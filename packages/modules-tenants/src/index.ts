import { moduleRegistry, type ModuleConfig, ADMIN_ROUTES } from '@reactpress/core-registry';
import { registerTenantsRoutes } from './routes/tenantsRoutes';
import { tenantsSettingsSection } from './settings/tenantsSettings';

/**
 * Tenants Module Configuration
 * 
 * This is a PLATFORM module - only visible to super admins.
 * Handles multi-tenancy, provisioning, and tenant lifecycle.
 */
export const tenantsModuleConfig: ModuleConfig = {
    id: 'tenants',
    name: 'Tenants',
    version: '1.0.0',
    description: 'Multi-tenant management and provisioning',
    category: 'core',
    isCore: true,
    features: ['Tenant Provisioning', 'Domain Mapping', 'Resource Limits', 'Status Management'],
    dependencies: ['auth', 'users'],
    tags: ['multi-tenancy', 'platform', 'infrastructure'],

    routes: registerTenantsRoutes,

    menu: {
        label: 'Tenants',
        icon: 'Building2',
        href: `${ADMIN_ROUTES.TENANTS}`,
        order: 10,
    },

    availability: {
        requiresPlatformAdmin: true, // Only super admin
        availableForTenants: false,
        defaultEnabled: false, // Not a tenant-level module
    },

    permissions: [
        'tenants.view',
        'tenants.create',
        'tenants.update',
        'tenants.delete',
        'tenants.suspend',
        'tenants.manage',
        'tenants.modules.manage',
    ],

    requiredPermission: 'tenants.view',

    settings: tenantsSettingsSection,


    // Breeze lifecycle hooks
    onProvision: async (tenantId, db) => {
        console.log(`[Tenants] Platform provisioned`);
        // Create default tenant if not exists
    },
};

// Auto-register on import
moduleRegistry.register(tenantsModuleConfig);

// Re-export
export { registerTenantsRoutes } from './routes/tenantsRoutes';
export { tenantsSettingsSection } from './settings/tenantsSettings';
export { moduleConfig } from './module.config';
