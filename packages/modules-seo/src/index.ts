import { moduleRegistry, type ModuleConfig } from '@reactpress/core-registry';

/**
 * SEO Module Configuration
 */
export const seoModuleConfig: ModuleConfig = {
    id: 'seo',
    name: 'SEO Optimizer',
    version: '1.0.0',
    description: 'Optimize content for search engines, manage sitemaps and robots.txt',
    category: 'features',
    isCore: false,
    features: ['Sitemap Generation', 'Robots.txt Editor', 'SEO Audit', 'Meta Tag Management'],
    dependencies: ['cms'],
    tags: ['seo', 'marketing', 'search'],

    routes: (app) => {
        // Routes will be implemented in seoRoutes.ts
    },

    menu: {
        label: 'SEO',
        icon: 'Search',
        href: '/hpanel/seo',
        order: 60,
    },

    availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: false,
    },

    permissions: [
        'seo.view',
        'seo.settings.manage',
        'seo.audit',
        'seo.redirects.manage'
    ],

    requiredPermission: 'seo.view',
};

// Auto-register on import
moduleRegistry.register(seoModuleConfig);
