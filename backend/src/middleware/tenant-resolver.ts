import { type Context, type Next } from 'hono';

/**
 * Middleware to resolve tenant from incoming request
 * 
 * Resolves tenant using multiple strategies (in order):
 * 1. Query parameter (?tenant=id or ?tenantId=id) - for manual override/debugging
 * 2. KV manifest cache (edge performance) - checks tenant:domain key
 * 3. Database fallback - queries tenant_domains table
 * 4. Default tenant - falls back to 'default' tenant if no match
 * 
 * Sets `c.set('tenant', tenantObject)` and `c.set('tenantId', id)` for downstream handlers
 * 
 * @param {Context} c - Hono context
 * @param {Next} next - Next middleware function
 * 
 * @example
 * // In Hono router setup:
 * app.use('*', tenantResolverMiddleware);
 * 
 * // In a route handler:
 * app.get('/api/data', async (c) => {
 *   const tenantId = c.get('tenantId'); // 'default' or resolved tenant id
 *   const tenant = c.get('tenant');     // full tenant object (may be undefined)
 * });
 */
export async function tenantResolverMiddleware(c: Context, next: Next) {
    const host = c.req.header('host') || '';
    const domain = host.split(':')[0]; // Remove port

    // 1. Try to resolve via ?tenant=... or ?tenantId=... parameter (Manual Override / Debug)
    const queryId = c.req.query('tenant') || c.req.query('tenantId');
    let tenant: any = null;
    let explicitlyRequested = false;

    if (queryId) {
        explicitlyRequested = true;
        const db = c.env.DB;
        const result = await db.prepare(`
            SELECT t.* FROM tenants t
            LEFT JOIN tenant_domains td ON t.id = td.tenant_id
            WHERE t.id = ? OR t.slug = ? OR td.domain = ?
            LIMIT 1
        `).bind(queryId, queryId, queryId).first();

        if (result) {
            tenant = {
                ...result,
                config: typeof result.config === 'string' ? JSON.parse(result.config) : result.config
            };
        }
    } else {
        // 2. Resolve via Domain -> KV Manifest (Edge Performance)
        const kv = c.env.TENANT_MANIFESTS;
        tenant = await kv.get(`tenant:${domain}`, { type: 'json' }) as any;

        if (!tenant) {
            // 3. Fallback to D1 Database
            const db = c.env.DB;
            const result = await db.prepare(`
                SELECT t.* FROM tenants t
                JOIN tenant_domains td ON t.id = td.tenant_id
                WHERE td.domain = ?
            `).bind(domain).first();

            if (result) {
                tenant = {
                    ...result,
                    config: typeof result.config === 'string' ? JSON.parse(result.config) : result.config
                };
                // Auto-populate KV
                await kv.put(`tenant:${domain}`, JSON.stringify(tenant));
            }
        }
    }

    if (tenant) {
        c.set('tenant', tenant);
        c.set('tenantId', tenant.id);
    } else if (explicitlyRequested) {
        // If they asked for a specific tenant and we didn't find it, don't fall back
        c.set('tenantId', 'invalid');
    } else {
        // Fallback to fetching 'default' tenant from DB to ensure metadata exists
        const db = c.env.DB;
        const result = await db.prepare("SELECT * FROM tenants WHERE id = 'default'").first();
        if (result) {
            const defaultTenant = {
                ...result,
                config: typeof result.config === 'string' ? JSON.parse(result.config) : result.config
            };
            c.set('tenant', defaultTenant);
            c.set('tenantId', 'default');
        } else {
            c.set('tenantId', 'default');
        }
    }

    await next();
}
