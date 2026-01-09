import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const tenants = sqliteTable('tenants', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    domain: text('domain'), // Optional primary domain cache
    config: text('config').notNull(), // JSON manifest
    status: text('status').notNull().default('active'),

    // Lifecycle/Suspension
    trialEndsAt: integer('trial_ends_at'),
    suspendedAt: integer('suspended_at'),
    suspendedReason: text('suspended_reason'),

    // Ownership
    ownerId: text('owner_id'),
    ownerEmail: text('owner_email'),
    billingEmail: text('billing_email'),

    // Subscription
    planId: text('plan_id'),
    planName: text('plan_name').default('free'),
    billingStatus: text('billing_status').default('current'),
    nextBillingDate: integer('next_billing_date'),
    mrr: integer('mrr').default(0),

    // Resource Limits
    maxUsers: integer('max_users').default(5),
    maxStorage: integer('max_storage').default(1),
    maxApiCalls: integer('max_api_calls').default(1000),

    // Real-time Usage
    currentUsers: integer('current_users').default(0),
    storageUsed: integer('storage_used').default(0),
    apiCallsThisMonth: integer('api_calls_this_month').default(0),

    // Metadata
    industry: text('industry'),
    companySize: text('company_size'),
    notes: text('notes'),
    tags: text('tags'),

    // Audit
    lastActivityAt: integer('last_activity_at'),
    createdAt: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at').notNull().default(sql`(strftime('%s', 'now'))`),
    createdBy: text('created_by'),
    deletedAt: integer('deleted_at'),
});
