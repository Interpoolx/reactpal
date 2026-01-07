import { Hono } from 'hono';

const resolver = new Hono<{ Bindings: any, Variables: any }>();

/**
 * GET /api/v1/auth/resolve-tenant
 * Returns the current resolved tenant info.
 */
resolver.get('/resolve-tenant', (c) => {
    const tenantId = c.get('tenantId');
    const tenant = c.get('tenant');

    if (tenantId === 'invalid') {
        return c.json({ valid: false, error: 'Tenant not found' }, 404);
    }

    if (tenant) {
        return c.json({
            valid: true,
            id: tenant.id,
            slug: tenant.slug,
            name: tenant.name,
            domain: tenant.domain
        });
    }

    // fallback info if tenantId is default but DB fetch failed for some reason
    if (tenantId === 'default') {
        return c.json({
            valid: true,
            id: 'default',
            slug: 'default',
            name: 'Default Tenant',
            domain: 'default'
        });
    }

    return c.json({ valid: false }, 404);
});

export default resolver;
