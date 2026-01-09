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
 * List all tenants with optional filtering.
 * Query params: ?search=term&status=active
 */
tenants.get('/', async (c) => {
    const db = c.env.DB;
    const url = new URL(c.req.url);
    const search = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || '';

    try {
        let query = `
            SELECT t.id, t.name, t.slug, t.status, t.plan_name, t.created_at, td.domain
            FROM tenants t
            LEFT JOIN tenant_domains td ON t.id = td.tenant_id AND td.is_primary = 1
            WHERE t.deleted_at IS NULL
        `;
        const params: any[] = [];

        if (search) {
            query += ` AND (t.name LIKE ? OR t.slug LIKE ? OR td.domain LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (statusFilter && statusFilter !== 'all') {
            query += ` AND t.status = ?`;
            params.push(statusFilter);
        }

        query += ` ORDER BY t.name ASC`;

        const results = await db.prepare(query).bind(...params).all();
        return c.json(results.results);
    } catch (error: any) {
        console.error('Failed to fetch tenants:', error);
        return c.json({ error: 'Failed to fetch tenants', message: error.message }, 500);
    }
});


/**
 * GET /api/v1/tenants/:id
 * Get a single tenant by ID
 */
tenants.get('/:id', async (c) => {
    const db = c.env.DB;
    const id = c.req.param('id');

    try {
        const tenant = await db.prepare(`
            SELECT t.id, t.name, t.slug, t.status, t.config, td.domain
            FROM tenants t
            LEFT JOIN tenant_domains td ON t.id = td.tenant_id AND td.is_primary = 1
            WHERE t.id = ?
        `).bind(id).first();

        if (!tenant) {
            return c.json({ error: 'Tenant not found' }, 404);
        }
        return c.json(tenant);
    } catch (error: any) {
        return c.json({ error: 'Failed to fetch tenant', message: error.message }, 500);
    }
});

/**
 * POST /api/v1/tenants
 * Create a new tenant
 */
tenants.post('/', async (c) => {
    const db = c.env.DB;
    const kv = c.env.TENANT_MANIFESTS;
    const body = await c.req.json();
    const { name, slug, domain, status = 'active', plan_name = 'free', description = '' } = body;

    if (!name || !slug) {
        return c.json({ error: 'Name and slug are required' }, 400);
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return c.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, 400);
    }

    const id = crypto.randomUUID();
    const config = { description };

    try {
        await db.prepare(`
            INSERT INTO tenants (id, name, slug, config, status, plan_name)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(id, name, slug, JSON.stringify(config), status, plan_name).run();

        if (domain) {
            await db.prepare(`
                INSERT INTO tenant_domains (id, tenant_id, domain, is_primary)
                VALUES (?, ?, ?, 1)
            `).bind(crypto.randomUUID(), id, domain).run();

            await kv.put(`tenant:${domain}`, JSON.stringify({ id, name, slug, domain, status, plan_name }));
        }

        return c.json({ id, name, slug, domain, status, plan_name }, 201);
    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return c.json({ error: 'Slug or domain already exists' }, 409);
        }
        return c.json({ error: 'Failed to create tenant', message: error.message }, 500);
    }
});

/**
 * PATCH /api/v1/tenants/:id
 * Update a tenant
 */
tenants.patch('/:id', async (c) => {
    const db = c.env.DB;
    const kv = c.env.TENANT_MANIFESTS;
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, slug, status, domain, plan_name } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
    }
    if (slug !== undefined) {
        updates.push('slug = ?');
        params.push(slug);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
    }
    if (plan_name !== undefined) {
        updates.push('plan_name = ?');
        params.push(plan_name);
    }

    // Always update updated_at
    updates.push('updated_at = ?');
    params.push(Math.floor(Date.now() / 1000));

    params.push(id);

    try {
        // Update tenant record
        await db.prepare(`UPDATE tenants SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

        // Handle domain update if provided
        if (domain !== undefined) {
            // Get current primary domain to remove from KV
            const currentDomain = await db.prepare(
                `SELECT domain FROM tenant_domains WHERE tenant_id = ? AND is_primary = 1`
            ).bind(id).first();

            if (currentDomain?.domain && currentDomain.domain !== domain) {
                // Delete old KV entry
                await kv.delete(`tenant:${currentDomain.domain}`);
            }

            // Update or insert primary domain
            await db.prepare(`
                DELETE FROM tenant_domains WHERE tenant_id = ? AND is_primary = 1
            `).bind(id).run();

            if (domain) {
                await db.prepare(`
                    INSERT INTO tenant_domains (id, tenant_id, domain, is_primary)
                    VALUES (?, ?, ?, 1)
                `).bind(crypto.randomUUID(), id, domain).run();

                // Update KV with new domain
                const tenant = await db.prepare(
                    `SELECT id, name, slug, status, plan_name FROM tenants WHERE id = ?`
                ).bind(id).first();
                if (tenant) {
                    await kv.put(`tenant:${domain}`, JSON.stringify({ ...tenant, domain }));
                }
            }
        }

        return c.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return c.json({ error: 'Slug or domain already exists' }, 409);
        }
        return c.json({ error: 'Failed to update tenant', message: error.message }, 500);
    }
});

/**
 * DELETE /api/v1/tenants/:id
 * Delete a tenant
 */
tenants.delete('/:id', async (c) => {
    const db = c.env.DB;
    const id = c.req.param('id');

    try {
        // Delete associated domains first
        await db.prepare('DELETE FROM tenant_domains WHERE tenant_id = ?').bind(id).run();
        // Then delete tenant
        await db.prepare('DELETE FROM tenants WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ error: 'Failed to delete tenant', message: error.message }, 500);
    }
});

export default tenants;
