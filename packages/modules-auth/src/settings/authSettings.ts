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
        // GENERAL SETTINGS
        // ============================================================
        {
            key: 'auth.allowGuestAccess',
            label: 'Allow Guest Access',
            type: 'boolean',
            description: 'Allow access to public pages without login',
            defaultValue: false,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.enableSocialLogin',
            label: 'Enable Social Login',
            type: 'boolean',
            description: 'Allow users to login with Google, GitHub, etc.',
            defaultValue: false,
            scope: 'tenant',
            group: 'General',
        },

        // ============================================================
        // ADMIN UI (Placeholder - hidden or empty)
        // ============================================================
        // No specific admin UI settings for auth yet

        // ============================================================
        // FRONTEND UI (Login, Registration, etc.)
        // ============================================================
        {
            key: 'auth.requireEmailVerification',
            label: 'Require Email Verification',
            type: 'boolean',
            description: 'Users must verify email before accessing the app',
            defaultValue: true,
            scope: 'tenant',
            group: 'Frontend UI',
        },
        {
            key: 'auth.allowSelfRegistration',
            label: 'Allow Self Registration',
            type: 'boolean',
            description: 'Users can register without an invitation',
            defaultValue: false,
            scope: 'tenant',
            group: 'Frontend UI',
        },
        {
            key: 'auth.allowMagicLink',
            label: 'Enable Magic Link Login',
            type: 'boolean',
            description: 'Allow passwordless login via email link',
            defaultValue: false,
            scope: 'tenant',
            group: 'Frontend UI',
        },
        {
            key: 'auth.loginPageTitle',
            label: 'Login Page Title',
            type: 'text',
            description: 'Title shown on the login page',
            defaultValue: 'Sign In',
            scope: 'tenant',
            group: 'Frontend UI',
        },

        // ============================================================
        // SECURITY POLICIES (Moved from root groups if needed, 
        // or keep as General if we want to merge)
        // User requested: "General settings for auth can be under General"
        // Let's keep specific policies as sub-types or just put them in General?
        // Let's put them in "General" as requested to consolidate.
        // ============================================================
        {
            key: 'auth.passwordMinLength',
            label: 'Minimum Password Length',
            type: 'number',
            description: 'Minimum characters required for passwords',
            defaultValue: 8,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.passwordRequireUppercase',
            label: 'Require Uppercase Letters',
            type: 'boolean',
            description: 'Passwords must contain at least one uppercase letter',
            defaultValue: true,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.passwordRequireNumbers',
            label: 'Require Numbers',
            type: 'boolean',
            description: 'Passwords must contain at least one number',
            defaultValue: true,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.passwordRequireSpecialChars',
            label: 'Require Special Characters',
            type: 'boolean',
            description: 'Passwords must contain at least one special character',
            defaultValue: false,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.passwordExpiryDays',
            label: 'Password Expiry (Days)',
            type: 'number',
            description: 'Force password reset after this many days (0 = never)',
            defaultValue: 0,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.maxLoginAttempts',
            label: 'Max Login Attempts',
            type: 'number',
            description: 'Lock account after this many failed attempts',
            defaultValue: 5,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.lockoutDurationMinutes',
            label: 'Lockout Duration (Minutes)',
            type: 'number',
            description: 'How long accounts stay locked',
            defaultValue: 30,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.sessionTimeoutMinutes',
            label: 'Session Timeout (Minutes)',
            type: 'number',
            description: 'Auto-logout after inactivity',
            defaultValue: 60,
            scope: 'tenant',
            group: 'General',
        },
        {
            key: 'auth.maxConcurrentSessions',
            label: 'Max Concurrent Sessions',
            type: 'number',
            description: 'Maximum devices logged in simultaneously (0 = unlimited)',
            defaultValue: 0,
            scope: 'tenant',
            group: 'General',
        },
    ],
};

