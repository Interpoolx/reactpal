import { type Context, type Next } from 'hono';

/**
 * Simple Master Key Middleware for Phase 1.
 * Sets isAdmin: true if the x-admin-key header matches.
 */
export async function adminAuthMiddleware(c: Context, next: Next) {
    const adminKey = c.req.header('x-admin-key');
    const masterKey = c.env.ADMIN_KEY;

    if (adminKey && adminKey === masterKey) {
        c.set('isAdmin', true);
    } else {
        c.set('isAdmin', false);
    }

    await next();
}
