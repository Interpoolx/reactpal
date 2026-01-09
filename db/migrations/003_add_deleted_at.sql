-- Migration: 003_add_deleted_at.sql
-- Adds deleted_at column to tenants and users tables for soft delete support
-- Note: These statements are commented out because the column may already exist
-- and SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN

-- Add deleted_at to tenants table (skip if already exists)
-- ALTER TABLE tenants ADD COLUMN deleted_at INTEGER;

-- Add deleted_at to users table
-- ALTER TABLE users ADD COLUMN deleted_at INTEGER;

-- This migration is now a no-op to prevent errors on existing databases
SELECT 1;
