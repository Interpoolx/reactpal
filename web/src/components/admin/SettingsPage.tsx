import React, { useState, useEffect } from 'react';
import {
    Settings, Palette, Plug, Bell, Key, Database, FileText, Contact,
    Search as SearchIcon, Users, Shield, ChevronRight,
    Info, User, Activity, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { RightDrawer } from './RightDrawer';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';
import { useToast } from '../ui/Toast';
import DatabaseSettings from './DatabaseSettings';

interface Tab {
    id: string;
    label: string;
    icon: any;
    category: 'core' | 'module';
    moduleId?: string;
}

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const { activeTenant } = useTenant();
    const [enabledModules, setEnabledModules] = useState<string[]>([]);
    const [settingsKey, setSettingsKey] = useState(0); // Force re-render on tenant change

    // Core tabs (always visible)
    const coreTabs: Tab[] = [
        { id: 'general', label: 'General', icon: Settings, category: 'core' },
        { id: 'appearance', label: 'Appearance', icon: Palette, category: 'core' },
        { id: 'integrations', label: 'Integrations', icon: Plug, category: 'core' },
        { id: 'notifications', label: 'Notifications', icon: Bell, category: 'core' },
        { id: 'api', label: 'API Keys', icon: Key, category: 'core' },
        { id: 'database', label: 'Database', icon: Database, category: 'core' },
    ];

    // Core module tabs (always visible - these are core infrastructure)
    const coreModuleTabs: Tab[] = [
        { id: 'auth', label: 'Authentication', icon: Shield, category: 'module', moduleId: 'auth' },
        { id: 'users', label: 'Users', icon: Users, category: 'module', moduleId: 'users' },
        { id: 'tenants', label: 'Tenants', icon: Settings, category: 'module', moduleId: 'tenants' },
    ];

    // Feature module tabs (shown based on enabled modules)
    const featureModuleTabs: Tab[] = [
        { id: 'cms', label: 'CMS', icon: FileText, category: 'module', moduleId: 'cms' },
        { id: 'crm', label: 'CRM', icon: Contact, category: 'module', moduleId: 'crm' },
        { id: 'seo', label: 'SEO', icon: SearchIcon, category: 'module', moduleId: 'seo' },
    ];

    // Combine all module tabs
    const moduleTabs = [...coreModuleTabs, ...featureModuleTabs];

    // Sync active tab with URL
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const url = new URL(window.location.href);
        url.searchParams.set('module', tabId);
        window.history.pushState({}, '', url.toString());
    };

    // Read tab from URL on load
    useEffect(() => {
        const url = new URL(window.location.href);
        const moduleParam = url.searchParams.get('module');
        if (moduleParam) {
            setActiveTab(moduleParam);
        }
    }, []);

    useEffect(() => {
        // Force refresh settings when tenant changes
        setSettingsKey(prev => prev + 1);
        // Don't reset to general - keep current tab
        loadEnabledModules();
    }, [activeTenant?.id]);

    const loadEnabledModules = async () => {
        try {
            const res = await apiFetch(`/api/v1/modules/status?tenantId=${activeTenant?.id || 'default'}`);
            if (res.ok) {
                const data = await res.json();
                const enabled = data.filter((m: any) => m.enabled).map((m: any) => m.module_id);
                setEnabledModules(enabled);
            } else {
                setEnabledModules([]);
            }
        } catch (error) {
            console.error('Failed to load modules:', error);
            setEnabledModules([]);
        }
    };

    // Core module tabs always visible (core infrastructure)
    // Feature module tabs only when enabled for this tenant
    const visibleFeatureModuleTabs = featureModuleTabs.filter(tab =>
        tab.moduleId && enabledModules.includes(tab.moduleId)
    );

    // All module tabs = core modules (always) + enabled feature modules
    const visibleModuleTabs = [...coreModuleTabs, ...visibleFeatureModuleTabs];

    const allTabs = [...coreTabs, ...visibleModuleTabs];

    return (
        <div className="p-6" key={settingsKey}>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted text-sm mt-1">
                    Configure settings for <span className="text-primary font-medium">{activeTenant?.name || 'Default Tenant'}</span>
                </p>
            </div>

            <div className="flex gap-6">
                {/* Vertical Tabs */}
                <div className="w-56 flex-shrink-0">
                    <nav className="space-y-1 bg-darker rounded-xl border border-border-muted p-2">
                        {/* Core Settings */}
                        <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
                            Core Settings
                        </div>
                        {coreTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-brand-primary/20 text-brand-primary'
                                    : 'text-muted hover:text-primary hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}

                        {/* Module Settings */}
                        {visibleModuleTabs.length > 0 && (
                            <>
                                <div className="px-3 py-2 mt-4 text-[10px] font-bold text-muted uppercase tracking-wider border-t border-border-muted pt-4">
                                    Module Settings
                                </div>
                                {visibleModuleTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-brand-primary/20 text-brand-primary'
                                            : 'text-muted hover:text-primary hover:bg-white/5'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        <ChevronRight className="w-3 h-3 ml-auto" />
                                    </button>
                                ))}
                            </>
                        )}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="flex-1 bg-darker rounded-xl border border-border-muted p-6">
                    {activeTab === 'general' && <GeneralSettings key={`general-${activeTenant?.id}`} />}
                    {activeTab === 'appearance' && <AppearanceSettings />}
                    {activeTab === 'integrations' && <IntegrationsSettings />}
                    {activeTab === 'notifications' && <NotificationsSettings />}
                    {activeTab === 'api' && <ApiSettings />}
                    {activeTab === 'database' && <DatabaseSettings />}
                    {/* Core Modules */}
                    {activeTab === 'auth' && <AuthSettings />}
                    {activeTab === 'users' && <UsersSettings />}
                    {activeTab === 'tenants' && <TenantsSettings />}
                    {/* Feature Modules */}
                    {activeTab === 'cms' && <CMSSettings />}
                    {activeTab === 'crm' && <CRMSettings />}
                    {activeTab === 'seo' && <SEOSettings />}
                </div>
            </div>
        </div>
    );
}

function GeneralSettings() {
    const { activeTenant } = useTenant();
    const [siteName, setSiteName] = useState(activeTenant?.name || '');
    const [siteUrl, setSiteUrl] = useState(activeTenant?.domain || '');
    const [tagline, setTagline] = useState('');
    const [timezone, setTimezone] = useState('UTC');

    useEffect(() => {
        // Load settings when tenant changes
        setSiteName(activeTenant?.name || '');
        setSiteUrl(activeTenant?.domain || '');
    }, [activeTenant]);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">General Settings</h2>
            <div className="grid gap-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Site Name</label>
                    <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Site URL</label>
                    <input
                        type="text"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tagline</label>
                    <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="A brief description of your site"
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Timezone</label>
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                    </select>
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors w-fit">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function AppearanceSettings() {
    const [theme, setTheme] = useState('dark');
    const [primaryColor, setPrimaryColor] = useState('#6366f1');

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Appearance</h2>
            <div className="grid gap-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Theme</label>
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Primary Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-border-muted cursor-pointer"
                        />
                        <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="flex-1 px-3 py-2 bg-dark border border-border-muted rounded-lg"
                        />
                    </div>
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors w-fit">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function UsersSettings() {
    // This component renders Users Admin UI settings from the auth module
    // Settings are defined in packages/modules-auth/src/settings/authSettings.ts
    return (
        <DynamicModuleSettings
            moduleId="users"
            title="Users Settings"
            description="Configure user management options"
        />
    );
}

// ============================================================================
// DYNAMIC SETTINGS RENDERER
// Fetches and renders settings from module definitions
// ============================================================================

interface SettingFieldDef {
    key: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'button' | 'action' | 'filterConfig';
    description?: string;
    defaultValue: any;
    options?: Array<{ label: string; value: any }>;
    group?: string;
    actionUrl?: string;
    actionMethod?: string;
    actionLabel?: string;
}

interface DynamicModuleSettingsProps {
    moduleId: string;
    title: string;
    description?: string;
    filterGroups?: string[]; // Only show settings from these groups
}

function DynamicModuleSettings({ moduleId, title, description, filterGroups }: DynamicModuleSettingsProps) {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [fields, setFields] = useState<SettingFieldDef[]>([]);
    const [modulePermissions, setModulePermissions] = useState<string[]>([]);
    const [newPermissionSlug, setNewPermissionSlug] = useState('');
    const [moduleConfig, setModuleConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { activeTenant } = useTenant();
    const [seedRefreshTrigger, setSeedRefreshTrigger] = useState(0);

    // Schema Drawer State
    const [showSchemaDrawer, setShowSchemaDrawer] = useState(false);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [schema, setSchema] = useState<any[]>([]);
    const [isLoadingSchema, setIsLoadingSchema] = useState(false);

    // Routes Tab State
    const [routesTab, setRoutesTab] = useState<'api' | 'admin' | 'frontend'>('api');

    const handleViewSchema = async (tableName: string) => {
        setSelectedTable(tableName);
        setShowSchemaDrawer(true);
        setIsLoadingSchema(true);
        setSchema([]); // Reset previous schema
        try {
            const response = await apiFetch(`/api/v1/schema/${tableName}`);
            if (response.ok) {
                const data = await response.json();
                setSchema(data.columns || []);
            }
        } catch (error) {
            console.error('Failed to fetch schema:', error);
        } finally {
            setIsLoadingSchema(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, [moduleId, activeTenant?.id]);

    // Helper to apply fallback fields
    const applyFallbackFields = () => {
        let fallbackFields: SettingFieldDef[] = [];

        if (moduleId === 'users') {
            fallbackFields = getUsersAdminUIFields();
        } else if (moduleId === 'tenants') {
            fallbackFields = getTenantsAdminUIFields();
        }

        if (fallbackFields.length > 0) {
            // Filter by groups if specified
            if (filterGroups && filterGroups.length > 0) {
                fallbackFields = fallbackFields.filter((f) =>
                    f.group && filterGroups.includes(f.group)
                );
            }
            setFields(fallbackFields);
            const initialValues: Record<string, any> = {};
            fallbackFields.forEach((field) => {
                initialValues[field.key] = field.defaultValue;
            });

            // Load any saved settings from localStorage
            const storageKey = `settings_${moduleId}_${activeTenant?.id || 'default'}`;
            const savedSettings = localStorage.getItem(storageKey);
            if (savedSettings) {
                try {
                    const parsed = JSON.parse(savedSettings);
                    Object.assign(initialValues, parsed);
                } catch { }
            }

            setSettings(initialValues);
        }
    };


    const loadSettings = async () => {
        setIsLoading(true);
        try {
            // Fetch module metadata to get associated tables
            try {
                const modRes = await apiFetch(`/api/v1/modules/${moduleId}`);
                if (modRes.ok) {
                    setModuleConfig(await modRes.json());
                }
            } catch (err) {
                console.error('Failed to load module config:', err);
            }

            // Get fallback fields first (these contain the latest field definitions)
            let fallbackFields: SettingFieldDef[] = [];
            if (moduleId === 'users') {
                fallbackFields = getUsersAdminUIFields();
            } else if (moduleId === 'tenants') {
                fallbackFields = getTenantsAdminUIFields();
            }

            // Fetch table schema if applicable to make columns dynamic
            if (moduleId === 'users' || moduleId === 'tenants') {
                try {
                    const schemaRes = await apiFetch(`/api/v1/schema/${moduleId}`);
                    if (schemaRes.ok) {
                        const schemaData = await schemaRes.json();
                        const columns = schemaData.columns;
                        const columnGroupName = 'Display Columns';

                        // Create dynamic fields from columns
                        const dynamicColumnFields: SettingFieldDef[] = columns.map((col: any) => {
                            // Convert snake_case to PascalCase for the key suffix
                            const pascalName = col.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                            // Convert snake_case to Start Case for the label
                            const label = col.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                            return {
                                key: `${moduleId}.ui.columns.show${pascalName}`,
                                label: label,
                                type: 'boolean' as const,
                                defaultValue: true,
                                group: columnGroupName
                            };
                        });

                        // Replace hardcoded column fields with dynamic ones
                        fallbackFields = [
                            ...fallbackFields.filter(f => !f.group?.includes('Columns')),
                            ...dynamicColumnFields
                        ];
                    }
                } catch (err) {
                    console.error('Failed to fetch schema for dynamic columns:', err);
                }
            }

            // Filter fallback by groups if specified
            if (filterGroups && filterGroups.length > 0) {
                fallbackFields = fallbackFields.filter((f) =>
                    f.group && filterGroups.includes(f.group)
                );
            }

            // Set fields from fallback (this ensures all groups including Filters appear)
            setFields(fallbackFields);

            // Initialize values from fallback defaults
            const initialValues: Record<string, any> = {};
            fallbackFields.forEach((field) => {
                initialValues[field.key] = field.defaultValue;
            });

            // Load saved settings from database via API
            try {
                const res = await apiFetch(`/api/v1/settings/sections/${moduleId}?tenantId=${activeTenant?.id || 'default'}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.values) {
                        Object.keys(data.values).forEach(key => {
                            if (data.values[key] !== undefined) {
                                initialValues[key] = data.values[key];
                            }
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to load settings from API:', err);
            }

            setSettings(initialValues);

            // Fetch available permissions for this module
            setModulePermissions([]);
            try {
                const permRes = await apiFetch('/api/v1/permissions');
                if (permRes.ok) {
                    const allPerms = await permRes.json();
                    const modulePerms = allPerms.find((m: any) => m.moduleId === moduleId);
                    if (modulePerms) {
                        setModulePermissions(modulePerms.permissions);
                    }
                }
            } catch (err) {
                console.error('Failed to load permissions:', err);
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
            applyFallbackFields();
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPermission = async () => {
        if (!newPermissionSlug) return;
        setIsSaving(true);
        try {
            const res = await apiFetch('/api/v1/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moduleId,
                    slug: newPermissionSlug,
                })
            });

            if (res.ok) {
                showToast('Permission added successfully', 'success');
                setNewPermissionSlug('');
                loadSettings(); // Reload to show new permission
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to add permission', 'error');
            }
        } catch (err) {
            showToast('Network error', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeletePermission = async (permSlug: string) => {
        if (!confirm(`Are you sure you want to delete the permission "${permSlug}"?`)) return;
        setIsSaving(true);
        try {
            // permSlug might be module.slug or just slug
            const slugOnly = permSlug.includes('.') ? permSlug.split('.')[1] : permSlug;
            const res = await apiFetch(`/api/v1/permissions/${moduleId}/${slugOnly}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                showToast('Permission deleted (if it was a custom one)', 'success');
                loadSettings();
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to delete permission', 'error');
            }
        } catch (err) {
            showToast('Network error', 'error');
        } finally {
            setIsSaving(false);
        }
    };


    const handleChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleAction = async (field: SettingFieldDef) => {
        if (!field.actionUrl) return;

        setIsSaving(true);
        try {
            const res = await apiFetch(field.actionUrl, {
                method: field.actionMethod || 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId: activeTenant?.id || 'default' })
            });

            if (res.ok) {
                const result = await res.json();
                showToast(result.message || result.error ? (result.error || 'Action failed') : 'Action completed successfully', result.error ? 'error' : 'success');
                if (field.key === 'users.seedData.generate') {
                    showToast(`Seeded ${result.seeded} users!`, 'success');
                }
            } else {
                showToast('Action failed', 'error');
            }
        } catch (err) {
            showToast('Failed to trigger action', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const { showToast } = useToast();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to database via API
            const res = await apiFetch(`/api/v1/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: activeTenant?.id || 'default',
                    moduleId,
                    settings,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to save settings');
            }

            showToast('Settings saved successfully!', 'success');
        } catch (err: any) {
            console.error('Failed to save settings:', err);
            showToast(err.message || 'Failed to save settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Group fields by group property
    const groupedFields = fields.reduce((acc: Record<string, SettingFieldDef[]>, field: SettingFieldDef) => {
        const group = field.group || 'General';
        if (!acc[group]) acc[group] = [];
        acc[group].push(field);
        return acc;
    }, {} as Record<string, SettingFieldDef[]>);

    // Add Permissions group if available
    if (modulePermissions.length > 0 && (!filterGroups || filterGroups.includes('Permissions'))) {
        groupedFields['Permissions'] = [];
    }

    // Add Tables group if available in module config
    if (moduleConfig?.tables && moduleConfig.tables.length > 0 && (!filterGroups || filterGroups.includes('Tables'))) {
        groupedFields['Tables'] = [];
    }

    // Add Routes group if available in module config
    if (moduleConfig?.apiRoutes && moduleConfig.apiRoutes.length > 0 && (!filterGroups || filterGroups.includes('Routes'))) {
        groupedFields['Routes'] = [];
    }

    // Ensure standard tabs exist for core modules
    if (['auth', 'users', 'tenants'].includes(moduleId)) {
        if (!groupedFields['General']) groupedFields['General'] = [];
        if (!groupedFields['Admin UI']) groupedFields['Admin UI'] = [];
        if (!groupedFields['Frontend UI']) groupedFields['Frontend UI'] = [];
    }

    const predefinedOrder = ['General', 'Admin UI', 'Frontend UI', 'Permissions', 'Tables', 'Routes'];
    const groupNames = Object.keys(groupedFields).sort((a, b) => {
        const indexA = predefinedOrder.indexOf(a);
        const indexB = predefinedOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });
    const [activeGroup, setActiveGroup] = useState(groupNames[0] || '');

    // Update active group when fields load
    useEffect(() => {
        if (groupNames.length > 0 && !groupNames.includes(activeGroup)) {
            setActiveGroup(groupNames[0]);
        }
    }, [groupNames.join(',')]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-6 bg-white/5 rounded w-32 animate-pulse" />
                <div className="h-10 bg-white/5 rounded animate-pulse" />
                <div className="h-10 bg-white/5 rounded animate-pulse" />
                <div className="h-10 bg-white/5 rounded animate-pulse" />
            </div>
        );
    }

    const activeFields = groupedFields[activeGroup] || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && <p className="text-sm text-muted">{description}</p>}
            </div>

            {/* Tab Navigation */}
            {groupNames.length > 1 && (
                <div className="flex flex-wrap gap-2 pb-4 border-b border-border-muted">
                    {groupNames.map((groupName) => (
                        <button
                            key={groupName}
                            onClick={() => setActiveGroup(groupName)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeGroup === groupName
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-primary'
                                }`}
                        >
                            {groupName}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeGroup === groupName
                                ? 'bg-white/20'
                                : 'bg-white/10'
                                }`}>
                                {groupName === 'Permissions' ? modulePermissions.length : (
                                    groupName === 'Tables' ? moduleConfig?.tables?.length : (
                                        groupName === 'Routes' ? moduleConfig?.apiRoutes?.length : (
                                            // Smarter count for Filters
                                            groupName.includes('Filters') && groupedFields[groupName].some((f: any) => f.type === 'filterConfig')
                                                ? Object.values(settings[groupedFields[groupName].find((f: any) => f.type === 'filterConfig')?.key || ''] || {})
                                                    .filter((cfg: any) => cfg.enabled).length
                                                : groupedFields[groupName].length
                                        )
                                    )
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Active Tab Content */}
            <div className="space-y-4">
                {/* Special compact UI for Table Columns only (Filters now use filterConfig) */}
                {(activeGroup.includes('Table Columns') || activeGroup.includes('Columns')) && !activeGroup.includes('Filters') ? (
                    <div className="bg-dark rounded-xl border border-border-muted p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium">
                                Select columns to display in the table:
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {activeFields.map((field) => (
                                <label
                                    key={field.key}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${settings[field.key]
                                        ? 'bg-brand-primary/10 border-brand-primary/30'
                                        : 'bg-white/5 border-border-muted hover:bg-white/10'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={settings[field.key] ?? field.defaultValue}
                                        onChange={(e) => handleChange(field.key, e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-600 bg-dark text-brand-primary"
                                    />
                                    <span className={`text-sm font-medium ${settings[field.key] ? 'text-primary' : 'text-muted'}`}>
                                        {field.label.replace('Show ', '').replace(' Column', '')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : activeGroup === 'Permissions' ? (
                    <div className="bg-dark rounded-xl border border-border-muted p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-border-muted">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold">Permissions Management</h3>
                                    <p className="text-xs text-muted">Manage available permissions for the {moduleId} module.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={loadSettings}
                                    disabled={isLoading}
                                    title="Refresh permissions list"
                                    className="p-1.5 text-muted hover:text-primary transition-colors mr-2"
                                >
                                    <Shield className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="permission.slug"
                                    value={newPermissionSlug}
                                    onChange={(e) => setNewPermissionSlug(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                                    className="px-3 py-1.5 bg-darker border border-border-muted rounded-lg text-xs w-48 focus:border-brand-primary outline-none"
                                />
                                <button
                                    onClick={handleAddPermission}
                                    disabled={isSaving || !newPermissionSlug}
                                    className="px-4 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/90 disabled:opacity-50 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {modulePermissions.map((permission) => (
                                <div key={permission} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-border-muted group hover:border-brand-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary/50 group-hover:bg-brand-primary transition-colors" />
                                        <span className="text-sm font-mono text-muted group-hover:text-primary transition-colors">{permission}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePermission(permission)}
                                        className="p-1.5 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete custom permission"
                                    >
                                        <Shield className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeGroup === 'Routes' ? (
                    <div className="bg-dark rounded-xl border border-border-muted p-6 transition-all animate-in fade-in duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                                <Plug className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">Module Routes</h3>
                                <p className="text-xs text-muted">Web and API endpoints provided by the {moduleId} module.</p>
                            </div>
                        </div>

                        {/* Sub-tabs for Routes */}
                        <div className="flex gap-2 mb-6">
                            {['api', 'admin', 'frontend'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setRoutesTab(type as any)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${routesTab === type
                                        ? 'bg-white/10 text-white'
                                        : 'text-muted hover:text-primary hover:bg-white/5'
                                        }`}
                                >
                                    {type.toUpperCase()}
                                    <span className="ml-2 opacity-50">
                                        {type === 'api' ? moduleConfig?.apiRoutes?.length || 0 :
                                            type === 'admin' ? moduleConfig?.adminRoutes?.length || 0 :
                                                moduleConfig?.frontendRoutes?.length || 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="grid gap-3">
                            {routesTab === 'api' && (
                                <>
                                    {moduleConfig?.apiRoutes?.length > 0 ? (
                                        moduleConfig.apiRoutes.map((route: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border-muted group hover:border-green-500/30 hover:bg-white/[0.07] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`
                                                    px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider min-w-[50px] text-center border
                                                    ${route.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                                    ${route.method === 'POST' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                                    ${route.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                    ${route.method === 'DELETE' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                                                `}>
                                                        {route.method}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-mono text-primary/90 group-hover:text-primary transition-colors">{route.path}</span>
                                                        <span className="text-xs text-muted">{route.description}</span>
                                                    </div>
                                                </div>
                                                {route.requiredPermission && (
                                                    <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[10px] text-muted border border-white/5">
                                                        <Key className="w-3 h-3 opacity-70" />
                                                        <span className="font-mono">{route.requiredPermission}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted border border-dashed border-border-muted rounded-xl">
                                            No API routes defined for this module.
                                        </div>
                                    )}
                                </>
                            )}

                            {routesTab === 'admin' && (
                                <>
                                    {moduleConfig?.adminRoutes?.length > 0 ? (
                                        moduleConfig.adminRoutes.map((route: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border-muted group hover:border-purple-500/30 hover:bg-white/[0.07] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider min-w-[50px] text-center border bg-purple-500/10 text-purple-400 border-purple-500/20">
                                                        PAGE
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-mono text-primary/90 group-hover:text-primary transition-colors">{route.path}</span>
                                                        <span className="text-xs text-muted">Component: {route.component}</span>
                                                    </div>
                                                </div>
                                                {route.requiredPermission && (
                                                    <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[10px] text-muted border border-white/5">
                                                        <Key className="w-3 h-3 opacity-70" />
                                                        <span className="font-mono">{route.requiredPermission}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted border border-dashed border-border-muted rounded-xl">
                                            No admin routes defined for this module.
                                        </div>
                                    )}
                                </>
                            )}

                            {routesTab === 'frontend' && (
                                <>
                                    {moduleConfig?.frontendRoutes?.length > 0 ? (
                                        moduleConfig.frontendRoutes.map((route: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border-muted group hover:border-orange-500/30 hover:bg-white/[0.07] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider min-w-[50px] text-center border bg-orange-500/10 text-orange-400 border-orange-500/20">
                                                        APP
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-mono text-primary/90 group-hover:text-primary transition-colors">{route.path}</span>
                                                        <span className="text-xs text-muted">Component: {route.component}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted border border-dashed border-border-muted rounded-xl">
                                            No frontend routes found.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : activeGroup === 'Tables' ? (
                    <div className="bg-dark rounded-xl border border-border-muted p-6 transition-all animate-in fade-in duration-300">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-muted/50">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                <Database className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">Associated Database Tables</h3>
                                <p className="text-xs text-muted">Core database resources managed by the {moduleId} module.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {moduleConfig?.tables?.map((table: string) => (
                                <div key={table} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border-muted group hover:border-blue-500/30 hover:bg-white/[0.07] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
                                            <Database className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary/80 group-hover:text-primary transition-colors">{table}</span>
                                            <span className="text-[10px] text-muted font-mono uppercase tracking-widest opacity-60">SQLite Table</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewSchema(table)}
                                        className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity border border-blue-500/20 hover:bg-blue-500/20"
                                    >
                                        View Schema
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-300/70 leading-relaxed">
                                <p className="font-semibold text-blue-300 mb-1 tracking-tight">Technical Reference</p>
                                These tables are defined in the module's migration files. Future database designs will ideally use
                                <span className="font-mono text-blue-300 mx-1 bg-blue-400/10 px-1 rounded">rp_{moduleId}_</span>
                                as a prefix for improved namespace separation.
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Regular field rendering for other groups */
                    activeFields.length > 0 ? (
                        <div className="grid gap-4 max-w-2xl">
                            {activeFields.map((field) => (
                                <SettingFieldRenderer
                                    key={field.key}
                                    field={field}
                                    value={settings[field.key]}
                                    onChange={(value) => handleChange(field.key, value)}
                                    onAction={async () => {
                                        await handleAction(field);
                                        // If seeding, trigger status refresh
                                        if (field.key === 'users.seedData.generate') {
                                            setSeedRefreshTrigger(prev => prev + 1);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted border border-dashed border-border-muted rounded-xl bg-white/5">
                            <p>No specific {activeGroup.toLowerCase()} settings found.</p>
                        </div>
                    )
                )
                }
                {activeGroup === 'Seed Data' && <SeedDataPreview refreshTrigger={seedRefreshTrigger} />}
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-border-muted">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-brand-primary/25"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Schema Drawer */}
            <RightDrawer
                isOpen={showSchemaDrawer}
                onClose={() => setShowSchemaDrawer(false)}
                title={`Schema: ${selectedTable}`}
            >
                <div>
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-bold">{selectedTable}</h3>
                        </div>
                        <p className="text-sm text-muted">Field definition and types for this table.</p>
                    </div>

                    {isLoadingSchema ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="border border-border-muted rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/5 text-muted font-medium">
                                    <tr>
                                        <th className="p-3 border-b border-border-muted">Column</th>
                                        <th className="p-3 border-b border-border-muted">Type</th>
                                        <th className="p-3 border-b border-border-muted">Attributes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-muted">
                                    {schema.map((col: any) => (
                                        <tr key={col.name} className="hover:bg-white/5">
                                            <td className="p-3 font-mono text-primary font-medium">{col.name}</td>
                                            <td className="p-3 text-blue-300 font-mono text-xs">{col.type}</td>
                                            <td className="p-3">
                                                <div className="flex gap-2 flex-wrap">
                                                    {col.pk && (
                                                        <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-bold border border-yellow-500/20" title="Primary Key">PK</span>
                                                    )}
                                                    {col.notnull && (
                                                        <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-bold border border-red-500/20" title="Required (Not Null)">REQ</span>
                                                    )}
                                                    {col.defaultValue !== null && (
                                                        <span className="px-1.5 py-0.5 bg-white/5 text-muted rounded text-[10px] border border-white/10" title={`Default: ${col.defaultValue}`}>
                                                            DEF
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {schema.length === 0 && !isLoadingSchema && (
                                <div className="p-8 text-center text-muted">
                                    No columns found or access denied.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </RightDrawer >
        </div >
    );
}

function SettingFieldRenderer({
    field,
    value,
    onChange,
    onAction
}: {
    field: SettingFieldDef;
    value: any;
    onChange: (value: any) => void;
    onAction?: () => void;
}) {
    switch (field.type) {
        case 'button':
        case 'action':
            return (
                <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted shadow-sm group hover:border-brand-primary/30 transition-colors">
                    <div className="flex-1 pr-4">
                        <div className="font-medium text-sm text-primary">{field.label}</div>
                        {field.description && <div className="text-xs text-muted mt-1 leading-relaxed">{field.description}</div>}
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); onAction?.(); }}
                        className="px-4 py-2 bg-white/5 border border-border-muted hover:bg-brand-primary hover:border-brand-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                    >
                        {field.actionLabel || 'Execute'}
                    </button>
                </div>
            );
        case 'boolean':
            return (
                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">{field.label}</div>
                        {field.description && <div className="text-xs text-muted">{field.description}</div>}
                    </div>
                    <input
                        type="checkbox"
                        checked={value ?? field.defaultValue}
                        onChange={(e) => onChange(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>
            );

        case 'select':
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <select
                        value={value ?? field.defaultValue}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    >
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {field.description && <p className="text-xs text-muted mt-1">{field.description}</p>}
                </div>
            );

        case 'number':
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <input
                        type="number"
                        value={value ?? field.defaultValue}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                    {field.description && <p className="text-xs text-muted mt-1">{field.description}</p>}
                </div>
            );

        case 'textarea':
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <textarea
                        value={value ?? field.defaultValue}
                        onChange={(e) => onChange(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg resize-none"
                    />
                    {field.description && <p className="text-xs text-muted mt-1">{field.description}</p>}
                </div>
            );

        case 'color':
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={value ?? field.defaultValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-10 h-10 rounded-lg border border-border-muted cursor-pointer"
                        />
                        <input
                            type="text"
                            value={value ?? field.defaultValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="flex-1 px-3 py-2 bg-dark border border-border-muted rounded-lg"
                        />
                    </div>
                    {field.description && <p className="text-xs text-muted mt-1">{field.description}</p>}
                </div>
            );
        case 'filterConfig':
            // Render a comprehensive filter configuration editor
            const filterConfig = value ?? field.defaultValue ?? {};
            return (
                <div className="space-y-4">
                    {Object.entries(filterConfig).map(([columnKey, config]: [string, any]) => {
                        const [isExpanded, setIsExpanded] = React.useState(false);
                        const columnConfig = config as {
                            enabled: boolean;
                            type: string;
                            label: string;
                            options?: string | any[];
                            sortOptions?: string[];
                            defaultSort?: string;
                        };

                        return (
                            <div
                                key={columnKey}
                                className={`border rounded-lg transition-all ${columnConfig.enabled
                                    ? 'border-brand-primary bg-brand-primary/5'
                                    : 'border-border-muted bg-dark'
                                    }`}
                            >
                                {/* Header - Always visible */}
                                <div
                                    className="flex items-center justify-between p-3 cursor-pointer"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={columnConfig.enabled}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                const newConfig = { ...filterConfig };
                                                newConfig[columnKey] = { ...columnConfig, enabled: e.target.checked };
                                                onChange(newConfig);
                                            }}
                                            className="w-4 h-4 rounded border-border-muted"
                                        />
                                        <span className={`font-medium ${columnConfig.enabled ? 'text-white' : 'text-muted'}`}>
                                            {columnConfig.label}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${columnConfig.type === 'select' ? 'bg-blue-500/20 text-blue-400' :
                                            columnConfig.type === 'date-range' ? 'bg-purple-500/20 text-purple-400' :
                                                columnConfig.type === 'multi-select' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {columnConfig.type}
                                        </span>
                                    </div>
                                    <button
                                        className="text-muted hover:text-white transition-colors p-1"
                                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                                    >
                                        ⚙️
                                    </button>
                                </div>

                                {/* Expanded settings */}
                                {isExpanded && columnConfig.enabled && (
                                    <div className="border-t border-border-muted p-3 space-y-3">
                                        {/* Filter Type */}
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm text-muted min-w-24">Filter Type:</label>
                                            <select
                                                value={columnConfig.type}
                                                onChange={(e) => {
                                                    const newConfig = { ...filterConfig };
                                                    newConfig[columnKey] = { ...columnConfig, type: e.target.value };
                                                    onChange(newConfig);
                                                }}
                                                className="px-2 py-1 bg-dark border border-border-muted rounded text-sm"
                                            >
                                                <option value="text">Text Search</option>
                                                <option value="select">Dropdown</option>
                                                <option value="multi-select">Multi-Select</option>
                                                <option value="date-range">Date Range</option>
                                                <option value="number-range">Number Range</option>
                                            </select>
                                        </div>

                                        {/* Options source for select types */}
                                        {(columnConfig.type === 'select' || columnConfig.type === 'multi-select') && (
                                            <div className="flex items-center gap-3">
                                                <label className="text-sm text-muted min-w-24">Options:</label>
                                                <select
                                                    value={columnConfig.options === 'auto' ? 'auto' : 'custom'}
                                                    onChange={(e) => {
                                                        const newConfig = { ...filterConfig };
                                                        newConfig[columnKey] = {
                                                            ...columnConfig,
                                                            options: e.target.value === 'auto' ? 'auto' : []
                                                        };
                                                        onChange(newConfig);
                                                    }}
                                                    className="px-2 py-1 bg-dark border border-border-muted rounded text-sm"
                                                >
                                                    <option value="auto">Auto-load from data</option>
                                                    <option value="custom">Custom options</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Sort Options */}
                                        {columnConfig.sortOptions && columnConfig.sortOptions.length > 0 && (
                                            <div className="flex items-start gap-3">
                                                <label className="text-sm text-muted min-w-24 pt-1">Sort:</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {columnConfig.sortOptions.map((opt: string) => (
                                                        <span
                                                            key={opt}
                                                            className={`px-2 py-1 text-xs rounded cursor-pointer transition-colors ${columnConfig.defaultSort === opt
                                                                ? 'bg-brand-primary text-white'
                                                                : 'bg-dark border border-border-muted hover:border-brand-primary'
                                                                }`}
                                                            onClick={() => {
                                                                const newConfig = { ...filterConfig };
                                                                newConfig[columnKey] = { ...columnConfig, defaultSort: opt };
                                                                onChange(newConfig);
                                                            }}
                                                        >
                                                            {opt === 'a-z' ? 'A → Z' :
                                                                opt === 'z-a' ? 'Z → A' :
                                                                    opt === 'newest' ? 'Newest' :
                                                                        opt === 'oldest' ? 'Oldest' : opt}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );

        default: // text
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <input
                        type="text"
                        value={value ?? field.defaultValue}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                    {field.description && <p className="text-xs text-muted mt-1">{field.description}</p>}
                </div>
            );
    }
}

// Fallback fields for Users Admin UI when API not available
function getUsersAdminUIFields(): SettingFieldDef[] {
    return [
        { key: 'users.ui.showStatsCards', label: 'Show Stats Cards', type: 'boolean', description: 'Display summary stats above the table', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.showSearch', label: 'Enable Search', type: 'boolean', description: 'Show search input for filtering users', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.showExport', label: 'Enable Export', type: 'boolean', description: 'Allow exporting user data', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.showImport', label: 'Enable Import', type: 'boolean', description: 'Allow bulk user import', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.showBulkActions', label: 'Enable Bulk Actions', type: 'boolean', description: 'Allow bulk role change, suspend, delete', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.allowInvite', label: 'Allow User Invites', type: 'boolean', description: 'Enable invite user workflow', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.showPagination', label: 'Show Pagination', type: 'boolean', description: 'Show pagination controls', defaultValue: true, group: 'Admin UI' },
        { key: 'users.ui.columns.showId', label: 'ID', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'users.ui.columns.showUsername', label: 'Username', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showEmail', label: 'Email', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showFullName', label: 'Full Name', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showRole', label: 'Role', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showStatus', label: 'Status', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showLastLogin', label: 'Last Login', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showCreatedAt', label: 'Created', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'users.ui.columns.showUpdatedAt', label: 'Updated', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'users.ui.columns.showCreatedBy', label: 'Created By', type: 'boolean', defaultValue: false, group: 'Display Columns' },

        // Filter Configuration - JSON structure for dynamic filter settings
        {
            key: 'users.ui.filterConfig',
            label: 'Filter Configuration',
            type: 'filterConfig',
            description: 'Configure which columns appear as filters and how they behave',
            group: 'Users Filters',
            defaultValue: {
                username: { enabled: false, type: 'text', label: 'Username', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                email: { enabled: false, type: 'text', label: 'Email', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                fullName: { enabled: false, type: 'text', label: 'Full Name', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                role: { enabled: true, type: 'select', label: 'Role', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                status: { enabled: true, type: 'select', label: 'Status', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                createdAt: { enabled: false, type: 'date-range', label: 'Created Date', sortOptions: ['newest', 'oldest'], defaultSort: 'newest' },
                lastLogin: { enabled: false, type: 'date-range', label: 'Last Login', sortOptions: ['newest', 'oldest'], defaultSort: 'newest' },
                createdBy: { enabled: false, type: 'text', label: 'Created By', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' }
            }
        },

        // Seed Data Fallback
        {
            key: 'users.seedData.generate',
            label: 'Generate Default Users',
            type: 'button',
            description: 'Automatically creates a standard set of users (Admin, Manager, Editor, Viewer, User) for every existing tenant.',
            defaultValue: null,
            group: 'Seed Data',
            actionUrl: '/api/v1/users/seed',
            actionMethod: 'POST',
            actionLabel: 'Generate Now',
        },
    ];
}

// Fallback fields for Tenants when API not available
function getTenantsAdminUIFields(): SettingFieldDef[] {
    return [
        // Admin UI
        { key: 'tenants.ui.showStatsCards', label: 'Show Stats Cards', type: 'boolean', description: 'Display summary stats (Total, Active, Trial, Plans) above the table', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.showSearch', label: 'Enable Search', type: 'boolean', description: 'Show search input for filtering tenants', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.showExportCSV', label: 'Enable CSV Export', type: 'boolean', description: 'Allow exporting tenant data to CSV', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.showBulkImport', label: 'Enable Bulk Import', type: 'boolean', description: 'Allow bulk tenant creation via import', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.showQuickActions', label: 'Enable Quick Actions', type: 'boolean', description: 'Show quick actions dropdown (Edit, Clone, Suspend, etc.)', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.allowClone', label: 'Allow Tenant Cloning', type: 'boolean', description: 'Allow cloning tenants from the list view', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.allowStatusChange', label: 'Allow Status Changes', type: 'boolean', description: 'Allow changing tenant status (Suspend, Activate, Archive)', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.showPagination', label: 'Show Pagination', type: 'boolean', description: 'Show pagination controls with page size selector', defaultValue: true, group: 'Admin UI' },
        { key: 'tenants.ui.defaultPageSize', label: 'Default Page Size', type: 'select', description: 'Number of tenants per page', defaultValue: '10', options: [{ label: '10', value: '10' }, { label: '25', value: '25' }, { label: '50', value: '50' }, { label: '100', value: '100' }], group: 'Admin UI' },

        // Table Columns - ALL columns from tenants schema
        // Basic Info
        { key: 'tenants.ui.columns.showId', label: 'ID', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showName', label: 'Name', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showSlug', label: 'Slug', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showDomain', label: 'Domain', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showStatus', label: 'Status', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        // Lifecycle
        { key: 'tenants.ui.columns.showTrialEndsAt', label: 'Trial Ends', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showSuspendedAt', label: 'Suspended At', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showSuspendedReason', label: 'Suspended Reason', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        // Ownership
        { key: 'tenants.ui.columns.showOwnerId', label: 'Owner ID', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showOwnerEmail', label: 'Owner Email', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showBillingEmail', label: 'Billing Email', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        // Subscription
        { key: 'tenants.ui.columns.showPlanId', label: 'Plan ID', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showPlanName', label: 'Plan', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showBillingStatus', label: 'Billing Status', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showNextBillingDate', label: 'Next Billing', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showMrr', label: 'MRR', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        // Resource Limits
        { key: 'tenants.ui.columns.showMaxUsers', label: 'Max Users', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showMaxStorage', label: 'Max Storage', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showMaxApiCalls', label: 'Max API Calls', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        // Real-time Usage
        { key: 'tenants.ui.columns.showCurrentUsers', label: 'Current Users', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showStorageUsed', label: 'Storage Used', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showApiCallsThisMonth', label: 'API Calls (Month)', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        // Metadata
        { key: 'tenants.ui.columns.showIndustry', label: 'Industry', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showCompanySize', label: 'Company Size', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showNotes', label: 'Notes', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showTags', label: 'Tags', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        // Audit
        { key: 'tenants.ui.columns.showLastActivityAt', label: 'Last Activity', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showCreatedAt', label: 'Created', type: 'boolean', defaultValue: true, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showUpdatedAt', label: 'Updated', type: 'boolean', defaultValue: false, group: 'Display Columns' },
        { key: 'tenants.ui.columns.showCreatedBy', label: 'Created By', type: 'boolean', defaultValue: false, group: 'Display Columns' },

        // Defaults
        { key: 'tenants.defaultPlan', label: 'Default Plan', type: 'select', description: 'Plan assigned to new tenants', defaultValue: 'free', options: [{ label: 'Free', value: 'free' }, { label: 'Starter', value: 'starter' }, { label: 'Professional', value: 'professional' }, { label: 'Enterprise', value: 'enterprise' }], group: 'Defaults' },
        { key: 'tenants.trialDays', label: 'Trial Period (Days)', type: 'number', description: 'Number of days for trial period', defaultValue: 14, group: 'Defaults' },
        // Limits
        { key: 'tenants.defaultMaxUsers', label: 'Default Max Users', type: 'number', description: 'Default user limit for new tenants', defaultValue: 5, group: 'Limits' },
        { key: 'tenants.defaultMaxStorage', label: 'Default Max Storage (GB)', type: 'number', description: 'Default storage limit for new tenants', defaultValue: 1, group: 'Limits' },
        { key: 'tenants.defaultMaxApiCalls', label: 'Default API Call Limit', type: 'number', description: 'Default monthly API call limit', defaultValue: 1000, group: 'Limits' },
        // Domains
        { key: 'tenants.allowCustomDomains', label: 'Allow Custom Domains', type: 'boolean', description: 'Tenants can use their own domains', defaultValue: true, group: 'Domains' },
        { key: 'tenants.requireDomainVerification', label: 'Require Domain Verification', type: 'boolean', description: 'Custom domains must be verified via DNS', defaultValue: true, group: 'Domains' },
        // Provisioning
        { key: 'tenants.autoProvisionModules', label: 'Auto-Provision Modules', type: 'text', description: 'Comma-separated list of modules to enable for new tenants', defaultValue: 'cms,seo', group: 'Provisioning' },

        // Filter Configuration - JSON structure for dynamic filter settings
        {
            key: 'tenants.ui.filterConfig',
            label: 'Filter Configuration',
            type: 'filterConfig',
            description: 'Configure which columns appear as filters and how they behave',
            group: 'Filters',
            defaultValue: {
                name: { enabled: false, type: 'text', label: 'Name', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                slug: { enabled: false, type: 'text', label: 'Slug', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                domain: { enabled: false, type: 'text', label: 'Domain', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                status: { enabled: true, type: 'select', label: 'Status', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                planName: { enabled: true, type: 'select', label: 'Plan', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                ownerEmail: { enabled: false, type: 'text', label: 'Owner', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                industry: { enabled: false, type: 'select', label: 'Industry', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                companySize: { enabled: false, type: 'select', label: 'Company Size', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                billingStatus: { enabled: false, type: 'select', label: 'Billing Status', options: 'auto', sortOptions: ['a-z', 'z-a'], defaultSort: 'a-z' },
                createdAt: { enabled: false, type: 'date-range', label: 'Created Date', sortOptions: ['newest', 'oldest'], defaultSort: 'newest' },
                trialEndsAt: { enabled: false, type: 'date-range', label: 'Trial End Date', sortOptions: ['newest', 'oldest'], defaultSort: 'newest' },
                tags: { enabled: false, type: 'multi-select', label: 'Tags', options: 'auto' }
            }
        },
    ];
}


function SecuritySettings() {
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [lockoutDuration, setLockoutDuration] = useState(15);
    const [sessionTimeout, setSessionTimeout] = useState(30);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Security Settings</h2>
            <div className="grid gap-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Max Login Attempts</label>
                    <input
                        type="number"
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Account Lockout Duration (minutes)</label>
                    <input
                        type="number"
                        value={lockoutDuration}
                        onChange={(e) => setLockoutDuration(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Session Timeout (days)</label>
                    <input
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold w-fit">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function IntegrationsSettings() {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Integrations</h2>
            <div className="grid gap-4">
                {[
                    { name: 'Cloudflare', status: 'Connected', color: 'green' },
                    { name: 'Google Analytics', status: 'Not Connected', color: 'gray' },
                    { name: 'Stripe', status: 'Not Connected', color: 'gray' },
                ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted">
                        <div>
                            <div className="font-medium">{integration.name}</div>
                            <div className={`text-xs ${integration.color === 'green' ? 'text-green-400' : 'text-muted'}`}>
                                {integration.status}
                            </div>
                        </div>
                        <button className="px-3 py-1.5 border border-border-muted rounded-lg text-sm hover:bg-white/5">
                            {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NotificationsSettings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="space-y-4 max-w-md">
                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-xs text-muted">Receive updates via email</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>
                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-xs text-muted">Receive browser notifications</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>
            </div>
        </div>
    );
}

function ApiSettings() {
    const [apiKey] = useState('rp_live_xxxxxxxxxxxxxxxxxxxx');

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">API Keys</h2>
            <div className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Live API Key</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={apiKey}
                            readOnly
                            className="flex-1 px-3 py-2 bg-dark border border-border-muted rounded-lg font-mono text-sm"
                        />
                        <button className="px-3 py-2 border border-border-muted rounded-lg hover:bg-white/5">
                            Copy
                        </button>
                    </div>
                    <p className="text-xs text-muted mt-1">Use this key for production API calls.</p>
                </div>
                <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30">
                    Regenerate Key
                </button>
            </div>
        </div>
    );
}

// Module-specific settings components
function CMSSettings() {
    const [defaultPostStatus, setDefaultPostStatus] = useState('draft');
    const [postsPerPage, setPostsPerPage] = useState(10);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">CMS Settings</h2>
                <p className="text-sm text-muted">Configure content management options</p>
            </div>
            <div className="grid gap-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium mb-1">Default Post Status</label>
                    <select
                        value={defaultPostStatus}
                        onChange={(e) => setDefaultPostStatus(e.target.value)}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Posts Per Page</label>
                    <input
                        type="number"
                        value={postsPerPage}
                        onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold w-fit">
                    Save CMS Settings
                </button>
            </div>
        </div>
    );
}

function CRMSettings() {
    const [notifyOnSubmission, setNotifyOnSubmission] = useState(true);
    const [defaultFromEmail, setDefaultFromEmail] = useState('');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">CRM Settings</h2>
                <p className="text-sm text-muted">Configure forms and email options</p>
            </div>
            <div className="grid gap-4 max-w-md">
                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">Notify on Form Submission</div>
                        <div className="text-xs text-muted">Send email when forms are submitted</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={notifyOnSubmission}
                        onChange={(e) => setNotifyOnSubmission(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>
                <div>
                    <label className="block text-sm font-medium mb-1">Default From Email</label>
                    <input
                        type="email"
                        value={defaultFromEmail}
                        onChange={(e) => setDefaultFromEmail(e.target.value)}
                        placeholder="noreply@example.com"
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold w-fit">
                    Save CRM Settings
                </button>
            </div>
        </div>
    );
}

function SEOSettings() {
    const [sitemapEnabled, setSitemapEnabled] = useState(true);
    const [robotsContent, setRobotsContent] = useState('User-agent: *\nAllow: /');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">SEO Settings</h2>
                <p className="text-sm text-muted">Configure search engine optimization</p>
            </div>
            <div className="grid gap-4 max-w-lg">
                <label className="flex items-center justify-between p-4 bg-dark rounded-lg border border-border-muted cursor-pointer">
                    <div>
                        <div className="font-medium">Auto-generate Sitemap</div>
                        <div className="text-xs text-muted">Automatically generate sitemap.xml</div>
                    </div>
                    <input
                        type="checkbox"
                        checked={sitemapEnabled}
                        onChange={(e) => setSitemapEnabled(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 bg-dark text-brand-primary"
                    />
                </label>
                <div>
                    <label className="block text-sm font-medium mb-1">robots.txt Content</label>
                    <textarea
                        value={robotsContent}
                        onChange={(e) => setRobotsContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg font-mono text-sm"
                    />
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold w-fit">
                    Save SEO Settings
                </button>
            </div>
        </div>
    );
}

// Core Module Settings Components
function AuthSettings() {
    return (
        <DynamicModuleSettings
            moduleId="auth"
            title="Authentication Settings"
            description="Configure login and security policies"
        />
    );
}

function TenantsSettings() {
    // This component renders all Tenants settings from the tenants module
    // Settings are defined in packages/modules-tenants/src/settings/tenantsSettings.ts
    return (
        <DynamicModuleSettings
            moduleId="tenants"
            title="Tenants Settings"
            description="Configure multi-tenancy and admin UI options"
        // No filterGroups = show ALL groups (Admin UI, Table Columns, Defaults, Limits, Domains, Provisioning)
        />
    );
}

function SeedDataPreview({ refreshTrigger }: { refreshTrigger?: number }) {
    const [info, setInfo] = useState<any>(null);
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [infoRes, statusRes] = await Promise.all([
                apiFetch('/api/v1/users/seed/info'),
                apiFetch('/api/v1/users/seed/status')
            ]);

            if (infoRes.ok) setInfo(await infoRes.json());
            if (statusRes.ok) setStatus(await statusRes.json());
        } catch (error) {
            console.error('Failed to fetch seed info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up polling for status while on this tab
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [refreshTrigger]); // Fetch when trigger changes

    if (isLoading && !info) return (
        <div className="mt-8 flex flex-col items-center justify-center p-12 bg-dark/30 rounded-2xl border border-dashed border-border-muted">
            <Activity className="w-8 h-8 text-brand-primary animate-spin mb-4" />
            <div className="text-sm text-muted">Analyzing platform seed state...</div>
        </div>
    );

    return (
        <div className="space-y-6 mt-8 pt-8 border-t border-border-muted/50 transition-all animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Seed Details */}
                <div className="bg-dark/40 backdrop-blur-sm rounded-2xl border border-border-muted p-6 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-[0.2em]">
                            <Info className="w-4 h-4 text-brand-primary" />
                            Account Blueprints
                        </h3>
                        <div className="text-[10px] text-muted-foreground bg-white/5 py-1 px-2 rounded uppercase font-bold">
                            5 ROLES DEFINED
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {info?.users?.map((u: any) => (
                            <div key={u.role} className="flex flex-col p-4 bg-darker/60 rounded-xl border border-border-muted/30 group hover:border-brand-primary/40 hover:bg-darker/80 transition-all cursor-default">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded uppercase tracking-wider">{u.role}</span>
                                    <span className="text-[10px] text-muted font-mono opacity-60">{u.email}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                            <User className="w-3 h-3 text-muted" />
                                        </div>
                                        <span className="text-xs font-mono text-primary/90">{u.username}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                                            <Key className="w-3 h-3 text-muted" />
                                        </div>
                                        <span className="text-xs font-mono text-primary/90">admin123</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                        <AlertCircle className="w-5 h-5 text-brand-primary shrink-0" />
                        <div>
                            <p className="text-[11px] text-brand-primary/90 leading-relaxed font-medium">
                                Account variables will be processed per tenant.
                            </p>
                            <p className="text-[10px] text-brand-primary/60 leading-relaxed italic mt-1">
                                Example: For 'web4strategy', the admin will be 'web4strategy_admin'.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Seeding Status / Health Check */}
                <div className="bg-dark/40 backdrop-blur-sm rounded-2xl border border-border-muted p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black flex items-center gap-2 text-primary uppercase tracking-[0.2em]">
                            <Activity className="w-4 h-4 text-brand-primary" />
                            Tenant Health Check
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest text-muted uppercase">LIVE STATUS</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-darker/50 p-4 rounded-xl border border-border-muted/30">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Seeded Tenants</div>
                            <div className="text-2xl font-black text-primary">{status?.completeTenants || 0}</div>
                        </div>
                        <div className="bg-darker/50 p-4 rounded-xl border border-border-muted/30">
                            <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Total Tenants</div>
                            <div className="text-2xl font-black text-primary">{status?.totalTenants || 0}</div>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[340px] overflow-y-auto pr-3 custom-scrollbar custom-scrollbar-thin">
                        {status?.details?.map((s: any) => (
                            <div key={s.tenantId} className="flex items-center justify-between p-4 bg-darker/40 rounded-xl border border-border-muted/20 hover:bg-darker/70 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${s.isComplete ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`} />
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold tracking-tight">{s.slug}</span>
                                        <span className="text-[10px] text-muted font-medium uppercase tracking-tighter">{s.count} accounts verified</span>
                                    </div>
                                </div>
                                {s.isComplete ? (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-lg">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Healthy</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg group-hover:bg-orange-500/20 transition-all">
                                        <Clock className="w-3.5 h-3.5 animate-spin-slow" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Needs Seeding</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
