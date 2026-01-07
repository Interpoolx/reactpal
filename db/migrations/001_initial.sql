-- tenants table: The master list of tenants
CREATE TABLE tenants (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  config TEXT NOT NULL, -- JSON manifest
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- tenant_domains table: Mapping domains to tenants
CREATE TABLE tenant_domains (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- audit_logs table: Basic provisioning events
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT,
  event TEXT NOT NULL,
  payload TEXT, -- JSON
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- Indexes for performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_domains_domain ON tenant_domains(domain);
CREATE INDEX idx_domains_tenant ON tenant_domains(tenant_id);
