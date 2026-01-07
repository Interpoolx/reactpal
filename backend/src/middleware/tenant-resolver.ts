import { type Context, type Next } from 'hono';

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
    }

    // 4. Fallback to Default Tenant (only if no explicit request failed)
    if (!c.get('tenantId')) {
        c.set('tenantId', 'default');
    }

    await next();
}
