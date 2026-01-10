import { Hono } from 'hono';

/**
 * Tenants module routes
 * Full lifecycle management for multi-tenant platform
 */
export function registerTenantsRoutes(app: Hono<any>): void {
    const tenants = new Hono<{ Bindings: any; Variables: any }>();

    // ============================================================================
    // TENANT ROUTES - /api/v1/tenants
    // ============================================================================

    /**
     * GET /api/v1/tenants
     * List all tenants (platform admin only)
     */
    tenants.get('/', async (c) => {
        const db = c.env.DB;
        const status = c.req.query('status');
        const search = c.req.query('search');

        try {
            let query = `
                SELECT t.id, t.name, t.slug, t.status, td.domain, t.plan_name, t.created_at
                FROM tenants t
                LEFT JOIN tenant_domains td ON t.id = td.tenant_id AND td.is_primary = 1
                WHERE 1=1
            `;
            const params: any[] = [];

            if (status && status !== 'all') {
                query += ' AND t.status = ?';
                params.push(status);
            }

            if (search) {
                query += ' AND (t.name LIKE ? OR t.slug LIKE ? OR td.domain LIKE ?)';
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            query += ' ORDER BY t.name ASC';

            const results = await db.prepare(query).bind(...params).all();
            return c.json(results.results || []);
        } catch (error: any) {
            console.error('Tenants fetch error:', error);
            return c.json({ error: 'Failed to fetch tenants', message: error.message }, 500);
        }
    });

    /**
     * GET /api/v1/tenants/stats
     * Get platform-wide tenant statistics
     */
    tenants.get('/stats', async (c) => {
        const db = c.env.DB;

        try {
            const stats = await db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'trial' THEN 1 ELSE 0 END) as trial,
          SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended,
          SUM(mrr) as total_mrr,
          SUM(current_users) as total_users
        FROM tenants
        WHERE deleted_at IS NULL
      `).first();

            return c.json(stats);
        } catch (error: any) {
            return c.json({ error: 'Failed to fetch stats', message: error.message }, 500);
        }
    });

    /**
     * GET /api/v1/tenants/:id
     * Get single tenant details
     */
    tenants.get('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const tenant = await db.prepare(`
        SELECT * FROM tenants WHERE id = ? AND deleted_at IS NULL
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
     * Create a new tenant (provision)
     */
    tenants.post('/', async (c) => {
        const db = c.env.DB;
        const kv = c.env.TENANT_MANIFESTS;
        const body = await c.req.json();

        const {
            name,
            slug,
            domain,
            ownerEmail,
            planName = 'free',
            maxUsers = 5,
            maxStorage = 1,
            status = 'trial',
        } = body;

        if (!name || !slug) {
            return c.json({ error: 'Name and slug are required' }, 400);
        }

        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);
        const trialEndsAt = status === 'trial' ? now + (14 * 24 * 60 * 60) : null;

        try {
            // Insert tenant into the database with all actual columns
            await db.prepare(`
                INSERT INTO tenants (
                    id, name, slug, domain, status, owner_email, 
                    plan_name, max_users, max_storage, trial_ends_at,
                    created_at, updated_at, config
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                id, name, slug, domain || null, status, ownerEmail || null,
                planName, maxUsers, maxStorage, trialEndsAt,
                now, now, JSON.stringify({})
            ).run();

            // Add domain to lookup table
            if (domain) {
                await db.prepare(`
                    INSERT INTO tenant_domains (id, tenant_id, domain, is_primary, created_at)
                    VALUES (?, ?, ?, 1, ?)
                `).bind(crypto.randomUUID(), id, domain, now).run();

                // Update KV manifest for fast domain lookup
                if (kv) {
                    const manifest = await kv.get('tenant_manifest', 'json') || {};
                    manifest[domain] = { id, slug, name };
                    await kv.put('tenant_manifest', JSON.stringify(manifest));
                }
            }

            return c.json({
                id,
                name,
                slug,
                domain,
                status,
                planName,
                trialEndsAt
            }, 201);
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

        // These columns now all exist in the database
        const allowedFields = [
            'name', 'slug', 'domain', 'status', 'owner_email', 'billing_email',
            'plan_name', 'plan_id', 'max_users', 'max_storage', 'max_api_calls',
            'industry', 'company_size', 'notes', 'data_region',
            'encryption_enabled', 'api_access_enabled'
        ];

        const updates: string[] = [];
        const params: any[] = [];

        for (const field of allowedFields) {
            const camelCase = field.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            if (body[camelCase] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(body[camelCase]);
            } else if (body[field] !== undefined) {
                updates.push(`${field} = ?`);
                params.push(body[field]);
            }
        }

        if (updates.length === 0) {
            return c.json({ error: 'No fields to update' }, 400);
        }

        try {
            // Update main tenant fields
            updates.push('updated_at = ?');
            params.push(Math.floor(Date.now() / 1000));
            params.push(id);
            await db.prepare(`UPDATE tenants SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();

            // Handle domain update in KV if domain was updated
            const newDomain = body.domain;
            if (newDomain !== undefined) {
                // Get current primary domain for KV cleanup
                const currentDomain = await db.prepare(
                    'SELECT domain FROM tenant_domains WHERE tenant_id = ? AND is_primary = 1'
                ).bind(id).first();

                if (currentDomain?.domain && currentDomain.domain !== newDomain) {
                    // Delete old KV entry
                    if (kv) {
                        const manifest = await kv.get('tenant_manifest', 'json') || {};
                        delete manifest[currentDomain.domain];
                        await kv.put('tenant_manifest', JSON.stringify(manifest));
                    }
                }

                // Delete old primary domain
                await db.prepare(
                    'DELETE FROM tenant_domains WHERE tenant_id = ? AND is_primary = 1'
                ).bind(id).run();

                // Insert new primary domain if provided
                if (newDomain) {
                    await db.prepare(`
                        INSERT INTO tenant_domains (id, tenant_id, domain, is_primary, created_at)
                        VALUES (?, ?, ?, 1, ?)
                    `).bind(crypto.randomUUID(), id, newDomain, Math.floor(Date.now() / 1000)).run();

                    // Update KV manifest
                    if (kv) {
                        const tenant = await db.prepare('SELECT name, slug FROM tenants WHERE id = ?').bind(id).first();
                        if (tenant) {
                            const manifest = await kv.get('tenant_manifest', 'json') || {};
                            manifest[newDomain] = { id, slug: tenant.slug, name: tenant.name };
                            await kv.put('tenant_manifest', JSON.stringify(manifest));
                        }
                    }
                }
            }

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to update tenant', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/tenants/:id/suspend
     * Suspend a tenant
     */
    tenants.post('/:id/suspend', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');
        const { reason } = await c.req.json();
        const now = Math.floor(Date.now() / 1000);

        try {
            await db.prepare(`
                UPDATE tenants 
                SET status = 'suspended', suspended_at = ?, suspended_reason = ?, updated_at = ?
                WHERE id = ?
            `).bind(now, reason || 'Suspended by administrator', now, id).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to suspend tenant', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/tenants/:id/reactivate
     * Reactivate a suspended tenant
     */
    tenants.post('/:id/reactivate', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');
        const now = Math.floor(Date.now() / 1000);

        try {
            await db.prepare(`
                UPDATE tenants 
                SET status = 'active', suspended_at = NULL, suspended_reason = NULL, updated_at = ?
                WHERE id = ?
            `).bind(now, id).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to reactivate tenant', message: error.message }, 500);
        }
    });

    /**
     * DELETE /api/v1/tenants/:id
     * Soft delete (archive) a tenant or permanently delete
     */
    tenants.delete('/:id', async (c) => {
        const db = c.env.DB;
        const kv = c.env.TENANT_MANIFESTS;
        const id = c.req.param('id');
        const permanent = c.req.query('permanent') === 'true';
        const now = Math.floor(Date.now() / 1000);

        try {
            // Get tenant domains for KV cleanup
            const domains = await db.prepare(
                'SELECT domain FROM tenant_domains WHERE tenant_id = ?'
            ).bind(id).all();

            if (permanent) {
                // Hard delete from database
                await db.prepare('DELETE FROM tenant_domains WHERE tenant_id = ?').bind(id).run();
                await db.prepare('DELETE FROM tenants WHERE id = ?').bind(id).run();
            } else {
                // Soft delete: just update status to 'archived'
                await db.prepare(`
                    UPDATE tenants 
                    SET status = 'archived', deleted_at = ?, updated_at = ?
                    WHERE id = ?
                `).bind(now, now, id).run();
            }

            // Cleanup KV for all domains
            if (kv && domains.results) {
                for (const row of (domains.results as any[])) {
                    if (row.domain) {
                        await kv.delete(`tenant:${row.domain}`);
                    }
                }
            }

            return c.json({ success: true, permanent });
        } catch (error: any) {
            return c.json({ error: 'Failed to delete tenant', message: error.message }, 500);
        }
    });

    /**
     * GET /api/v1/tenants/:id/usage
     * Get tenant usage statistics
     */
    tenants.get('/:id/usage', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const usage = await db.prepare(`
        SELECT 
          current_users, max_users,
          storage_used, max_storage,
          api_calls_this_month, max_api_calls
        FROM tenants WHERE id = ?
      `).bind(id).first();

            if (!usage) {
                return c.json({ error: 'Tenant not found' }, 404);
            }

            return c.json({
                users: {
                    current: usage.current_users,
                    max: usage.max_users,
                    percentage: usage.max_users > 0 ? Math.round((usage.current_users / usage.max_users) * 100) : 0,
                },
                storage: {
                    current: usage.storage_used,
                    max: usage.max_storage,
                    unit: 'GB',
                    percentage: usage.max_storage > 0 ? Math.round((usage.storage_used / usage.max_storage) * 100) : 0,
                },
                apiCalls: {
                    current: usage.api_calls_this_month,
                    max: usage.max_api_calls,
                    percentage: usage.max_api_calls > 0 ? Math.round((usage.api_calls_this_month / usage.max_api_calls) * 100) : 0,
                },
            });
        } catch (error: any) {
            return c.json({ error: 'Failed to fetch usage', message: error.message }, 500);
        }
    });

    /**
     * GET /api/v1/tenants/:id/modules
     * Get enabled modules for tenant
     */
    tenants.get('/:id/modules', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const modules = await db.prepare(`
        SELECT module_id, enabled, enabled_at, enabled_by, settings
        FROM module_status
        WHERE tenant_id = ?
      `).bind(id).all();

            return c.json(modules.results);
        } catch (error: any) {
            return c.json({ error: 'Failed to fetch modules', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/tenants/:id/modules/:moduleId/enable
     * Enable a module for tenant
     */
    tenants.post('/:id/modules/:moduleId/enable', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.param('id');
        const moduleId = c.req.param('moduleId');
        const { enabledBy } = await c.req.json();

        try {
            await db.prepare(`
        INSERT INTO module_status (id, module_id, tenant_id, enabled, enabled_at, enabled_by, created_at)
        VALUES (?, ?, ?, 1, ?, ?, ?)
        ON CONFLICT(module_id, tenant_id) DO UPDATE SET enabled = 1, enabled_at = ?, enabled_by = ?, updated_at = ?
      `).bind(
                crypto.randomUUID(),
                moduleId,
                tenantId,
                Math.floor(Date.now() / 1000),
                enabledBy,
                Math.floor(Date.now() / 1000),
                Math.floor(Date.now() / 1000),
                enabledBy,
                Math.floor(Date.now() / 1000)
            ).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to enable module', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/tenants/:id/modules/:moduleId/disable
     * Disable a module for tenant
     */
    tenants.post('/:id/modules/:moduleId/disable', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.param('id');
        const moduleId = c.req.param('moduleId');

        try {
            await db.prepare(`
        UPDATE module_status SET enabled = 0, updated_at = ?
        WHERE module_id = ? AND tenant_id = ?
      `).bind(Math.floor(Date.now() / 1000), moduleId, tenantId).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to disable module', message: error.message }, 500);
        }
    });

    // Mount routes
    app.route('/api/v1/tenants', tenants);
}
