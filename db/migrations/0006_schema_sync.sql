-- Migration: 0006_schema_sync.sql
-- Synchronizes missing columns from modular architecture migration

-- ALTER TABLE ADD COLUMN does not support IF NOT EXISTS in all SQLite versions
-- Adding only columns confirmed missing via PRAGMA table_info

-- tenants table
ALTER TABLE tenants ADD COLUMN domain TEXT;
ALTER TABLE tenants ADD COLUMN suspended_at INTEGER;
ALTER TABLE tenants ADD COLUMN suspended_reason TEXT;
ALTER TABLE tenants ADD COLUMN owner_id TEXT;
ALTER TABLE tenants ADD COLUMN owner_email TEXT;
ALTER TABLE tenants ADD COLUMN billing_email TEXT;
ALTER TABLE tenants ADD COLUMN plan_id TEXT;
ALTER TABLE tenants ADD COLUMN next_billing_date INTEGER;
ALTER TABLE tenants ADD COLUMN max_api_calls INTEGER DEFAULT 1000;
ALTER TABLE tenants ADD COLUMN api_calls_this_month INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN data_region TEXT DEFAULT 'us-east';
ALTER TABLE tenants ADD COLUMN encryption_enabled INTEGER DEFAULT 1;
ALTER TABLE tenants ADD COLUMN api_access_enabled INTEGER DEFAULT 1;
ALTER TABLE tenants ADD COLUMN industry TEXT;
ALTER TABLE tenants ADD COLUMN company_size TEXT;
ALTER TABLE tenants ADD COLUMN notes TEXT;
ALTER TABLE tenants ADD COLUMN tags TEXT;
ALTER TABLE tenants ADD COLUMN created_by TEXT;

-- users table
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN email_verified_at INTEGER;
ALTER TABLE users ADD COLUMN account_expires_at INTEGER;
ALTER TABLE users ADD COLUMN created_by TEXT;
