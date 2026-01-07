import { Hono } from 'hono';

const tenants = new Hono<{ Bindings: any, Variables: any }>();

/**
 * POST /api/v1/tenants/bulk
 * Atomic bulk provisioning of 100+ tenants.
 */
tenants.post('/bulk', async (c) => {
    const payload = await c.req.json();
    const db = c.env.DB;
    const kv = c.env.TENANT_MANIFESTS;

    if (!Array.isArray(payload)) {
        return c.json({ error: 'Payload must be an array of tenants' }, 400);
    }

    // Phase 1: Simple loop with db.batch()
    // In a real implementation, we'd use the repository and batch API
    const statements: any[] = [];
    const kvUpdates: Promise<void>[] = [];

    for (const item of payload) {
        const tenantId = crypto.randomUUID();
        const manifest = {
            ...item.config,
            id: tenantId,
            slug: item.slug,
            primaryDomain: item.primaryDomain
        };

        // 1. Insert Tenant
        statements.push(db.prepare(`
      INSERT INTO tenants (id, name, slug, config, status)
      VALUES (?, ?, ?, ?, 'active')
    `).bind(tenantId, item.name, item.slug, JSON.stringify(manifest)));

        // 2. Insert Primary Domain
        statements.push(db.prepare(`
      INSERT INTO tenant_domains (id, tenant_id, domain, is_primary)
      VALUES (?, ?, ?, 1)
    `).bind(crypto.randomUUID(), tenantId, item.primaryDomain));

        // 3. Prepare KV Update
        kvUpdates.push(kv.put(`tenant:${item.primaryDomain}`, JSON.stringify(manifest)));
    }

    try {
        // Execute DB Batch
        await db.batch(statements);
        // Execute KV Updates
        await Promise.all(kvUpdates);

        return c.json({
            success: true,
            count: payload.length,
            message: `${payload.length} tenants provisioned successfully.`
        });
    } catch (error: any) {
        console.error('Provisioning Error:', error);
        return c.json({ error: 'Provisioning Failed', message: error.message }, 500);
    }
});

/**
 * GET /api/v1/tenants
 * List all tenants for switcher.
 */
tenants.get('/', async (c) => {
    const db = c.env.DB;
    try {
        const results = await db.prepare(`
            SELECT t.id, t.name, t.slug, td.domain
            FROM tenants t
            LEFT JOIN tenant_domains td ON t.id = td.tenant_id AND td.is_primary = 1
            ORDER BY t.name ASC
        `).all();
        return c.json(results.results);
    } catch (error: any) {
        return c.json({ error: 'Failed to fetch tenants' }, 500);
    }
});

export default tenants;
