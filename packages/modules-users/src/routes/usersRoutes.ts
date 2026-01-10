import { Hono } from 'hono';
import { moduleRegistry } from '@reactpress/core-registry';

/**
 * Users module routes
 * Routes for user CRUD, roles, and invitations
 */
export function registerUsersRoutes(app: Hono<any>): void {
    const users = new Hono<{ Bindings: any; Variables: any }>();
    const roles = new Hono<{ Bindings: any; Variables: any }>();
    const invitations = new Hono<{ Bindings: any; Variables: any }>();

    const checkUserLimit = async (db: any, tenantId: string) => {
        const tenant = await db.prepare('SELECT max_users FROM tenants WHERE id = ?').bind(tenantId).first();
        if (!tenant) return { allowed: true };

        const maxUsers = (tenant as any).max_users || 0;
        if (maxUsers <= 0) return { allowed: true };

        const usersCount = await db.prepare('SELECT COUNT(*) as count FROM users WHERE tenant_id = ? AND status != ?').bind(tenantId, 'archived').first();
        const activeUsersCount = (usersCount as any).count || 0;

        const invitesCount = await db.prepare('SELECT COUNT(*) as count FROM invitations WHERE tenant_id = ? AND status = ?').bind(tenantId, 'pending').first();
        const pendingInvitesCount = (invitesCount as any).count || 0;

        if (activeUsersCount + pendingInvitesCount >= maxUsers) {
            return {
                allowed: false,
                current: activeUsersCount + pendingInvitesCount,
                max: maxUsers,
                error: 'User limit reached. Please upgrade your plan.'
            };
        }

        return { allowed: true };
    };

    // ============================================================================
    // USER ROUTES - /api/v1/users
    // ============================================================================

    users.get('/', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.query('tenantId');
        const status = c.req.query('status');
        const search = c.req.query('search');

        try {
            let query = `SELECT id, username, email, first_name, last_name, role, status, tenant_id, created_at FROM users WHERE 1=1`;
            const params: any[] = [];

            if (tenantId && tenantId !== 'default') {
                query += ' AND tenant_id = ?';
                params.push(tenantId);
            }

            if (status && status !== 'all') {
                query += ' AND status = ?';
                params.push(status);
            } else {
                // Default: Hide archived unless explicitly requested? 
                // Actually, let's show all if status is 'all' but status filter in UI will handle it.
            }

            if (search) {
                query += ' AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }

            query += ' ORDER BY created_at DESC';

            const results = await db.prepare(query).bind(...params).all();
            return c.json(results.results || []);
        } catch (error: any) {
            console.error('Users fetch error:', error);
            return c.json({ error: 'Failed to fetch users', message: error.message }, 500);
        }
    });

    /**
     * GET /api/v1/users/:id
     * Get a single user
     */
    users.get('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const user = await db.prepare(`
        SELECT id, username, email, first_name, last_name, phone, avatar_url, timezone,
               role, status, email_verified, email_verified_at, account_expires_at,
               last_login_at, created_at, updated_at, tenant_id
        FROM users WHERE id = ? AND deleted_at IS NULL
      `).bind(id).first();

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
        const { username, email, password, role = 'viewer', tenantId, firstName, lastName } = body;

        if (!username || !password) {
            return c.json({ error: 'Username and password are required' }, 400);
        }

        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        try {
            // Check Limits
            const limitCheck = await checkUserLimit(db, tenantId || 'default');
            if (!limitCheck.allowed) {
                return c.json({ error: limitCheck.error }, 403);
            }

            await db.prepare(`
        INSERT INTO users (id, tenant_id, username, email, password, first_name, last_name, role, status, joined_via, created_at, last_activity_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?)
      `).bind(id, tenantId || 'default', username, email, password, firstName, lastName, role, 'manual', now, now).run();

            return c.json({ id, username, email, role, status: 'active', joined_via: 'manual', created_at: now }, 201);
        } catch (error: any) {
            if (error.message?.includes('UNIQUE constraint failed')) {
                return c.json({ error: 'Username or email already exists' }, 409);
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
        const { username, email, role, status, firstName, lastName, phone, timezone } = body;

        const updates: string[] = [];
        const params: any[] = [];

        if (username) { updates.push('username = ?'); params.push(username); }
        if (email) { updates.push('email = ?'); params.push(email); }
        if (role) { updates.push('role = ?'); params.push(role); }
        if (status) { updates.push('status = ?'); params.push(status); }
        if (firstName !== undefined) { updates.push('first_name = ?'); params.push(firstName); }
        if (lastName !== undefined) { updates.push('last_name = ?'); params.push(lastName); }
        if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
        if (timezone) { updates.push('timezone = ?'); params.push(timezone); }

        if (updates.length === 0) {
            return c.json({ error: 'No fields to update' }, 400);
        }

        updates.push('updated_at = ?');
        params.push(Math.floor(Date.now() / 1000));
        params.push(id);

        try {
            // Safety guard: Don't allow suspending super_admins via API
            if (status === 'suspended') {
                const user = await db.prepare('SELECT role FROM users WHERE id = ?').bind(id).first();
                if (user?.role === 'super_admin' || user?.role === 'super-admin') {
                    return c.json({ error: 'Super Admin accounts cannot be suspended' }, 403);
                }
            }

            await db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to update user', message: error.message }, 500);
        }
    });

    users.delete('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');
        const permanent = c.req.query('permanent') === 'true';

        try {
            // Safety guard: Don't allow deleting super_admins via API
            const user = await db.prepare('SELECT role FROM users WHERE id = ?').bind(id).first();
            if (user?.role === 'super_admin' || user?.role === 'super-admin') {
                return c.json({ error: 'Super Admin accounts cannot be deleted' }, 403);
            }

            if (permanent) {
                // Hard delete
                await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
            } else {
                // Soft delete (archive)
                await db.prepare('UPDATE users SET deleted_at = ?, status = ?, updated_at = ? WHERE id = ?')
                    .bind(Math.floor(Date.now() / 1000), 'archived', Math.floor(Date.now() / 1000), id).run();
            }
            return c.json({ success: true, permanent });
        } catch (error: any) {
            return c.json({ error: 'Failed to delete user', message: error.message }, 500);
        }
    });

    users.post('/bulk-delete', async (c) => {
        const db = c.env.DB;
        const { ids, permanent = false } = await c.req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return c.json({ error: 'IDs array is required' }, 400);
        }

        try {
            const placeholders = ids.map(() => '?').join(', ');
            if (permanent) {
                await db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`)
                    .bind(...ids).run();
            } else {
                await db.prepare(`UPDATE users SET deleted_at = ?, status = ?, updated_at = ? WHERE id IN (${placeholders})`)
                    .bind(Math.floor(Date.now() / 1000), 'archived', Math.floor(Date.now() / 1000), ...ids).run();
            }
            return c.json({ success: true, deleted: ids.length, permanent });
        } catch (error: any) {
            return c.json({ error: 'Failed to delete users', message: error.message }, 500);
        }
    });

    // ============================================================================
    // SEED DATA ROUTES
    // ============================================================================

    /**
     * GET /api/v1/users/seed/info
     * Returns info about what users will be seeded
     */
    users.get('/seed/info', async (c) => {
        return c.json({
            users: [
                { role: 'admin', username: '{tenant}_admin', password: 'admin123', email: 'admin@{tenant}' },
                { role: 'manager', username: '{tenant}_manager', password: 'admin123', email: 'manager@{tenant}' },
                { role: 'editor', username: '{tenant}_editor', password: 'admin123', email: 'editor@{tenant}' },
                { role: 'viewer', username: '{tenant}_viewer', password: 'admin123', email: 'viewer@{tenant}' },
                { role: 'user', username: '{tenant}_user', password: 'admin123', email: 'user@{tenant}' },
            ]
        });
    });

    /**
     * GET /api/v1/users/seed/status
     * Health check for seed data across all tenants
     */
    users.get('/seed/status', async (c) => {
        const db = c.env.DB;
        try {
            const tenantsRes = await db.prepare('SELECT id, slug FROM tenants').all();
            const tenants = tenantsRes.results || [];

            const status: any[] = [];
            for (const tenant of tenants as any[]) {
                const seedUsers = await db.prepare(`
                    SELECT COUNT(*) as count FROM users 
                    WHERE tenant_id = ? AND username IN (?, ?, ?, ?, ?)
                `).bind(
                    tenant.id,
                    `${tenant.slug}_admin`,
                    `${tenant.slug}_manager`,
                    `${tenant.slug}_editor`,
                    `${tenant.slug}_viewer`,
                    `${tenant.slug}_user`
                ).first();

                status.push({
                    tenantId: tenant.id,
                    slug: tenant.slug,
                    count: (seedUsers as any)?.count || 0,
                    isComplete: (seedUsers as any)?.count >= 5
                });
            }

            return c.json({
                totalTenants: tenants.length,
                completeTenants: status.filter(s => s.isComplete).length,
                details: status
            });
        } catch (error: any) {
            return c.json({ error: 'Failed to check seed status' }, 500);
        }
    });

    /**
     * POST /api/v1/users/seed
     * Seed default users across all tenants
     */
    users.post('/seed', async (c) => {
        const db = c.env.DB;
        try {
            const tenantsRes = await db.prepare('SELECT id, slug FROM tenants').all();
            const tenants = tenantsRes.results || [];

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

    // ============================================================================
    // PERMISSION ROUTES - /api/v1/permissions
    // ============================================================================

    const permissions = new Hono<{ Bindings: any; Variables: any }>();

    /**
     * GET /api/v1/permissions
     * List all available permissions grouped by module
     */
    permissions.get('/', async (c) => {
        const db = c.env.DB;
        const modules = moduleRegistry.getAll();

        // Map code-based permissions
        const modulePermsMap: Record<string, { moduleId: string; moduleName: string; permissions: string[] }> = {};

        modules.forEach(m => {
            if (m.permissions && m.permissions.length > 0) {
                modulePermsMap[m.id] = {
                    moduleId: m.id,
                    moduleName: m.name,
                    permissions: [...m.permissions]
                };
            }
        });

        try {
            // Fetch custom permissions from DB
            const results = await db.prepare('SELECT id, module_id, slug FROM permissions').all();
            const dbPermissions = results.results || [];

            dbPermissions.forEach((p: any) => {
                const mod = modulePermsMap[p.module_id];
                if (mod) {
                    if (!mod.permissions.includes(p.slug)) {
                        mod.permissions.push(p.slug);
                    }
                } else {
                    // Module might not be in registry (future module or removed?)
                    // Still show it as a category
                    modulePermsMap[p.module_id] = {
                        moduleId: p.module_id,
                        moduleName: p.module_id.charAt(0).toUpperCase() + p.module_id.slice(1),
                        permissions: [p.slug]
                    };
                }
            });
        } catch (error) {
            console.error('Error fetching DB permissions:', error);
        }

        return c.json(Object.values(modulePermsMap));
    });

    permissions.post('/', async (c) => {
        const db = c.env.DB;
        const { moduleId, slug, name, description } = await c.req.json();

        if (!moduleId || !slug) {
            return c.json({ error: 'Module ID and slug are required' }, 400);
        }

        const id = `${moduleId}.${slug}`;
        const finalName = name || slug.charAt(0).toUpperCase() + slug.slice(1);

        try {
            await db.prepare('INSERT INTO permissions (id, module_id, name, slug, description) VALUES (?, ?, ?, ?, ?)')
                .bind(id, moduleId, finalName, slug, description || '')
                .run();
            return c.json({ success: true, id });
        } catch (error: any) {
            if (error.message?.includes('UNIQUE constraint failed')) {
                return c.json({ error: 'Permission already exists' }, 409);
            }
            return c.json({ error: 'Failed to add permission', message: error.message }, 500);
        }
    });

    permissions.delete('/:moduleId/:slug', async (c) => {
        const db = c.env.DB;
        const moduleId = c.req.param('moduleId');
        const slug = c.req.param('slug');

        try {
            await db.prepare('DELETE FROM permissions WHERE module_id = ? AND slug = ?')
                .bind(moduleId, slug)
                .run();
            // Note: We don't delete code-based permissions, just custom ones in DB.
            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to delete permission', message: error.message }, 500);
        }
    });

    // ============================================================================
    // ROLE ROUTES - /api/v1/roles
    // ============================================================================

    /**
     * GET /api/v1/roles
     * List all roles
     */
    roles.get('/', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.query('tenantId');

        try {
            let query = `
                SELECT 
                    r.id, r.name, r.slug, r.description, r.is_system, r.created_at, r.tenant_id,
                    (SELECT COUNT(*) FROM users u WHERE u.role = r.slug) as user_count
                FROM roles r
            `;
            const params: any[] = [];

            if (tenantId) {
                query += ' WHERE r.tenant_id = ? OR r.is_system = 1';
                params.push(tenantId);
            }

            query += ' ORDER BY r.is_system DESC, r.name ASC';

            const results = await db.prepare(query).bind(...params).all();
            return c.json(results.results || []);
        } catch (error: any) {
            console.error('Roles fetch error:', error);
            // Return default roles if table doesn't exist
            return c.json([
                { id: 'super_admin', name: 'Super Admin', slug: 'super_admin', is_system: 1 },
                { id: 'admin', name: 'Administrator', slug: 'admin', is_system: 1 },
                { id: 'editor', name: 'Editor', slug: 'editor', is_system: 1 },
                { id: 'viewer', name: 'Viewer', slug: 'viewer', is_system: 1 },
            ]);
        }
    });

    /**
     * GET /api/v1/roles/:id
     * Get a single role with permissions
     */
    roles.get('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const role = await db.prepare('SELECT * FROM roles WHERE id = ?').bind(id).first();

            if (!role) {
                return c.json({ error: 'Role not found' }, 404);
            }

            // Fetch permissions
            const permissionsRes = await db.prepare(`
                SELECT permission_id FROM role_permissions WHERE role_id = ?
            `).bind(id).all();

            const permissions = (permissionsRes.results || []).map((p: any) => p.permission_id);

            return c.json({ ...role, permissions });
        } catch (error: any) {
            return c.json({ error: 'Failed to fetch role', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/roles
     * Create a new role
     */
    roles.post('/', async (c) => {
        const db = c.env.DB;
        const body = await c.req.json();
        const { name, slug, description, tenantId, permissions = [] } = body;

        if (!name || !slug) {
            return c.json({ error: 'Name and slug are required' }, 400);
        }

        const id = crypto.randomUUID();

        try {
            await db.prepare(`
        INSERT INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?)
      `).bind(id, tenantId || 'default', name, slug, description, Math.floor(Date.now() / 1000)).run();

            // Insert permissions
            if (Array.isArray(permissions) && permissions.length > 0) {
                const stmt = db.prepare('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)');
                const batch = permissions.map((permId: string) => stmt.bind(id, permId));
                await db.batch(batch);
            }

            return c.json({ id, name, slug, description, permissions }, 201);
        } catch (error: any) {
            if (error.message?.includes('UNIQUE constraint failed')) {
                return c.json({ error: 'Role slug already exists for this tenant' }, 409);
            }
            return c.json({ error: 'Failed to create role', message: error.message }, 500);
        }
    });

    /**
     * PATCH /api/v1/roles/:id
     * Update a role
     */
    roles.patch('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');
        const body = await c.req.json();
        const { name, description, permissions } = body;

        try {
            const role = await db.prepare('SELECT is_system FROM roles WHERE id = ?').bind(id).first();
            if (!role) return c.json({ error: 'Role not found' }, 404);

            if (role.is_system && (name || description)) {
                // Allow updating permissions for system roles? Maybe not name/slug.
                // let's allow description update but not name for system roles
            }

            const updates: string[] = [];
            const params: any[] = [];

            if (name) { updates.push('name = ?'); params.push(name); }
            if (description !== undefined) { updates.push('description = ?'); params.push(description); }

            if (updates.length > 0) {
                await db.prepare(`UPDATE roles SET ${updates.join(', ')} WHERE id = ?`).bind(...params, id).run();
            }

            // Update permissions if provided
            if (permissions !== undefined && Array.isArray(permissions)) {
                // Transaction-like: delete all, then insert new
                // D1 doesn't support full transactions in HTTP API easily, but batch is atomic
                const deleteStmt = db.prepare('DELETE FROM role_permissions WHERE role_id = ?').bind(id);
                const insertStmt = db.prepare('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)');

                const batch = [deleteStmt, ...permissions.map((permId: string) => insertStmt.bind(id, permId))];
                await db.batch(batch);
            }

            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to update role', message: error.message }, 500);
        }
    });

    /**
     * DELETE /api/v1/roles/:id
     * Delete a role (non-system only)
     */
    roles.delete('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const role = await db.prepare('SELECT is_system FROM roles WHERE id = ?').bind(id).first();

            if (!role) {
                return c.json({ error: 'Role not found' }, 404);
            }

            if (role.is_system) {
                return c.json({ error: 'Cannot delete system role' }, 403);
            }

            // Delete associations first
            await db.prepare('DELETE FROM role_permissions WHERE role_id = ?').bind(id).run();
            // TODO: Handle users assigned to this role? separate check needed?

            await db.prepare('DELETE FROM roles WHERE id = ?').bind(id).run();
            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to delete role', message: error.message }, 500);
        }
    });

    // ============================================================================
    // INVITATION ROUTES - /api/v1/invitations
    // ============================================================================

    /**
     * GET /api/v1/invitations
     * List invitations
     */
    invitations.get('/', async (c) => {
        const db = c.env.DB;
        const tenantId = c.req.query('tenantId');
        const status = c.req.query('status');

        try {
            let query = 'SELECT id, email, role_id, token, status, invited_by, expires_at, accepted_at, created_at, tenant_id FROM invitations WHERE 1=1';
            const params: any[] = [];

            if (tenantId) {
                query += ' AND tenant_id = ?';
                params.push(tenantId);
            }

            if (status) {
                query += ' AND status = ?';
                params.push(status);
            }

            query += ' ORDER BY created_at DESC';

            const results = await db.prepare(query).bind(...params).all();
            return c.json(results.results);
        } catch (error: any) {
            return c.json({ error: 'Failed to fetch invitations', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/invitations
     * Send invitation
     */
    invitations.post('/', async (c) => {
        const db = c.env.DB;
        const body = await c.req.json();
        const { email, roleId, tenantId, invitedBy } = body;

        if (!email) {
            return c.json({ error: 'Email is required' }, 400);
        }

        const id = crypto.randomUUID();
        const token = crypto.randomUUID();
        const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days

        try {
            // Check Limits
            const limitCheck = await checkUserLimit(db, tenantId || 'default');
            if (!limitCheck.allowed) {
                return c.json({ error: limitCheck.error }, 403);
            }

            await db.prepare(`
        INSERT INTO invitations (id, tenant_id, email, role_id, token, status, invited_by, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)
      `).bind(id, tenantId || 'default', email, roleId, token, invitedBy, expiresAt, Math.floor(Date.now() / 1000)).run();

            return c.json({ id, email, token, expiresAt, status: 'pending' }, 201);
        } catch (error: any) {
            return c.json({ error: 'Failed to send invitation', message: error.message }, 500);
        }
    });

    /**
     * POST /api/v1/invitations/:id/resend
     * Resend invitation
     */
    invitations.post('/:id/resend', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            const newToken = crypto.randomUUID();
            const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);

            await db.prepare('UPDATE invitations SET token = ?, expires_at = ?, status = ? WHERE id = ?')
                .bind(newToken, expiresAt, 'pending', id).run();

            return c.json({ success: true, token: newToken, expiresAt });
        } catch (error: any) {
            return c.json({ error: 'Failed to resend invitation', message: error.message }, 500);
        }
    });

    /**
     * DELETE /api/v1/invitations/:id
     * Cancel invitation
     */
    invitations.delete('/:id', async (c) => {
        const db = c.env.DB;
        const id = c.req.param('id');

        try {
            await db.prepare('UPDATE invitations SET status = ? WHERE id = ?').bind('cancelled', id).run();
            return c.json({ success: true });
        } catch (error: any) {
            return c.json({ error: 'Failed to cancel invitation', message: error.message }, 500);
        }
    });

    // Mount routes
    app.route('/api/v1/users', users);
    app.route('/api/v1/roles', roles);
    app.route('/api/v1/invitations', invitations);
    app.route('/api/v1/permissions', permissions);
}
