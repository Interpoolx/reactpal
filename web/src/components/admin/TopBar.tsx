import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Globe, Check, ExternalLink, Eye, Building2, User, LogOut } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useRole, ROLE_DEFINITIONS, type RoleType } from '../../context/RoleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../../lib/api';

export function TopBar() {
    const { activeTenant, tenants, setActiveTenant } = useTenant();
    const { currentRole, previewRole, setPreviewRole, isPreviewMode, getRoleColor, getRoleDefinition } = useRole();
    const [isTenantOpen, setIsTenantOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const tenantRef = useRef<HTMLDivElement>(null);
    const roleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tenantRef.current && !tenantRef.current.contains(event.target as Node)) {
                setIsTenantOpen(false);
            }
            if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
                setIsRoleOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRoleChange = (roleId: RoleType | null) => {
        setPreviewRole(roleId);
        setIsRoleOpen(false);
    };

    const handleTenantChange = (tenant: any) => {
        setActiveTenant(tenant);
        setIsTenantOpen(false);
        // Update URL with new tenant
        const url = new URL(window.location.href);
        url.searchParams.set('tenant', tenant.domain || tenant.slug || tenant.id);
        window.history.pushState({}, '', url.toString());
        window.location.reload(); // Refresh to load new tenant data
    };

    const handleLogout = async () => {
        try {
            await apiFetch('/api/v1/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout API failed:', err);
        } finally {
            sessionStorage.removeItem('rp_admin_token');
            sessionStorage.removeItem('rp_admin_logged_in');
            window.location.href = '/hpanel';
        }
    };

    const roleColor = getRoleColor(previewRole);
    const currentRoleDefinition = getRoleDefinition(currentRole);

    return (
        <header className="h-16 border-b border-border-muted bg-dark/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative max-w-md w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search commands, tenants, modules..."
                        className="w-full bg-white/5 border border-border-muted rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* View as Role Dropdown */}
                <div className="relative" ref={roleRef}>
                    <button
                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                        style={isPreviewMode ? {
                            backgroundColor: `${roleColor}20`,
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: `${roleColor}50`,
                            color: roleColor,
                        } : {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            borderColor: 'rgba(255,255,255,0.1)',
                        }}
                        title="View as different role"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="text-xs font-medium">
                            {isPreviewMode ? currentRoleDefinition.name : 'View as'}
                        </span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isRoleOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-64 bg-darker border border-border-muted rounded-2xl shadow-2xl z-50 py-2"
                            >
                                <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
                                    Preview as Role
                                </div>
                                {isPreviewMode && (
                                    <button
                                        onClick={() => handleRoleChange(null)}
                                        className="w-full px-4 py-2 text-sm text-left text-amber-400 hover:bg-amber-500/10 border-b border-border-muted flex items-center gap-2"
                                    >
                                        <span>←</span>
                                        <span>Exit Preview Mode</span>
                                    </button>
                                )}
                                {ROLE_DEFINITIONS.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => handleRoleChange(role.id)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: role.color }}
                                            />
                                            <div>
                                                <div className="font-medium text-left">{role.name}</div>
                                                <div className="text-[10px] text-muted text-left">{role.description}</div>
                                            </div>
                                        </div>
                                        {currentRole === role.id && (
                                            <Check className="w-4 h-4" style={{ color: role.color }} />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tenant Switcher */}
                <div className="relative" ref={tenantRef}>
                    <button
                        onClick={() => setIsTenantOpen(!isTenantOpen)}
                        className="flex items-center gap-2 bg-white/5 border border-border-muted px-4 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer min-w-[200px] justify-between"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Globe className="w-4 h-4 text-brand-primary flex-shrink-0" />
                            <span className="text-xs font-medium truncate">
                                {activeTenant?.name || 'Select Tenant'}
                            </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 text-muted transition-transform ${isTenantOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isTenantOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-64 bg-darker border border-border-muted rounded-2xl shadow-2xl z-50 py-2"
                            >
                                <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
                                    Available Tenants
                                </div>
                                {Array.isArray(tenants) && tenants.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleTenantChange(t)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-brand-primary/10 transition-colors group"
                                    >
                                        <div className="flex flex-col items-start overflow-hidden">
                                            <span className="font-medium truncate">{t.name}</span>
                                            <span className="text-[10px] text-muted truncate">{t.domain}</span>
                                        </div>
                                        {activeTenant?.id === t.id && (
                                            <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                                <div className="border-t border-border-muted mt-2 pt-2">
                                    <a
                                        href="/hpanel/tenants"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-primary hover:bg-white/5"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        Manage Tenants
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Open Frontend Link */}
                {activeTenant && (
                    <a
                        href={`/?tenant=${activeTenant.domain || activeTenant.slug || activeTenant.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Public Site"
                        className="p-2.5 bg-white/5 border border-border-muted rounded-xl hover:bg-brand-primary/20 hover:text-brand-primary transition-all group"
                    >
                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                )}

                {/* Notifications */}
                <button className="p-2.5 bg-white/5 border border-border-muted rounded-xl hover:bg-white/10 transition-colors">
                    <Bell className="w-4 h-4" />
                </button>

                {/* User with Role Badge and Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-border-muted">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-muted" />
                    </div>
                    <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: `${getRoleColor()}20`,
                            color: getRoleColor(),
                            border: `1px solid ${getRoleColor()}40`
                        }}
                    >
                        {currentRoleDefinition.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ml-1"
                        title="Log Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
