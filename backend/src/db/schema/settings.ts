import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const settings = sqliteTable('settings', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull(),
    moduleId: text('module_id').notNull(),
    key: text('key').notNull(),
    value: text('value'), // Will store JSON stringified value
    updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => ({
    tenantModuleKeyIdx: uniqueIndex('tenant_module_key_idx').on(table.tenantId, table.moduleId, table.key),
}));
