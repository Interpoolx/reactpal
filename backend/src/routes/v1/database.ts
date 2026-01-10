import { Hono } from 'hono';
import * as schema from '../../db/schema';
import { getTableColumns, getTableName } from 'drizzle-orm';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MigrationLoader } from '../../lib/migrationLoader';

// Helper for unique IDs that works in all environments
const generateId = () => {
    try {
        return globalThis.crypto?.randomUUID() || `id_${Math.random().toString(36).slice(2)}`;
    } catch (e) {
        return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }
};

const database = new Hono<{ Bindings: any; Variables: any }>();

// Helper to log administrative actions to the audit_logs table
async function logAudit(db: any, event: string, payload: any, tenantId = 'system') {
    try {
        await db.prepare(`
            INSERT INTO audit_logs (id, event, payload, tenant_id, created_at)
            VALUES (?, ?, ?, ?, ?)
        `).bind(
            generateId(),
            event,
            typeof payload === 'string' ? payload : JSON.stringify(payload),
            tenantId,
            Math.floor(Date.now() / 1000)
        ).run();
    } catch (e) {
        console.warn('[Audit Log Failed]:', e);
    }
}

// Global error handler for this router
database.onError((err, c) => {
    console.error('[Database API Error]:', err);
    return c.json({
        success: false,
        error: err.name || 'Internal Error',
        message: err.message || 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, 500);
});

/**
 * GET /api/v1/database/status
 * Get database statistics and health
 */
database.get('/status', async (c) => {
    const db = c.env.DB;

    try {
        // Table count & Total Records
        const tablesResult = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%'").all();
        const tables = tablesResult.results || [];
        const tableCount = tables.length;

        // Calculate total records
        let totalRecords = 0;
        for (const table of tables) {
            try {
                const countRes = await db.prepare(`SELECT count(*) as count FROM ${table.name}`).first();
                totalRecords += (countRes as any)?.count || 0;
            } catch (e) {
                console.warn(`Could not count records for table ${table.name}:`, e);
            }
        }

        // Estimate size based on record count (rough approximation)
        const estimatedSizeBytes = totalRecords * 1024; // Rough estimate: 1KB per record
        const sizeFormatted = estimatedSizeBytes > 0 ? formatBytes(estimatedSizeBytes) + ' (estimated)' : 'Managed by D1';

        return c.json({
            status: 'healthy',
            sizeBytes: estimatedSizeBytes,
            sizeFormatted,
            tableCount,
            recordCount: totalRecords,
            databaseId: c.env.DB_ID || 'worker-db',
            note: 'Size is estimated. Use Cloudflare Dashboard for exact metrics.'
        });
    } catch (error: any) {
        console.error('Database status error:', error);
        return c.json({ error: 'Failed to fetch database status', message: error.message }, 500);
    }
});

/**
 * GET /api/v1/database/tables
 * List all tables with row and column counts
 */
database.get('/tables', async (c) => {
    const db = c.env.DB;

    try {
        // Helper for pagination
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '10');
        const offset = (page - 1) * limit;

        const tablesResult = await db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%' LIMIT ? OFFSET ?")
            .bind(limit, offset)
            .all();

        const countResult = await db.prepare("SELECT count(*) as total FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '__drizzle_%'").first();
        const total = (countResult as any)?.total || 0;

        const tableNames = (tablesResult.results || []).map((r: any) => r.name);

        const tables = await Promise.all(tableNames.map(async (name: string) => {
            let records = 0;
            let colInfo: any[] = [];

            try {
                const rowCountResult = await db.prepare(`SELECT count(*) as count FROM ${name}`).first();
                records = (rowCountResult as any)?.count || 0;
            } catch (e) {
                console.warn(`Failed to get row count for ${name}:`, e);
            }

            try {
                const colInfoResult = await db.prepare(`PRAGMA table_info(${name})`).all();
                colInfo = colInfoResult.results || [];
            } catch (e) {
                console.warn(`Failed to get PRAGMA table_info for ${name}:`, e);
            }

            return {
                name,
                records,
                columnCount: colInfo.length,
                columns: colInfo
            };
        }));

        return c.json({
            data: tables,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error('Database tables error:', error);
        return c.json({ error: 'Failed to fetch tables', message: error.message }, 500);
    }
});

/**
 * GET /api/v1/database/schema/compare
 * Compare local Drizzle schema with remote DB structure
 */
database.get('/schema/compare', async (c) => {
    const db = c.env.DB;

    try {
        const diffs: any[] = [];

        // Iterate through all exported tables in schema
        for (const [key, value] of Object.entries(schema)) {
            if (isDrizzleTable(value)) {
                const tableName = getTableName(value);
                const schemaColumns = getTableColumns(value);

                // Fetch remote info
                let remoteColumns: any[] = [];
                try {
                    const remoteColumnsResult = await db.prepare(`PRAGMA table_info(${tableName})`).all();
                    remoteColumns = (remoteColumnsResult.results || []).map((col: any) => ({
                        name: col.name,
                        type: col.type,
                        notnull: col.notnull === 1,
                        pk: col.pk === 1,
                        default: col.dflt_value
                    }));
                } catch (e) {
                    console.warn(`Failed to compare schema for table ${tableName}:`, e);
                }

                const localColumns = Object.values(schemaColumns).map((col: any) => ({
                    name: col.name,
                    type: col.getSQLType(),
                    notnull: col.notNull,
                    default: col.default !== undefined ? String(col.default) : null
                }));

                // Compare
                const columns: any[] = [];
                const allColNames = Array.from(new Set([
                    ...localColumns.map(c => c.name),
                    ...remoteColumns.map((c: any) => c.name)
                ]));

                let mismatch = false;
                for (const name of allColNames) {
                    const local = localColumns.find(c => c.name === name);
                    const remote = remoteColumns.find((c: any) => c.name === name);

                    const isMatch = local && remote &&
                        local.type.toUpperCase() === remote.type.toUpperCase() &&
                        local.notnull === remote.notnull;

                    if (!isMatch) mismatch = true;

                    columns.push({
                        name,
                        type: local?.type || remote?.type,
                        local: !!local,
                        remote: !!remote,
                        match: isMatch
                    });
                }

                diffs.push({
                    table: tableName,
                    status: mismatch ? (remoteColumns.length === 0 ? 'missing' : 'mismatch') : 'match',
                    columns
                });
            }
        }

        return c.json(diffs);
    } catch (error: any) {
        console.error('Schema compare error:', error);
        return c.json({ error: 'Failed to compare schema', message: error.message }, 500);
    }
});

/**
 * GET /api/v1/database/export
 * Export database as SQL dump
 */
database.get('/export', async (c) => {
    const db = c.env.DB;

    try {
        let sqlDump = '-- D1 Database Export\n';
        sqlDump += `-- Generated: ${new Date().toISOString()}\n\n`;

        // Get all tables
        const tablesResult = await db.prepare(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        ).all();

        const tables = tablesResult.results || [];

        for (const table of tables) {
            const tableName = (table as any).name;

            // Get table schema
            const schemaResult = await db.prepare(
                `SELECT sql FROM sqlite_master WHERE type='table' AND name=?`
            ).bind(tableName).first();

            if (schemaResult) {
                sqlDump += `-- Table: ${tableName}\n`;
                sqlDump += `${(schemaResult as any).sql};\n\n`;
            }

            // Get table data
            const dataResult = await db.prepare(`SELECT * FROM ${tableName}`).all();
            const rows = dataResult.results || [];

            if (rows.length > 0) {
                sqlDump += `-- Data for ${tableName}\n`;

                for (const row of rows) {
                    const columns = Object.keys(row);
                    const values = Object.values(row).map(v => {
                        if (v === null) return 'NULL';
                        if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
                        return v;
                    });

                    sqlDump += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
                }
                sqlDump += '\n';
            }
        }

        return new Response(sqlDump, {
            headers: {
                'Content-Type': 'application/sql',
                'Content-Disposition': `attachment; filename="d1-backup-${Date.now()}.sql"`
            }
        });

    } catch (error: any) {
        console.error('Database export error:', error);
        return c.json({ error: 'Failed to export database', message: error.message }, 500);
    }
});


/**
 * GET /api/v1/database/migrations
 * List migration files and their status in DB
 * Now works in both local development and production!
 */
database.get('/migrations', async (c) => {
    const db = c.env.DB;

    try {
        const page = parseInt(c.req.query('page') || '1');
        const limit = parseInt(c.req.query('limit') || '10');
        const offset = (page - 1) * limit;

        // 1. Load migration files first (this is now fast via internal manifest)
        const loader = new MigrationLoader();
        const migrationFiles = await loader.listMigrations();

        // 2. Try to get applied migrations from DB
        let appliedMap = new Map<string, any>();

        // Check both common migration tables
        const tablesToCheck = ['d1_migrations', '__drizzle_migrations'];

        for (const tableName of tablesToCheck) {
            try {
                const result = await db.prepare(`SELECT * FROM ${tableName}`).all();
                (result.results || []).forEach((m: any) => {
                    // Normalize data from different table schemas
                    const id = String(m.id || '');
                    const name = String(m.name || '');
                    const appliedAt = m.applied_at || m.created_at;
                    const hash = m.hash || null;

                    const data = { id, name, hash, appliedAt, status: 'applied' };

                    if (id) appliedMap.set(id, data);
                    if (name) appliedMap.set(name, data);
                    // Also match without extension
                    if (name.endsWith('.sql')) appliedMap.set(name.replace('.sql', ''), data);
                });
            } catch (e) {
                // Ignore if table doesn't exist
            }
        }

        // 3. Merge data: combine file list with applied status
        const allMigrations = migrationFiles.map(({ id: fileId, name }) => {
            const nameWithoutExt = name.replace('.sql', '');
            const applied = appliedMap.get(name) ||
                appliedMap.get(nameWithoutExt) ||
                appliedMap.get(fileId);

            return {
                id: name,
                name: name,
                status: applied ? 'applied' : 'pending',
                appliedAt: applied?.appliedAt || null,
                hash: applied?.hash || null
            };
        });

        // 4. Natural Sort Descending (latest first)
        allMigrations.sort((a, b) => {
            const getNum = (s: string) => parseInt(s.match(/^\d+/)?.[0] || '0');
            const numA = getNum(a.name);
            const numB = getNum(b.name);

            if (numA !== numB) return numB - numA;
            return b.name.localeCompare(a.name);
        });
        const total = allMigrations.length;
        const sliced = allMigrations.slice(offset, offset + limit);

        return c.json({
            data: sliced,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        console.error('Migration fetch error:', error);
        return c.json({
            data: [],
            meta: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
                error: error.message,
                hint: 'Run "npm run db:manifest" to generate migration manifest'
            }
        });
    }
});

/**
 * POST /api/v1/database/migrations/run
 * Mark a migration as applied (Safety Mode)
 * This doesn't execute SQL, just marks it as resolved
 */
database.post('/migrations/run', async (c) => {
    const db = c.env.DB;
    const { migration } = await c.req.json();

    try {
        if (!migration) {
            return c.json({ success: false, message: 'Migration name is required' }, 400);
        }

        // Extract ID from filename
        const migrationId = migration.replace('.sql', '').match(/^(\d+)/)?.[1] || migration.replace('.sql', '');
        const timestamp = Date.now();

        // Check if already applied
        const existing = await db.prepare('SELECT id FROM __drizzle_migrations WHERE id = ?')
            .bind(migrationId)
            .first();

        if (existing) {
            return c.json({
                success: false,
                message: `Migration ${migration} is already applied`
            }, 400);
        }

        // Insert into migrations table
        await db.prepare('INSERT INTO __drizzle_migrations (id, hash, created_at) VALUES (?, ?, ?)')
            .bind(migrationId, 'manual_apply_' + timestamp, timestamp)
            .run();

        await logAudit(db, 'MIGRATION_APPLY', { migration, migrationId });

        return c.json({
            message: `Migration ${migration} marked as applied successfully.`,
            success: true,
            note: 'Remember to execute the SQL manually via Wrangler or Cloudflare Dashboard'
        });
    } catch (e: any) {
        return c.json({ success: false, message: e.message }, 500);
    }
});

/**
 * POST /api/v1/database/migrations/rollback
 * Unmark the latest migration as applied
 */
database.post('/migrations/rollback', async (c) => {
    const db = c.env.DB;

    try {
        // Find latest migration
        const latest = await db.prepare(
            'SELECT * FROM __drizzle_migrations ORDER BY created_at DESC LIMIT 1'
        ).first();

        if (!latest) {
            return c.json({
                success: false,
                message: 'No applied migrations to rollback.'
            }, 400);
        }

        const migrationId = (latest as any).id;

        // Delete from migrations table
        await db.prepare('DELETE FROM __drizzle_migrations WHERE id = ?')
            .bind(migrationId)
            .run();

        await logAudit(db, 'MIGRATION_ROLLBACK', { migrationId });

        return c.json({
            success: true,
            message: `Rolled back migration ${migrationId}. It is now marked as pending.`,
            note: 'This only unmarked the migration. You may need to manually revert schema changes.'
        });

    } catch (e: any) {
        return c.json({
            success: false,
            message: 'Rollback failed: ' + e.message
        }, 500);
    }
});


/**
 * POST /api/v1/database/schema/sync
 * Sync schema changes for a table (Simple ADD COLUMN support)
 */
database.post('/schema/sync', async (c) => {
    const db = c.env.DB;
    const { table, action, dryRun } = await c.req.json();

    // Find the drizzle table definition
    let drizzleTable: any = null;
    for (const [key, value] of Object.entries(schema)) {
        if (isDrizzleTable(value) && getTableName(value) === table) {
            drizzleTable = value;
            break;
        }
    }

    if (!drizzleTable) {
        return c.json({ success: false, message: `Table ${table} definition not found in schema.` }, 404);
    }

    try {
        const schemaColumns = getTableColumns(drizzleTable);
        const remoteResult = await db.prepare(`PRAGMA table_info(${table})`).all();
        const remoteColumnNames = new Set((remoteResult.results || []).map((r: any) => r.name));

        const statements: string[] = [];

        // Check for missing columns (Local exists, Remote missing) -> ADD COLUMN
        for (const [colName, colDef] of Object.entries(schemaColumns)) {
            if (!remoteColumnNames.has(colName)) {
                const col: any = colDef;
                const type = col.getSQLType();
                const notNull = col.notNull ? 'NOT NULL' : '';
                let defaultVal = '';
                if (col.default !== undefined) {
                    defaultVal = `DEFAULT ${typeof col.default === 'string' ? `'${col.default}'` : col.default}`;
                }

                statements.push(`ALTER TABLE ${table} ADD COLUMN ${colName} ${type} ${notNull} ${defaultVal};`);
            }
        }

        if (statements.length === 0) {
            return c.json({ success: true, message: 'No syncable changes found.', sql: [] });
        }

        if (dryRun) {
            return c.json({ success: true, message: 'Dry run generated SQL.', sql: statements });
        }

        // Execute sequentially
        for (const sql of statements) {
            await db.prepare(sql.replace(/;$/, '')).run();
        }

        await logAudit(db, 'SCHEMA_SYNC', { table, statements: statements.length });

        return c.json({
            message: `Successfully synchronized ${table}. Applied ${statements.length} changes.`,
            success: true,
            statements
        });

    } catch (e: any) {
        return c.json({ success: false, message: 'Sync failed: ' + e.message }, 500);
    }
});

/**
 * GET /api/v1/database/audit-logs
 * Get recent activity logs
 */
database.get('/audit-logs', async (c) => {
    const db = c.env.DB;
    try {
        const result = await db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10').all();
        const logs = (result.results || []).map((log: any) => ({
            id: log.id,
            action: log.event,
            details: log.payload,
            createdAt: typeof log.created_at === 'number' ? log.created_at * 1000 : log.created_at,
            type: log.event.includes('FAIL') ? 'error' : 'success'
        }));
        return c.json(logs);
    } catch (e) {
        console.error('[Audit logs error]:', e);
        return c.json([]);
    }
});

// Helper functions
function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function isDrizzleTable(val: any): val is SQLiteTable {
    return val && typeof val === 'object' && Symbol.for('drizzle:IsAlias') in val === false && Symbol.for('drizzle:Name') in val;
}

export default database;