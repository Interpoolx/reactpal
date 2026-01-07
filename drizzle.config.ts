import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './backend/src/db/schema/index.ts',
    out: './db/migrations',
    dialect: 'sqlite',
    driver: 'd1-http',
    dbCredentials: {
        databaseId: '39a4d54d-a335-4e15-bb6b-b02362fa16ea'
    }
});
