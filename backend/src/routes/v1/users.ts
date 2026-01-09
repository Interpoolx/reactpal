import { Hono } from 'hono';

const users = new Hono<{ Bindings: any, Variables: any }>();

/**
 * GET /api/v1/users
 * List all users (optionally filtered by tenant)
 */
users.get('/', async (c) => {
    const db = c.env.DB;
    const tenantId = c.req.query('tenantId');

    try {
        let query = 'SELECT id, username, email, first_name, last_name, role, status, avatar_url, last_login_at, created_at, updated_at FROM users';
        const params: string[] = [];

        if (tenantId && tenantId !== 'all') { // Handle 'all' or defined tenant
            query += ' WHERE tenant_id = ?';
            params.push(tenantId === 'default' ? 'default' : tenantId);
        }

        query += ' ORDER BY created_at DESC';

        const results = await db.prepare(query).bind(...params).all();
        return c.json(results.results);
    } catch (error: any) {
        return c.json({ error: 'Failed to fetch users', message: error.message }, 500);
    }
});

/**
 * GET /api/v1/users/:id
 * Get a single user by ID
 */
users.get('/:id', async (c) => {
    const db = c.env.DB;
    const id = c.req.param('id');

    try {
        const user = await db.prepare('SELECT id, username, email, first_name, last_name, role, status, avatar_url, last_login_at, created_at, updated_at FROM users WHERE id = ?').bind(id).first();
        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(user);
    } catch (error: any) {
        return c.json({ error: 'Failed to fetch user', message: error.message }, 500);
    }
});

/**
 * POST /api/v1/users
 * Create a new user
 */
users.post('/', async (c) => {
    const db = c.env.DB;
    const body = await c.req.json();
    const { username, password, email, first_name, last_name, role = 'viewer', status = 'active', tenantId } = body;

    if (!username || !password) {
        return c.json({ error: 'Username and password are required' }, 400);
    }

    const id = crypto.randomUUID();
    const createdAt = Math.floor(Date.now() / 1000);

    try {
        await db.prepare(`
            INSERT INTO users (id, username, password, email, first_name, last_name, role, status, tenant_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, username, password, email || null, first_name || null, last_name || null, role, status, tenantId || 'default', createdAt, createdAt).run();

        return c.json({ id, username, email, first_name, last_name, role, status, created_at: createdAt }, 201);
    } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
            return c.json({ error: 'Username already exists' }, 409);
        }
        return c.json({ error: 'Failed to create user', message: error.message }, 500);
    }
});

/**
 * PATCH /api/v1/users/:id
 * Update a user
 */
users.patch('/:id', async (c) => {
    const db = c.env.DB;
    const id = c.req.param('id');
    const body = await c.req.json();
    const { username, password, role, status, email, first_name, last_name, avatar_url } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (username !== undefined) { updates.push('username = ?'); params.push(username); }
    if (password !== undefined) { updates.push('password = ?'); params.push(password); }
    if (role !== undefined) { updates.push('role = ?'); params.push(role); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (first_name !== undefined) { updates.push('first_name = ?'); params.push(first_name); }
    if (last_name !== undefined) { updates.push('last_name = ?'); params.push(last_name); }
    if (avatar_url !== undefined) { updates.push('avatar_url = ?'); params.push(avatar_url); }

    if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
    }

    // Always update updated_at
    updates.push('updated_at = ?');
    params.push(Math.floor(Date.now() / 1000));

    params.push(id);

    try {
        await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ error: 'Failed to update user', message: error.message }, 500);
    }
});

/**
 * DELETE /api/v1/users/:id
 * Delete a user
 */
users.delete('/:id', async (c) => {
    const db = c.env.DB;
    const id = c.req.param('id');

    try {
        await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (error: any) {
        return c.json({ error: 'Failed to delete user', message: error.message }, 500);
    }
});

/**
 * POST /api/v1/users/seed
 * Seed default users across all tenants
 */
users.post('/seed', async (c) => {
    const db = c.env.DB;
    try {
        // Fetch all tenants
        const tenantsRes = await db.prepare('SELECT id, slug FROM tenants').all();
        const tenants = tenantsRes.results;

        const defaultUsers = [
            { role: 'admin', suffix: 'admin' },
            { role: 'manager', suffix: 'manager' },
            { role: 'editor', suffix: 'editor' },
            { role: 'viewer', suffix: 'viewer' },
            { role: 'user', suffix: 'user' },
        ];

        const now = Math.floor(Date.now() / 1000);
        let count = 0;

        for (const tenant of tenants as any[]) {
            for (const def of defaultUsers) {
                const username = `${tenant.slug}_${def.suffix}`;
                const email = `${def.suffix}@${tenant.slug}`;
                const id = `u_${tenant.slug}_${def.suffix}`;

                const res = await db.prepare(`
                    INSERT OR IGNORE INTO users (id, tenant_id, username, password, email, first_name, last_name, role, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    id,
                    tenant.id,
                    username,
                    'admin123',
                    email,
                    def.role.charAt(0).toUpperCase() + def.role.slice(1),
                    'User',
                    def.role,
                    'active',
                    now,
                    now
                ).run();

                if (res.meta.changes > 0) count++;
            }
        }

        return c.json({ success: true, seeded: count });
    } catch (error: any) {
        return c.json({ error: 'Failed to seed users', message: error.message }, 500);
    }
});

/**
 * POST /api/v1/users/bulk-delete
 */
users.post('/bulk-delete', async (c) => {
    const db = c.env.DB;
    const { ids } = await c.req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
        return c.json({ error: 'IDs array is required' }, 400);
    }

    try {
        const placeholders = ids.map(() => '?').join(', ');
        await db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).bind(...ids).run();
        return c.json({ success: true, deleted: ids.length });
    } catch (error: any) {
        return c.json({ error: 'Failed to delete users', message: error.message }, 500);
    }
});

export default users;
