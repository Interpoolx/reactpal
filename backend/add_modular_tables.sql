-- Safe migration script that uses CREATE TABLE IF NOT EXISTS
-- This can be run even if some tables already exist

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_system INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  UNIQUE(tenant_id, slug)
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  UNIQUE(module_id, slug)
);

-- User roles junction
CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  PRIMARY KEY (user_id, role_id, tenant_id)
);

-- Role permissions junction
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  PRIMARY KEY (role_id, permission_id)
);

-- Invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role_id TEXT,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  invited_by TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at INTEGER NOT NULL,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  location TEXT,
  last_activity_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  revoked_at INTEGER
);

-- Login attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  tenant_id TEXT,
  success INTEGER NOT NULL,
  failure_reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  consecutive_failures INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Password resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  ip_address TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Security events table
CREATE TABLE IF NOT EXISTS security_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  tenant_id TEXT,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);

-- Module status table
CREATE TABLE IF NOT EXISTS module_status (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  enabled_at INTEGER,
  enabled_by TEXT,
  settings TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER,
  UNIQUE(module_id, tenant_id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  value TEXT,
  scope TEXT NOT NULL,
  tenant_id TEXT,
  user_id TEXT,
  encrypted INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER,
  created_by TEXT,
  updated_by TEXT,
  UNIQUE(key, scope, tenant_id, user_id)
);

-- Settings audit table
CREATE TABLE IF NOT EXISTS settings_audit (
  id TEXT PRIMARY KEY,
  setting_key TEXT NOT NULL,
  scope TEXT NOT NULL,
  tenant_id TEXT,
  user_id TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL,
  changed_at INTEGER DEFAULT (strftime('%s','now')),
  ip_address TEXT,
  reason TEXT
);

-- Seed default system roles
INSERT OR IGNORE INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
VALUES 
  ('role-super-admin', 'default', 'Super Admin', 'super_admin', 'Platform super administrator', 1, strftime('%s','now')),
  ('role-admin', 'default', 'Administrator', 'admin', 'Full access to tenant', 1, strftime('%s','now')),
  ('role-editor', 'default', 'Editor', 'editor', 'Can create and edit content', 1, strftime('%s','now')),
  ('role-viewer', 'default', 'Viewer', 'viewer', 'Read-only access', 1, strftime('%s','now'));
