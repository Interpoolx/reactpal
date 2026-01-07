import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const auditLogs = sqliteTable('audit_logs', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id'),
    event: text('event').notNull(),
    payload: text('payload'), // JSON
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
});
