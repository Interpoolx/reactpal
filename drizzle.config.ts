import { defineConfig } from 'drizzle-kit';
import fs from 'node:fs';
import path from 'node:path';

// Detect local D1 database file in Miniflare state
const localDbDir = './backend/.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
let localDbPath = '';

if (fs.existsSync(localDbDir)) {
    const files = fs.readdirSync(localDbDir);
    const sqliteFile = files.find(f => f.endsWith('.sqlite'));
    if (sqliteFile) {
        localDbPath = path.join(localDbDir, sqliteFile);
    }
}

const useRemote = process.env.USE_REMOTE_DB === 'true';

export default defineConfig({
    schema: './backend/src/db/schema/index.ts',
    out: './db/migrations',
    dialect: 'sqlite',
    ...(useRemote ? {
        driver: 'd1-http',
        dbCredentials: {
            accountId: '3b7246d9a5ae476dd7207163108ab2dd',
            databaseId: '39a4d54d-a335-4e15-bb6b-b02362fa16ea',
            token: process.env.CLOUDFLARE_API_TOKEN!,
        }
    } : {
        dbCredentials: {
            url: localDbPath || 'local.sqlite'
        }
    })
});
