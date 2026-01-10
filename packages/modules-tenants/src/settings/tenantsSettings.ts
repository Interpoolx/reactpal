import type { SettingSection } from '@reactpress/core-registry';

/**
 * Tenants module settings section
 * Platform-level settings for multi-tenancy (super admin only)
 */
export const tenantsSettingsSection: SettingSection = {
    id: 'tenants',
    label: 'Multi-Tenancy',
    icon: 'Building2',
    order: 10,
    availableForTenants: false, // Platform admin only
    requiredPermission: 'tenants.manage',

    fields: [
        // ============================================================
        // GENERAL SETTINGS
        // ============================================================
        {
            key: 'tenants.registrationEnabled',
            label: 'Enable Tenant Registration',
            type: 'boolean',
            description: 'Allow new tenants to register',
            defaultValue: true,
            scope: 'platform',
            group: 'General',
        },
        {
            key: 'tenants.requireBusinessEmail',
            label: 'Require Business Email',
            type: 'boolean',
            description: 'Block registration from free email providers (gmail, yahoo, etc.)',
            defaultValue: false,
            scope: 'platform',
            group: 'General',
        },

        // ============================================================
        // ADMIN UI SETTINGS
        // Controls what features are visible in the Tenants management page
        // ============================================================
        {
            key: 'tenants.ui.showStatsCards',
            label: 'Show Stats Cards',
            type: 'boolean',
            description: 'Display summary stats (Total, Active, Trial, Plans) above the table',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.showSearch',
            label: 'Enable Search',
            type: 'boolean',
            description: 'Show search input for filtering tenants',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.showExportCSV',
            label: 'Enable CSV Export',
            type: 'boolean',
            description: 'Allow exporting tenant data to CSV',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.showBulkImport',
            label: 'Enable Bulk Import',
            type: 'boolean',
            description: 'Allow bulk tenant creation via import',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.showQuickActions',
            label: 'Enable Quick Actions',
            type: 'boolean',
            description: 'Show quick actions dropdown (Edit, Clone, Suspend, etc.)',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.allowClone',
            label: 'Allow Tenant Cloning',
            type: 'boolean',
            description: 'Allow cloning tenants from the list view',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.allowStatusChange',
            label: 'Allow Status Changes',
            type: 'boolean',
            description: 'Allow changing tenant status (Suspend, Activate, Archive)',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.showPagination',
            label: 'Show Pagination',
            type: 'boolean',
            description: 'Show pagination controls with page size selector',
            defaultValue: true,
            scope: 'platform',
            group: 'Admin UI',
        },
        {
            key: 'tenants.ui.defaultPageSize',
            label: 'Default Page Size',
            type: 'select',
            description: 'Number of tenants per page',
            defaultValue: '10',
            options: [
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '50', value: '50' },
                { label: '100', value: '100' },
            ],
            scope: 'platform',
            group: 'Admin UI',
        },

        // ============================================================
        // VISIBLE COLUMNS - ALL columns from tenants schema
        // ============================================================
        // Basic Info
        { key: 'tenants.ui.columns.showId', label: 'ID', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showName', label: 'Name', type: 'boolean', defaultValue: true, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showSlug', label: 'Slug', type: 'boolean', defaultValue: true, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showDomain', label: 'Domain', type: 'boolean', defaultValue: true, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showStatus', label: 'Status', type: 'boolean', defaultValue: true, scope: 'platform', group: 'Display Columns' },
        // Lifecycle
        { key: 'tenants.ui.columns.showTrialEndsAt', label: 'Trial Ends', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showSuspendedAt', label: 'Suspended At', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showSuspendedReason', label: 'Suspended Reason', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        // Ownership
        { key: 'tenants.ui.columns.showOwnerId', label: 'Owner ID', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showOwnerEmail', label: 'Owner Email', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showBillingEmail', label: 'Billing Email', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        // Subscription
        { key: 'tenants.ui.columns.showPlanId', label: 'Plan ID', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showPlanName', label: 'Plan', type: 'boolean', defaultValue: true, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showBillingStatus', label: 'Billing Status', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showNextBillingDate', label: 'Next Billing', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showMrr', label: 'MRR', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        // Resource Limits
        { key: 'tenants.ui.columns.showMaxUsers', label: 'Max Users', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showMaxStorage', label: 'Max Storage', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showMaxApiCalls', label: 'Max API Calls', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        // Real-time Usage
        { key: 'tenants.ui.columns.showCurrentUsers', label: 'Current Users', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showStorageUsed', label: 'Storage Used', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showApiCallsThisMonth', label: 'API Calls (Month)', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        // Metadata
        { key: 'tenants.ui.columns.showIndustry', label: 'Industry', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showCompanySize', label: 'Company Size', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showNotes', label: 'Notes', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showTags', label: 'Tags', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        // Audit
        { key: 'tenants.ui.columns.showLastActivityAt', label: 'Last Activity', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showCreatedAt', label: 'Created', type: 'boolean', defaultValue: true, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showUpdatedAt', label: 'Updated', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },
        { key: 'tenants.ui.columns.showCreatedBy', label: 'Created By', type: 'boolean', defaultValue: false, scope: 'platform', group: 'Display Columns' },

        // ============================================================
        // FILTER CONFIGURATION
        // JSON structure for dynamic filter settings per column
        // ============================================================
        {
            key: 'tenants.ui.filterConfig',
            label: 'Filter Configuration',
            type: 'filterConfig',
            description: 'Configure which columns appear as filters and how they behave',
            scope: 'platform',
            group: 'Filters',
            defaultValue: {
                name: {
                    enabled: false,
                    type: 'text',
                    label: 'Name',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                slug: {
                    enabled: false,
                    type: 'text',
                    label: 'Slug',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                domain: {
                    enabled: false,
                    type: 'text',
                    label: 'Domain',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                status: {
                    enabled: true,
                    type: 'select',
                    label: 'Status',
                    options: 'auto',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                planName: {
                    enabled: true,
                    type: 'select',
                    label: 'Plan',
                    options: 'auto',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                ownerEmail: {
                    enabled: false,
                    type: 'text',
                    label: 'Owner',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                industry: {
                    enabled: false,
                    type: 'select',
                    label: 'Industry',
                    options: 'auto',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                companySize: {
                    enabled: false,
                    type: 'select',
                    label: 'Company Size',
                    options: 'auto',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                billingStatus: {
                    enabled: false,
                    type: 'select',
                    label: 'Billing Status',
                    options: 'auto',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                createdAt: {
                    enabled: false,
                    type: 'date-range',
                    label: 'Created Date',
                    sortOptions: ['newest', 'oldest'],
                    defaultSort: 'newest'
                },
                trialEndsAt: {
                    enabled: false,
                    type: 'date-range',
                    label: 'Trial End Date',
                    sortOptions: ['newest', 'oldest'],
                    defaultSort: 'newest'
                },
                tags: {
                    enabled: false,
                    type: 'multi-select',
                    label: 'Tags',
                    options: 'auto'
                }
            }
        },

        // ============================================================
        // DEFAULT TENANT SETTINGS
        // ============================================================
        {
            key: 'tenants.defaultPlan',
            label: 'Default Plan',
            type: 'select',
            description: 'Plan assigned to new tenants',
            defaultValue: 'free',
            options: [
                { label: 'Free', value: 'free' },
                { label: 'Starter', value: 'starter' },
                { label: 'Professional', value: 'professional' },
                { label: 'Enterprise', value: 'enterprise' },
            ],
            scope: 'platform',
            group: 'Defaults',
        },
        {
            key: 'tenants.trialDays',
            label: 'Trial Period (Days)',
            type: 'number',
            description: 'Number of days for trial period',
            defaultValue: 14,
            scope: 'platform',
            group: 'Defaults',
        },

        // ============================================================
        // LIMITS
        // ============================================================
        {
            key: 'tenants.defaultMaxUsers',
            label: 'Default Max Users',
            type: 'number',
            description: 'Default user limit for new tenants',
            defaultValue: 5,
            scope: 'platform',
            group: 'Limits',
        },
        {
            key: 'tenants.defaultMaxStorage',
            label: 'Default Max Storage (GB)',
            type: 'number',
            description: 'Default storage limit for new tenants',
            defaultValue: 1,
            scope: 'platform',
            group: 'Limits',
        },
        {
            key: 'tenants.defaultMaxApiCalls',
            label: 'Default API Call Limit',
            type: 'number',
            description: 'Default monthly API call limit',
            defaultValue: 1000,
            scope: 'platform',
            group: 'Limits',
        },

        // ============================================================
        // DOMAIN SETTINGS
        // ============================================================
        {
            key: 'tenants.allowCustomDomains',
            label: 'Allow Custom Domains',
            type: 'boolean',
            description: 'Tenants can use their own domains',
            defaultValue: true,
            scope: 'platform',
            group: 'Domains',
        },
        {
            key: 'tenants.requireDomainVerification',
            label: 'Require Domain Verification',
            type: 'boolean',
            description: 'Custom domains must be verified via DNS',
            defaultValue: true,
            scope: 'platform',
            group: 'Domains',
        },

        // ============================================================
        // PROVISIONING
        // ============================================================
        {
            key: 'tenants.autoProvisionModules',
            label: 'Auto-Provision Modules',
            type: 'text',
            description: 'Comma-separated list of modules to enable for new tenants',
            defaultValue: 'cms,seo',
            scope: 'platform',
            group: 'Provisioning',
        },
    ],
};

