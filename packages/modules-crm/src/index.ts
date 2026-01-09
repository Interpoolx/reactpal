import { moduleRegistry, type ModuleConfig } from '@reactpress/core-registry';

/**
 * CRM Module Configuration
 */
export const crmModuleConfig: ModuleConfig = {
    id: 'crm',
    name: 'Customer Relations',
    version: '1.0.0',
    description: 'Manage contacts, leads, and form submissions',
    category: 'features',
    isCore: false,
    features: ['Contact Directory', 'Lead Tracking', 'Form Builder', 'Submission Exports'],
    dependencies: [],
    tags: ['marketing', 'crm', 'contacts'],

    routes: (app) => {
        // Routes will be implemented in crmRoutes.ts
    },

    menu: {
        label: 'CRM',
        icon: 'Contact',
        href: '/hpanel/crm',
        order: 50,
    },

    availability: {
        requiresPlatformAdmin: false,
        availableForTenants: true,
        defaultEnabled: false,
    },

    permissions: [
        'crm.view',
        'crm.contacts.manage',
        'crm.leads.manage',
        'crm.forms.view',
        'crm.forms.manage'
    ],

    requiredPermission: 'crm.view',
};

// Auto-register on import
moduleRegistry.register(crmModuleConfig);
