import type { Hono } from 'hono';

// ============================================================================
// MODULE REGISTRY TYPES
// ============================================================================

/**
 * Configuration for a pluggable module
 */
export interface ModuleConfig {
    /** Unique module identifier (e.g., 'auth', 'users', 'cms') */
    id: string;

    /** Human-readable display name */
    name: string;

    /** Semantic version string */
    version: string;

    /** Optional description */
    description?: string;

    /** Whether this is a core/foundation module */
    isCore: boolean;

    /** Whether this is infrastructure (not shown in modules marketplace) */
    isInfrastructure?: boolean;

    /** Module category */
    category: 'core' | 'features' | 'integrations';

    /** List of feature names */
    features: string[];

    /** Searchable tags */
    tags: string[];

    /** Register Hono routes for this module */
    routes: (app: Hono<any>) => void;

    /** Admin sidebar menu configuration */
    menu: ModuleMenuItem;

    /** Module availability rules */
    availability: ModuleAvailability;

    /** Permissions this module provides */
    permissions: string[];

    /** Permission required to access this module */
    requiredPermission?: string;

    /** Other modules this depends on (loaded first) */
    dependencies?: string[];

    /** Settings section to auto-register */
    settings?: SettingSection;

    // Breeze Lifecycle Hooks
    onProvision?: (tenantId: string, db: any) => Promise<void>;
    onEnable?: (tenantId: string, db: any) => Promise<void>;
    onDisable?: (tenantId: string, db: any) => Promise<void>;
    onDeprovision?: (tenantId: string, db: any) => Promise<void>;
}

/**
 * Module availability configuration
 */
export interface ModuleAvailability {
    /** Only visible to platform super admins */
    requiresPlatformAdmin?: boolean;

    /** Can tenants enable/disable this module? */
    availableForTenants?: boolean;

    /** Enabled by default for new tenants */
    defaultEnabled?: boolean;

    /** Requires enterprise plan */
    enterpriseOnly?: boolean;
}

/**
 * Sidebar menu item configuration
 */
export interface ModuleMenuItem {
    /** Display label */
    label: string;

    /** Lucide icon name */
    icon: string;

    /** Route path (e.g., '/hpanel/users') */
    href: string;

    /** Menu order (lower = higher up) */
    order: number;

    /** Optional badge configuration */
    badge?: ModuleBadge;

    /** Submenu items */
    children?: ModuleMenuItem[];
}

/**
 * Badge configuration for menu items
 */
export interface ModuleBadge {
    type: 'count' | 'status' | 'new';
    getValue?: () => Promise<number | string | undefined>;
}

/**
 * Frontend route configuration
 */
export interface ModuleRoute {
    /** Route path */
    path: string;

    /** Component path for lazy loading */
    component: string;

    /** Permission required for this route */
    requiredPermission?: string;

    /** Exact match only */
    exact?: boolean;
}

/**
 * Module status in database
 */
export interface ModuleStatus {
    moduleId: string;
    tenantId: string;
    enabled: boolean;
    enabledAt?: Date;
    enabledBy?: string;
    settings?: Record<string, any>;
}

// ============================================================================
// SETTINGS REGISTRY TYPES
// ============================================================================

/**
 * Settings section registered by a module
 */
export interface SettingSection {
    /** Unique section identifier */
    id: string;

    /** Display label */
    label: string;

    /** Lucide icon name */
    icon: string;

    /** Display order */
    order: number;

    /** Permission required to view/edit */
    requiredPermission?: string;

    /** Roles that can access this section */
    requiredRoles?: string[];

    /** Available for tenant admins (false = platform only) */
    availableForTenants?: boolean;

    /** Settings fields in this section */
    fields: SettingField[];
}

/**
 * Individual setting field definition
 */
export interface SettingField {
    /** Unique key (e.g., 'auth.passwordMinLength') */
    key: string;

    /** Display label */
    label: string;

    /** Field type */
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'file' | 'json' | 'textarea' | 'button' | 'action' | 'filterConfig';

    /** Help text */
    description?: string;

    /** Default value */
    defaultValue: any;

    /** Options for select fields */
    options?: Array<{ label: string; value: any }>;

    /** Scope where this setting applies */
    scope: 'platform' | 'tenant' | 'user';

    /** Mask in UI and encrypt in DB */
    sensitive?: boolean;

    /** Group for organizing settings in UI (e.g., 'Admin UI', 'Table Columns', 'Defaults') */
    group?: string;

    /** Action endpoint for button/action types */
    actionUrl?: string;

    /** HTTP method for the action (defaults to POST) */
    actionMethod?: string;

    /** Label for the action button */
    actionLabel?: string;
}

/**
 * Context for settings resolution
 */
export interface SettingsContext {
    userId?: string;
    tenantId?: string;
    isSuperAdmin?: boolean;
}

// ============================================================================
// EVENT BUS TYPES
// ============================================================================

/**
 * Event payload for module events
 */
export interface ModuleEvent {
    moduleId: string;
    tenantId?: string;
    timestamp: Date;
    payload?: any;
}

/**
 * Event handler function
 */
export type EventHandler = (event: ModuleEvent) => void | Promise<void>;

// ============================================================================
// API ROUTE CONSTANTS
// ============================================================================

/**
 * Standardized API route prefixes for stability
 */
export const API_ROUTES = {
    // Versioned API base
    BASE: '/api/v1',

    // Auth module routes
    AUTH: {
        BASE: '/api/v1/auth',
        LOGIN: '/api/v1/auth/login',
        LOGOUT: '/api/v1/auth/logout',
        LOGOUT_ALL: '/api/v1/auth/logout-all',
        REFRESH: '/api/v1/auth/refresh',
        REGISTER: '/api/v1/auth/register',
        FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
        RESET_PASSWORD: '/api/v1/auth/reset-password',
        CHANGE_PASSWORD: '/api/v1/auth/change-password',
        SESSIONS: '/api/v1/auth/sessions',
        ME: '/api/v1/auth/me',
        LOGIN_HISTORY: '/api/v1/auth/login-history',
    },

    // Users module routes
    USERS: {
        BASE: '/api/v1/users',
        ROLES: '/api/v1/roles',
        PERMISSIONS: '/api/v1/permissions',
        INVITATIONS: '/api/v1/invitations',
    },

    // Tenants module routes
    TENANTS: {
        BASE: '/api/v1/tenants',
        DOMAINS: '/api/v1/tenants/domains',
        USAGE: '/api/v1/tenants/usage',
        MODULES: '/api/v1/tenants/modules',
    },

    // Settings routes
    SETTINGS: {
        BASE: '/api/v1/settings',
        SECTIONS: '/api/v1/settings/sections',
    },

    // Module management routes
    MODULES: {
        BASE: '/api/v1/modules',
        MENU: '/api/v1/modules/menu',
        STATUS: '/api/v1/modules/status',
    },

    // Resolver route
    RESOLVER: {
        BASE: '/api/v1/resolver',
        RESOLVE_TENANT: '/api/v1/resolver/resolve-tenant',
    },
} as const;

/**
 * Admin panel route prefixes
 */
export const ADMIN_ROUTES = {
    BASE: '/hpanel',
    DASHBOARD: '/hpanel',
    USERS: '/hpanel/users',
    TENANTS: '/hpanel/tenants',
    SETTINGS: '/hpanel/settings',
    SECURITY: '/hpanel/security',
} as const;
