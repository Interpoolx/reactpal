import { Hono } from 'hono';

const resolver = new Hono<{ Bindings: any, Variables: any }>();

/**
 * GET /api/v1/auth/resolve-tenant
 * Returns the current resolved tenant info.
 */
resolver.get('/resolve-tenant', (c) => {
    const tenantId = c.get('tenantId');
    const tenant = c.get('tenant');

    if (!tenant && tenantId === 'default') {
        return c.json({ valid: true, id: 'default', slug: 'default' });
    }

    if (tenant) {
        return c.json({ valid: true, id: tenant.id, slug: tenant.slug });
    }

    return c.json({ valid: false }, 404);
});

export default resolver;
