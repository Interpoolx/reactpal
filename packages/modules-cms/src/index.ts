import { moduleRegistry, type ModuleConfig } from '@reactpress/core-registry';

/**
 * CMS Module Configuration
 */
export const cmsModuleConfig: ModuleConfig = {
    id: 'cms',
    name: 'Content Management',
    version: '1.0.0',
    description: 'Create and manage pages, blog posts, and media library',
    category: 'features',
    isCore: false,
    features: ['Page Builder', 'Blog', 'Media Library', 'Navigation Menus'],
    dependencies: [],
    tags: ['content', 'cms', 'publishing'],

    routes: (app) => {
        // Routes will be implemented in cmsRoutes.ts
    },

    menu: {
        label: 'CMS',
        icon: 'FileText',
        href: '/hpanel/cms',
        order: 40,
    },

    availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: false,
    },

    permissions: [
        'cms.view',
        'cms.create',
        'cms.edit',
        'cms.publish',
        'cms.delete',
        'media.manage'
    ],

    requiredPermission: 'cms.view',
};

// Auto-register on import
moduleRegistry.register(cmsModuleConfig);
