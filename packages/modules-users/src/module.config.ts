/**
 * Users Module Configuration
 * This is the single source of truth for module metadata
 */
export const moduleConfig = {
    id: 'users',
    name: 'Users',
    description: 'User management, roles, permissions, and invitations',
    longDescription: 'Full user lifecycle management including RBAC, team invitations, and GDPR compliance features.',
    icon: 'Users',
    version: '1.0.0',
    category: 'core' as const,
    isCore: true,
    features: [
        'User CRUD',
        'Role Management',
        'Invitations',
        'GDPR Export',
        'User Profiles',
    ],
    dependencies: ['auth'],
    tags: ['users', 'rbac', 'permissions'],
    tables: ['users', 'roles', 'permissions', 'user_roles', 'role_permissions', 'invitations'],
    permissions: [
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'users.invite',
        'roles.view',
        'roles.manage',
    ],
};

export type ModuleConfig = typeof moduleConfig;
