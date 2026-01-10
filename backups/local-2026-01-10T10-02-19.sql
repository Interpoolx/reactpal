PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE tenants (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  config TEXT NOT NULL, 
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
, deleted_at INTEGER, plan_name TEXT DEFAULT 'free', billing_status TEXT DEFAULT 'current', current_users INTEGER DEFAULT 0, max_users INTEGER DEFAULT 5, storage_used INTEGER DEFAULT 0, max_storage INTEGER DEFAULT 1, mrr INTEGER DEFAULT 0, trial_ends_at INTEGER, last_activity_at INTEGER, domain TEXT, suspended_at INTEGER, suspended_reason TEXT, owner_id TEXT, owner_email TEXT, billing_email TEXT, plan_id TEXT, next_billing_date INTEGER, max_api_calls INTEGER DEFAULT 1000, api_calls_this_month INTEGER DEFAULT 0, data_region TEXT DEFAULT 'us-east', encryption_enabled INTEGER DEFAULT 1, api_access_enabled INTEGER DEFAULT 1, industry TEXT, company_size TEXT, notes TEXT, tags TEXT, created_by TEXT);
INSERT INTO "tenants" VALUES('t_001','Web4 Strategy','web4strategy','{"meta":{"siteTitle":"Web4 Strategy | Enterprise SaaS"},"appearance":{"brandColor":"#0f172a"},"modules":{"activeList":["cms","seo"],"visibility":{"cms":["admin","editor"],"seo":["admin"]}}}','active',1767802299,1767802299,NULL,'free','current',0,5,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1000,0,'us-east',1,1,NULL,NULL,NULL,NULL,NULL);
INSERT INTO "tenants" VALUES('t_002','JurisQuest','jurisquest','{"meta":{"siteTitle":"JurisQuest | Legal Excellence"},"appearance":{"brandColor":"#1e293b"},"modules":{"activeList":["cms"],"visibility":{"cms":["admin","editor"]}}}','active',1767802299,1767971752,1767963647,'free','current',0,5,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1000,0,'us-east',1,1,NULL,NULL,NULL,NULL,NULL);
INSERT INTO "tenants" VALUES('default','Default Tenant','default','{}','active',1767802525,1767802525,NULL,'free','current',0,5,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1000,0,'us-east',1,1,NULL,NULL,NULL,NULL,NULL);
CREATE TABLE tenant_domains (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);
INSERT INTO "tenant_domains" VALUES('d_001','t_001','web4strategy.com',1,1767802299);
INSERT INTO "tenant_domains" VALUES('d_001_local','default','localhost',0,1767802299);
INSERT INTO "tenant_domains" VALUES('d_002','t_002','jurisquest.com',1,1767802299);
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT,
  event TEXT NOT NULL,
  payload TEXT, 
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, 
  role TEXT NOT NULL DEFAULT 'admin',
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), email TEXT, first_name TEXT, last_name TEXT, status TEXT DEFAULT 'active', email_verified INTEGER DEFAULT 0, last_login_at INTEGER, updated_at INTEGER, deleted_at INTEGER, phone TEXT, avatar_url TEXT, timezone TEXT DEFAULT 'UTC', email_verified_at INTEGER, account_expires_at INTEGER, created_by TEXT, joined_via TEXT DEFAULT 'signup', last_activity_at INTEGER,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);
INSERT INTO "users" VALUES('u_admin','t_001','admin','admin123','super_admin',1767802352,'admin@reactpal.com','System','Admin','active',0,1767973111,1767938310,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_web4strategy_admin','t_001','web4strategy_admin','admin123','admin',1767941015,'admin@web4strategy','Admin','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_web4strategy_manager','t_001','web4strategy_manager','admin123','manager',1767941015,'manager@web4strategy','Manager','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_web4strategy_editor','t_001','web4strategy_editor','admin123','editor',1767941015,'editor@web4strategy','Editor','User','active',0,NULL,1767942337,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_web4strategy_user','t_001','web4strategy_user','admin123','user',1767941015,'user@web4strategy','User','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_jurisquest_admin','t_002','jurisquest_admin','admin123','admin',1767941015,'admin@jurisquest','Admin','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_jurisquest_manager','t_002','jurisquest_manager','admin123','manager',1767941015,'manager@jurisquest','Manager','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_jurisquest_editor','t_002','jurisquest_editor','admin123','editor',1767941015,'editor@jurisquest','Editor','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_jurisquest_viewer','t_002','jurisquest_viewer','admin123','viewer',1767941015,'viewer@jurisquest','Viewer','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_jurisquest_user','t_002','jurisquest_user','admin123','user',1767941015,'user@jurisquest','User','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_default_admin','default','default_admin','admin123','admin',1767941015,'admin@default','Admin','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_default_manager','default','default_manager','admin123','manager',1767941015,'manager@default','Manager','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_default_editor','default','default_editor','admin123','editor',1767941015,'editor@default','Editor','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_default_viewer','default','default_viewer','admin123','viewer',1767941015,'viewer@default','Viewer','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_default_user','default','default_user','admin123','user',1767941015,'user@default','User','User','active',0,NULL,1767941015,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
INSERT INTO "users" VALUES('u_web4strategy_viewer','t_001','web4strategy_viewer','admin123','viewer',1767968317,'viewer@web4strategy','Viewer','User','active',0,NULL,1767968317,NULL,NULL,NULL,'UTC',NULL,NULL,NULL,'signup',NULL);
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
INSERT INTO "d1_migrations" VALUES(1,'001_initial.sql','2026-01-08 14:29:10');
INSERT INTO "d1_migrations" VALUES(2,'002_auth.sql','2026-01-08 14:29:11');
INSERT INTO "d1_migrations" VALUES(3,'003_add_deleted_at.sql','2026-01-08 14:30:44');
INSERT INTO "d1_migrations" VALUES(4,'004_user_schema_updates.sql','2026-01-09 05:37:58');
INSERT INTO "d1_migrations" VALUES(5,'0005_modular_architecture.sql','2026-01-09 14:37:35');
INSERT INTO "d1_migrations" VALUES(6,'0006_schema_sync.sql','2026-01-09 14:37:47');
INSERT INTO "d1_migrations" VALUES(7,'0007_user_enhancements.sql','2026-01-10 03:45:16');
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  is_system INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  UNIQUE(tenant_id, slug)
);
INSERT INTO "roles" VALUES('role-super-admin','default','Super Admin','super_admin','Platform super administrator',1,1767845586);
INSERT INTO "roles" VALUES('role-admin','default','Administrator','admin','Full access to tenant',1,1767845586);
INSERT INTO "roles" VALUES('role-editor','default','Editor','editor','Can create and edit content',1,1767845586);
INSERT INTO "roles" VALUES('role-viewer','default','Viewer','viewer','Read-only access',1,1767845586);
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  UNIQUE(module_id, slug)
);
CREATE TABLE user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  PRIMARY KEY (user_id, role_id, tenant_id)
);
CREATE TABLE role_permissions (
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  PRIMARY KEY (role_id, permission_id)
);
CREATE TABLE invitations (
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
CREATE TABLE sessions (
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
INSERT INTO "sessions" VALUES('test_session','u_admin','t_001','test_token_12345',NULL,9999999999,'Test',NULL,NULL,NULL,'127.0.0.1',NULL,1767884742,1767884742,NULL);
INSERT INTO "sessions" VALUES('06be5791-ca91-4bbc-bad7-567976ad68f1','u_admin','t_001','8fb125d7-7354-4337-89f6-21a7cd593188',NULL,1767971175,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,NULL,NULL,'unknown',NULL,1767884775,1767884775,NULL);
INSERT INTO "sessions" VALUES('1c54360f-55eb-49f7-bb1d-09866923ab49','u_admin','t_001','c09180c2-017a-41fe-ab7d-4fef8ed1edf5',NULL,1768059511,'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,NULL,NULL,'unknown',NULL,1767973111,1767973111,NULL);
CREATE TABLE login_attempts (
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
INSERT INTO "login_attempts" VALUES('cb71044e-69ca-40b0-9129-c6ce93d8ec54','admin','t_001',1,NULL,'unknown','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,0,1767884775);
INSERT INTO "login_attempts" VALUES('f83d78b6-8c3b-416f-83b0-4a84c6090988','admin','t_001',0,'Account not active','unknown','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,0,1767972652);
INSERT INTO "login_attempts" VALUES('fe957dc7-e091-4936-b322-c5ed2a48d3f2','admin','t_001',0,'Account not active','unknown','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,0,1767972723);
INSERT INTO "login_attempts" VALUES('5b21db55-db60-4221-be8c-d5c567dec484','admin','t_001',1,NULL,'unknown','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,0,1767973111);
CREATE TABLE password_resets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  ip_address TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE TABLE security_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  tenant_id TEXT,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE TABLE module_status (
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
CREATE TABLE settings_audit (
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
CREATE TABLE settings (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, module_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT, updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')));
INSERT INTO "settings" VALUES('db39ed1a-85b1-4ee4-a9b3-be29c2bf8d60','default','tenants','tenants.ui.showStatsCards','true',1768018994);
INSERT INTO "settings" VALUES('b0f48d77-ea6a-4cbc-9fec-801f95da8197','default','tenants','tenants.ui.showSearch','true',1768018994);
INSERT INTO "settings" VALUES('3654aaae-3953-4548-b3a2-35a5500375fc','default','tenants','tenants.ui.showStatusFilter','true',1768018994);
INSERT INTO "settings" VALUES('ce24db62-2cc1-48b9-b8eb-3ea7195cc8af','default','tenants','tenants.ui.showPlanFilter','true',1768018994);
INSERT INTO "settings" VALUES('323abebf-d20c-42eb-87cb-783952e53b01','default','tenants','tenants.ui.showExportCSV','true',1768018994);
INSERT INTO "settings" VALUES('986dd78a-7170-4769-b21a-6e5c85d0e472','default','tenants','tenants.ui.showBulkImport','true',1768018994);
INSERT INTO "settings" VALUES('2a1153c4-3119-4bff-a11e-278accffe15a','default','tenants','tenants.ui.showQuickActions','true',1768018994);
INSERT INTO "settings" VALUES('050a9740-8e72-455d-9e94-f2d142869fbe','default','tenants','tenants.ui.allowClone','true',1768018994);
INSERT INTO "settings" VALUES('5f27398c-f8d3-4bca-b036-d4fed3a18724','default','tenants','tenants.ui.allowStatusChange','true',1768018994);
INSERT INTO "settings" VALUES('6ccdb56a-3630-48c5-9c36-25d1b1167179','default','tenants','tenants.ui.showPagination','true',1768018994);
INSERT INTO "settings" VALUES('1ca6cad7-37b2-4998-9b53-edaadf492405','default','tenants','tenants.ui.defaultPageSize','10',1768018994);
INSERT INTO "settings" VALUES('7a793463-e0ea-41db-845d-d8d5c6b66bd9','default','tenants','tenants.ui.columns.showId','false',1768018994);
INSERT INTO "settings" VALUES('b4954550-961c-47c4-8558-040d10d66d00','default','tenants','tenants.ui.columns.showName','true',1768018994);
INSERT INTO "settings" VALUES('3336c74c-59f7-4cba-826c-d19e32fb7d6a','default','tenants','tenants.ui.columns.showSlug','false',1768018994);
INSERT INTO "settings" VALUES('f2b8ff0b-134b-484c-8cb2-2ca068ffdc0a','default','tenants','tenants.ui.columns.showDomain','true',1768018994);
INSERT INTO "settings" VALUES('22903b91-7862-4122-bb33-940d01c91803','default','tenants','tenants.ui.columns.showStatus','true',1768018994);
INSERT INTO "settings" VALUES('be81ba85-2ed0-4f1e-9671-5a6aadfebaa4','default','tenants','tenants.ui.columns.showTrialEndsAt','false',1768018994);
INSERT INTO "settings" VALUES('ef273a58-ea7a-4c3d-bb3f-234502d016f7','default','tenants','tenants.ui.columns.showSuspendedAt','false',1768018994);
INSERT INTO "settings" VALUES('646aff41-543e-47aa-b3d4-47b1df6edff2','default','tenants','tenants.ui.columns.showSuspendedReason','false',1768018994);
INSERT INTO "settings" VALUES('be628a6f-32c0-40a1-9a52-0df6b8ce7865','default','tenants','tenants.ui.columns.showOwnerId','false',1768018994);
INSERT INTO "settings" VALUES('a4ea22ab-4ec4-40f3-9a79-69c758566142','default','tenants','tenants.ui.columns.showOwnerEmail','false',1768018994);
INSERT INTO "settings" VALUES('68d0d004-87a9-49a9-8211-f020e1a57fb8','default','tenants','tenants.ui.columns.showBillingEmail','false',1768018994);
INSERT INTO "settings" VALUES('172779f0-a8e6-4547-af78-72dc74cc1e39','default','tenants','tenants.ui.columns.showPlanId','false',1768018994);
INSERT INTO "settings" VALUES('bce9e913-19db-47d4-9f4c-63976a289ed0','default','tenants','tenants.ui.columns.showPlanName','true',1768018994);
INSERT INTO "settings" VALUES('3c303196-7841-4456-b81d-6dbe4ad99923','default','tenants','tenants.ui.columns.showBillingStatus','false',1768018994);
INSERT INTO "settings" VALUES('a1ef3bd1-10d2-45c2-8d0e-9c07e4770f3e','default','tenants','tenants.ui.columns.showNextBillingDate','false',1768018994);
INSERT INTO "settings" VALUES('938edf41-f477-4b67-bf99-62344c92d8be','default','tenants','tenants.ui.columns.showMrr','false',1768018994);
INSERT INTO "settings" VALUES('c4f698d2-66ac-48be-9045-794ec438dd19','default','tenants','tenants.ui.columns.showMaxUsers','false',1768018994);
INSERT INTO "settings" VALUES('fc9e8714-31f0-46fd-acfd-74d42990520c','default','tenants','tenants.ui.columns.showMaxStorage','false',1768018994);
INSERT INTO "settings" VALUES('ca8c8b8b-fb38-418a-8784-1c4ded75baa1','default','tenants','tenants.ui.columns.showMaxApiCalls','false',1768018994);
INSERT INTO "settings" VALUES('a71a4899-9d5d-4a45-b72d-b0e63d1ba52f','default','tenants','tenants.ui.columns.showCurrentUsers','false',1768018994);
INSERT INTO "settings" VALUES('0dd14249-14e1-4249-b385-a4a7df99629d','default','tenants','tenants.ui.columns.showStorageUsed','false',1768018994);
INSERT INTO "settings" VALUES('c01f4e68-e6b2-47b5-909a-523b7e5f8ba7','default','tenants','tenants.ui.columns.showApiCallsThisMonth','false',1768018994);
INSERT INTO "settings" VALUES('eafbf5c3-a28b-4dba-ba13-909274c24a05','default','tenants','tenants.ui.columns.showIndustry','false',1768018994);
INSERT INTO "settings" VALUES('c96cc8dc-9c05-4ecd-ae92-fbee8bd7ce13','default','tenants','tenants.ui.columns.showCompanySize','false',1768018994);
INSERT INTO "settings" VALUES('57a2411a-10ba-42bc-8471-8902f1cbf605','default','tenants','tenants.ui.columns.showNotes','false',1768018994);
INSERT INTO "settings" VALUES('90649bc7-22ee-4448-a19a-22eebe64ab94','default','tenants','tenants.ui.columns.showTags','false',1768018994);
INSERT INTO "settings" VALUES('06e49df8-245c-4d32-a777-3c1a46fa3739','default','tenants','tenants.ui.columns.showLastActivityAt','false',1768018994);
INSERT INTO "settings" VALUES('d8981f8c-e360-4027-b454-94b569634a92','default','tenants','tenants.ui.columns.showCreatedAt','false',1768018994);
INSERT INTO "settings" VALUES('8f2c15fe-5435-46a3-b3f8-565653cc857d','default','tenants','tenants.ui.columns.showUpdatedAt','false',1768018994);
INSERT INTO "settings" VALUES('9cd2138d-8cbe-4914-b5eb-d1ee1b49356d','default','tenants','tenants.ui.columns.showCreatedBy','false',1768018994);
INSERT INTO "settings" VALUES('9562c12a-da1f-454a-bda1-e6a4920e1686','default','tenants','tenants.defaultPlan','free',1768018994);
INSERT INTO "settings" VALUES('4de6c5f7-6d9b-4924-9d20-98fcf64e7d84','default','tenants','tenants.trialDays','14',1768018994);
INSERT INTO "settings" VALUES('df29cb4b-99d7-467d-87fa-217828930c15','default','tenants','tenants.defaultMaxUsers','5',1768018994);
INSERT INTO "settings" VALUES('133faffb-d0f2-4a95-8bb0-d8e618982348','default','tenants','tenants.defaultMaxStorage','1',1768018994);
INSERT INTO "settings" VALUES('b4451f05-a1ee-4004-8ba7-9bc8d29c8191','default','tenants','tenants.defaultMaxApiCalls','1000',1768018994);
INSERT INTO "settings" VALUES('268f07e4-d76f-40ee-b74b-954e5d6fe40c','default','tenants','tenants.allowCustomDomains','true',1768018994);
INSERT INTO "settings" VALUES('69625a7f-e29b-48a6-924d-1a9e309c25af','default','tenants','tenants.requireDomainVerification','true',1768018994);
INSERT INTO "settings" VALUES('eb6d8c4c-1c4c-4558-b30d-d6927ea90e51','default','tenants','tenants.autoProvisionModules','cms,seo',1768018994);
INSERT INTO "settings" VALUES('1798f012-9551-4ca4-9474-66188bf6419e','default','users','users.ui.showStatsCards','true',1768018963);
INSERT INTO "settings" VALUES('2d651d4b-5164-465f-b26d-6c8b25a4895b','default','users','users.ui.showSearch','true',1768018963);
INSERT INTO "settings" VALUES('090be23d-ee31-46c2-bd66-a52d7da8be5b','default','users','users.ui.showStatusFilter','true',1768018963);
INSERT INTO "settings" VALUES('fb3d8e57-f4c9-40f3-a540-0e8cad45aeed','default','users','users.ui.showRoleFilter','true',1768018963);
INSERT INTO "settings" VALUES('f44e4476-c95b-4e31-bf16-0f8afdd09954','default','users','users.ui.showExport','true',1768018963);
INSERT INTO "settings" VALUES('84d631f2-5909-42c8-93da-85e27078c4a3','default','users','users.ui.showImport','true',1768018963);
INSERT INTO "settings" VALUES('fb3ff58d-4591-4002-91ce-ecd4d815d124','default','users','users.ui.showBulkActions','true',1768018963);
INSERT INTO "settings" VALUES('b953760d-3014-464c-a740-9d0c0c3fd14a','default','users','users.ui.allowInvite','true',1768018963);
INSERT INTO "settings" VALUES('db84cb50-d337-478a-a5c3-2e98e48bab84','default','users','users.ui.showPagination','true',1768018963);
INSERT INTO "settings" VALUES('173a7627-4cf8-43cd-bd5f-708fbcf401cb','default','users','users.ui.defaultPageSize','10',1768018963);
INSERT INTO "settings" VALUES('875be0b4-7430-41cc-ba2d-e58f5e98c101','default','users','users.ui.columns.showId','false',1768018963);
INSERT INTO "settings" VALUES('82541188-620e-477c-a32d-2a120e9cf895','default','users','users.ui.columns.showUsername','true',1768018963);
INSERT INTO "settings" VALUES('f52e0268-3bc6-4e53-b609-933cfe6bd4eb','default','users','users.ui.columns.showEmail','false',1768018963);
INSERT INTO "settings" VALUES('ea155092-82fd-4151-8141-ffaf03ca307d','default','users','users.ui.columns.showFullName','true',1768018963);
INSERT INTO "settings" VALUES('24105a42-d30e-4bf4-b00e-a42659398141','default','users','users.ui.columns.showRole','false',1768018963);
INSERT INTO "settings" VALUES('faac77b1-f11e-4946-92ef-8f8046e7c163','default','users','users.ui.columns.showStatus','true',1768018963);
INSERT INTO "settings" VALUES('54f0fb68-83ef-4381-836d-7baeb54550e9','default','users','users.ui.columns.showLastLogin','false',1768018963);
INSERT INTO "settings" VALUES('d0045b81-4638-4cb4-9d43-6f4869dfcbb8','default','users','users.ui.columns.showCreatedAt','false',1768018963);
INSERT INTO "settings" VALUES('d74d66b3-78cb-4041-9a78-8f362b893fe8','default','users','users.ui.columns.showUpdatedAt','false',1768018963);
INSERT INTO "settings" VALUES('608013fc-4cf2-40c8-9be4-04534e7f2b22','default','users','users.ui.columns.showCreatedBy','false',1768018963);
INSERT INTO "settings" VALUES('b91d7b78-c069-4255-8c64-0d536e011213','default','users','users.defaultRole','viewer',1768018963);
INSERT INTO "settings" VALUES('ace083f0-fa99-4a69-9062-d229e319ead0','default','users','users.maxUsersPerTenant','0',1768018963);
INSERT INTO "settings" VALUES('15a36f58-3758-42f0-b2ac-8209bf9d8dcd','default','users','users.invitationExpiryDays','7',1768018963);
INSERT INTO "settings" VALUES('2a0fc3bf-6e71-4c4c-a39d-8360fdb7e7e9','default','users','users.allowInviteByNonAdmin','false',1768018963);
INSERT INTO "settings" VALUES('78af0f9c-ed77-4635-a17d-b52f77ff281e','default','users','users.requirePhoneNumber','false',1768018963);
INSERT INTO "settings" VALUES('7c329c28-0711-41e4-832a-a9fb86b06411','default','users','users.allowAvatarUpload','true',1768018963);
INSERT INTO "settings" VALUES('65657cc4-1319-400c-bf14-98e2b816c856','default','users','users.allowDataExport','true',1768018963);
INSERT INTO "settings" VALUES('db44c22d-d05c-4314-9861-c61744c8e6c1','default','users','users.allowAccountDeletion','true',1768018963);
INSERT INTO "settings" VALUES('a57a38eb-93fc-49c7-9999-77ce5365b1a9','default','users','users.seedData.generate','null',1768018963);
INSERT INTO "settings" VALUES('219e400d-c72e-420a-b0c4-5f3e33e42aa3','default','tenants','tenants.ui.filters.name','true',1768018994);
INSERT INTO "settings" VALUES('75c729fa-8fc7-4a7b-93bb-68bab7d01dab','default','tenants','tenants.ui.filters.slug','false',1768018994);
INSERT INTO "settings" VALUES('e3b0af0d-b954-4e66-88db-3feda812a10e','default','tenants','tenants.ui.filters.domain','false',1768018994);
INSERT INTO "settings" VALUES('ae7f2464-9a91-4326-9d4f-3cbc21b7dc0b','default','tenants','tenants.ui.filters.status','true',1768018994);
INSERT INTO "settings" VALUES('0f3808fe-9c62-4b40-8a41-f92d9cf0da16','default','tenants','tenants.ui.filters.planName','true',1768018994);
INSERT INTO "settings" VALUES('bc037b54-a154-42bc-859c-8bb987098049','default','tenants','tenants.ui.filters.ownerId','false',1768018994);
INSERT INTO "settings" VALUES('c52045f2-c332-49e9-954b-2487118fccd6','default','tenants','tenants.ui.filters.industry','false',1768018994);
INSERT INTO "settings" VALUES('9f9c26f6-e4b1-4748-a4a6-b74529374b73','default','tenants','tenants.ui.filters.companySize','false',1768018994);
INSERT INTO "settings" VALUES('0e1e7098-5571-4dee-90dc-31bdfdfeec21','default','tenants','tenants.ui.filters.billingStatus','false',1768018994);
INSERT INTO "settings" VALUES('cc35fdf7-591c-4308-995d-13c6e038964d','default','tenants','tenants.ui.filters.createdAt','false',1768018994);
INSERT INTO "settings" VALUES('20d8786a-073b-4eab-ac32-1070d64b446f','default','tenants','tenants.ui.filters.trialEndsAt','false',1768018994);
INSERT INTO "settings" VALUES('1aebf1c5-e664-4eca-92e8-a16645fdc7c1','default','tenants','tenants.ui.filters.tags','false',1768018994);
INSERT INTO "settings" VALUES('c5a45eef-25aa-4c91-a9a6-11068a468c6d','default','users','users.ui.filters.username','false',1768018963);
INSERT INTO "settings" VALUES('566f2b35-0300-4a33-9c50-2acf6461de45','default','users','users.ui.filters.email','false',1768018963);
INSERT INTO "settings" VALUES('3f95afac-d6d8-4796-b6d8-1578b2bfd972','default','users','users.ui.filters.fullName','false',1768018963);
INSERT INTO "settings" VALUES('9dbdf5d6-2ccf-4107-be5a-578eebe078d0','default','users','users.ui.filters.role','false',1768018963);
INSERT INTO "settings" VALUES('9b58ce84-fcf6-4ffe-bf62-8f3fe2169572','default','users','users.ui.filters.status','true',1768018963);
INSERT INTO "settings" VALUES('6150dfcb-ac76-4ce4-a630-8984aab809ce','default','users','users.ui.filters.createdAt','false',1768018963);
INSERT INTO "settings" VALUES('bdf0a280-e972-4a47-8ed4-d155c4cbd6b1','default','users','users.ui.filters.lastLogin','false',1768018963);
INSERT INTO "settings" VALUES('fecab77b-ab5c-438e-bf24-a5ebed5b7f34','default','users','users.ui.filters.createdBy','false',1768018963);
INSERT INTO "settings" VALUES('746c75e1-52fa-49f4-a221-b27daf6d1e7e','default','tenants','tenants.ui.filters.ownerEmail','false',1768018994);
INSERT INTO "settings" VALUES('7fa9e991-845a-4904-9132-80cee85b4bf1','default','tenants','tenants.ui.filterConfig','{"name":{"enabled":false,"type":"text","label":"Name","sortOptions":["a-z","z-a"],"defaultSort":"a-z","options":[]},"slug":{"enabled":false,"type":"text","label":"Slug","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"domain":{"enabled":false,"type":"text","label":"Domain","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"status":{"enabled":true,"type":"select","label":"Status","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"planName":{"enabled":true,"type":"select","label":"Plan","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"ownerEmail":{"enabled":false,"type":"text","label":"Owner","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"industry":{"enabled":false,"type":"select","label":"Industry","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"companySize":{"enabled":false,"type":"select","label":"Company Size","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"billingStatus":{"enabled":false,"type":"select","label":"Billing Status","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"createdAt":{"enabled":false,"type":"date-range","label":"Created Date","sortOptions":["newest","oldest"],"defaultSort":"newest"},"trialEndsAt":{"enabled":false,"type":"date-range","label":"Trial End Date","sortOptions":["newest","oldest"],"defaultSort":"newest"},"tags":{"enabled":false,"type":"multi-select","label":"Tags","options":"auto"}}',1768018994);
INSERT INTO "settings" VALUES('71aca5d3-a856-42cd-b53a-76e73553e5ec','default','users','users.ui.filterConfig','{"username":{"enabled":false,"type":"text","label":"Username","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"email":{"enabled":false,"type":"text","label":"Email","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"fullName":{"enabled":false,"type":"text","label":"Full Name","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"role":{"enabled":true,"type":"select","label":"Role","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"status":{"enabled":true,"type":"select","label":"Status","options":"auto","sortOptions":["a-z","z-a"],"defaultSort":"a-z"},"createdAt":{"enabled":false,"type":"date-range","label":"Created Date","sortOptions":["newest","oldest"],"defaultSort":"newest"},"lastLogin":{"enabled":false,"type":"date-range","label":"Last Login","sortOptions":["newest","oldest"],"defaultSort":"newest"},"createdBy":{"enabled":false,"type":"text","label":"Created By","sortOptions":["a-z","z-a"],"defaultSort":"a-z"}}',1768018963);
INSERT INTO "settings" VALUES('b66ff2ed-51c8-4dd3-a566-7e1705779c6f','default','users','users.ui.columns.showTenantId','false',1768018963);
INSERT INTO "settings" VALUES('237d011b-5cd7-463b-8121-cbf65972c7a4','default','users','users.ui.columns.showPassword','false',1768018963);
INSERT INTO "settings" VALUES('64717cd5-5a87-4fd5-bba4-7ed96c16ed63','default','users','users.ui.columns.showFirstName','false',1768018963);
INSERT INTO "settings" VALUES('cf6e4597-a198-4adc-b1cb-5ef29fc0d532','default','users','users.ui.columns.showLastName','false',1768018963);
INSERT INTO "settings" VALUES('a748021e-5905-4567-b667-99aec83e79b3','default','users','users.ui.columns.showEmailVerified','false',1768018963);
INSERT INTO "settings" VALUES('47c2c0d8-6a1c-4289-be82-79708b9b77c6','default','users','users.ui.columns.showLastLoginAt','false',1768018963);
INSERT INTO "settings" VALUES('99992502-9a32-4d71-a22b-5e99fe8d3b5e','default','users','users.ui.columns.showDeletedAt','false',1768018963);
INSERT INTO "settings" VALUES('c262fd2c-3c45-41d2-9ba8-5a3ff6543ca8','default','users','users.ui.columns.showPhone','false',1768018963);
INSERT INTO "settings" VALUES('295d74aa-4278-455f-b8f3-f4b840c885e5','default','users','users.ui.columns.showAvatarUrl','false',1768018963);
INSERT INTO "settings" VALUES('32d23715-e17a-4b72-bd3e-bfc1d7629b2d','default','users','users.ui.columns.showTimezone','false',1768018963);
INSERT INTO "settings" VALUES('d5200e11-746f-4384-998b-628300bfbea3','default','users','users.ui.columns.showEmailVerifiedAt','false',1768018963);
INSERT INTO "settings" VALUES('b2c65ac5-1006-4c57-9af4-dd25c49eaf38','default','users','users.ui.columns.showAccountExpiresAt','false',1768018963);
INSERT INTO "settings" VALUES('f8c16f54-7638-4329-82ce-43b599321e63','default','users','users.ui.columns.showJoinedVia','false',1768018963);
INSERT INTO "settings" VALUES('8cf4507d-7106-4995-abfc-17c366431665','default','users','users.ui.columns.showLastActivityAt','false',1768018963);
INSERT INTO "settings" VALUES('30db91c8-86b7-403c-a0d5-6af41f845ee2','default','tenants','tenants.ui.columns.showConfig','false',1768018994);
INSERT INTO "settings" VALUES('51e1b458-80b8-4e5b-b236-6f71b1b9d836','default','tenants','tenants.ui.columns.showDeletedAt','false',1768018994);
INSERT INTO "settings" VALUES('0bc13916-0761-4b06-9d1c-07ec7fdee974','default','tenants','tenants.ui.columns.showDataRegion','false',1768018994);
INSERT INTO "settings" VALUES('eba66005-475c-4c6b-8080-797417b6c0e4','default','tenants','tenants.ui.columns.showEncryptionEnabled','false',1768018994);
INSERT INTO "settings" VALUES('16c301d0-708f-4d56-a3aa-2f97935f842f','default','tenants','tenants.ui.columns.showApiAccessEnabled','false',1768018994);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('d1_migrations',7);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_domains_domain ON tenant_domains(domain);
CREATE INDEX idx_domains_tenant ON tenant_domains(tenant_id);
CREATE UNIQUE INDEX tenant_module_key_idx ON settings(tenant_id, module_id, key);