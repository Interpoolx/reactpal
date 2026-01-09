-- users table: For admin and staff access
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- bcrypt (hardcoded admin123 for now per user request)
  role TEXT NOT NULL DEFAULT 'admin',
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Seed the initial admin user
INSERT OR IGNORE INTO users (id, tenant_id, username, password, role)
VALUES ('u_admin', 't_001', 'admin', 'admin123', 'admin');
