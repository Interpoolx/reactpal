-- Migration 007: Add joined_via and last_activity_at columns to users table
ALTER TABLE users ADD COLUMN joined_via TEXT DEFAULT 'signup';
ALTER TABLE users ADD COLUMN last_activity_at INTEGER;

-- Update existing users to have a default joined_via
UPDATE users SET joined_via = 'signup' WHERE joined_via IS NULL;
