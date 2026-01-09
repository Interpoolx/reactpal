import { moduleRegistry, type ModuleConfig, ADMIN_ROUTES } from '@reactpress/core-registry';

/**
 * Core Module Configuration
 * 
 * Provides basic infrastructure links like Dashboard and Module Management.
 */
export const coreModuleConfig: ModuleConfig = {
    id: 'core',
    name: 'Platform Core',
    version: '1.0.0',
    description: 'Essential platform infrastructure and dashboard',
    category: 'core',
    isCore: true,
    features: ['Infrastructure', 'System Health', 'Service Mesh'],
    dependencies: [],
    tags: ['core', 'platform', 'system'],

    routes: () => { }, // Handled by main app routing

    menu: {
        label: 'Dashboard',
        icon: 'LayoutDashboard',
        href: `${ADMIN_ROUTES.DASHBOARD}`,
        order: 0,
    },

    availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: true,
    },

    permissions: ['platform.view'],
};

export function registerCoreModules() {
    // 1. Dashboard - Infrastructure, not an installable module
    moduleRegistry.register({
        id: 'dashboard',
        name: 'Dashboard',
        version: '1.0.0',
        routes: () => { },
        menu: { label: 'Dashboard', icon: 'LayoutDashboard', href: '/hpanel', order: 0 },
        isCore: true,
        isInfrastructure: true, // Don't show in modules marketplace
        category: 'core',
        features: ['Usage overview', 'Quick stats'],
        tags: ['dashboard', 'stats'],
        availability: { defaultEnabled: true, availableForTenants: true },
        permissions: []
    });

    // 2. Module Management - Infrastructure, not an installable module
    moduleRegistry.register({
        id: 'module-manager',
        name: 'Modules',
        version: '1.0.0',
        routes: () => { },
        menu: { label: 'Modules', icon: 'Package', href: '/hpanel/modules', order: 5 },
        isCore: true,
        isInfrastructure: true, // Don't show in modules marketplace
        category: 'core',
        features: ['Module installation', 'Tenant module toggles'],
        tags: ['modules', 'plugins'],
        availability: { requiresPlatformAdmin: true, defaultEnabled: true },
        permissions: ['modules.manage']
    });

    // 3. Settings (Global) - Infrastructure, not an installable module
    moduleRegistry.register({
        id: 'settings',
        name: 'Settings',
        version: '1.0.0',
        routes: () => { },
        menu: { label: 'Settings', icon: 'Settings', href: '/hpanel/settings', order: 100 },
        isCore: true,
        isInfrastructure: true, // Don't show in modules marketplace
        category: 'core',
        features: ['Global configuration', 'Branding'],
        tags: ['settings', 'config'],
        availability: { defaultEnabled: true, availableForTenants: true },
        permissions: ['settings.view']
    });
}
