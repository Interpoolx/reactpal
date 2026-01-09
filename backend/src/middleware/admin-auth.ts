import { type Context, type Next } from 'hono';

/**
 * Simple Master Key Middleware for Phase 1.
 * Sets isAdmin: true if the x-admin-key header matches.
 */
export async function adminAuthMiddleware(c: Context, next: Next) {
    const adminKey = c.req.header('x-admin-key');
    const masterKey = c.env.ADMIN_KEY;
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // 1. Check Master Key (Legacy/SuperAdmin)
    if (adminKey && adminKey === masterKey) {
        c.set('isAdmin', true);
        c.set('user', { role: 'super-admin', isPlatformAdmin: true });
        return await next();
    }

    // 2. Check Session Token
    if (token) {
        const db = c.env.DB;
        try {
            const session = await db.prepare(`
                SELECT s.user_id, s.tenant_id, u.role, u.username
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.access_token = ? AND s.revoked_at IS NULL AND s.expires_at > ?
            `).bind(token, Math.floor(Date.now() / 1000)).first();

            if (session) {
                c.set('isAdmin', true);
                c.set('user', {
                    id: session.user_id,
                    username: session.username,
                    role: session.role,
                    tenantId: session.tenant_id,
                    isPlatformAdmin: session.role === 'super-admin'
                });
                return await next();
            }
        } catch (err) {
            console.error('Auth middleware DB error:', err);
        }
    }

    c.set('isAdmin', false);
    c.set('user', null);
    await next();
}
