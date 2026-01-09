import React, { useState, useEffect } from 'react';
import {
    Package, Check, X, Building2, Users, Settings,
    Shield, FileText, Contact, Search, BarChart3,
    ChevronDown, ChevronUp, RefreshCw, LayoutGrid, List,
    CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink,
    Info, Plug, Zap
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';

interface ModuleInfo {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    icon: string;
    version: string;
    category: 'core' | 'features' | 'integrations';
    status: 'enabled' | 'disabled' | 'available';
    isCore: boolean;
    platformEnabled: boolean;
    tenantsEnabled: number;
    totalTenants?: number;
    features?: string[];
    dependencies?: { id: string; name: string; satisfied: boolean }[];
    tags?: string[];
}

interface TenantModuleStatus {
    tenantId: string;
    tenantName: string;
    domain?: string;
    enabled: boolean;
    enabledAt?: number;
}

// Icon mapping
const IconMap: Record<string, any> = {
    Shield, Users, Building2, FileText, Contact, Search, BarChart3, Settings,
    Package, Plug, Zap, Info
};

// Status badge component
function ModuleStatusBadge({ status }: { status: ModuleInfo['status'] }) {
    const config = {
        enabled: { label: 'Enabled', className: 'bg-green-500/20 text-green-400', Icon: CheckCircle },
        disabled: { label: 'Disabled', className: 'bg-gray-500/20 text-gray-400', Icon: XCircle },
        available: { label: 'Available', className: 'bg-blue-500/20 text-blue-400', Icon: Clock },
    };
    const { label, className, Icon } = config[status] || config.available;
    return (
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${className}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

// Module card component
function ModuleCard({
    module,
    view,
    onToggle,
    onClick
}: {
    module: ModuleInfo;
    view: 'grid' | 'list';
    onToggle: (id: string, enabled: boolean) => void;
    onClick: () => void;
}) {
    const [isToggling, setIsToggling] = useState(false);
    const Icon = IconMap[module.icon] || Package;

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (module.isCore) return;
        setIsToggling(true);
        await onToggle(module.id, !module.platformEnabled);
        setIsToggling(false);
    };

    if (view === 'list') {
        return (
            <div
                onClick={onClick}
                className="flex items-center gap-4 p-4 bg-dark rounded-xl border border-border-muted cursor-pointer hover:border-brand-primary/50 transition-colors"
            >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${module.isCore ? 'bg-green-500/20 text-green-400' : 'bg-brand-primary/20 text-brand-primary'
                    }`}>
                    <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium">{module.name}</h3>
                        <ModuleStatusBadge status={module.status} />
                        {module.isCore && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">CORE</span>
                        )}
                    </div>
                    <p className="text-sm text-muted truncate">{module.description}</p>
                </div>

                <div className="flex items-center gap-6">
                    {!module.isCore && module.tenantsEnabled > 0 && (
                        <div className="text-right">
                            <div className="text-sm font-medium">{module.tenantsEnabled}</div>
                            <div className="text-xs text-muted">tenants</div>
                        </div>
                    )}

                    {!module.isCore && (
                        <button
                            onClick={handleToggle}
                            disabled={isToggling}
                            className={`w-11 h-6 rounded-full transition-colors relative ${module.platformEnabled ? 'bg-green-500' : 'bg-gray-600'
                                }`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${module.platformEnabled ? 'left-6' : 'left-1'
                                }`} />
                        </button>
                    )}

                    <ExternalLink className="w-4 h-4 text-muted" />
                </div>
            </div>
        );
    }

    // Grid view card
    return (
        <div
            className="bg-dark rounded-xl border border-border-muted p-5 hover:border-brand-primary/50 transition-all flex flex-col group hover:shadow-lg hover:shadow-brand-primary/5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.isCore ? 'bg-green-500/20 text-green-400' : 'bg-brand-primary/20 text-brand-primary'
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>

                {!module.isCore && (
                    <button
                        onClick={handleToggle}
                        disabled={isToggling}
                        className={`w-11 h-6 rounded-full transition-colors relative ${module.platformEnabled ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                    >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${module.platformEnabled ? 'left-6' : 'left-1'
                            }`} />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{module.name}</h3>
                {module.isCore && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">CORE</span>
                )}
            </div>

            <p className="text-sm text-muted mb-4 line-clamp-2 flex-1">{module.description}</p>

            <div className="space-y-2 pt-4 border-t border-border-muted">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Status</span>
                    <ModuleStatusBadge status={module.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Version</span>
                    <span className="font-medium">{module.version || '1.0.0'}</span>
                </div>
                {!module.isCore && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Tenants</span>
                        <span className="font-medium">{module.tenantsEnabled || 0}</span>
                    </div>
                )}
            </div>

            {module.dependencies && module.dependencies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-muted">
                    <span className="text-xs text-muted block mb-2">Dependencies</span>
                    <div className="flex flex-wrap gap-1">
                        {module.dependencies.map((dep: any) => (
                            <span
                                key={typeof dep === 'string' ? dep : dep.id}
                                className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"
                            >
                                {typeof dep === 'string' ? dep : dep.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* View Details Button */}
            <div className="mt-4 pt-4 border-t border-border-muted flex gap-2">
                <button
                    onClick={onClick}
                    className="flex-1 text-sm text-center py-2 border border-border-muted rounded-lg hover:bg-white/5 transition-colors"
                >
                    Quick View
                </button>
                <a
                    href={`/hpanel/modules/view?id=${module.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-sm text-center py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-1"
                >
                    View Details
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}

export function ModulesPage() {
    const [modules, setModules] = useState<ModuleInfo[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [selectedModule, setSelectedModule] = useState<ModuleInfo | null>(null);
    const [tenantStatuses, setTenantStatuses] = useState<TenantModuleStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'core' | 'features' | 'integrations'>('all');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const { activeTenant } = useTenant();

    useEffect(() => {
        loadModules();
        loadTenants();
    }, []);

    async function loadModules() {
        setIsLoading(true);
        try {
            const response = await apiFetch('/api/v1/modules');
            if (response.ok) {
                const data = await response.json();
                // Transform API response to match frontend interface
                const modulesData: ModuleInfo[] = data.map((m: any) => ({
                    ...m,
                    description: m.description || `${m.name} module`,
                    icon: m.icon || 'Package',
                    version: m.version || '1.0.0',
                    status: m.status || (m.isCore ? 'enabled' : 'available'),
                    platformEnabled: m.platformEnabled ?? m.isCore,
                    tenantsEnabled: m.tenantsEnabled || 0,
                }));
                setModules(modulesData);
            }
        } catch (error) {
            console.error('Failed to load modules:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function loadTenants() {
        try {
            const response = await apiFetch('/api/v1/tenants');
            if (response.ok) {
                const data = await response.json();
                setTenants(data);
            }
        } catch (error) {
            console.error('Failed to load tenants:', error);
        }
    }

    async function handleToggle(moduleId: string, enabled: boolean) {
        try {
            const endpoint = enabled
                ? `/api/v1/modules/${moduleId}/enable`
                : `/api/v1/modules/${moduleId}/disable`;

            const response = await apiFetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabledBy: 'admin' })
            });

            if (response.ok) {
                setModules(prev => prev.map(m =>
                    m.id === moduleId ? { ...m, platformEnabled: enabled, status: enabled ? 'enabled' : 'disabled' } : m
                ));
            }
        } catch (error) {
            console.error('Failed to toggle module platform-wide:', error);
        }
    }

    async function loadTenantStatuses(moduleId: string) {
        try {
            const response = await apiFetch(`/api/v1/modules/${moduleId}/tenants`);
            if (response.ok) {
                const data = await response.json();
                const statuses: TenantModuleStatus[] = data.map((t: any) => ({
                    tenantId: t.id,
                    tenantName: t.name,
                    domain: t.domain,
                    enabled: t.enabled === 1 || t.enabled === true,
                    enabledAt: t.enabled_at,
                }));
                setTenantStatuses(statuses);
            }
        } catch (error) {
            console.error('Failed to load tenant statuses:', error);
        }
    }

    async function toggleModuleForTenant(moduleId: string, tenantId: string, enable: boolean) {
        try {
            const endpoint = enable
                ? `/api/v1/tenants/${tenantId}/modules/${moduleId}/enable`
                : `/api/v1/tenants/${tenantId}/modules/${moduleId}/disable`;

            await apiFetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabledBy: 'admin' })
            });

            loadTenantStatuses(moduleId);
        } catch (error) {
            console.error('Failed to toggle module:', error);
        }
    }

    function handleModuleClick(module: ModuleInfo) {
        setSelectedModule(module);
        if (!module.isCore) {
            loadTenantStatuses(module.id);
        }
    }

    const filteredModules = filter === 'all'
        ? modules
        : modules.filter(m => m.category === filter);

    const stats = {
        total: modules.length,
        enabled: modules.filter(m => m.status === 'enabled').length,
        disabled: modules.filter(m => m.status === 'disabled').length,
        available: modules.filter(m => m.status === 'available').length,
    };

    return (
        <div className="flex-1 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Modules</h1>
                    <p className="text-muted mt-1">Manage platform modules and features</p>
                </div>
                <button
                    onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }}
                    className="flex items-center gap-2 px-4 py-2 bg-dark border border-border-muted rounded-lg hover:bg-white/5"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Modules', value: stats.total, Icon: Package, color: 'text-white' },
                    { label: 'Enabled', value: stats.enabled, Icon: CheckCircle, color: 'text-green-400' },
                    { label: 'Disabled', value: stats.disabled, Icon: XCircle, color: 'text-gray-400' },
                    { label: 'Available', value: stats.available, Icon: Clock, color: 'text-blue-400' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-dark rounded-xl border border-border-muted p-4">
                        <div className="flex items-center gap-3">
                            <stat.Icon className={`w-5 h-5 ${stat.color}`} />
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & View Toggle */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {[
                        { id: 'all', label: `All (${modules.length})` },
                        { id: 'core', label: 'Core' },
                        { id: 'features', label: 'Features' },
                        { id: 'integrations', label: 'Integrations' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as any)}
                            className={`px-4 py-2 rounded-lg transition-colors ${filter === tab.id
                                ? 'bg-brand-primary text-white'
                                : 'bg-dark text-muted hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setView('grid')}
                        className={`p-2 rounded-lg ${view === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg ${view === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Modules */}
            <div className="flex gap-6">
                {/* Modules List/Grid */}
                <div className={`flex-1 ${view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-3'
                    }`}>
                    {filteredModules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            view={view}
                            onToggle={handleToggle}
                            onClick={() => handleModuleClick(module)}
                        />
                    ))}
                </div>

                {/* Detail Panel */}
                {selectedModule && (
                    <div className="w-96 bg-dark rounded-xl border border-border-muted p-6 h-fit sticky top-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">{selectedModule.name}</h2>
                            <button
                                onClick={() => setSelectedModule(null)}
                                className="p-1 hover:bg-white/10 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-muted mb-4">{selectedModule.longDescription || selectedModule.description}</p>

                        {/* Features */}
                        {selectedModule.features && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">Features</h4>
                                <ul className="space-y-1">
                                    {selectedModule.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                                            <Check className="w-3 h-3 text-green-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tenant Assignment (for non-core modules) */}
                        {!selectedModule.isCore && (
                            <div className="mt-4 pt-4 border-t border-border-muted">
                                <h4 className="text-sm font-medium mb-3">Tenant Access</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {tenantStatuses.map((status) => (
                                        <div
                                            key={status.tenantId}
                                            className="flex items-center justify-between p-2 bg-darker rounded-lg"
                                        >
                                            <div className="truncate">
                                                <div className="text-sm font-medium truncate">{status.tenantName}</div>
                                                {status.domain && (
                                                    <div className="text-xs text-muted truncate">{status.domain}</div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => toggleModuleForTenant(selectedModule.id, status.tenantId, !status.enabled)}
                                                className={`w-10 h-5 rounded-full transition-colors relative ${status.enabled ? 'bg-green-500' : 'bg-gray-600'
                                                    }`}
                                            >
                                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${status.enabled ? 'left-5' : 'left-0.5'
                                                    }`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
