import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { RightDrawer } from './RightDrawer';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';
import {
    Users, UserPlus, Shield, Mail, Calendar,
    CheckCircle, Clock, XCircle, AlertTriangle,
    Search, Download, Upload, Eye, Edit2, Key, History, UserX, X,
    Plus, Trash2, Building2, MoreVertical, SortAsc, SortDesc, ArrowUpAZ, ArrowDownZA
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { ActionConfirmModal } from '../ui/ActionConfirmModal';

// ============================================================================
// TYPES
// ============================================================================

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    username?: string;
    role: string;
    status: 'active' | 'pending' | 'suspended' | 'inactive' | 'archived';
    last_login_at?: number;
    created_at: number;
    updated_at?: number;
    avatar_url?: string;
    joined_via?: string;
    last_activity_at?: number;
}

interface Invitation {
    id: string;
    email: string;
    role_id: string;
    status: 'pending' | 'accepted' | 'expired' | 'cancelled';
    token: string;
    invited_by: string;
    expires_at: number;
    created_at: number;
}

interface Role {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_system: boolean;
    color?: string;
}

// ============================================================================
// PAGE CONFIGURATION (Config-Driven Approach)
// ============================================================================

const PAGE_CONFIG = {
    title: 'Users',
    getDescription: (tenantName: string) => `Manage users for ${tenantName}`,
    apiEndpoint: '/api/v1/users',
    rolesEndpoint: '/api/v1/roles',
    addButtonLabel: 'Invite User',
    addButtonIcon: UserPlus,
    searchPlaceholder: 'Search by name or email...',
};

const STATS_CONFIG = [
    { key: 'total', label: 'Total Users', Icon: Users, color: 'text-white' },
    { key: 'active', label: 'Active', Icon: CheckCircle, color: 'text-green-400' },
    { key: 'pending', label: 'Pending Invites', Icon: Clock, color: 'text-blue-400' },
    { key: 'roles', label: 'Roles', Icon: Shield, color: 'text-purple-400' },
];

const FILTER_CONFIG = {
    status: {
        key: 'status',
        label: 'All Status',
        options: [
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'archived', label: 'Archived' },
        ],
    },
};

const COLUMN_SETTINGS_CONFIG = {
    columns: [
        { key: 'users.ui.columns.showId', label: 'ID', type: 'boolean', defaultValue: false, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showUsername', label: 'Username', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showEmail', label: 'Email', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showFullName', label: 'Full Name', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showRole', label: 'Role', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showStatus', label: 'Status', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showLastLogin', label: 'Last Login', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showCreatedAt', label: 'Created', type: 'boolean', defaultValue: true, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showUpdatedAt', label: 'Updated', type: 'boolean', defaultValue: false, group: 'Users Table Columns' },
        { key: 'users.ui.columns.showCreatedBy', label: 'Created By', type: 'boolean', defaultValue: false, group: 'Users Table Columns' },
    ],
};

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: any }> = {
    active: { label: 'Active', color: 'bg-green-500/20 text-green-400', Icon: CheckCircle },
    pending: { label: 'Pending', color: 'bg-blue-500/20 text-blue-400', Icon: Clock },
    suspended: { label: 'Suspended', color: 'bg-red-500/20 text-red-400', Icon: XCircle },
    archived: { label: 'Archived', color: 'bg-gray-500/20 text-gray-400', Icon: AlertTriangle },
};

const ROLE_COLORS: Record<string, string> = {
    super_admin: 'bg-purple-500/20 text-purple-400',
    admin: 'bg-brand-primary/20 text-brand-primary',
    editor: 'bg-yellow-500/20 text-yellow-400',
    viewer: 'bg-slate-700 text-muted',
};

const PAGINATION_CONFIG = {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
};

const DEFAULT_ROLES: Role[] = [
    { id: '1', name: 'Admin', slug: 'admin', is_system: true },
    { id: '2', name: 'Editor', slug: 'editor', is_system: true },
    { id: '3', name: 'Viewer', slug: 'viewer', is_system: true },
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

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

function StatusBadge({ status }: { status: User['status'] }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <config.Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}

function RoleBadge({ role }: { role: string }) {
    const color = ROLE_COLORS[role] || 'bg-slate-700 text-muted';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${color}`}>
            <Shield className="w-3 h-3" />
            {role.replace('_', ' ')}
        </span>
    );
}

function UserQuickActions({
    user,
    onView,
    onEdit,
    onDelete,
    onStatusChange
}: {
    user: User;
    onView: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onStatusChange: (user: User, status: User['status']) => void;
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
        { label: 'View Details', icon: Eye, onClick: onView, color: 'text-blue-400' },
        { label: 'Edit User', icon: Edit2, onClick: onEdit, color: 'text-brand-primary' },
        { type: 'divider' },
        ...(user.status === 'active'
            ? [{ label: 'Suspend', icon: XCircle, onClick: () => onStatusChange(user, 'suspended'), color: 'text-orange-400' }]
            : user.status !== 'archived'
                ? [{ label: 'Activate', icon: CheckCircle, onClick: () => onStatusChange(user, 'active'), color: 'text-green-400' }]
                : []
        ),
        // Archive option for non-archived users
        ...(user.status !== 'archived'
            ? [{ label: 'Archive User', icon: Trash2, onClick: () => onStatusChange(user, 'archived'), color: 'text-gray-400' }]
            : []
        ),
        // Delete Permanently only for archived users
        ...(user.status === 'archived'
            ? [
                { type: 'divider' },
                { label: 'Delete Permanently', icon: Trash2, onClick: onDelete, color: 'text-red-400' }
            ]
            : []
        ),
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-muted hover:text-primary transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-darker border border-border-muted rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {QUICK_ACTIONS.map((action, i) =>
                        action.type === 'divider' ? (
                            <div key={i} className="border-t border-border-muted my-1" />
                        ) : (
                            <button
                                key={i}
                                onClick={() => { action.onClick?.(); setIsOpen(false); }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2 ${action.color}`}
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UsersPage() {
    // State
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'invite' | 'edit' | 'view'>('invite');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.defaultPageSize);
    const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
    const [uiSettings, setUiSettings] = useState<Record<string, any>>({});
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [sorting, setSorting] = useState<Record<string, 'asc' | 'desc' | null>>({});
    const [schemaColumns, setSchemaColumns] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const { activeTenant, refresh: refreshTenantUsage } = useTenant();
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

    // Data fetching
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTenant?.id) params.set('tenantId', activeTenant.id);
            if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
            if (debouncedSearch) params.set('search', debouncedSearch);

            const url = `${PAGE_CONFIG.apiEndpoint}?${params.toString()}`;
            const res = await apiFetch(url);
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data.map((u: any) => ({
                ...u,
                email: u.email || `${u.username}@example.com`,
                first_name: u.first_name || u.username || 'User',
                last_name: u.last_name || '',
                status: u.status || 'active',
            })));
        } catch (err) {
            console.error('Failed to fetch users', err);
            showToast('Failed to fetch users', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeTenant?.id, statusFilter, debouncedSearch, showToast]);

    const fetchInvitations = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTenant?.id) params.set('tenantId', activeTenant.id);

            const res = await apiFetch(`/api/v1/invitations?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch invitations');
            const data = await res.json();
            setInvitations(data);
        } catch (err) {
            console.error('Failed to fetch invitations', err);
            showToast('Failed to fetch invitations', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeTenant?.id, showToast]);

    const fetchRoles = async () => {
        try {
            const res = await apiFetch(PAGE_CONFIG.rolesEndpoint);
            if (res.ok) {
                setRoles(await res.json());
            } else {
                setRoles(DEFAULT_ROLES);
            }
        } catch {
            setRoles(DEFAULT_ROLES);
        }
    };

    const fetchUiSettings = useCallback(async () => {
        try {
            let settings: Record<string, any> = {};

            // Load from database via API
            const res = await apiFetch(`/api/v1/settings/sections/users?tenantId=${activeTenant?.id || 'default'}`);
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
                if (key.startsWith('users.ui.columns.show')) {
                    colSettings[key] = settings[key];
                }
            });
            setVisibleColumns(colSettings);

            // Set default page size if available
            if (settings['users.ui.defaultPageSize']) {
                setPageSize(parseInt(settings['users.ui.defaultPageSize']));
            }

            // Fetch schema for dynamic columns
            try {
                const schemaRes = await apiFetch('/api/v1/schema/users');
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
    }, [activeTenant?.id]);

    // Load UI settings from database
    useEffect(() => {
        fetchRoles();
        fetchUiSettings();
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchInvitations();
        }
    }, [fetchUsers, fetchInvitations, activeTab]);

    // Handlers
    const handleInvite = () => { setSelectedUser(null); setDrawerMode('invite'); setDrawerOpen(true); };
    const handleEdit = (user: User) => { setSelectedUser(user); setDrawerMode('edit'); setDrawerOpen(true); };
    const handleView = (user: User) => { setSelectedUser(user); setDrawerMode('view'); setDrawerOpen(true); };
    const handleDelete = async (rows: User[], permanent = false) => {
        setConfirmModal({
            isOpen: true,
            title: permanent ? 'Permanently Delete' : 'Archive User',
            description: permanent
                ? `Are you sure you want to permanently delete ${rows.length} user(s)? This action cannot be undone.`
                : `Are you sure you want to archive ${rows.length} user(s)? They will be moved to the Archived status.`,
            confirmText: permanent ? 'Delete Permanently' : 'Archive',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    setIsSaving(true);
                    if (rows.length > 1) {
                        const res = await apiFetch(`${PAGE_CONFIG.apiEndpoint}/bulk-delete`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ids: rows.map(r => r.id), permanent }),
                        });
                        if (!res.ok) throw new Error('Bulk delete failed');
                    } else {
                        const res = await apiFetch(`${PAGE_CONFIG.apiEndpoint}/${rows[0].id}${permanent ? '?permanent=true' : ''}`, {
                            method: 'DELETE',
                        });
                        if (!res.ok) throw new Error('Delete failed');
                    }
                    showToast(`${permanent ? 'Permanently deleted' : 'Archived'} ${rows.length} user(s)`, 'success');
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    fetchUsers();
                } catch (err: any) {
                    showToast(err.message || 'Action failed', 'error');
                } finally {
                    setIsSaving(false);
                }
            }
        });
    };

    const handleStatusChange = async (user: User, newStatus: User['status']) => {
        const executeUpdate = async () => {
            try {
                const res = await apiFetch(`${PAGE_CONFIG.apiEndpoint}/${user.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                });
                if (!res.ok) throw new Error('Status update failed');
                showToast(`User ${newStatus} successfully`, 'success');
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                fetchUsers();
            } catch (err: any) {
                showToast(err.message || 'Update failed', 'error');
            }
        };

        if (newStatus === 'suspended') {
            // Safety guard: Don't allow suspending admins or super_admins
            // Support both super_admin and super-admin for robustness
            const isAdminRole = user.role === 'admin' || user.role === 'super_admin' || user.role === 'super-admin';
            if (isAdminRole) {
                showToast('Administrative accounts cannot be suspended', 'error');
                return;
            }
            setConfirmModal({
                isOpen: true,
                title: 'Suspend User',
                description: `Are you sure you want to suspend "${user.first_name} ${user.last_name}"? They will lose access to the platform.`,
                confirmText: 'Suspend',
                variant: 'warning',
                onConfirm: executeUpdate
            });
        } else if (newStatus === 'archived') {
            handleDelete([user], false);
        } else {
            executeUpdate();
        }
    };

    const handleEmptyArchive = () => {
        const archivedUsers = users.filter(u => u.status === 'archived');
        if (archivedUsers.length === 0) return;
        handleDelete(archivedUsers, true);
    };

    const handleSave = async (formData: any) => {
        console.log('Saving:', formData);
        setDrawerOpen(false);
        fetchUsers();
    };

    // Filter users (with debounced search)
    // Updated Filtering logic for multi-select roles
    const filteredUsers = users.filter(user => {
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        // Role filter can be 'all' or a slug. In the future we might want multi-select.
        // For now, let's just make sure slug matches.
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            user.username?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.first_name?.toLowerCase().includes(searchLower) ||
            user.last_name?.toLowerCase().includes(searchLower);

        // Advanced filters from settings
        const matchesCustomFilters = Object.entries(filters).every(([key, value]) => {
            if (!value || value === 'all' || value === '') return true;
            const userValue = (user as any)[key];

            if (typeof value === 'object') {
                if (value.min && userValue < value.min) return false;
                if (value.max && userValue > value.max) return false;
                if (value.start && userValue < new Date(value.start).getTime() / 1000) return false;
                if (value.end && userValue > new Date(value.end).getTime() / 1000) return false;
            } else if (Array.isArray(value)) {
                return value.includes(userValue);
            } else {
                return String(userValue).toLowerCase().includes(String(value).toLowerCase());
            }
            return true;
        });

        return matchesStatus && matchesRole && matchesSearch && matchesCustomFilters;
    });

    // Dynamic sorting
    Object.entries(sorting).forEach(([key, direction]) => {
        if (direction) {
            filteredUsers.sort((a: any, b: any) => {
                const valA = a[key];
                const valB = b[key];
                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Stats (computed from config keys)
    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        pending: users.filter(u => u.status === 'pending').length,
        roles: roles.length,
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
        setRoleFilter('all');
        setFilters({});
        setSorting({});
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || roleFilter !== 'all' ||
        Object.values(filters).some(v => v !== '' && v !== 'all' && v !== null) ||
        Object.values(sorting).some(v => v !== null);

    // All available columns
    const allColumns: (ColumnDef<User, any> & { showSetting?: string })[] = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="text-xs text-muted font-mono">{row.original.id}</span>,
            showSetting: 'users.ui.columns.showId'
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: 'User',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm font-medium">
                        {(row.original.first_name?.[0] || row.original.username?.[0] || 'U').toUpperCase()}
                        {(row.original.last_name?.[0] || '').toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium">{row.original.first_name} {row.original.last_name}</div>
                        <div className="text-sm text-muted">{row.original.email}</div>
                    </div>
                </div>
            ),
            showSetting: 'users.ui.columns.showUsername' // Combined with email
        },
        {
            id: 'username',
            accessorKey: 'username',
            header: 'Username',
            cell: ({ row }) => <span className="text-sm font-mono">{row.original.username}</span>,
            showSetting: 'users.ui.columns.showUsername'
        },
        {
            id: 'email',
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
            showSetting: 'users.ui.columns.showEmail'
        },
        {
            id: 'role',
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => <RoleBadge role={row.original.role} />,
            showSetting: 'users.ui.columns.showRole'
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <StatusBadge status={row.original.status} />,
            showSetting: 'users.ui.columns.showStatus'
        },
        {
            id: 'joined_via',
            accessorKey: 'joined_via',
            header: 'Joined Via',
            cell: ({ row }) => (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border-muted capitalize">
                    {row.original.joined_via || 'signup'}
                </span>
            ),
            showSetting: 'users.ui.columns.showJoinedVia'
        },
        {
            id: 'last_active',
            accessorKey: 'last_activity_at',
            header: 'Last Active',
            cell: ({ row }) => {
                const lastActive = row.original.last_activity_at || row.original.last_login_at;
                return (
                    <span className="text-muted text-sm italic">
                        {lastActive ? getRelativeTime(lastActive) : 'Never'}
                    </span>
                );
            },
            showSetting: 'users.ui.columns.showLastActivityAt'
        },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => (
                <span className="text-muted text-sm">
                    {new Date(row.original.created_at * 1000).toLocaleDateString()}
                </span>
            ),
            showSetting: 'users.ui.columns.showCreatedAt'
        },
        {
            id: 'updated_at',
            accessorKey: 'updated_at',
            header: 'Updated',
            cell: ({ row }) => (
                <span className="text-muted text-sm">
                    {row.original.updated_at ? new Date(row.original.updated_at * 1000).toLocaleDateString() : '—'}
                </span>
            ),
            showSetting: 'users.ui.columns.showUpdatedAt'
        },
        // Actions
        {
            id: 'quickActions',
            header: '',
            cell: ({ row }) => (
                <UserQuickActions
                    user={row.original}
                    onView={() => handleView(row.original)}
                    onEdit={() => handleEdit(row.original)}
                    onDelete={() => handleDelete([row.original], row.original.status === 'archived')}
                    onStatusChange={handleStatusChange}
                />
            ),
            size: 50,
        },
    ];

    const baseColumns = [...allColumns];
    schemaColumns.forEach(sc => {
        const pascalName = sc.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        const showKey = `users.ui.columns.show${pascalName}`;

        // Check if this DB field is already covered by a hardcoded column
        // We match by showSetting OR by accessorKey directly
        const isCovered = allColumns.some(col =>
            col.showSetting === showKey ||
            (col as any).accessorKey === sc.name ||
            (col.id === 'name' && (sc.name === 'first_name' || sc.name === 'last_name' || sc.name === 'username'))
        );

        if (!isCovered) {
            const label = sc.name.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            baseColumns.push({
                id: sc.name,
                accessorKey: sc.name,
                header: label,
                cell: ({ row }: { row: any }) => {
                    const val = row.original[sc.name as keyof User];
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
            });
        }
    });

    const columns = baseColumns.filter(col => {
        const settingKey = (col as any).showSetting;
        if (!settingKey) return true;

        // Ensure actions and mandatory columns stay
        if (col.id === 'quickActions' || col.id === 'actions') return true;

        // Special case for 'User' (name) column - it combines multiple fields
        // Since we moved its setting to showUsername, it follows that now
        if (col.id === 'name' && col.showSetting === 'users.ui.columns.showUsername') {
            return visibleColumns['users.ui.columns.showUsername'] !== false;
        }

        return visibleColumns[settingKey] !== false;
    });

    const handleResendInvite = async (id: string) => {
        try {
            const res = await apiFetch(`/api/v1/invitations/${id}/resend`, { method: 'POST' });
            if (res.ok) {
                showToast('Invitation resent successfully', 'success');
                fetchInvitations();
                refreshTenantUsage();
            } else {
                throw new Error('Failed to resend');
            }
        } catch (err) {
            showToast('Failed to resend invitation', 'error');
        }
    };

    const handleRevokeInvite = async (id: string) => {
        if (!confirm('Are you sure you want to revoke this invitation?')) return;
        try {
            const res = await apiFetch(`/api/v1/invitations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showToast('Invitation revoked', 'info');
                fetchInvitations();
                refreshTenantUsage();
            } else {
                throw new Error('Failed to revoke');
            }
        } catch (err) {
            showToast('Failed to revoke invitation', 'error');
        }
    };

    const invitationColumns: ColumnDef<any, any>[] = [
        {
            id: 'email',
            accessorKey: 'email',
            header: 'Invited Email',
            cell: ({ row }) => <span className="font-medium text-sm">{row.original.email}</span>
        },
        {
            id: 'role',
            accessorKey: 'role_id',
            header: 'Assigned Role',
            cell: ({ row }) => <RoleBadge role={row.original.role_id} />
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${row.original.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
                    row.original.status === 'expired' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>
                    {row.original.status}
                </span>
            )
        },
        {
            id: 'invited_by',
            accessorKey: 'invited_by',
            header: 'Invited By',
            cell: ({ row }) => <span className="text-sm text-muted">{row.original.invited_by}</span>
        },
        {
            id: 'expires_at',
            accessorKey: 'expires_at',
            header: 'Expires',
            cell: ({ row }) => <span className="text-xs">{getRelativeTime(row.original.expires_at)}</span>
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleResendInvite(row.original.id)}
                        className="p-1 px-2 text-[10px] bg-brand-primary/10 text-brand-primary rounded border border-brand-primary/30 hover:bg-brand-primary/20 transition-colors uppercase font-bold"
                    >
                        Resend
                    </button>
                    <button
                        onClick={() => handleRevokeInvite(row.original.id)}
                        className="p-1 px-2 text-[10px] bg-red-500/10 text-red-500 rounded border border-red-500/30 hover:bg-red-500/20 transition-colors uppercase font-bold"
                    >
                        Revoke
                    </button>
                </div>
            )
        }
    ];

    // Render
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{PAGE_CONFIG.title}</h1>
                    <p className="text-muted text-sm mt-1">{activeTenant ? `Manage users for ${activeTenant.name}` : PAGE_CONFIG.getDescription('global')}</p>
                </div>
                <div className="flex items-center gap-3">
                    {uiSettings['users.ui.showExport'] !== false && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-muted rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    )}
                    {uiSettings['users.ui.showImport'] !== false && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-border-muted rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
                            <Upload className="w-4 h-4" />
                            Import
                        </button>
                    )}
                    <button
                        onClick={() => window.location.href = '/hpanel/users/roles'}
                        className="flex items-center gap-2 px-4 py-2 border border-border-muted rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                        <Shield className="w-4 h-4" />
                        Manage Roles
                    </button>
                    {uiSettings['users.ui.allowInvite'] !== false && (
                        <div className="flex items-center gap-3">
                            {(activeTenant?.max_users || 0) > 0 && (
                                <div className="text-sm text-muted hidden md:block">
                                    <span className={((activeTenant?.current_users || 0) >= (activeTenant?.max_users || 0)) ? 'text-red-400 font-bold' : ''}>
                                        {activeTenant?.current_users || 0}
                                    </span>
                                    <span className="opacity-50"> / </span>
                                    <span>{activeTenant?.max_users} users</span>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    if ((activeTenant?.max_users || 0) > 0 && (activeTenant?.current_users || 0) >= (activeTenant?.max_users || 0)) {
                                        showToast('User limit reached. Please upgrade your plan.', 'error');
                                        return;
                                    }
                                    handleInvite();
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${(activeTenant?.max_users || 0) > 0 && (activeTenant?.current_users || 0) >= (activeTenant?.max_users || 0)
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                                    }`}
                            >
                                <PAGE_CONFIG.addButtonIcon className="w-4 h-4" />
                                {PAGE_CONFIG.addButtonLabel}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards (Config-Driven) */}
            {uiSettings['users.ui.showStatsCards'] !== false && (
                <div className="grid grid-cols-4 gap-4">
                    {STATS_CONFIG.map((stat) => {
                        const stats = {
                            total: users.length,
                            active: users.filter(u => u.status === 'active').length,
                            pending: users.filter(u => u.status === 'pending').length,
                            roles: new Set(users.map(u => u.role)).size,
                        };
                        const count = stats[stat.key as keyof typeof stats] || 0;
                        return (
                            <div key={stat.key} className="bg-dark rounded-xl border border-border-muted p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                                        <stat.Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{count}</div>
                                        <div className="text-xs text-muted">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-darker rounded-xl border border-border-muted w-fit mt-2">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users'
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                        : 'text-muted hover:text-primary hover:bg-white/5'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Users
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'users' ? 'bg-white/20' : 'bg-white/5'}`}>
                            {users.length}
                        </span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('invitations')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'invitations'
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                        : 'text-muted hover:text-primary hover:bg-white/5'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Pending Invitations
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'invitations' ? 'bg-white/20' : 'bg-white/5'}`}>
                            {invitations.length}
                        </span>
                    </div>
                </button>
            </div>

            {/* Filters (Dynamic Config-Driven) */}
            {(() => {
                const filterConfig = uiSettings['users.ui.filterConfig'] || {};
                const searchEnabled = uiSettings['users.ui.showSearch'] !== false;

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
                                        <option value="all">All Status</option>
                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                            <option key={key} value={key}>{config.label}</option>
                                        ))}
                                    </select>
                                );
                            }
                            if (cfg.key === 'role') {
                                return (
                                    <select
                                        key="role"
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm min-w-[120px]"
                                    >
                                        <option value="all">All Roles</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.slug}>{role.name}</option>
                                        ))}
                                    </select>
                                );
                            }

                            switch (cfg.type) {
                                case 'select':
                                case 'multi-select':
                                    const options = cfg.options === 'auto'
                                        ? [...new Set(users.map(u => (u as any)[cfg.key]))].filter(Boolean).map(v => ({ label: v, value: v }))
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
                                default: return null;
                            }
                        })}

                        {statusFilter === 'archived' && filteredUsers.length > 0 && (
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

            {/* Bulk Actions Bar */}
            {selectedUsers.length > 0 && (
                <div className="flex items-center gap-4 p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
                    <span className="text-sm font-medium">{selectedUsers.length} user(s) selected</span>
                    <div className="flex gap-2 ml-auto">
                        <button className="px-3 py-1.5 text-sm border border-border-muted rounded-lg hover:bg-white/5">Change Role</button>
                        <button className="px-3 py-1.5 text-sm border border-border-muted rounded-lg hover:bg-white/5">Suspend</button>
                        <button className="px-3 py-1.5 text-sm border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10">Delete</button>
                        <button onClick={() => setSelectedUsers([])} className="px-3 py-1.5 text-sm text-muted hover:text-primary">Clear</button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <DataTable
                data={(activeTab === 'users' ? paginatedUsers : invitations) as any[]}
                columns={(activeTab === 'users' ? columns : invitationColumns) as any[]}
                isLoading={isLoading}
                onDelete={activeTab === 'users' ? handleDelete : undefined}
            />

            {/* Pagination Controls (Config-Driven) */}
            {(users.length > 0 && uiSettings['users.ui.showPagination'] !== false) && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length}
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
            )}

            {/* Drawer */}
            <RightDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerMode === 'invite' ? 'Invite User' : drawerMode === 'edit' ? 'Edit User' : 'User Details'}
            >
                {drawerMode === 'view' && selectedUser ? (
                    <UserDetails
                        user={selectedUser}
                        roles={roles}
                        onEdit={() => setDrawerMode('edit')}
                        onStatusChange={handleStatusChange}
                        showToast={showToast}
                    />
                ) : (
                    <InviteUserForm
                        user={selectedUser}
                        roles={roles}
                        onSave={handleSave}
                        onClose={() => setDrawerOpen(false)}
                        isEdit={drawerMode === 'edit'}
                    />
                )}
            </RightDrawer>

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
// SUB-COMPONENTS
// ============================================================================

function UserDetails({ user, roles, onEdit, onStatusChange, showToast }: {
    user: User;
    roles: Role[];
    onEdit: () => void;
    onStatusChange: (user: User, status: User['status']) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}) {
    const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');

    // Mock activities for now
    const activities = [
        { id: 1, action: 'User logged in', timestamp: Math.floor(Date.now() / 1000) - 3600, icon: Key, color: 'text-blue-400' },
        { id: 2, action: 'Updated profile information', timestamp: Math.floor(Date.now() / 1000) - 86400, icon: Edit2, color: 'text-emerald-400' },
        { id: 3, action: 'Password changed', timestamp: Math.floor(Date.now() / 1000) - 259200, icon: Shield, color: 'text-orange-400' },
        { id: 4, action: 'Joined via manual invitation', timestamp: user.created_at, icon: Mail, color: 'text-brand-primary' },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xl font-bold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
                    <p className="text-muted text-sm">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                        <StatusBadge status={user.status} />
                        <RoleBadge role={user.role} />
                    </div>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-border-muted mb-6">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted hover:text-primary'}`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted hover:text-primary'}`}
                >
                    Activity History
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === 'profile' ? (
                    <div className="space-y-6">
                        <div className="space-y-3 pb-6 border-b border-border-muted">
                            <div className="flex justify-between py-2">
                                <span className="text-muted text-sm">Username</span>
                                <span className="text-sm font-mono">{user.username}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted text-sm">Joined Via</span>
                                <span className="text-sm capitalize">{user.joined_via || 'signup'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted text-sm">Last Active</span>
                                <span className="text-sm">{user.last_activity_at ? new Date(user.last_activity_at * 1000).toLocaleString() : 'Never'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted text-sm">Created</span>
                                <span className="text-sm">{new Date(user.created_at * 1000).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Account Management</div>
                            <div className="space-y-2">
                                <button onClick={onEdit} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium">
                                    <Edit2 className="w-4 h-4" /> Edit User
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                                    <Key className="w-4 h-4" /> Reset Password
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-red-500/30 space-y-2">
                            <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 opacity-70">Danger Zone</div>
                            {user.status === 'active' ? (
                                <button
                                    onClick={() => {
                                        if (user.role === 'admin' || user.role === 'super_admin') {
                                            showToast('Administrative accounts cannot be suspended', 'error');
                                        } else {
                                            onStatusChange(user, 'suspended');
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/10 transition-colors text-sm font-medium"
                                >
                                    <XCircle className="w-4 h-4" /> Suspend Account
                                </button>
                            ) : (
                                <button
                                    onClick={() => onStatusChange(user, 'active')}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/10 transition-colors text-sm font-medium"
                                >
                                    <CheckCircle className="w-4 h-4" /> Activate Account
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-border-muted hover:border-brand-primary/30 transition-colors group">
                                <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${activity.color}`}>
                                    <activity.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium group-hover:text-primary transition-colors">{activity.action}</div>
                                    <div className="text-xs text-muted mt-1 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {getRelativeTime(activity.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 text-xs text-muted hover:text-brand-primary transition-colors border border-dashed border-border-muted rounded-lg mt-2 font-medium">
                            View All Activity
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface InviteUserFormProps {
    user: User | null;
    roles: Role[];
    onSave: (data: any) => void;
    onClose: () => void;
    isEdit: boolean;
}

function InviteUserForm({ user, roles, onSave, onClose, isEdit }: InviteUserFormProps) {
    const [email, setEmail] = useState(user?.email || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [role, setRole] = useState(user?.role || 'viewer');
    const [sendInvite, setSendInvite] = useState(true);
    const [message, setMessage] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: user?.id, email, first_name: firstName, last_name: lastName, role, send_invite: sendInvite, message, expiry_date: expiryDate });
    };

    const selectedRole = roles.find(r => r.slug === role);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-400">*</span></label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" className="w-full pl-10 pr-4 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">First Name <span className="text-red-400">*</span></label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-400">*</span></label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary">
                    {roles.map(r => <option key={r.id} value={r.slug}>{r.name}</option>)}
                </select>
                {selectedRole?.description && <p className="text-xs text-muted mt-1">{selectedRole.description}</p>}
            </div>

            {!isEdit && (
                <div className="flex items-center justify-between p-3 bg-darker rounded-lg">
                    <div>
                        <div className="font-medium text-sm">Send invitation email</div>
                        <div className="text-xs text-muted">User will receive an email with login instructions</div>
                    </div>
                    <button type="button" onClick={() => setSendInvite(!sendInvite)} className={`w-11 h-6 rounded-full transition-colors relative ${sendInvite ? 'bg-brand-primary' : 'bg-gray-600'}`}>
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${sendInvite ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
            )}

            {sendInvite && !isEdit && (
                <div>
                    <label className="block text-sm font-medium mb-1">Custom Message (optional)</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a personal message..." rows={3} className="w-full px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none" />
                </div>
            )}

            {!isEdit && (
                <div>
                    <label className="block text-sm font-medium mb-1">Account Expiry (optional)</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <p className="text-xs text-muted mt-1">Leave empty for permanent access</p>
                </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border-muted">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90">
                    {isEdit ? 'Save Changes' : sendInvite ? 'Send Invitation' : 'Create User'}
                </button>
            </div>
        </form>
    );
}
