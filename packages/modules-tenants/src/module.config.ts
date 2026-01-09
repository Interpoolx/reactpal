/**
 * Tenants Module Configuration
 * This is the single source of truth for module metadata
 */
export const moduleConfig = {
    id: 'tenants',
    name: 'Tenants',
    description: 'Multi-tenant management and provisioning (Platform Admin)',
    longDescription: 'Complete multi-tenancy infrastructure with provisioning, billing integration, and usage tracking.',
    icon: 'Building2',
    version: '1.0.0',
    category: 'core' as const,
    isCore: true,
    features: [
        'Tenant CRUD',
        'Module Assignment',
        'Usage Tracking',
        'Billing Integration',
        'Domain Management',
    ],
    dependencies: ['auth', 'users'],
    tags: ['platform', 'multitenancy', 'tenants'],
};

export type ModuleConfig = typeof moduleConfig;
