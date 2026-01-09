import type { SettingSection } from '@reactpress/core-registry';

/**
 * Auth module settings section
 * These settings control authentication behavior per tenant
 */
export const authSettingsSection: SettingSection = {
    id: 'auth',
    label: 'Authentication & Security',
    icon: 'Shield',
    order: 20,
    availableForTenants: true,
    requiredPermission: 'settings.auth.manage',

    fields: [

        // ============================================================
        // PASSWORD POLICY
        // ============================================================
        {
            key: 'auth.passwordMinLength',
            label: 'Minimum Password Length',
            type: 'number',
            description: 'Minimum characters required for passwords',
            defaultValue: 8,
            scope: 'tenant',
            group: 'Password Policy',
        },
        {
            key: 'auth.passwordRequireUppercase',
            label: 'Require Uppercase Letters',
            type: 'boolean',
            description: 'Passwords must contain at least one uppercase letter',
            defaultValue: true,
            scope: 'tenant',
            group: 'Password Policy',
        },
        {
            key: 'auth.passwordRequireNumbers',
            label: 'Require Numbers',
            type: 'boolean',
            description: 'Passwords must contain at least one number',
            defaultValue: true,
            scope: 'tenant',
            group: 'Password Policy',
        },
        {
            key: 'auth.passwordRequireSpecialChars',
            label: 'Require Special Characters',
            type: 'boolean',
            description: 'Passwords must contain at least one special character',
            defaultValue: false,
            scope: 'tenant',
            group: 'Password Policy',
        },
        {
            key: 'auth.passwordExpiryDays',
            label: 'Password Expiry (Days)',
            type: 'number',
            description: 'Force password reset after this many days (0 = never)',
            defaultValue: 0,
            scope: 'tenant',
            group: 'Password Policy',
        },

        // ============================================================
        // LOCKOUT POLICY
        // ============================================================
        {
            key: 'auth.maxLoginAttempts',
            label: 'Max Login Attempts',
            type: 'number',
            description: 'Lock account after this many failed attempts',
            defaultValue: 5,
            scope: 'tenant',
            group: 'Lockout Policy',
        },
        {
            key: 'auth.lockoutDurationMinutes',
            label: 'Lockout Duration (Minutes)',
            type: 'number',
            description: 'How long accounts stay locked',
            defaultValue: 30,
            scope: 'tenant',
            group: 'Lockout Policy',
        },

        // ============================================================
        // SESSION POLICY
        // ============================================================
        {
            key: 'auth.sessionTimeoutMinutes',
            label: 'Session Timeout (Minutes)',
            type: 'number',
            description: 'Auto-logout after inactivity',
            defaultValue: 60,
            scope: 'tenant',
            group: 'Session Policy',
        },
        {
            key: 'auth.maxConcurrentSessions',
            label: 'Max Concurrent Sessions',
            type: 'number',
            description: 'Maximum devices logged in simultaneously (0 = unlimited)',
            defaultValue: 0,
            scope: 'tenant',
            group: 'Session Policy',
        },

        // ============================================================
        // REGISTRATION
        // ============================================================
        {
            key: 'auth.requireEmailVerification',
            label: 'Require Email Verification',
            type: 'boolean',
            description: 'Users must verify email before accessing the app',
            defaultValue: true,
            scope: 'tenant',
            group: 'Registration',
        },
        {
            key: 'auth.allowSelfRegistration',
            label: 'Allow Self Registration',
            type: 'boolean',
            description: 'Users can register without an invitation',
            defaultValue: false,
            scope: 'tenant',
            group: 'Registration',
        },
        {
            key: 'auth.allowMagicLink',
            label: 'Enable Magic Link Login',
            type: 'boolean',
            description: 'Allow passwordless login via email link',
            defaultValue: false,
            scope: 'tenant',
            group: 'Registration',
        },
    ],
};

