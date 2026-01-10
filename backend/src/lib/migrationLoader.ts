import * as fs from 'node:fs';
import * as path from 'node:path';

interface Migration {
    id: string;
    name: string;
    sql?: string;
}

interface MigrationManifest {
    migrations: string[];
    generated?: string;
}

export class MigrationLoader {
    private isProduction: boolean;
    private manifest: MigrationManifest | null = null;

    constructor() {
        // Try to load mirrored manifest (copied during npm run db:manifest)
        try {
            // @ts-ignore - This file is generated dynamically
            this.manifest = require('./migrations-manifest.json');
            console.log(`[MigrationLoader] Loaded manifest with ${this.manifest?.migrations.length} files`);
        } catch (e) {
            console.warn('[MigrationLoader] Internal manifest NOT found. Did you run "npm run db:manifest"?');
            this.manifest = { migrations: [] };
        }

        // We only use FS in local dev as a fallback
        this.isProduction = typeof process === 'undefined' || !process.cwd;
    }

    /**
     * Get list of migration files
     */
    async listMigrations(): Promise<Migration[]> {
        // Always prefer the manifest if it exists (reliable in all environments)
        if (this.manifest && this.manifest.migrations.length > 0) {
            return this.manifest.migrations.map(name => ({
                id: this.extractId(name),
                name: name
            }));
        }

        // Fallback to FS only if not in production and manifest is empty
        if (!this.isProduction) {
            return this.listFromFilesystem();
        }

        return [];
    }

    /**
     * Read migration SQL content (local only)
     */
    async readMigration(filename: string): Promise<string | null> {
        if (this.isProduction) {
            return null; // Can't read files in production
        }

        try {
            const possiblePaths = [
                path.join(process.cwd(), 'db', 'migrations', filename),
                path.join(process.cwd(), '..', 'db', 'migrations', filename),
                path.join(process.cwd(), 'backend', 'db', 'migrations', filename),
            ];

            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    return fs.readFileSync(p, 'utf-8');
                }
            }

            console.error(`Migration file not found: ${filename}`);
            return null;
        } catch (e) {
            console.error(`Failed to read migration ${filename}:`, e);
            return null;
        }
    }

    /**
     * List migrations from filesystem (local development)
     */
    private listFromFilesystem(): Migration[] {
        const possiblePaths = [
            path.join(process.cwd(), 'db', 'migrations'),
            path.join(process.cwd(), '..', 'db', 'migrations'),
            path.join(process.cwd(), 'backend', 'db', 'migrations'),
        ];

        for (const migrationsPath of possiblePaths) {
            if (fs.existsSync(migrationsPath)) {
                console.log(`[MigrationLoader] Found migrations at: ${migrationsPath}`);

                const files = fs.readdirSync(migrationsPath)
                    .filter(f => f.endsWith('.sql'))
                    .sort();

                return files.map(name => ({
                    id: this.extractId(name),
                    name: name
                }));
            }
        }

        console.warn(`[MigrationLoader] No migrations directory found. Checked: ${possiblePaths.join(', ')}`);
        return [];
    }

    /**
     * Extract migration ID from filename
     * Examples:
     * - "0001_initial_schema.sql" -> "0001"
     * - "20240115_add_users.sql" -> "20240115"
     */
    private extractId(filename: string): string {
        // Remove .sql extension
        const nameWithoutExt = filename.replace('.sql', '');

        // Try to extract numeric prefix
        const match = nameWithoutExt.match(/^(\d+)/);
        if (match) {
            return match[1];
        }

        // Fallback to full name without extension
        return nameWithoutExt;
    }

    /**
     * Generate manifest file (for build scripts)
     */
    static generateManifest(outputPath: string): void {
        const migrationsDir = path.join(process.cwd(), 'db', 'migrations');

        if (!fs.existsSync(migrationsDir)) {
            console.error(`Migrations directory not found: ${migrationsDir}`);
            process.exit(1);
        }

        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        const manifest: MigrationManifest = {
            migrations: files,
            generated: new Date().toISOString()
        };

        fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
        console.log(`✅ Generated manifest with ${files.length} migrations`);
        console.log(files);
    }
}