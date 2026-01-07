-- Seed initial tenants
INSERT INTO tenants (id, name, slug, config, status) VALUES 
('t_001', 'Web4 Strategy', 'web4strategy', '{"meta":{"siteTitle":"Web4 Strategy | Enterprise SaaS"},"appearance":{"brandColor":"#0f172a"},"modules":{"activeList":["cms","seo"],"visibility":{"cms":["admin","editor"],"seo":["admin"]}}}', 'active'),
('t_002', 'JurisQuest', 'jurisquest', '{"meta":{"siteTitle":"JurisQuest | Legal Excellence"},"appearance":{"brandColor":"#1e293b"},"modules":{"activeList":["cms"],"visibility":{"cms":["admin","editor"]}}}', 'active');

-- Seed domains
INSERT INTO tenant_domains (id, tenant_id, domain, is_primary) VALUES
('d_001', 't_001', 'web4strategy.com', 1),
('d_001_local', 't_001', 'localhost', 0),
('d_002', 't_002', 'jurisquest.com', 1);
