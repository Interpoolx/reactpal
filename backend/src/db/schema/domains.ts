import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { tenants } from './tenants';

export const tenantDomains = sqliteTable('tenant_domains', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
    domain: text('domain').notNull().unique(),
    isPrimary: integer('is_primary').notNull().default(0),
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
});
