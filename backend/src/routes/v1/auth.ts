import { Hono } from 'hono';

const auth = new Hono<{ Bindings: any, Variables: any }>();

/**
 * POST /api/v1/auth/login
 * Simple login for Phase 1.
 */
auth.post('/login', async (c) => {
    const { username, password } = await c.req.json();
    const db = c.env.DB;

    // In Phase 1, we check against the hardcoded/seeded user
    const user = await db.prepare(`
    SELECT * FROM users 
    WHERE username = ? AND password = ?
  `).bind(username, password).first();

    if (user) {
        return c.json({
            success: true,
            user: { id: user.id, username: user.username, role: user.role },
            token: 'mock_token_for_phase1'
        });
    }

    return c.json({ success: false, error: 'Invalid credentials' }, 401);
});

export default auth;
