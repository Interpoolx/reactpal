import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { RightDrawer } from './RightDrawer';
import { BulkImportModal } from './BulkImportModal';
import { TabbedTenantForm } from './TabbedTenantForm';
import { useTenant } from '../../context/TenantContext';
import {
    Globe, Building2, Search, X, MoreVertical, Edit2, Pause, Trash2,
    Check, AlertCircle, Upload, Calendar, Download, Play, Archive, Copy,
    ExternalLink, Package, Plus, ArrowUpAZ, ArrowDownZA, SortAsc, SortDesc,
    CheckCircle, XCircle
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useToast } from '../ui/Toast';
import { ActionConfirmModal } from '../ui/ActionConfirmModal';

// ============================================================================
// TYPES
// ============================================================================

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain: string;
    status: 'active' | 'trial' | 'suspended' | 'archived';
    plan_name?: string;
    mrr?: number;
    storage_used?: number;
    current_users?: number;
    api_calls_this_month?: number;
    last_login_at?: number;
    last_activity_at?: number;
    created_at: number;
    updated_at?: number;
    avatar_url?: string;
    industry?: string;
    company_size?: string;
    tags?: string;
    notes?: string;
    trial_ends_at?: number;
    suspended_at?: number;
    suspended_reason?: string;
    owner_id?: string;
    owner_email?: string;
    billing_email?: string;
    plan_id?: string;
    next_billing_date?: number;
    max_users?: number;
    max_storage?: number;
    max_api_calls?: number;
    created_by?: string;
}


// ============================================================================
// PAGE CONFIGURATION (Config-Driven Approach)
// ============================================================================

const PAGE_CONFIG = {
    title: 'Tenants',
    description: 'Manage all registered tenants',
    apiEndpoint: '/api/v1/tenants',
    addButtonLabel: 'Add Tenant',
    addButtonIcon: Building2,
    searchPlaceholder: 'Search by name, slug, or domain...',
    exportFileName: 'tenants-export',
};

const STATS_CONFIG = [
    { key: 'total', label: 'Total Tenants', Icon: Building2, color: 'text-white' },
    { key: 'active', label: 'Active', Icon: Check, color: 'text-green-400' },
    { key: 'trial', label: 'Trial', Icon: Calendar, color: 'text-blue-400' },
    { key: 'plans', label: 'Plans', Icon: Package, color: 'text-purple-400' },
];

const FILTER_CONFIG = {
    status: {
        key: 'status',
        label: 'All Status',
        options: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'trial', label: 'Trial' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'archived', label: 'Archived' },
        ],
    },
    plan: {
        key: 'plan',
        label: 'All Plans',
        options: [
            { value: 'all', label: 'All Plans' },
            { value: 'free', label: 'Free' },
            { value: 'starter', label: 'Starter' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' },
        ],
    },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400' },
    trial: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    suspended: { bg: 'bg-red-500/20', text: 'text-red-400' },
    archived: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
};

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
    free: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    starter: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    pro: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    enterprise: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
};

const PAGINATION_CONFIG = {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
};

const CSV_EXPORT_CONFIG = {
    headers: ['Name', 'Slug', 'Domain', 'Status', 'Plan', 'Created'],
    mapRow: (t: Tenant) => [
        t.name,
        t.slug,
        t.domain || '',
        t.status,
        t.plan_name || 'free',
        t.created_at ? new Date(t.created_at * 1000).toISOString().split('T')[0] : ''
    ],
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function QuickActions({
    tenant,
    onEdit,
    onSuspend,
    onActivate,
    onDelete,
    onClone
}: {
    tenant: Tenant;
    onEdit: () => void;
    onSuspend: () => void;
    onActivate: () => void;
    onDelete: () => void;
    onClone: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const QUICK_ACTIONS = [
        { label: 'Edit Tenant', icon: Edit2, onClick: onEdit, color: '' },
        { label: 'Visit Site', icon: ExternalLink, onClick: () => window.open(`https://${tenant.domain}`, '_blank'), color: '', disabled: !tenant.domain },
        { label: 'Clone Tenant', icon: Copy, onClick: onClone, color: '' },
        { type: 'divider' },
        ...(tenant.status === 'active'
            ? [{ label: 'Suspend', icon: Pause, onClick: onSuspend, color: 'text-yellow-400' }]
            : tenant.status !== 'archived'
                ? [{ label: 'Activate', icon: Play, onClick: onActivate, color: 'text-green-400' }]
                : []
        ),
        { type: 'divider' },
        ...(tenant.status === 'archived'
            ? [{ label: 'Restore', icon: Play, onClick: onActivate, color: 'text-green-400' }]
            : []
        ),
        {
            label: tenant.status === 'archived' ? 'Delete Permanently' : 'Delete',
            icon: Trash2,
            onClick: onDelete,
            color: 'text-red-400'
        },
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-primary transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-darker border border-border-muted rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                    {QUICK_ACTIONS.map((action, i) =>
                        action.type === 'divider' ? (
                            <div key={i} className="border-t border-border-muted my-1" />
                        ) : (
                            <button
                                key={i}
                                onClick={() => { action.onClick?.(); setIsOpen(false); }}
                                disabled={action.disabled}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2 disabled:opacity-50 ${action.color}`}
                            >
                                {action.icon && <action.icon className="w-4 h-4" />}
                                {action.label}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}


function StatusBadge({ status }: { status: string }) {
    const colors = STATUS_COLORS[status] || STATUS_COLORS.active;
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text}`}>
            {status}
        </span>
    );
}

function PlanBadge({ plan }: { plan: string }) {
    const colors = PLAN_COLORS[plan] || PLAN_COLORS.free;
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text}`}>
            {plan}
        </span>
    );
}

function SortButton({ column, currentSort, onSort }: {
    column: string,
    currentSort: 'asc' | 'desc' | null,
    onSort: (key: string, direction: 'asc' | 'desc' | null) => void
}) {
    return (
        <button
            onClick={() => {
                if (!currentSort) onSort(column, 'asc');
                else if (currentSort === 'asc') onSort(column, 'desc');
                else onSort(column, null);
            }}
            className={`p-2 rounded-lg transition-colors ${currentSort
                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/50'
                : 'bg-dark border border-border-muted text-muted hover:text-white'
                }`}
            title={currentSort === 'asc' ? 'Sorted Ascending' : currentSort === 'desc' ? 'Sorted Descending' : 'Not Sorted'}
        >
            {currentSort === 'asc' ? <SortAsc className="w-4 h-4" /> :
                currentSort === 'desc' ? <SortDesc className="w-4 h-4" /> :
                    <SortAsc className="w-4 h-4 opacity-50" />}
        </button>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TenantsPage() {
    // State
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [isSaving, setIsSaving] = useState(false);
    const [bulkImportOpen, setBulkImportOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.defaultPageSize);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
    const [uiSettings, setUiSettings] = useState<Record<string, any>>({});
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sorting, setSorting] = useState<Record<string, 'asc' | 'desc' | null>>({});
    const [schemaColumns, setSchemaColumns] = useState<any[]>([]);
    const { activeTenant } = useTenant();
    const { showToast } = useToast();

    // Action Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant: 'danger' | 'warning' | 'info';
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => { },
        variant: 'danger'
    });

    // Row selection state for DataTable
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Load UI settings from database
    useEffect(() => {
        const loadSettings = async () => {
            try {
                let settings: Record<string, any> = {};

                // Load from database via API
                const res = await apiFetch(`/api/v1/settings/sections/tenants?tenantId=${activeTenant?.id || 'default'}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.values) {
                        settings = data.values;
                    }
                }

                setUiSettings(settings);

                // Set visible columns
                const colSettings: Record<string, boolean> = {};
                Object.keys(settings).forEach(key => {
                    if (key.startsWith('tenants.ui.columns.show')) {
                        colSettings[key] = settings[key];
                    }
                });
                setVisibleColumns(colSettings);

                // Set default page size if available
                if (settings['tenants.ui.defaultPageSize']) {
                    setPageSize(parseInt(settings['tenants.ui.defaultPageSize']));
                }

                // Fetch schema for dynamic columns
                try {
                    const schemaRes = await apiFetch('/api/v1/schema/tenants');
                    if (schemaRes.ok) {
                        const schemaData = await schemaRes.json();
                        setSchemaColumns(schemaData.columns || []);
                    }
                } catch (err) {
                    console.error('Failed to fetch schema', err);
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        loadSettings();
    }, [activeTenant?.id]);


    // Compute stats from config
    const stats = {
        total: tenants.length,
        active: tenants.filter(t => t.status === 'active').length,
        trial: tenants.filter(t => t.status === 'trial').length,
        plans: new Set(tenants.map(t => t.plan_name || 'free')).size,
    };

    // Pagination
    const totalPages = Math.ceil(tenants.length / pageSize);
    const paginatedTenants = tenants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Data fetching
    const fetchTenants = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.set('search', debouncedSearch);
            if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
            if (planFilter && planFilter !== 'all') params.set('plan', planFilter);

            const url = `${PAGE_CONFIG.apiEndpoint}${params.toString() ? '?' + params.toString() : ''}`;
            const res = await apiFetch(url);
            if (!res.ok) throw new Error('Failed to fetch tenants');
            const result = await res.json();

            // We still support client-side dynamic filters and sorting for flexibility
            let processed = [...result];

            // Client-side dynamic filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'all') {
                    processed = processed.filter((t: any) => {
                        const cellValue = t[key];

                        // Handle range filters
                        if (typeof value === 'object' && (value.min !== undefined || value.max !== undefined)) {
                            const val = Number(cellValue || 0);
                            if (value.min && val < Number(value.min)) return false;
                            if (value.max && val > Number(value.max)) return false;
                            return true;
                        }

                        if (typeof value === 'object' && (value.start !== undefined || value.end !== undefined)) {
                            const val = cellValue ? new Date(cellValue).getTime() : 0;
                            if (value.start && val < new Date(value.start).getTime()) return false;
                            if (value.end && val > new Date(value.end).getTime()) return false;
                            return true;
                        }

                        const strValue = String(cellValue || '').toLowerCase();
                        return strValue.includes(String(value).toLowerCase());
                    });
                }
            });

            // Client-side dynamic sorting
            Object.entries(sorting).forEach(([key, direction]) => {
                if (direction) {
                    processed.sort((a: any, b: any) => {
                        const valA = a[key];
                        const valB = b[key];
                        if (valA < valB) return direction === 'asc' ? -1 : 1;
                        if (valA > valB) return direction === 'asc' ? 1 : -1;
                        return 0;
                    });
                }
            });

            setTenants(processed);
        } catch (err) {
            console.error('Failed to fetch tenants', err);
            showToast('Failed to fetch tenants', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, statusFilter, planFilter, filters, sorting]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants]);

    // Handlers
    const handleAdd = () => { setEditingTenant(null); setDrawerOpen(true); };
    const handleEdit = (tenant: Tenant) => { setEditingTenant(tenant); setDrawerOpen(true); };

    const handleDelete = async (rows: Tenant[], permanent = false) => {
        setConfirmModal({
            isOpen: true,
            title: permanent ? 'Permanently Delete' : 'Archive Tenant',
            description: permanent
                ? `Are you sure you want to permanently delete ${rows.length} tenant(s)? This action cannot be undone and will remove all associated data.`
                : `Are you sure you want to archive ${rows.length} tenant(s)? They will be moved to the Archived status and can be restored later.`,
            confirmText: permanent ? 'Delete Permanently' : 'Archive',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    setIsSaving(true);
                    for (const row of rows) {
                        const url = `${PAGE_CONFIG.apiEndpoint}/${row.id}${permanent ? '?permanent=true' : ''}`;
                        const res = await apiFetch(url, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Action failed');
                    }
                    showToast(`${permanent ? 'Permanently deleted' : 'Archived'} ${rows.length} tenant(s)`, 'success');
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    setRowSelection({}); // Clear selection
                    fetchTenants();
                } catch (err: any) {
                    showToast(err.message || 'Action failed', 'error');
                } finally {
                    setIsSaving(false);
                }
            }
        });
    };

    const handleStatusChange = async (tenant: Tenant, newStatus: string) => {
        const executeUpdate = async () => {
            try {
                let url = `${PAGE_CONFIG.apiEndpoint}/${tenant.id}`;
                let method = 'PATCH';
                let body: any = { status: newStatus };

                if (newStatus === 'suspended') {
                    url = `${PAGE_CONFIG.apiEndpoint}/${tenant.id}/suspend`;
                    method = 'POST';
                    body = { reason: 'Suspended by administrator' };
                } else if (newStatus === 'active' && tenant.status === 'suspended') {
                    url = `${PAGE_CONFIG.apiEndpoint}/${tenant.id}/reactivate`;
                    method = 'POST';
                    body = {};
                }

                const res = await apiFetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                if (!res.ok) throw new Error('Failed to update status');

                showToast(`Tenant ${newStatus} successfully`, 'success');
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                fetchTenants();
            } catch (err: any) {
                showToast(err.message || 'Failed to update status', 'error');
            }
        };

        if (newStatus === 'suspended') {
            setConfirmModal({
                isOpen: true,
                title: 'Suspend Tenant',
                description: `Are you sure you want to suspend "${tenant.name}"? This will disable access for all users of this tenant.`,
                confirmText: 'Suspend',
                variant: 'warning',
                onConfirm: executeUpdate
            });
        } else if (newStatus === 'archived') {
            handleDelete([tenant], false);
        } else {
            executeUpdate();
        }
    };

    const handleEmptyArchive = () => {
        const archivedTenants = tenants.filter(t => t.status === 'archived');
        if (archivedTenants.length === 0) return;
        handleDelete(archivedTenants, true);
    };

    const handleClone = async (tenant: Tenant) => {
        try {
            const res = await apiFetch(PAGE_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${tenant.name} (Copy)`,
                    slug: `${tenant.slug}-copy-${Date.now().toString(36)}`,
                    status: 'trial',
                    plan_name: tenant.plan_name || 'free',
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || 'Clone failed');
            }

            showToast('Tenant cloned successfully', 'success');
            fetchTenants();
        } catch (err: any) {
            console.error('Clone error:', err);
            showToast(err.message || 'Failed to clone tenant', 'error');
        }
    };

    const handleSave = async (formData: Partial<Tenant>) => {
        setIsSaving(true);
        try {
            const url = editingTenant?.id
                ? `${PAGE_CONFIG.apiEndpoint}/${editingTenant.id}`
                : PAGE_CONFIG.apiEndpoint;
            const method = editingTenant?.id ? 'PATCH' : 'POST';

            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Save failed');
            }
            showToast(editingTenant ? 'Tenant updated' : 'Tenant created', 'success');
            setDrawerOpen(false);
            fetchTenants();
        } catch (err: any) {
            showToast(err.message || 'Failed to save', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExportCSV = () => {
        const csvContent = [CSV_EXPORT_CONFIG.headers, ...tenants.map(CSV_EXPORT_CONFIG.mapRow)]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${PAGE_CONFIG.exportFileName}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported ${tenants.length} tenants`, 'success');
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleSortChange = (key: string, direction: 'asc' | 'desc' | null) => {
        setSorting(prev => ({ ...prev, [key]: direction }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPlanFilter('all');
        setFilters({});
        setSorting({});
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || planFilter !== 'all' ||
        Object.values(filters).some(v => v !== '' && v !== 'all' && v !== null) ||
        Object.values(sorting).some(v => v !== null);

    // All available columns
    const allColumns: (ColumnDef<Tenant, any> & { showSetting?: string })[] = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="text-xs text-muted font-mono">{row.original.id}</span>,
            showSetting: 'tenants.ui.columns.showId'
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                        <div className="font-medium">{row.original.name}</div>
                        <div className="text-xs text-muted font-mono">{row.original.slug}</div>
                    </div>
                </div>
            ),
            showSetting: 'tenants.ui.columns.showName'
        },
        {
            id: 'slug',
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.slug}</span>,
            showSetting: 'tenants.ui.columns.showSlug'
        },
        {
            id: 'domain',
            accessorKey: 'domain',
            header: 'Domain',
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-muted">
                    <Globe className="w-4 h-4" />
                    <span>{row.original.domain || '—'}</span>
                </div>
            ),
            showSetting: 'tenants.ui.columns.showDomain'
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status || 'active'} />,
            showSetting: 'tenants.ui.columns.showStatus'
        },
        {
            id: 'plan_name',
            accessorKey: 'plan_name',
            header: 'Plan',
            cell: ({ row }) => <PlanBadge plan={row.original.plan_name || 'free'} />,
            showSetting: 'tenants.ui.columns.showPlanName'
        },
        // Subscription columns
        { id: 'plan_id', accessorKey: 'plan_id', header: 'Plan ID', showSetting: 'tenants.ui.columns.showPlanId' },
        { id: 'billing_status', accessorKey: 'billing_status', header: 'Billing Status', showSetting: 'tenants.ui.columns.showBillingStatus' },
        {
            id: 'next_billing_date',
            accessorKey: 'next_billing_date',
            header: 'Next Billing',
            cell: ({ row }) => row.original.next_billing_date ? new Date(row.original.next_billing_date * 1000).toLocaleDateString() : '—',
            showSetting: 'tenants.ui.columns.showNextBillingDate'
        },
        {
            id: 'mrr',
            accessorKey: 'mrr',
            header: 'MRR',
            cell: ({ row }) => <span>${(row.original.mrr || 0).toLocaleString()}</span>,
            showSetting: 'tenants.ui.columns.showMrr'
        },
        // Ownership
        { id: 'owner_id', accessorKey: 'owner_id', header: 'Owner ID', showSetting: 'tenants.ui.columns.showOwnerId' },
        { id: 'owner_email', accessorKey: 'owner_email', header: 'Owner Email', showSetting: 'tenants.ui.columns.showOwnerEmail' },
        { id: 'billing_email', accessorKey: 'billing_email', header: 'Billing Email', showSetting: 'tenants.ui.columns.showBillingEmail' },
        // Resource Limits
        { id: 'max_users', accessorKey: 'max_users', header: 'Max Users', showSetting: 'tenants.ui.columns.showMaxUsers' },
        {
            id: 'max_storage',
            accessorKey: 'max_storage',
            header: 'Max Storage',
            cell: ({ row }) => <span>{row.original.max_storage || 0} GB</span>,
            showSetting: 'tenants.ui.columns.showMaxStorage'
        },
        { id: 'max_api_calls', accessorKey: 'max_api_calls', header: 'Max API Calls', showSetting: 'tenants.ui.columns.showMaxApiCalls' },
        // Real-time Usage
        { id: 'current_users', accessorKey: 'current_users', header: 'Users', showSetting: 'tenants.ui.columns.showCurrentUsers' },
        {
            id: 'storage_used',
            accessorKey: 'storage_used',
            header: 'Storage',
            cell: ({ row }) => <span>{(row.original.storage_used || 0).toFixed(2)} GB</span>,
            showSetting: 'tenants.ui.columns.showStorageUsed'
        },
        { id: 'api_calls_this_month', accessorKey: 'api_calls_this_month', header: 'API Calls', showSetting: 'tenants.ui.columns.showApiCallsThisMonth' },
        // Lifecycle & Audit
        {
            id: 'trial_ends_at',
            accessorKey: 'trial_ends_at',
            header: 'Trial Ends',
            cell: ({ row }) => row.original.trial_ends_at ? new Date(row.original.trial_ends_at * 1000).toLocaleDateString() : '—',
            showSetting: 'tenants.ui.columns.showTrialEndsAt'
        },
        {
            id: 'suspended_at',
            accessorKey: 'suspended_at',
            header: 'Suspended At',
            cell: ({ row }) => row.original.suspended_at ? new Date(row.original.suspended_at * 1000).toLocaleDateString() : '—',
            showSetting: 'tenants.ui.columns.showSuspendedAt'
        },
        { id: 'suspended_reason', accessorKey: 'suspended_reason', header: 'Suspended Reason', showSetting: 'tenants.ui.columns.showSuspendedReason' },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => {
                if (!row.original.created_at) return <span className="text-muted">—</span>;
                return (
                    <div className="flex items-center gap-2 text-muted text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(row.original.created_at * 1000).toLocaleDateString()}
                    </div>
                );
            },
            showSetting: 'tenants.ui.columns.showCreatedAt'
        },
        {
            id: 'updated_at',
            accessorKey: 'updated_at',
            header: 'Updated',
            cell: ({ row }) => row.original.updated_at ? new Date(row.original.updated_at * 1000).toLocaleDateString() : '—',
            showSetting: 'tenants.ui.columns.showUpdatedAt'
        },
        {
            id: 'last_activity_at',
            accessorKey: 'last_activity_at',
            header: 'Last Activity',
            cell: ({ row }) => row.original.last_activity_at ? new Date(row.original.last_activity_at * 1000).toLocaleDateString() : '—',
            showSetting: 'tenants.ui.columns.showLastActivityAt'
        },
        { id: 'created_by', accessorKey: 'created_by', header: 'Created By', showSetting: 'tenants.ui.columns.showCreatedBy' },
        // Metadata
        { id: 'industry', accessorKey: 'industry', header: 'Industry', showSetting: 'tenants.ui.columns.showIndustry' },
        { id: 'company_size', accessorKey: 'company_size', header: 'Size', showSetting: 'tenants.ui.columns.showCompanySize' },
        {
            id: 'notes',
            accessorKey: 'notes',
            header: 'Notes',
            cell: ({ row }) => (
                <span className="text-xs text-muted truncate max-w-[150px] inline-block" title={row.original.notes}>
                    {row.original.notes || '—'}
                </span>
            ),
            showSetting: 'tenants.ui.columns.showNotes'
        },
        {
            id: 'tags',
            accessorKey: 'tags',
            header: 'Tags',
            cell: ({ row }) => {
                if (!row.original.tags) return '—';
                return (
                    <div className="flex flex-wrap gap-1">
                        {row.original.tags.split(',').map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-[10px] rounded uppercase font-medium">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                );
            },
            showSetting: 'tenants.ui.columns.showTags'
        },
        // Actions
        {
            id: 'quickActions',
            header: '',
            cell: ({ row }) => (
                <QuickActions
                    tenant={row.original}
                    onEdit={() => handleEdit(row.original)}
                    onSuspend={() => handleStatusChange(row.original, 'suspended')}
                    onActivate={() => handleStatusChange(row.original, 'active')}
                    onDelete={() => handleDelete([row.original], row.original.status === 'archived')}
                    onClone={() => handleClone(row.original)}
                />
            ),
            size: 50,
        },
    ];

    // Filter columns based on settings
    const baseColumns = [...allColumns];
    schemaColumns.forEach(sc => {
        const pascalName = sc.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        const showKey = `tenants.ui.columns.show${pascalName}`;

        // Check if this DB field is already covered by a hardcoded column
        const isCovered = allColumns.some(col =>
            (col as any).showSetting === showKey ||
            (col as any).accessorKey === sc.name
        );

        if (!isCovered) {
            const label = sc.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            baseColumns.push({
                id: sc.name,
                accessorKey: sc.name,
                header: label,
                cell: ({ row }: { row: any }) => {
                    const val = row.original[sc.name as keyof Tenant];
                    if (val === null || val === undefined) return <span className="text-muted">—</span>;
                    if (typeof val === 'number' && (sc.name.endsWith('_at') || sc.name === 'created_at' || sc.name === 'updated_at')) {
                        return <span className="text-sm">{new Date(val * 1000).toLocaleDateString()}</span>;
                    }
                    if (typeof val === 'boolean') {
                        return val ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
                    }
                    return <span className="text-sm">{String(val)}</span>;
                },
                showSetting: showKey
            } as any);
        }
    });

    const columns = baseColumns.filter(col => {
        if (col.id === 'quickActions' || col.id === 'actions') return true;
        const settingKey = (col as any).showSetting;
        if (!settingKey) return true;
        return visibleColumns[settingKey] !== false;
    });

    // Render
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{PAGE_CONFIG.title}</h1>
                    <p className="text-muted text-sm mt-1">{PAGE_CONFIG.description}</p>
                </div>
                <div className="flex items-center gap-3">
                    {uiSettings['tenants.ui.showExportCSV'] !== false && (
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 border border-border-muted rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    )}
                    {uiSettings['tenants.ui.showBulkImport'] !== false && (
                        <button
                            onClick={() => setBulkImportOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-border-muted rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Bulk Import
                        </button>
                    )}
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
                    >
                        <PAGE_CONFIG.addButtonIcon className="w-4 h-4" />
                        {PAGE_CONFIG.addButtonLabel}
                    </button>
                </div>
            </div>

            {/* Stats Cards (Config-Driven) */}
            {uiSettings['tenants.ui.showStatsCards'] !== false && (
                <div className="grid grid-cols-4 gap-4">
                    {STATS_CONFIG.map((stat) => (
                        <div key={stat.key} className="bg-dark rounded-xl border border-border-muted p-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                                    <stat.Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats[stat.key as keyof typeof stats]}</div>
                                    <div className="text-xs text-muted">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters (Dynamic Config-Driven) */}
            {(() => {
                const filterConfig = uiSettings['tenants.ui.filterConfig'] || {};
                const searchEnabled = uiSettings['tenants.ui.showSearch'] !== false;

                const enabledFilters = Object.entries(filterConfig)
                    .filter(([_, config]: [string, any]) => config.enabled)
                    .map(([key, config]: [string, any]) => ({ key, ...config }));

                if (!searchEnabled && enabledFilters.length === 0) return null;

                return (
                    <div className="flex flex-wrap items-center gap-4 p-4 bg-darker rounded-xl border border-border-muted">
                        {searchEnabled && (
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder={PAGE_CONFIG.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                                />
                            </div>
                        )}

                        {enabledFilters.map((cfg) => {
                            if (cfg.key === 'status') {
                                return (
                                    <select
                                        key="status"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm min-w-[120px]"
                                    >
                                        {FILTER_CONFIG.status.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                );
                            }
                            if (cfg.key === 'planName') {
                                return (
                                    <select
                                        key="plan"
                                        value={planFilter}
                                        onChange={(e) => setPlanFilter(e.target.value)}
                                        className="px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm min-w-[120px]"
                                    >
                                        {FILTER_CONFIG.plan.options.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                );
                            }
                            switch (cfg.type) {
                                case 'select':
                                case 'multi-select':
                                    const options = cfg.options === 'auto'
                                        ? [...new Set(tenants.map(t => (t as any)[cfg.key]))].filter(Boolean).map(v => ({ label: v, value: v }))
                                        : (Array.isArray(cfg.options) ? cfg.options : []);

                                    return (
                                        <div key={cfg.key} className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">{cfg.label}</label>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={filters[cfg.key] || 'all'}
                                                    onChange={(e) => handleFilterChange(cfg.key, e.target.value)}
                                                    className="px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm min-w-[120px]"
                                                >
                                                    <option value="all">All {cfg.label}</option>
                                                    {options.map((opt: any) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                {cfg.sortOptions && <SortButton column={cfg.key} currentSort={sorting[cfg.key]} onSort={handleSortChange} />}
                                            </div>
                                        </div>
                                    );
                                case 'text':
                                    return (
                                        <div key={cfg.key} className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">{cfg.label}</label>
                                            <div className="flex items-center gap-2">
                                                <div className="relative min-w-[150px]">
                                                    <input
                                                        type="text"
                                                        placeholder={`Filter ${cfg.label}...`}
                                                        value={filters[cfg.key] || ''}
                                                        onChange={(e) => handleFilterChange(cfg.key, e.target.value)}
                                                        className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                                                    />
                                                </div>
                                                {cfg.sortOptions && <SortButton column={cfg.key} currentSort={sorting[cfg.key]} onSort={handleSortChange} />}
                                            </div>
                                        </div>
                                    );
                                case 'number-range':
                                    return (
                                        <div key={cfg.key} className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">{cfg.label} Range</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center bg-dark border border-border-muted rounded-lg overflow-hidden h-[38px]">
                                                    <input
                                                        type="number"
                                                        placeholder="Min"
                                                        value={filters[cfg.key]?.min || ''}
                                                        onChange={(e) => handleFilterChange(cfg.key, { ...filters[cfg.key], min: e.target.value })}
                                                        className="w-16 px-2 py-1 bg-transparent border-none text-xs focus:ring-0"
                                                    />
                                                    <div className="w-[1px] h-4 bg-border-muted" />
                                                    <input
                                                        type="number"
                                                        placeholder="Max"
                                                        value={filters[cfg.key]?.max || ''}
                                                        onChange={(e) => handleFilterChange(cfg.key, { ...filters[cfg.key], max: e.target.value })}
                                                        className="w-16 px-2 py-1 bg-transparent border-none text-xs focus:ring-0"
                                                    />
                                                </div>
                                                {cfg.sortOptions && <SortButton column={cfg.key} currentSort={sorting[cfg.key]} onSort={handleSortChange} />}
                                            </div>
                                        </div>
                                    );
                                case 'date-range':
                                    return (
                                        <div key={cfg.key} className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider pl-1">{cfg.label} Date</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center bg-dark border border-border-muted rounded-lg overflow-hidden h-[38px]">
                                                    <input
                                                        type="date"
                                                        value={filters[cfg.key]?.start || ''}
                                                        onChange={(e) => handleFilterChange(cfg.key, { ...filters[cfg.key], start: e.target.value })}
                                                        className="px-2 py-1 bg-transparent border-none text-[10px] focus:ring-0 w-28"
                                                    />
                                                    <div className="w-[1px] h-4 bg-border-muted" />
                                                    <input
                                                        type="date"
                                                        value={filters[cfg.key]?.end || ''}
                                                        onChange={(e) => handleFilterChange(cfg.key, { ...filters[cfg.key], end: e.target.value })}
                                                        className="px-2 py-1 bg-transparent border-none text-[10px] focus:ring-0 w-28"
                                                    />
                                                </div>
                                                {cfg.sortOptions && <SortButton column={cfg.key} currentSort={sorting[cfg.key]} onSort={handleSortChange} />}
                                            </div>
                                        </div>
                                    );
                                default:
                                    return null;
                            }
                        })}

                        {statusFilter === 'archived' && tenants.length > 0 && (
                            <button
                                onClick={handleEmptyArchive}
                                className="ml-auto flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Empty Archive
                            </button>
                        )}

                        <div className={`overflow-hidden transition-all duration-300 flex items-center ${hasActiveFilters ? 'max-w-[100px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0'}`}>
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-3 py-2 text-muted hover:text-primary text-sm transition-colors whitespace-nowrap"
                            >
                                <X className="w-4 h-4" />
                                Clear
                            </button>
                        </div>
                    </div>
                );
            })()}

            {/* DataTable */}
            <DataTable
                data={paginatedTenants}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />

            {/* Pagination (Config-Driven) */}
            {
                tenants.length > 0 && uiSettings['tenants.ui.showPagination'] !== false && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">
                                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, tenants.length)} of {tenants.length}
                            </span>
                            <select
                                value={pageSize}
                                onChange={(e) => { setPageSize(parseInt(e.target.value)); setCurrentPage(1); }}
                                className="px-2 py-1 bg-dark border border-border-muted rounded text-sm"
                            >
                                {PAGINATION_CONFIG.pageSizeOptions.map(size => (
                                    <option key={size} value={size}>{size} / page</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border border-border-muted rounded-lg disabled:opacity-50 hover:bg-white/5">First</button>
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border border-border-muted rounded-lg disabled:opacity-50 hover:bg-white/5">Prev</button>
                            <span className="px-4 py-1.5 text-sm">Page {currentPage} of {totalPages || 1}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm border border-border-muted rounded-lg disabled:opacity-50 hover:bg-white/5">Next</button>
                            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm border border-border-muted rounded-lg disabled:opacity-50 hover:bg-white/5">Last</button>
                        </div>
                    </div>
                )
            }

            {/* Drawer */}
            <RightDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}>
                <TabbedTenantForm tenant={editingTenant} onSave={handleSave} onCancel={() => setDrawerOpen(false)} isSaving={isSaving} />
            </RightDrawer>

            {/* Bulk Import Modal */}
            <BulkImportModal isOpen={bulkImportOpen} onClose={() => setBulkImportOpen(false)} onSuccess={() => { fetchTenants(); showToast('Bulk import completed', 'success'); }} />

            {/* Action Confirmation Modal */}
            <ActionConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                variant={confirmModal.variant}
                isLoading={isSaving}
            />
        </div>
    );
}
