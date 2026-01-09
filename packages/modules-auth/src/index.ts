import { Hono } from 'hono';
import { moduleRegistry, type ModuleConfig, ADMIN_ROUTES } from '@reactpress/core-registry';
import { registerAuthRoutes } from './routes/authRoutes';
import { authSettingsSection } from './settings/authSettings';

/**
 * Auth Module Configuration
 * 
 * This is a foundation module - always loaded, cannot be disabled.
 * Handles authentication, sessions, password management, and security.
 */
export const authModuleConfig: ModuleConfig = {
    id: 'auth',
    name: 'Authentication',
    version: '1.0.0',
    description: 'Authentication, sessions, and security management',
    category: 'core',
    isCore: true,
    features: ['Login', 'Logout', 'Session Management', 'Password Reset'],
    dependencies: [],
    tags: ['security', 'identity', 'auth'],

    routes: registerAuthRoutes,

    menu: {
        label: 'Security',
        icon: 'Shield',
        href: `${ADMIN_ROUTES.SECURITY}`,
        order: 30,
    },

    availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: true, // Foundation module - always enabled
    },

    permissions: [
        'auth.settings.manage',
        'sessions.view',
        'sessions.revoke',
        'login-history.view',
    ],

    requiredPermission: 'sessions.view',

    settings: authSettingsSection,

    // Breeze lifecycle hooks
    onProvision: async (tenantId, db) => {
        console.log(`[Auth] Provisioning for tenant: ${tenantId}`);
        // Create default security settings for new tenant
    },

    onEnable: async (tenantId, db) => {
        console.log(`[Auth] Enabled for tenant: ${tenantId}`);
    },

    onDisable: async (tenantId, db) => {
        // Auth cannot be disabled for a tenant
        console.warn(`[Auth] Cannot disable auth module`);
    },
};

// Auto-register on import
moduleRegistry.register(authModuleConfig);

// Re-export for external use
export { registerAuthRoutes } from './routes/authRoutes';
export { authSettingsSection } from './settings/authSettings';
export { moduleConfig } from './module.config';
