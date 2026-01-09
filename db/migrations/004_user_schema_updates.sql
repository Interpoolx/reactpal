-- Migration 004: Add missing user columns for profile, status, and audit
ALTER TABLE users ADD COLUMN email TEXT;
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN last_login_at INTEGER;
ALTER TABLE users ADD COLUMN updated_at INTEGER DEFAULT 0;

-- Update existing admin user with some defaults
UPDATE users SET email = 'admin@reactpal.com', first_name = 'System', last_name = 'Admin', updated_at = (strftime('%s', 'now')) WHERE id = 'u_admin';

-- Update all users to have valid timestamps
UPDATE users SET updated_at = (strftime('%s', 'now')) WHERE updated_at = 0 OR updated_at IS NULL;
