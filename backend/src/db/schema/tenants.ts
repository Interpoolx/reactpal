import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const tenants = sqliteTable('tenants', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    config: text('config').notNull(), // JSON manifest
    status: text('status').notNull().default('active'),
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s', 'now'))`),
});
