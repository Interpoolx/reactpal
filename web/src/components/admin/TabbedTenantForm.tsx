import React, { useState, useEffect } from 'react';
import { Globe, Building2, Settings, Users, Package, Check, AlertCircle, Clock, Sparkles, Gauge } from 'lucide-react';
import { apiFetch } from '../../lib/api';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain: string;
    status: 'active' | 'trial' | 'suspended' | 'archived';
    plan_name?: string;
    // Extended fields
    timezone?: string;
    language?: string;
    description?: string;
    // Limits
    max_users?: number;
    max_storage?: number;
    current_users?: number;
    storage_used?: number;
}

interface TabbedTenantFormProps {
    tenant: Tenant | null;
    onSave: (data: Partial<Tenant>) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

type TabKey = 'basic' | 'limits' | 'modules';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'basic', label: 'Basic Info', icon: <Building2 className="w-4 h-4" /> },
    { key: 'limits', label: 'Limits', icon: <Gauge className="w-4 h-4" /> },
    { key: 'modules', label: 'Modules', icon: <Package className="w-4 h-4" /> },
];

// Available modules for tenant assignment
const availableModules = [
    { id: 'cms', name: 'CMS', description: 'Content Management System', icon: '📝', isCore: true },
    { id: 'crm', name: 'CRM', description: 'Lead capture and forms', icon: '📧', isCore: false },
    { id: 'seo', name: 'SEO', description: 'Search Engine Optimization', icon: '🔍', isCore: false },
    { id: 'analytics', name: 'Analytics', description: 'Traffic and behavior tracking', icon: '📊', isCore: false },
];

export function TabbedTenantForm({ tenant, onSave, onCancel, isSaving = false }: TabbedTenantFormProps) {
    const [activeTab, setActiveTab] = useState<TabKey>('basic');

    // Form state - Basic Info
    const [name, setName] = useState(tenant?.name || '');
    const [slug, setSlug] = useState(tenant?.slug || '');
    const [domain, setDomain] = useState(tenant?.domain || '');
    const [status, setStatus] = useState<string>(tenant?.status || 'active');
    const [planName, setPlanName] = useState(tenant?.plan_name || 'free');
    const [timezone, setTimezone] = useState(tenant?.timezone || 'UTC');
    const [language, setLanguage] = useState(tenant?.language || 'en');
    const [description, setDescription] = useState(tenant?.description || '');

    // Form state - Limits
    const [maxUsers, setMaxUsers] = useState(tenant?.max_users || 5);
    const [maxStorage, setMaxStorage] = useState(tenant?.max_storage || 10);

    // Form state - Modules
    const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set(['cms']));

    // Validation
    const [slugError, setSlugError] = useState('');

    // Auto-generate slug from name for new tenants
    useEffect(() => {
        if (!tenant && name && !slug) {
            const autoSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setSlug(autoSlug);
        }
    }, [name, tenant, slug]);

    // Fetch tenant modules on load (for edit mode)
    useEffect(() => {
        if (tenant?.id) {
            apiFetch(`/api/v1/tenants/${tenant.id}/modules`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setEnabledModules(new Set(data.map((m: any) => m.module_id)));
                    }
                })
                .catch(console.error);
        }
    }, [tenant?.id]);

    const validateSlug = (value: string) => {
        if (!/^[a-z0-9-]*$/.test(value)) {
            setSlugError('Only lowercase letters, numbers, and hyphens allowed');
            return false;
        }
        setSlugError('');
        return true;
    };

    const handleSlugChange = (value: string) => {
        const normalizedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setSlug(normalizedValue);
        validateSlug(normalizedValue);
    };

    const toggleModule = (moduleId: string) => {
        const newSet = new Set(enabledModules);
        if (newSet.has(moduleId)) {
            newSet.delete(moduleId);
        } else {
            newSet.add(moduleId);
        }
        setEnabledModules(newSet);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateSlug(slug)) return;

        onSave({
            id: tenant?.id,
            name,
            slug,
            domain: domain || undefined,
            status: status as Tenant['status'],
            plan_name: planName,
            timezone,
            language,
            description,
            max_users: maxUsers,
            max_storage: maxStorage,
        });
    };

    // Usage calculations (mocked for display)
    const currentUsers = tenant?.current_users || 0;
    const storageUsed = tenant?.storage_used || 0;
    const userPercent = Math.min((currentUsers / maxUsers) * 100, 100);
    const storagePercent = Math.min((storageUsed / maxStorage) * 100, 100);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Tab Navigation */}
            <div className="flex border-b border-border-muted mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-muted hover:text-primary'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 space-y-5 overflow-y-auto">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                    <>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="My Company"
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Slug <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                                className={`w-full px-3 py-2.5 bg-dark border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary ${slugError ? 'border-red-500' : 'border-border-muted'
                                    }`}
                                placeholder="my-company"
                                required
                            />
                            {slugError && <p className="text-red-400 text-xs mt-1">{slugError}</p>}
                        </div>

                        {/* Domain */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Domain</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    placeholder="example.com"
                                />
                            </div>
                        </div>

                        {/* Status & Plan Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    <option value="active">Active</option>
                                    <option value="trial">Trial</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Plan</label>
                                <select
                                    value={planName}
                                    onChange={(e) => setPlanName(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    <option value="free">Free</option>
                                    <option value="starter">Starter</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                        </div>

                        {/* Timezone & Language */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Timezone</label>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">America/New York</option>
                                    <option value="America/Los_Angeles">America/Los Angeles</option>
                                    <option value="Europe/London">Europe/London</option>
                                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="hi">Hindi</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2.5 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none h-20"
                                placeholder="Internal notes about this tenant..."
                            />
                        </div>
                    </>
                )}

                {/* Limits Tab */}
                {activeTab === 'limits' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-dark/50 rounded-xl border border-border-muted">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Current Plan</span>
                                <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-sm font-medium capitalize">
                                    {planName}
                                </span>
                            </div>
                            <p className="text-xs text-muted">Upgrade plan to increase default limits</p>
                        </div>

                        {/* Max Users */}
                        <div className="p-4 bg-dark/30 rounded-xl border border-border-muted">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted" />
                                    <span className="font-medium">Users</span>
                                </div>
                                <span className="text-sm text-muted">{currentUsers} / {maxUsers}</span>
                            </div>
                            <div className="h-2 bg-dark rounded-full overflow-hidden mb-3">
                                <div
                                    className={`h-full transition-all ${userPercent > 80 ? 'bg-red-500' : 'bg-brand-primary'}`}
                                    style={{ width: `${userPercent}%` }}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-muted">Limit:</label>
                                <input
                                    type="number"
                                    value={maxUsers}
                                    onChange={(e) => setMaxUsers(parseInt(e.target.value) || 5)}
                                    min={1}
                                    max={1000}
                                    className="w-24 px-3 py-1.5 bg-dark border border-border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                                <span className="text-sm text-muted">users</span>
                            </div>
                        </div>

                        {/* Max Storage */}
                        <div className="p-4 bg-dark/30 rounded-xl border border-border-muted">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-muted" />
                                    <span className="font-medium">Storage</span>
                                </div>
                                <span className="text-sm text-muted">{storageUsed} / {maxStorage} GB</span>
                            </div>
                            <div className="h-2 bg-dark rounded-full overflow-hidden mb-3">
                                <div
                                    className={`h-full transition-all ${storagePercent > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                                    style={{ width: `${storagePercent}%` }}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm text-muted">Limit:</label>
                                <input
                                    type="number"
                                    value={maxStorage}
                                    onChange={(e) => setMaxStorage(parseInt(e.target.value) || 10)}
                                    min={1}
                                    max={10000}
                                    className="w-24 px-3 py-1.5 bg-dark border border-border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                                <span className="text-sm text-muted">GB</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modules Tab */}
                {activeTab === 'modules' && (
                    <div className="space-y-3">
                        <p className="text-sm text-muted mb-4">
                            Select which modules are enabled for this tenant
                        </p>
                        {availableModules.map(module => (
                            <div
                                key={module.id}
                                className={`p-4 rounded-xl border transition-colors cursor-pointer ${enabledModules.has(module.id)
                                        ? 'bg-brand-primary/10 border-brand-primary/30'
                                        : 'bg-dark/30 border-border-muted hover:border-border-muted/80'
                                    }`}
                                onClick={() => !module.isCore && toggleModule(module.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{module.icon}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{module.name}</span>
                                                {module.isCore && (
                                                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">Core</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted">{module.description}</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${enabledModules.has(module.id)
                                            ? 'bg-brand-primary border-brand-primary'
                                            : 'border-border-muted'
                                        }`}>
                                        {enabledModules.has(module.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 mt-4 border-t border-border-muted">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2.5 border border-border-muted rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving || !!slugError}
                    className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            {tenant ? 'Update' : 'Create'} Tenant
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
