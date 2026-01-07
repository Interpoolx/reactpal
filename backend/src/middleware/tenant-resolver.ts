import { type Context, type Next } from 'hono';

export async function tenantResolverMiddleware(c: Context, next: Next) {
    const host = c.req.header('host') || '';
    const domain = host.split(':')[0]; // Remove port

    // 1. Try to resolve via ?tenantId=... parameter (Manual Override / Debug)
    const queryTenantId = c.req.query('tenantId');
    if (queryTenantId) {
        c.set('tenantId', queryTenantId);
        // Ideally fetch full tenant meta here if needed
    } else {
        // 2. Resolve via Domain -> KV Manifest (Edge Performance)
        // For Phase 1, if KV isn't populated, we'll fallback to D1
        const kv = c.env.TENANT_MANIFESTS;
        let tenant = await kv.get(`tenant:${domain}`, { type: 'json' }) as any;

        if (!tenant) {
            // 3. Fallback to D1 Database
            // Note: In a real implementation, we'd use the repository here
            const db = c.env.DB;
            const result = await db.prepare(`
        SELECT t.* FROM tenants t
        JOIN tenant_domains td ON t.id = td.tenant_id
        WHERE td.domain = ?
      `).bind(domain).first();

            if (result) {
                tenant = {
                    ...result,
                    config: JSON.parse(result.config as string)
                };
                // Auto-populate KV for subsequent requests
                await kv.put(`tenant:${domain}`, JSON.stringify(tenant));
            }
        }

        if (tenant) {
            c.set('tenant', tenant);
            c.set('tenantId', tenant.id);
        }
    }

    // 4. Fallback to Default Tenant
    if (!c.get('tenantId')) {
        c.set('tenantId', 'default');
    }

    await next();
}
