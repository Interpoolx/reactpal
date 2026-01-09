import { Hono } from 'hono';
import { moduleRegistry } from '@reactpress/core-registry';

/**
 * Register module management API routes
 * 
 * Provides REST API for querying and managing modules:
 * - List modules with stats
 * - Get individual module details
 * - Enable/disable modules platform-wide or per-tenant
 * - Get sidebar menu items based on context
 * - Track module usage across tenants
 * 
 * Routes mounted at /api/v1/modules:
 * - GET    / - List all modules with stats
 * - GET    /stats - Statistics summary
 * - GET    /menu - Sidebar menu for current user/tenant
 * - GET    /status - Module enablement status
 * - GET    /:id - Get single module details
 * - POST   /:id/enable - Enable module platform-wide
 * - POST   /:id/disable - Disable module platform-wide
 * - GET    /:id/tenants - Get all tenants with module status
 * 
 * @param {Hono<any>} app - Hono app instance to mount routes on
 * 
 * @note This is CORE infrastructure, not a module itself
 * @note All data comes from moduleRegistry (dynamic) and database (stats)
 */
export function registerModulesRoutes(app: Hono<any>): void {
    const modules = new Hono<{ Bindings: any; Variables: any }>();

    // Dynamic module list from registry (filter out infrastructure)
    const getModules = () => moduleRegistry.getAll().filter(m => !m.isInfrastructure);

    /**
     * GET /api/v1/modules
     * List all modules with stats
     */
    modules.get('/', async (c) => {
        const db = c.env.DB;

        try {
            // Get enabled counts per module
            const stats = await db.prepare(`
        SELECT module_id, COUNT(*) as tenant_count 
        FROM module_status 
        WHERE enabled = 1 
        GROUP BY module_id
      `).all();

            const statsByModule: Record<string, number> = {};
            for (const row of stats.results || []) {
                statsByModule[(row as any).module_id] = (row as any).tenant_count;
            }

            // Get total tenant count (simple query without deleted_at)
            const tenantCount = await db.prepare('SELECT COUNT(*) as count FROM tenants').first();

            const modulesWithStats = getModules().map(mod => ({
                ...mod,
                tenantsEnabled: statsByModule[mod.id] || 0,
                totalTenants: (tenantCount as any)?.count || 0,
                platformEnabled: mod.isCore || (statsByModule[mod.id] || 0) > 0,
                status: mod.isCore ? 'enabled' : (statsByModule[mod.id] > 0 ? 'enabled' : 'available'),
            }));

            return c.json(modulesWithStats);
        } catch (error: any) {
            console.error('Failed to get modules:', error);
            return c.json(getModules().map(m => ({ ...m, tenantsEnabled: 0, platformEnabled: m.isCore })));
        }
    });

    /**
     * GET /api/v1/modules/stats
     * Get module statistics summary
     */
    modules.get('/stats', async (c) => {
        const db = c.env.DB;

        try {
            const enabledCount = await db.prepare(`
        SELECT COUNT(DISTINCT module_id) as count 
        FROM module_status 
        WHERE enabled = 1
      `).first();

            return c.json({
                total: getModules().length,
                core: getModules().filter(m => m.isCore).length,
                enabled: (enabledCount as any)?.count || 0,
                available: getModules().filter(m => !m.isCore).length,
            });
        } catch (error: any) {
            return c.json({ total: getModules().length, core: 3, enabled: 0, available: 4 });
        }
    });

    /**
     * GET /api/v1/modules/menu
     * Get sidebar menu items for current user
     */
    modules.get('/menu', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.query('tenantId');

        const user = c.get('user');
        const isAdmin = c.get('isAdmin');

        // For local dev: treat any authenticated admin as super admin
        // This ensures menu items are visible during development
        const isSuperAdmin = isAdmin === true;
        const tenantPlan = 'pro';

        console.log('[Menu] isAdmin:', isAdmin, 'user:', user?.role, 'isSuperAdmin:', isSuperAdmin);

        try {
            let enabledModules: string[] = [];

            if (tenantId && tenantId !== 'default') {
                const results = await db.prepare(`
                    SELECT module_id FROM module_status 
                    WHERE tenant_id = ? AND enabled = 1
                `).bind(tenantId).all();

                enabledModules = (results.results || []).map((r: any) => r.module_id);
            }

            // Get dynamic menu from registry
            const menuItems = await moduleRegistry.getSidebarMenu({
                isSuperAdmin,
                tenantPlan,
                enabledModules
            });

            return c.json(menuItems);
        } catch (error: any) {
            console.error('Failed to get module menu:', error);
            // Minimal fallback
            return c.json([
                { label: 'Dashboard', icon: 'LayoutDashboard', href: '/hpanel', order: 0 },
                { label: 'Modules', icon: 'Package', href: '/hpanel/modules', order: 5 },
            ]);
        }
    });

    /**
     * GET /api/v1/modules/status
     * Get all module statuses for a tenant
     */
    modules.get('/status', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.query('tenantId');
        const moduleId = c.req.query('moduleId');

        try {
            let query = 'SELECT module_id, tenant_id, enabled, enabled_at, enabled_by FROM module_status';
            const params: string[] = [];

            if (tenantId) {
                query += ' WHERE tenant_id = ?';
                params.push(tenantId);
            } else if (moduleId) {
                query += ' WHERE module_id = ?';
                params.push(moduleId);
            }

            const statuses = await db.prepare(query).bind(...params).all();
            return c.json(statuses.results);
        } catch (error: any) {
            return c.json([]);
        }
    });

    /**
     * GET /api/v1/modules/:id
     * Get single module details
     */
    modules.get('/:id', async (c) => {
        const db = c.env.DB;
        const moduleId = c.req.param('id');

        const module = getModules().find(m => m.id === moduleId);
        if (!module) {
            return c.json({ error: 'Module not found' }, 404);
        }

        try {
            // Get tenant count for this module
            const stats = await db.prepare(`
        SELECT COUNT(*) as enabled_count 
        FROM module_status 
        WHERE module_id = ? AND enabled = 1
      `).bind(moduleId).first();

            // Get all tenants with their status for this module
            const tenantStatuses = await db.prepare(`
        SELECT t.id, t.name, t.slug, ms.enabled, ms.enabled_at, ms.enabled_by
        FROM tenants t
        LEFT JOIN module_status ms ON t.id = ms.tenant_id AND ms.module_id = ?
      `).bind(moduleId).all();

            return c.json({
                ...module,
                tenantsEnabled: (stats as any)?.enabled_count || 0,
                tenants: tenantStatuses.results,
            });
        } catch (error: any) {
            return c.json({ ...module, tenantsEnabled: 0, tenants: [] });
        }
    });

    /**
     * POST /api/v1/modules/:id/enable
     * Enable module platform-wide
     */
    modules.post('/:id/enable', async (c) => {
        const db = c.env.DB;
        const moduleId = c.req.param('id');
        const { enabledBy } = await c.req.json();

        try {
            // Get all tenants
            const tenants = await db.prepare('SELECT id FROM tenants').all();

            // Enable for all tenants
            for (const tenant of tenants.results || []) {
                await db.prepare(`
          INSERT INTO module_status (id, module_id, tenant_id, enabled, enabled_at, enabled_by, created_at)
          VALUES (?, ?, ?, 1, ?, ?, ?)
          ON CONFLICT(module_id, tenant_id) DO UPDATE SET enabled = 1, enabled_at = ?, enabled_by = ?
        `).bind(
                    crypto.randomUUID(),
                    moduleId,
                    (tenant as any).id,
                    Math.floor(Date.now() / 1000),
                    enabledBy || 'admin',
                    Math.floor(Date.now() / 1000),
                    Math.floor(Date.now() / 1000),
                    enabledBy || 'admin'
                ).run();
            }

            return c.json({ success: true, tenantsEnabled: tenants.results?.length || 0 });
        } catch (error: any) {
            return c.json({ error: 'Failed to enable module', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/modules/:id/disable
     * Disable module platform-wide
     */
    modules.post('/:id/disable', async (c) => {
        const db = c.env.DB;
        const moduleId = c.req.param('id');

        try {
            await db.prepare(`
        UPDATE module_status SET enabled = 0, updated_at = ?
        WHERE module_id = ?
      `).bind(Math.floor(Date.now() / 1000), moduleId).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to disable module', message: error.message }, 500);
        }
    });

    /**
     * GET /api/v1/modules/:id/tenants
     * Get all tenants with their status for a module
     */
    modules.get('/:id/tenants', async (c) => {
        const db = c.env.DB;
        const moduleId = c.req.param('id');

        try {
            const tenants = await db.prepare(`
        SELECT t.id, t.name, t.slug, t.status,
               ms.enabled, ms.enabled_at, ms.enabled_by
        FROM tenants t
        LEFT JOIN module_status ms ON t.id = ms.tenant_id AND ms.module_id = ?
        ORDER BY t.name
      `).bind(moduleId).all();

            return c.json(tenants.results);
        } catch (error: any) {
            return c.json([]);
        }
    });

    // Mount routes
    app.route('/api/v1/modules', modules);
}
