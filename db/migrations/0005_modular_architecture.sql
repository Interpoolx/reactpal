-- Migration: 0006_modular_architecture.sql
-- Adds tables for modular architecture: roles, permissions, sessions, etc.

-- ============================================================================
-- USERS TABLE ENHANCEMENTS
-- ============================================================================
-- Note: Some columns may already exist, using ALTER TABLE IF NOT EXISTS pattern

-- Add email column if missing
ALTER TABLE users ADD COLUMN email TEXT;

-- Add profile columns
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN timezone TEXT DEFAULT 'UTC';

-- Add status and verification columns
ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN email_verified_at INTEGER;

-- Add access control columns
ALTER TABLE users ADD COLUMN account_expires_at INTEGER;
ALTER TABLE users ADD COLUMN last_login_at INTEGER;

-- Add audit columns
ALTER TABLE users ADD COLUMN updated_at INTEGER;
ALTER TABLE users ADD COLUMN created_by TEXT;
ALTER TABLE users ADD COLUMN deleted_at INTEGER;

-- ============================================================================
-- ROLES TABLE
-- ============================================================================
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

-- ============================================================================
-- PERMISSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  
  UNIQUE(module_id, slug)
);

-- ============================================================================
-- USER ROLES JUNCTION
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  
  PRIMARY KEY (user_id, role_id, tenant_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ============================================================================
-- ROLE PERMISSIONS JUNCTION
-- ============================================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- ============================================================================
-- INVITATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role_id TEXT,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','accepted','expired','cancelled')),
  invited_by TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- ============================================================================
-- SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at INTEGER NOT NULL,
  
  user_agent TEXT,
  device_type TEXT CHECK(device_type IN ('desktop','mobile','tablet')),
  browser TEXT,
  os TEXT,
  
  ip_address TEXT,
  location TEXT,
  
  last_activity_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  revoked_at INTEGER,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_access_token ON sessions(access_token);

-- ============================================================================
-- LOGIN ATTEMPTS TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);

-- ============================================================================
-- PASSWORD RESETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  ip_address TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================================
-- SECURITY EVENTS TABLE
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);

-- ============================================================================
-- MODULE STATUS TABLE
-- ============================================================================
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

-- ============================================================================
-- SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  value TEXT,
  
  scope TEXT NOT NULL CHECK(scope IN ('platform','tenant','user')),
  tenant_id TEXT,
  user_id TEXT,
  
  encrypted INTEGER DEFAULT 0,
  
  created_at INTEGER DEFAULT (strftime('%s','now')),
  updated_at INTEGER,
  created_by TEXT,
  updated_by TEXT,
  
  UNIQUE(key, scope, tenant_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- ============================================================================
-- SETTINGS AUDIT TABLE
-- ============================================================================
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

-- ============================================================================
-- TENANTS TABLE ENHANCEMENTS
-- ============================================================================
-- Add status lifecycle columns
ALTER TABLE tenants ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE tenants ADD COLUMN domain TEXT; -- Primary domain cache
ALTER TABLE tenants ADD COLUMN trial_ends_at INTEGER;
ALTER TABLE tenants ADD COLUMN suspended_at INTEGER;
ALTER TABLE tenants ADD COLUMN suspended_reason TEXT;

-- Add ownership columns
ALTER TABLE tenants ADD COLUMN owner_id TEXT;
ALTER TABLE tenants ADD COLUMN owner_email TEXT;
ALTER TABLE tenants ADD COLUMN billing_email TEXT;

-- Add subscription columns
ALTER TABLE tenants ADD COLUMN plan_id TEXT;
ALTER TABLE tenants ADD COLUMN plan_name TEXT DEFAULT 'free';
ALTER TABLE tenants ADD COLUMN billing_status TEXT DEFAULT 'current';
ALTER TABLE tenants ADD COLUMN next_billing_date INTEGER;
ALTER TABLE tenants ADD COLUMN mrr INTEGER DEFAULT 0;

-- Add limits columns
ALTER TABLE tenants ADD COLUMN max_users INTEGER DEFAULT 5;
ALTER TABLE tenants ADD COLUMN max_storage INTEGER DEFAULT 1;
ALTER TABLE tenants ADD COLUMN max_api_calls INTEGER DEFAULT 1000;

-- Add usage columns
ALTER TABLE tenants ADD COLUMN current_users INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN storage_used INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN api_calls_this_month INTEGER DEFAULT 0;

-- Add security columns
ALTER TABLE tenants ADD COLUMN data_region TEXT DEFAULT 'us-east';
ALTER TABLE tenants ADD COLUMN encryption_enabled INTEGER DEFAULT 1;
ALTER TABLE tenants ADD COLUMN api_access_enabled INTEGER DEFAULT 1;

-- Add metadata columns
ALTER TABLE tenants ADD COLUMN industry TEXT;
ALTER TABLE tenants ADD COLUMN company_size TEXT;
ALTER TABLE tenants ADD COLUMN notes TEXT;
ALTER TABLE tenants ADD COLUMN tags TEXT;

-- Add audit columns
ALTER TABLE tenants ADD COLUMN last_activity_at INTEGER;
ALTER TABLE tenants ADD COLUMN updated_at INTEGER;
ALTER TABLE tenants ADD COLUMN created_by TEXT;
ALTER TABLE tenants ADD COLUMN deleted_at INTEGER;

-- ============================================================================
-- SEED DEFAULT SYSTEM ROLES
-- ============================================================================
INSERT OR IGNORE INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
VALUES 
  ('role-super-admin', 'default', 'Super Admin', 'super_admin', 'Platform super administrator', 1, strftime('%s','now')),
  ('role-admin', 'default', 'Administrator', 'admin', 'Full access to tenant', 1, strftime('%s','now')),
  ('role-editor', 'default', 'Editor', 'editor', 'Can create and edit content', 1, strftime('%s','now')),
  ('role-viewer', 'default', 'Viewer', 'viewer', 'Read-only access', 1, strftime('%s','now'));
