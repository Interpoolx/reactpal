import { Hono } from 'hono';

const schema = new Hono<{ Bindings: any; Variables: any }>();

/**
 * GET /api/v1/schema/:table
 * Get column information for a table
 */
schema.get('/:table', async (c) => {
    const db = c.env.DB;
    const table = c.req.param('table');

    // Basic validation to prevent SQL injection in table name
    // TODO: Dynamic validation against database tables
    const allowedTables = [
        'users', 'tenants', 'invitations', 'roles', 'permissions',
        'user_roles', 'role_permissions', 'sessions', 'login_attempts',
        'password_resets', 'security_events', 'settings', 'audit_logs',
        'tenant_domains', 'module_status'
    ];
    if (!allowedTables.includes(table)) {
        return c.json({ error: 'Invalid table name' }, 400);
    }

    try {
        const results = await db.prepare(`PRAGMA table_info(${table})`).all();
        const columns = results.results.map((col: any) => ({
            name: col.name,
            type: col.type,
            notnull: col.notnull === 1,
            pk: col.pk === 1,
            defaultValue: col.dflt_value
        }));

        return c.json({
            table,
            columns
        });
    } catch (error: any) {
        console.error(`Schema fetch error for ${table}:`, error);
        return c.json({ error: `Failed to fetch schema for ${table}`, message: error.message }, 500);
    }
});

export default schema;
