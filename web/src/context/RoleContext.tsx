import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Role definitions with hierarchy (lower index = higher privilege)
export type RoleType = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'user';

export interface RoleDefinition {
    id: RoleType;
    name: string;
    description: string;
    color: string;
    hierarchyLevel: number;
}

export const ROLE_DEFINITIONS: RoleDefinition[] = [
    { id: 'super_admin', name: 'Super Admin', description: 'Full platform access', color: '#9333EA', hierarchyLevel: 0 },
    { id: 'admin', name: 'Admin', description: 'Tenant admin access', color: '#DC2626', hierarchyLevel: 1 },
    { id: 'editor', name: 'Editor', description: 'Content management', color: '#2563EB', hierarchyLevel: 2 },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access', color: '#059669', hierarchyLevel: 3 },
    { id: 'user', name: 'Regular User', description: 'No admin access', color: '#6B7280', hierarchyLevel: 4 },
];

// Permission definitions
export type Permission =
    | 'view_dashboard'
    | 'manage_tenants'
    | 'manage_modules'
    | 'manage_users'
    | 'manage_security'
    | 'manage_settings'
    | 'view_cms'
    | 'edit_cms'
    | 'view_crm'
    | 'edit_crm'
    | 'view_seo'
    | 'edit_seo'
    | 'view_analytics'
    | 'create_content'
    | 'edit_content'
    | 'delete_content'
    | 'publish_content'
    | 'upload_media';

// Role to permissions mapping
const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
    super_admin: [
        'view_dashboard', 'manage_tenants', 'manage_modules', 'manage_users',
        'manage_security', 'manage_settings', 'view_cms', 'edit_cms', 'view_crm',
        'edit_crm', 'view_seo', 'edit_seo', 'view_analytics', 'create_content',
        'edit_content', 'delete_content', 'publish_content', 'upload_media'
    ],
    admin: [
        'view_dashboard', 'manage_modules', 'manage_users', 'manage_settings',
        'view_cms', 'edit_cms', 'view_crm', 'edit_crm', 'view_seo', 'edit_seo',
        'view_analytics', 'create_content', 'edit_content', 'delete_content',
        'publish_content', 'upload_media'
    ],
    editor: [
        'view_dashboard', 'view_cms', 'edit_cms', 'view_crm', 'edit_crm',
        'view_seo', 'edit_seo', 'view_analytics', 'create_content', 'edit_content',
        'delete_content', 'publish_content', 'upload_media'
    ],
    viewer: [
        'view_dashboard', 'view_cms', 'view_crm', 'view_seo', 'view_analytics'
    ],
    user: []
};

// Sidebar items that require specific permissions
export const SIDEBAR_PERMISSIONS: Record<string, { requiredPermission: Permission | null; minRole: RoleType }> = {
    '/hpanel': { requiredPermission: 'view_dashboard', minRole: 'viewer' },
    '/hpanel/modules': { requiredPermission: 'manage_modules', minRole: 'admin' },
    '/hpanel/tenants': { requiredPermission: 'manage_tenants', minRole: 'super_admin' },
    '/hpanel/users': { requiredPermission: 'manage_users', minRole: 'admin' },
    '/hpanel/security': { requiredPermission: 'manage_security', minRole: 'super_admin' },
    '/hpanel/settings': { requiredPermission: 'manage_settings', minRole: 'admin' },
    '/hpanel/cms': { requiredPermission: 'view_cms', minRole: 'viewer' },
    '/hpanel/crm': { requiredPermission: 'view_crm', minRole: 'viewer' },
    '/hpanel/seo': { requiredPermission: 'view_seo', minRole: 'viewer' },
};

interface RoleState {
    previewRole: RoleType | null;
    actualRole: RoleType;
    previewStartTime: string | null;
}

interface RoleContextType {
    currentRole: RoleType;
    previewRole: RoleType | null;
    actualRole: RoleType;
    previewStartTime: string | null;
    isPreviewMode: boolean;
    setPreviewRole: (role: RoleType | null) => void;
    hasPermission: (permission: Permission) => boolean;
    canAccessRoute: (route: string) => boolean;
    getRoleDefinition: (roleId: RoleType) => RoleDefinition;
    getRoleColor: (roleId?: RoleType | null) => string;
    exitPreviewMode: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'rp_role_state';

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const [roleState, setRoleState] = useState<RoleState>(() => {
        // Load from session storage
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                // ignore parse errors
            }
        }
        return {
            previewRole: null,
            actualRole: 'super_admin', // Default for development; in production, fetch from auth
            previewStartTime: null,
        };
    });

    // Save to session storage when state changes
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(roleState));
    }, [roleState]);

    const currentRole = roleState.previewRole || roleState.actualRole;
    const isPreviewMode = roleState.previewRole !== null;

    const setPreviewRole = useCallback((role: RoleType | null) => {
        setRoleState(prev => ({
            ...prev,
            previewRole: role,
            previewStartTime: role ? new Date().toISOString() : null,
        }));
    }, []);

    const exitPreviewMode = useCallback(() => {
        setPreviewRole(null);
    }, [setPreviewRole]);

    const hasPermission = useCallback((permission: Permission): boolean => {
        return ROLE_PERMISSIONS[currentRole]?.includes(permission) ?? false;
    }, [currentRole]);

    const canAccessRoute = useCallback((route: string): boolean => {
        // Find the matching route permission
        const routeConfig = SIDEBAR_PERMISSIONS[route];
        if (!routeConfig) {
            // If no specific permission required, allow access for non-user roles
            return currentRole !== 'user';
        }

        if (routeConfig.requiredPermission) {
            return hasPermission(routeConfig.requiredPermission);
        }

        // Check by minimum role level
        const currentDef = ROLE_DEFINITIONS.find(r => r.id === currentRole);
        const minDef = ROLE_DEFINITIONS.find(r => r.id === routeConfig.minRole);
        if (!currentDef || !minDef) return false;

        return currentDef.hierarchyLevel <= minDef.hierarchyLevel;
    }, [currentRole, hasPermission]);

    const getRoleDefinition = useCallback((roleId: RoleType): RoleDefinition => {
        return ROLE_DEFINITIONS.find(r => r.id === roleId) || ROLE_DEFINITIONS[0];
    }, []);

    const getRoleColor = useCallback((roleId?: RoleType | null): string => {
        const role = roleId || currentRole;
        return ROLE_DEFINITIONS.find(r => r.id === role)?.color || '#6B7280';
    }, [currentRole]);

    return (
        <RoleContext.Provider value={{
            currentRole,
            previewRole: roleState.previewRole,
            actualRole: roleState.actualRole,
            previewStartTime: roleState.previewStartTime,
            isPreviewMode,
            setPreviewRole,
            hasPermission,
            canAccessRoute,
            getRoleDefinition,
            getRoleColor,
            exitPreviewMode,
        }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within RoleProvider');
    }
    return context;
}
