import type { SettingSection } from '@reactpress/core-registry';

/**
 * Users module settings section
 * Controls user management behavior per tenant
 */
export const usersSettingsSection: SettingSection = {
    id: 'users',
    label: 'Users & Permissions',
    icon: 'Users',
    order: 25,
    availableForTenants: true,
    requiredPermission: 'settings.users.manage',

    fields: [
        // ============================================================
        // ADMIN UI
        // ============================================================
        {
            key: 'users.seedData.generate',
            label: 'Generate Default Users',
            type: 'button',
            description: 'Automatically creates a standard set of users (Admin, Manager, Editor, Viewer, User) for every existing tenant. This is useful for initial setup or restoring standard access levels.',
            defaultValue: null,
            scope: 'platform',
            group: 'Admin UI',
            actionUrl: '/api/v1/users/seed',
            actionMethod: 'POST',
            actionLabel: 'Generate Now',
        },

        // ============================================================
        // GENERAL SETTINGS
        // ============================================================
        {
            key: 'users.defaultRole',
            label: 'Default Role for New Users',
            type: 'select',
            description: 'Role assigned to new users by default',
            defaultValue: 'viewer',
            options: [
                { label: 'Viewer', value: 'viewer' },
                { label: 'Editor', value: 'editor' },
                { label: 'Admin', value: 'admin' },
            ],
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.maxUsersPerTenant',
            label: 'Max Users',
            type: 'number',
            description: 'Maximum users allowed for this tenant (0 = unlimited)',
            defaultValue: 0,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.invitationExpiryDays',
            label: 'Invitation Expiry (Days)',
            type: 'number',
            description: 'How long invitation links remain valid',
            defaultValue: 7,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.allowInviteByNonAdmin',
            label: 'Allow Non-Admins to Invite',
            type: 'boolean',
            description: 'Editors can invite new users',
            defaultValue: false,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.requirePhoneNumber',
            label: 'Require Phone Number',
            type: 'boolean',
            description: 'Make phone number a required field',
            defaultValue: false,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.allowAvatarUpload',
            label: 'Allow Avatar Upload',
            type: 'boolean',
            description: 'Users can upload profile pictures',
            defaultValue: true,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.allowDataExport',
            label: 'Allow Data Export',
            type: 'boolean',
            description: 'Users can export their personal data (GDPR)',
            defaultValue: true,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'users.allowAccountDeletion',
            label: 'Allow Account Deletion',
            type: 'boolean',
            description: 'Users can request account deletion (GDPR)',
            defaultValue: true,
            scope: 'tenant',
            group: 'General',
        },

        // ============================================================
        // ADMIN UI SETTINGS
        // Controls what features are visible in the Users management page
        // ============================================================
        {
            key: 'users.ui.showStatsCards',
            label: 'Show Stats Cards',
            type: 'boolean',
            description: 'Display summary stats (Total, Active, Pending, Roles) above the table',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.showSearch',
            label: 'Enable Search',
            type: 'boolean',
            description: 'Show search input for filtering users',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.showExport',
            label: 'Enable Export',
            type: 'boolean',
            description: 'Allow exporting user data',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.showImport',
            label: 'Enable Import',
            type: 'boolean',
            description: 'Allow bulk user import',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.showBulkActions',
            label: 'Enable Bulk Actions',
            type: 'boolean',
            description: 'Allow bulk role change, suspend, delete',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.allowInvite',
            label: 'Allow User Invites',
            type: 'boolean',
            description: 'Enable invite user workflow',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.showPagination',
            label: 'Show Pagination',
            type: 'boolean',
            description: 'Show pagination controls with page size selector',
            defaultValue: true,
            scope: 'tenant',
            group: 'Admin UI',
        },
        {
            key: 'users.ui.defaultPageSize',
            label: 'Default Page Size',
            type: 'select',
            description: 'Number of users per page',
            defaultValue: '10',
            options: [
                { label: '10', value: '10' },
                { label: '25', value: '25' },
                { label: '50', value: '50' },
                { label: '100', value: '100' },
            ],
            scope: 'tenant',
            group: 'Admin UI',
        },

        // ============================================================
        // VISIBLE COLUMNS
        // =================================== =========================
        { key: 'users.ui.columns.showId', label: 'ID', type: 'boolean', defaultValue: false, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showUsername', label: 'Username', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showEmail', label: 'Email', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showFullName', label: 'Full Name', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showRole', label: 'Role', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showStatus', label: 'Status', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showLastLogin', label: 'Last Login', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showCreatedAt', label: 'Created', type: 'boolean', defaultValue: true, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showUpdatedAt', label: 'Updated', type: 'boolean', defaultValue: false, scope: 'tenant', group: 'Display Columns' },
        { key: 'users.ui.columns.showCreatedBy', label: 'Created By', type: 'boolean', defaultValue: false, scope: 'tenant', group: 'Display Columns' },

        // ============================================================
        // FILTER CONFIGURATION
        // JSON structure for dynamic filter settings per column
        // ============================================================
        {
            key: 'users.ui.filterConfig',
            label: 'Filter Configuration',
            type: 'filterConfig',
            description: 'Configure which columns appear as filters and how they behave',
            scope: 'tenant',
            group: 'Users Filters',
            defaultValue: {
                username: {
                    enabled: false,
                    type: 'text',
                    label: 'Username',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                email: {
                    enabled: false,
                    type: 'text',
                    label: 'Email',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                fullName: {
                    enabled: false,
                    type: 'text',
                    label: 'Full Name',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                },
                role: {
                    enabled: true,
                    type: 'select',
                    label: 'Role',
                    options: 'auto',
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
                createdAt: {
                    enabled: false,
                    type: 'date-range',
                    label: 'Created Date',
                    sortOptions: ['newest', 'oldest'],
                    defaultSort: 'newest'
                },
                lastLogin: {
                    enabled: false,
                    type: 'date-range',
                    label: 'Last Login',
                    sortOptions: ['newest', 'oldest'],
                    defaultSort: 'newest'
                },
                createdBy: {
                    enabled: false,
                    type: 'text',
                    label: 'Created By',
                    sortOptions: ['a-z', 'z-a'],
                    defaultSort: 'a-z'
                }
            }
        },

    ],
};
