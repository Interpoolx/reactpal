import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useModuleMenu, type ModuleMenuItem } from '../../hooks/useModuleMenu';
import { useRole, SIDEBAR_PERMISSIONS, type RoleType } from '../../context/RoleContext';

// Dynamic icon component
function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.Box;
    return <IconComponent className={className} />;
}

// Check if a menu item is accessible for the current role
function isMenuAccessible(href: string, currentRole: RoleType): boolean {
    // Super admin sees everything
    if (currentRole === 'super_admin') return true;

    // Regular user has no admin access
    if (currentRole === 'user') return false;

    // Map menu items to minimum required role
    const roleHierarchy: Record<RoleType, number> = {
        super_admin: 0,
        admin: 1,
        editor: 2,
        viewer: 3,
        user: 4,
    };

    const menuRoleRequirements: Record<string, RoleType> = {
        '/hpanel': 'viewer',
        '/hpanel/modules': 'admin',
        '/hpanel/tenants': 'super_admin',
        '/hpanel/users': 'admin',
        '/hpanel/security': 'super_admin',
        '/hpanel/settings': 'admin',
        '/hpanel/cms': 'viewer',
        '/hpanel/crm': 'viewer',
        '/hpanel/seo': 'viewer',
    };

    const requiredRole = menuRoleRequirements[href] || 'viewer';
    return roleHierarchy[currentRole] <= roleHierarchy[requiredRole];
}

// Menu item component
function MenuItem({ item, query, currentRole }: { item: ModuleMenuItem; query: string; currentRole: RoleType }) {
    const isActive = window.location.pathname === item.href;
    const hasAccess = isMenuAccessible(item.href, currentRole);

    // Don't render items the user doesn't have access to
    if (!hasAccess) return null;

    return (
        <a
            href={`${item.href}${query}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                ? 'text-primary bg-white/10'
                : 'text-muted hover:text-primary hover:bg-white/5'
                }`}
        >
            <DynamicIcon name={item.icon} className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm flex-1">{item.label}</span>
            {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${item.badge.type === 'new'
                    ? 'bg-brand-primary text-white'
                    : 'bg-white/10 text-muted'
                    }`}>
                    {item.badge.type === 'new' ? 'NEW' : item.badge.value}
                </span>
            )}
        </a>
    );
}

export function SideNav() {
    const { activeTenant } = useTenant();
    const { menuItems, isLoading } = useModuleMenu();
    const { currentRole, getRoleColor, getRoleDefinition, isPreviewMode } = useRole();

    const identifier = activeTenant?.domain || activeTenant?.slug || activeTenant?.id;
    const query = identifier ? `?tenant=${identifier}` : '';

    const roleColor = getRoleColor();
    const roleDefinition = getRoleDefinition(currentRole);

    // Filter menu items based on role
    const accessibleItems = menuItems.filter(item => isMenuAccessible(item.href, currentRole));

    return (
        <aside className="w-64 h-screen border-r border-border-muted bg-darker flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold">
                        R
                    </div>
                    <span className="font-bold text-lg tracking-tight">ReactPress</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {isLoading ? (
                    // Skeleton loading
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                            <div className="w-5 h-5 rounded bg-white/10 animate-pulse" />
                            <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                        </div>
                    ))
                ) : (
                    accessibleItems
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                            <MenuItem key={item.href} item={item} query={query} currentRole={currentRole} />
                        ))
                )}
            </nav>

            {/* User Section with Role */}
            <div className="p-4 border-t border-border-muted">
                <div className="bg-dark p-3 rounded-xl border border-border-muted">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                                backgroundColor: `${roleColor}20`,
                                border: `1px solid ${roleColor}40`
                            }}
                        >
                            <LucideIcons.User className="w-4 h-4" style={{ color: roleColor }} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-xs font-medium truncate">Master Admin</div>
                            <div
                                className="text-[10px] truncate font-medium"
                                style={{ color: roleColor }}
                            >
                                {roleDefinition.name}
                                {isPreviewMode && (
                                    <span className="ml-1 text-amber-400">(Preview)</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

