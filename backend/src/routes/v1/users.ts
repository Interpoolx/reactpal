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
        let query = 'SELECT id, username, role, created_at FROM users';
        const params: string[] = [];

        if (tenantId && tenantId !== 'default') {
            query += ' WHERE tenant_id = ?';
            params.push(tenantId);
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
        const user = await db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').bind(id).first();
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
    const { username, password, role = 'viewer', tenantId } = body;

    if (!username || !password) {
        return c.json({ error: 'Username and password are required' }, 400);
    }

    const id = crypto.randomUUID();
    const createdAt = Math.floor(Date.now() / 1000);

    try {
        await db.prepare(`
            INSERT INTO users (id, username, password, role, tenant_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(id, username, password, role, tenantId || 'default', createdAt).run();

        return c.json({ id, username, role, created_at: createdAt }, 201);
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
    const { username, password, role } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (username) {
        updates.push('username = ?');
        params.push(username);
    }
    if (password) {
        updates.push('password = ?');
        params.push(password);
    }
    if (role) {
        updates.push('role = ?');
        params.push(role);
    }

    if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
    }

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
 * POST /api/v1/users/bulk-delete
 * Bulk delete users
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
