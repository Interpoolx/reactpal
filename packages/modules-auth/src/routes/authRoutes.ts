import { Hono } from 'hono';
import { API_ROUTES } from '@reactpress/core-registry';

/**
 * Register all authentication routes on the Hono app
 * 
 * Mounts complete auth API at /api/v1/auth including:
 * - Login/logout (single session and all sessions)
 * - Password management
 * - Session management and history
 * - User info and login history
 * 
 * All endpoints track login attempts and manage session tokens.
 * Currently uses UUID-based tokens (TODO: migrate to JWT)
 * 
 * @param {Hono<any>} app - Hono app instance to mount routes on
 * 
 * @example
 * import { registerAuthRoutes } from '@reactpress/modules-auth';
 * const app = new Hono();
 * registerAuthRoutes(app);
 * 
 * // Routes now available:
 * // POST   /api/v1/auth/login
 * // POST   /api/v1/auth/logout
 * // POST   /api/v1/auth/logout-all
 * // GET    /api/v1/auth/me
 * // GET    /api/v1/auth/sessions
 * // DELETE /api/v1/auth/sessions/:id
 * // GET    /api/v1/auth/login-history
 * // POST   /api/v1/auth/change-password
 */
export function registerAuthRoutes(app: Hono<any>): void {
    const auth = new Hono<{ Bindings: any; Variables: any }>();

    /**
     * POST /api/v1/auth/login
     * Authenticate user with username/password
     */
    auth.post('/login', async (c) => {
        const db = c.env.DB;
        const body = await c.req.json();
        const { username, password } = body;

        if (!username || !password) {
            return c.json({ error: 'Username and password are required' }, 400);
        }

        try {
            // Find user
            const user = await db.prepare(
                'SELECT id, username, password, role, tenant_id, status, email_verified FROM users WHERE username = ?'
            ).bind(username).first();

            if (!user) {
                // Track failed login attempt
                await trackLoginAttempt(db, username, null, false, 'User not found', c);
                return c.json({ error: 'Invalid credentials' }, 401);
            }

            // Check password (simple comparison for now, should use bcrypt)
            if (user.password !== password) {
                await trackLoginAttempt(db, username, user.tenant_id, false, 'Invalid password', c);
                return c.json({ error: 'Invalid credentials' }, 401);
            }

            // Check if user is active
            if (user.status !== 'active') {
                await trackLoginAttempt(db, username, user.tenant_id, false, 'Account not active', c);
                return c.json({ error: 'Account is not active' }, 403);
            }

            // Create session
            const sessionId = crypto.randomUUID();
            const accessToken = crypto.randomUUID(); // Should use JWT
            const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 24 hours

            await db.prepare(`
        INSERT INTO sessions (id, user_id, tenant_id, access_token, expires_at, user_agent, ip_address, created_at, last_activity_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
                sessionId,
                user.id,
                user.tenant_id,
                accessToken,
                expiresAt,
                c.req.header('user-agent') || 'unknown',
                c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
                Math.floor(Date.now() / 1000),
                Math.floor(Date.now() / 1000)
            ).run();

            // Track successful login
            await trackLoginAttempt(db, username, user.tenant_id, true, null, c);

            // Update last login
            await db.prepare('UPDATE users SET last_login_at = ? WHERE id = ?')
                .bind(Math.floor(Date.now() / 1000), user.id).run();

            return c.json({
                success: true,
                token: accessToken,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    tenantId: user.tenant_id,
                },
                expiresAt,
            });
        } catch (error: any) {
            console.error('Login error:', error);
            return c.json({ error: 'Login failed', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/auth/logout
     * Logout current session
     */
    auth.post('/logout', async (c) => {
        const db = c.env.DB;
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return c.json({ error: 'No token provided' }, 400);
        }

        try {
            await db.prepare('UPDATE sessions SET revoked_at = ? WHERE access_token = ?')
                .bind(Math.floor(Date.now() / 1000), token).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Logout failed' }, 500);
        }
    });

    /**
     * POST /api/v1/auth/logout-all
     * Logout all sessions for the user
     */
    auth.post('/logout-all', async (c) => {
        const db = c.env.DB;
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return c.json({ error: 'No token provided' }, 400);
        }

        try {
            // Get user from token
            const session = await db.prepare('SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL')
                .bind(token).first();

            if (!session) {
                return c.json({ error: 'Invalid session' }, 401);
            }

            // Revoke all sessions
            await db.prepare('UPDATE sessions SET revoked_at = ? WHERE user_id = ?')
                .bind(Math.floor(Date.now() / 1000), session.user_id).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Logout all failed' }, 500);
        }
    });

    /**
     * GET /api/v1/auth/me
     * Get current user info
     */
    auth.get('/me', async (c) => {
        const db = c.env.DB;
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return c.json({ error: 'No token provided' }, 401);
        }

        try {
            const session = await db.prepare(`
        SELECT s.user_id, s.tenant_id, s.expires_at, u.username, u.role, u.email, u.first_name, u.last_name, u.avatar_url
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.access_token = ? AND s.revoked_at IS NULL AND s.expires_at > ?
      `).bind(token, Math.floor(Date.now() / 1000)).first();

            if (!session) {
                return c.json({ error: 'Invalid or expired session' }, 401);
            }

            return c.json({
                id: session.user_id,
                username: session.username,
                email: session.email,
                role: session.role,
                tenantId: session.tenant_id,
                firstName: session.first_name,
                lastName: session.last_name,
                avatarUrl: session.avatar_url,
            });
        } catch (error: any) {
            return c.json({ error: 'Failed to get user info' }, 500);
        }
    });

    /**
     * GET /api/v1/auth/sessions
     * List active sessions for current user
     */
    auth.get('/sessions', async (c) => {
        const db = c.env.DB;
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return c.json({ error: 'No token provided' }, 401);
        }

        try {
            const currentSession = await db.prepare('SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL')
                .bind(token).first();

            if (!currentSession) {
                return c.json({ error: 'Invalid session' }, 401);
            }

            const sessions = await db.prepare(`
        SELECT id, user_agent, ip_address, last_activity_at, created_at,
               CASE WHEN access_token = ? THEN 1 ELSE 0 END as is_current
        FROM sessions
        WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
        ORDER BY last_activity_at DESC
      `).bind(token, currentSession.user_id, Math.floor(Date.now() / 1000)).all();

            return c.json(sessions.results);
        } catch (error: any) {
            return c.json({ error: 'Failed to get sessions' }, 500);
        }
    });

    /**
     * DELETE /api/v1/auth/sessions/:id
     * Revoke a specific session
     */
    auth.delete('/sessions/:id', async (c) => {
        const db = c.env.DB;
        const sessionId = c.req.param('id');
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return c.json({ error: 'No token provided' }, 401);
        }

        try {
            // Verify ownership
            const currentSession = await db.prepare('SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL')
                .bind(token).first();

            if (!currentSession) {
                return c.json({ error: 'Invalid session' }, 401);
            }

            // Revoke the target session (only if owned by the same user)
            await db.prepare('UPDATE sessions SET revoked_at = ? WHERE id = ? AND user_id = ?')
                .bind(Math.floor(Date.now() / 1000), sessionId, currentSession.user_id).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to revoke session' }, 500);
        }
    });

    /**
     * GET /api/v1/auth/login-history
     * Get login history for current user
     */
    auth.get('/login-history', async (c) => {
        const db = c.env.DB;
        const token = c.req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return c.json({ error: 'No token provided' }, 401);
        }

        try {
            const session = await db.prepare('SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL')
                .bind(token).first();

            if (!session) {
                return c.json({ error: 'Invalid session' }, 401);
            }

            // Get user's email/username
            const user = await db.prepare('SELECT username FROM users WHERE id = ?').bind(session.user_id).first();

            if (!user) {
                return c.json({ error: 'User not found' }, 404);
            }

            const history = await db.prepare(`
        SELECT id, success, failure_reason, ip_address, user_agent, location, created_at
        FROM login_attempts
        WHERE email = ?
        ORDER BY created_at DESC
        LIMIT 50
      `).bind(user.username).all();

            return c.json(history.results);
        } catch (error: any) {
            return c.json({ error: 'Failed to get login history' }, 500);
        }
    });

    /**
     * POST /api/v1/auth/change-password
     * Change password for current user
     */
    auth.post('/change-password', async (c) => {
        const db = c.env.DB;
        const token = c.req.header('Authorization')?.replace('Bearer ', '');
        const { currentPassword, newPassword } = await c.req.json();

        if (!token) {
            return c.json({ error: 'No token provided' }, 401);
        }

        if (!currentPassword || !newPassword) {
            return c.json({ error: 'Current and new password are required' }, 400);
        }

        if (newPassword.length < 8) {
            return c.json({ error: 'New password must be at least 8 characters' }, 400);
        }

        try {
            const session = await db.prepare('SELECT user_id FROM sessions WHERE access_token = ? AND revoked_at IS NULL')
                .bind(token).first();

            if (!session) {
                return c.json({ error: 'Invalid session' }, 401);
            }

            const user = await db.prepare('SELECT password FROM users WHERE id = ?').bind(session.user_id).first();

            if (user?.password !== currentPassword) {
                return c.json({ error: 'Current password is incorrect' }, 400);
            }

            await db.prepare('UPDATE users SET password = ?, updated_at = ? WHERE id = ?')
                .bind(newPassword, Math.floor(Date.now() / 1000), session.user_id).run();

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to change password' }, 500);
        }
    });

    // Mount auth routes
    app.route('/api/v1/auth', auth);
}

/**
 * Track login attempt in database
 * 
 * Logs all login attempts (successful and failed) for security auditing.
 * Captures user credentials, status, reason for failure, IP address, and user agent.
 * 
 * @param {any} db - D1 database instance
 * @param {string} email - Username/email of login attempt
 * @param {string|null} tenantId - Tenant ID if available (null if user not found)
 * @param {boolean} success - Whether login succeeded
 * @param {string|null} failureReason - Reason for failure ('Invalid password', 'Account not active', etc.)
 * @param {any} c - Hono context (for IP and user-agent headers)
 * @returns {Promise<void>}
 * 
 * @example
 * // Successful login
 * await trackLoginAttempt(db, 'alice@acme.com', 'tenant-123', true, null, c);
 * 
 * // Failed login
 * await trackLoginAttempt(db, 'bob@acme.com', null, false, 'User not found', c);
 * 
 * @note Silently fails if database insert fails (logs error but doesn't throw)
 */
async function trackLoginAttempt(
    db: any,
    email: string,
    tenantId: string | null,
    success: boolean,
    failureReason: string | null,
    c: any
): Promise<void> {
    try {
        await db.prepare(`
      INSERT INTO login_attempts (id, email, tenant_id, success, failure_reason, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
            crypto.randomUUID(),
            email,
            tenantId,
            success ? 1 : 0,
            failureReason,
            c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
            c.req.header('user-agent') || 'unknown',
            Math.floor(Date.now() / 1000)
        ).run();
    } catch (err) {
        console.error('Failed to track login attempt:', err);
    }
}
