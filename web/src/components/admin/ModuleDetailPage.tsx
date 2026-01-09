import React, { useState, useEffect } from 'react';
import {
    Package, Building2, Settings, Activity, ChevronLeft,
    CheckCircle, XCircle, Clock, Users, Zap, AlertTriangle,
    ToggleLeft, ToggleRight, FileText, BarChart3, History
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';

interface ModuleInfo {
    id: string;
    name: string;
    description: string;
    longDescription?: string;
    version: string;
    category: 'core' | 'features' | 'integrations';
    status: 'enabled' | 'disabled' | 'available';
    isCore: boolean;
    platformEnabled: boolean;
    tenantsEnabled: number;
    totalTenants: number;
    features?: string[];
    dependencies?: { id: string; name: string; satisfied: boolean }[];
    changelog?: { version: string; date: string; changes: string[] }[];
}

interface TenantStatus {
    tenantId: string;
    tenantName: string;
    domain?: string;
    enabled: boolean;
    enabledAt?: number;
}

interface ModuleActivity {
    id: string;
    action: string;
    details: string;
    user: string;
    timestamp: number;
}

const TABS = ['overview', 'tenants', 'config', 'activity', 'changelog'] as const;
type TabId = typeof TABS[number];

function getRelativeTime(timestamp?: number): string {
    if (!timestamp) return 'Never';
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
}

export function ModuleDetailPage() {
    const [module, setModule] = useState<ModuleInfo | null>(null);
    const [tenants, setTenants] = useState<TenantStatus[]>([]);
    const [activity, setActivity] = useState<ModuleActivity[]>([]);
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const { activeTenant } = useTenant();

    // Get module ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id') || window.location.pathname.split('/').pop();

    useEffect(() => {
        loadModule();
    }, [moduleId]);

    const loadModule = async () => {
        setIsLoading(true);
        try {
            // Fetch module from API
            const res = await apiFetch('/api/v1/modules');
            if (res.ok) {
                const allModules = await res.json();
                const foundModule = allModules.find((m: any) => m.id === moduleId);
                if (foundModule) {
                    // Transform to match interface
                    setModule({
                        ...foundModule,
                        longDescription: foundModule.longDescription || foundModule.description,
                        status: foundModule.isCore ? 'enabled' : (foundModule.platformEnabled ? 'enabled' : 'available'),
                        totalTenants: foundModule.totalTenants || 0,
                        changelog: [
                            { version: foundModule.version || '1.0.0', date: '2024-01-01', changes: ['Initial implementation'] },
                        ],
                    });
                    // Generate mock activity for now
                    setActivity([
                        { id: '1', action: 'Module Registered', details: `${foundModule.name} added to platform`, user: 'system', timestamp: Date.now() / 1000 - 86400 * 30 },
                    ]);
                    // Load tenants after we know if module is core
                    await loadTenants(foundModule.isCore);
                }
            }
        } catch (error) {
            console.error('Failed to load module:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTenants = async (isModuleCore: boolean) => {
        try {
            // Fetch tenants from API
            const res = await apiFetch('/api/v1/tenants');
            if (res.ok) {
                const tenantsData = await res.json();

                // Transform to TenantStatus format
                const tenantStatuses: TenantStatus[] = tenantsData.map((t: any) => ({
                    tenantId: t.id || t.slug,
                    tenantName: t.name,
                    domain: t.domain || t.slug,
                    // Core modules are always enabled for all tenants
                    enabled: isModuleCore ? true : false,
                    enabledAt: isModuleCore ? Date.now() / 1000 : undefined,
                }));

                setTenants(tenantStatuses);
            }
        } catch (error) {
            console.error('Failed to load tenants:', error);
        }
    };

    const handleToggleTenant = async (tenantId: string, enabled: boolean) => {
        setTenants(prev => prev.map(t =>
            t.tenantId === tenantId ? { ...t, enabled, enabledAt: enabled ? Date.now() / 1000 : undefined } : t
        ));
        // API call would go here
    };

    if (isLoading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-8 w-48 bg-white/10 rounded mb-4" />
                <div className="h-32 bg-white/5 rounded-xl" />
            </div>
        );
    }

    if (!module) {
        return (
            <div className="p-6 text-center">
                <Package className="w-16 h-16 mx-auto text-muted mb-4" />
                <h2 className="text-xl font-semibold">Module not found</h2>
                <a href="/hpanel/modules" className="text-brand-primary hover:underline mt-2 inline-block">
                    ← Back to Modules
                </a>
            </div>
        );
    }

    const categoryColors = {
        core: 'bg-purple-500/20 text-purple-400',
        features: 'bg-blue-500/20 text-blue-400',
        integrations: 'bg-green-500/20 text-green-400',
    };

    return (
        <div className="p-6 space-y-6">
            {/* Back Link */}
            <a
                href="/hpanel/modules"
                className="inline-flex items-center gap-2 text-muted hover:text-primary"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Modules
            </a>

            {/* Header */}
            <div className="bg-darker rounded-xl border border-border-muted p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold">{module.name}</h1>
                                <span className="text-sm text-muted">v{module.version}</span>
                                {module.isCore && (
                                    <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                                        Core
                                    </span>
                                )}
                            </div>
                            <p className="text-muted mt-1">{module.description}</p>
                            <div className="flex items-center gap-3 mt-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[module.category]}`}>
                                    {module.category}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${module.platformEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {module.platformEnabled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {module.platformEnabled ? 'Platform Enabled' : 'Platform Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!module.isCore && (
                            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${module.platformEnabled
                                ? 'border border-red-500/50 text-red-400 hover:bg-red-500/10'
                                : 'bg-brand-primary text-white'
                                }`}>
                                {module.platformEnabled ? (
                                    <>
                                        <XCircle className="w-4 h-4" />
                                        Disable Platform-Wide
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Enable Platform-Wide
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard title="Tenants Enabled" value={module.tenantsEnabled} subtitle={`of ${module.totalTenants}`} icon={Building2} />
                <StatCard title="Features" value={module.features?.length || 0} subtitle="included" icon={Zap} />
                <StatCard title="Dependencies" value={module.dependencies?.length || 0} subtitle="required" icon={Package} />
                <StatCard title="Latest Version" value={module.version} subtitle="current" icon={FileText} />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border-muted">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab
                            ? 'border-brand-primary text-brand-primary'
                            : 'border-transparent text-muted hover:text-primary'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-darker rounded-xl border border-border-muted p-6">
                {activeTab === 'overview' && <OverviewTab module={module} />}
                {activeTab === 'tenants' && <TenantsTab tenants={tenants} onToggle={handleToggleTenant} isCore={module.isCore} />}
                {activeTab === 'config' && <ConfigTab module={module} />}
                {activeTab === 'activity' && <ActivityTab activity={activity} />}
                {activeTab === 'changelog' && <ChangelogTab module={module} />}
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon }: any) {
    return (
        <div className="bg-darker rounded-xl border border-border-muted p-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted">{title} {subtitle}</div>
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ module }: { module: ModuleInfo }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-muted">{module.longDescription || module.description}</p>
            </div>

            {module.features && module.features.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Features</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {module.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 p-3 bg-dark rounded-lg">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {module.dependencies && module.dependencies.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Dependencies</h2>
                    <div className="space-y-2">
                        {module.dependencies.map((dep) => (
                            <div key={dep.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Package className="w-4 h-4 text-muted" />
                                    <span>{dep.name}</span>
                                </div>
                                <span className={`inline-flex items-center gap-1 text-xs ${dep.satisfied ? 'text-green-400' : 'text-red-400'}`}>
                                    {dep.satisfied ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                    {dep.satisfied ? 'Satisfied' : 'Missing'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function TenantsTab({ tenants, onToggle, isCore }: { tenants: TenantStatus[]; onToggle: (id: string, enabled: boolean) => void; isCore: boolean }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Tenant Assignments</h2>
                <span className="text-sm text-muted">
                    {tenants.filter(t => t.enabled).length} of {tenants.length} enabled
                </span>
            </div>

            {isCore && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm">
                    Core modules are automatically enabled for all tenants and cannot be disabled.
                </div>
            )}

            <div className="space-y-2">
                {tenants.map((tenant) => (
                    <div key={tenant.tenantId} className="flex items-center justify-between p-4 bg-dark rounded-lg">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-muted" />
                            <div>
                                <div className="font-medium">{tenant.tenantName}</div>
                                <div className="text-xs text-muted">{tenant.domain}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {tenant.enabledAt && (
                                <span className="text-xs text-muted">
                                    Enabled {getRelativeTime(tenant.enabledAt)}
                                </span>
                            )}
                            <button
                                onClick={() => onToggle(tenant.tenantId, !tenant.enabled)}
                                disabled={isCore}
                                className={`p-1 rounded transition-colors ${isCore ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {tenant.enabled ? (
                                    <ToggleRight className="w-8 h-8 text-green-400" />
                                ) : (
                                    <ToggleLeft className="w-8 h-8 text-muted" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ConfigTab({ module }: { module: ModuleInfo }) {
    const [config, setConfig] = useState({
        defaultStatus: 'draft',
        itemsPerPage: 10,
        enableComments: true,
        enableRevisions: true,
    });

    return (
        <div className="space-y-6 max-w-lg">
            <h2 className="text-lg font-semibold">Module Configuration</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Default Content Status</label>
                    <select
                        value={config.defaultStatus}
                        onChange={(e) => setConfig({ ...config, defaultStatus: e.target.value })}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Items Per Page</label>
                    <input
                        type="number"
                        value={config.itemsPerPage}
                        onChange={(e) => setConfig({ ...config, itemsPerPage: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>

                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">Enable Comments</div>
                        <div className="text-xs text-muted">Allow comments on content</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.enableComments}
                        onChange={(e) => setConfig({ ...config, enableComments: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">Enable Revisions</div>
                        <div className="text-xs text-muted">Keep history of content changes</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.enableRevisions}
                        onChange={(e) => setConfig({ ...config, enableRevisions: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>
            </div>

            <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold">
                Save Configuration
            </button>
        </div>
    );
}

function ActivityTab({ activity }: { activity: ModuleActivity[] }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="space-y-3">
                {activity.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-dark rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                            <History className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{log.action}</div>
                            <div className="text-sm text-muted">{log.details}</div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                                <span>{getRelativeTime(log.timestamp)}</span>
                                <span>by {log.user}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChangelogTab({ module }: { module: ModuleInfo }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Changelog</h2>
            <div className="space-y-4">
                {module.changelog?.map((release) => (
                    <div key={release.version} className="p-4 bg-dark rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">v{release.version}</span>
                            <span className="text-xs text-muted">{release.date}</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-muted">
                            {release.changes.map((change, i) => (
                                <li key={i}>{change}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
