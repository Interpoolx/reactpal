import { moduleRegistry, type ModuleConfig, ADMIN_ROUTES } from '@reactpress/core-registry';
import { registerUsersRoutes } from './routes/usersRoutes';
import { usersSettingsSection } from './settings/usersSettings';

/**
 * Users Module Configuration
 * 
 * This is a foundation module - always loaded for tenant management.
 * Handles user CRUD, roles, permissions, and invitations.
 */
export const usersModuleConfig: ModuleConfig = {
    id: 'users',
    name: 'Users',
    version: '1.0.0',
    description: 'User management, roles, and permissions',
    category: 'core',
    isCore: true,
    features: ['User CRUD', 'Role Management', 'Permissions', 'Invitations'],
    dependencies: ['auth'],
    tags: ['users', 'roles', 'permissions', 'access'],

    routes: registerUsersRoutes,

    menu: {
        label: 'Users',
        icon: 'Users',
        href: `${ADMIN_ROUTES.USERS}`,
        order: 20,
        badge: {
            type: 'count',
            getValue: async () => {
                // Would return pending invitations count
                return undefined;
            },
        },
    },

    availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: true, // Foundation module
    },

    permissions: [
        'users.view',
        'users.create',
        'users.update',
        'users.delete',
        'users.invite',
        'roles.view',
        'roles.manage',
        'permissions.manage',
        'settings.users.manage',
    ],

    requiredPermission: 'users.view',

    settings: usersSettingsSection,


    // Breeze lifecycle hooks
    onProvision: async (tenantId, db) => {
        console.log(`[Users] Provisioning for tenant: ${tenantId}`);
        // Create default roles for new tenant
        const defaultRoles = [
            { slug: 'admin', name: 'Administrator', description: 'Full access to all features' },
            { slug: 'editor', name: 'Editor', description: 'Can create and edit content' },
            { slug: 'viewer', name: 'Viewer', description: 'Read-only access' },
        ];

        for (const role of defaultRoles) {
            try {
                await db.prepare(`
          INSERT INTO roles (id, tenant_id, name, slug, description, is_system, created_at)
          VALUES (?, ?, ?, ?, ?, 1, ?)
        `).bind(
                    crypto.randomUUID(),
                    tenantId,
                    role.name,
                    role.slug,
                    role.description,
                    Math.floor(Date.now() / 1000)
                ).run();
            } catch (err) {
                console.log(`Role ${role.slug} may already exist for tenant ${tenantId}`);
            }
        }
    },

    onEnable: async (tenantId, db) => {
        console.log(`[Users] Enabled for tenant: ${tenantId}`);
    },
};

// Auto-register on import
moduleRegistry.register(usersModuleConfig);

// Re-export
export { registerUsersRoutes } from './routes/usersRoutes';
export { usersSettingsSection } from './settings/usersSettings';
export { moduleConfig } from './module.config';
