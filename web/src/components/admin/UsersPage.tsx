import React, { useState, useEffect, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './DataTable';
import { RightDrawer } from './RightDrawer';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';
import {
    Users, UserPlus, Shield, Mail, Calendar,
    CheckCircle, Clock, XCircle, AlertTriangle,
    Search, Download, Upload, Eye, Edit2, Key, History, UserX, X,
    Plus, Trash2, Building2, MoreVertical
} from 'lucide-react';
import { useToast } from '../ui/Toast';

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
    status: 'active' | 'pending' | 'suspended' | 'inactive';
    last_login_at?: number;
    created_at: number;
    updated_at?: number;
    avatar_url?: string;
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
    rolesEndpoint: '/api/v1/users/roles',
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
            { value: 'inactive', label: 'Inactive' },
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
    inactive: { label: 'Inactive', color: 'bg-gray-500/20 text-gray-400', Icon: AlertTriangle },
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
    onStatusChange: (status: User['status']) => void;
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
            ? [{ label: 'Suspend', icon: XCircle, onClick: () => onStatusChange('suspended'), color: 'text-orange-400' }]
            : [{ label: 'Activate', icon: CheckCircle, onClick: () => onStatusChange('active'), color: 'text-green-400' }]
        ),
        { type: 'divider' },
        { label: 'Delete User', icon: Trash2, onClick: onDelete, color: 'text-red-400' },
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
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({});
    const [uiSettings, setUiSettings] = useState<Record<string, any>>({});
    const { activeTenant } = useTenant();
    const { showToast } = useToast();

    // Load UI settings
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await apiFetch(`/api/v1/settings/sections/users`);
                let settings: Record<string, any> = {};

                if (res.ok) {
                    const data = await res.json();
                    settings = data.values || {};
                } else {
                    const storageKey = `settings_users_${activeTenant?.id || 'default'}`;
                    const saved = localStorage.getItem(storageKey);
                    if (saved) settings = JSON.parse(saved);
                }

                if (Object.keys(settings).length > 0) {
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
                }
            } catch (err) {
                console.error('Failed to load settings', err);
            }
        };
        loadSettings();
    }, [activeTenant?.id]);

    // Data fetching
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const tenantId = activeTenant?.id || 'default';
            const res = await apiFetch(`${PAGE_CONFIG.apiEndpoint}?tenantId=${tenantId}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.map((u: any) => ({
                    ...u,
                    email: u.email || `${u.username}@example.com`,
                    first_name: u.first_name || u.username || 'User',
                    last_name: u.last_name || '',
                    status: u.status || 'active',
                })));
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setIsLoading(false);
        }
    };

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

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [activeTenant]);

    // Handlers
    const handleInvite = () => { setSelectedUser(null); setDrawerMode('invite'); setDrawerOpen(true); };
    const handleEdit = (user: User) => { setSelectedUser(user); setDrawerMode('edit'); setDrawerOpen(true); };
    const handleView = (user: User) => { setSelectedUser(user); setDrawerMode('view'); setDrawerOpen(true); };
    const handleDelete = async (rows: User[]) => {
        if (!confirm(`Permanently delete ${rows.length} user(s)? This cannot be undone.`)) return;
        try {
            for (const user of rows) {
                await apiFetch(`${PAGE_CONFIG.apiEndpoint}/${user.id}`, { method: 'DELETE' });
            }
            showToast('Users deleted successfully', 'success');
            fetchUsers();
        } catch (err) {
            showToast('Failed to delete users', 'error');
        }
    };

    const handleStatusChange = async (user: User, newStatus: User['status']) => {
        try {
            const res = await apiFetch(`${PAGE_CONFIG.apiEndpoint}/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Update failed');
            showToast(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`, 'success');
            fetchUsers();
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    };
    const handleSave = async (formData: any) => {
        console.log('Saving:', formData);
        setDrawerOpen(false);
        fetchUsers();
    };

    // Filter users (with debounced search)
    const filteredUsers = users.filter(user => {
        const matchesSearch = !debouncedSearch ||
            user.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            user.first_name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
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

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || roleFilter !== 'all';

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setRoleFilter('all');
    };

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
            id: 'last_login_at',
            accessorKey: 'last_login_at',
            header: 'Last Login',
            cell: ({ row }) => (
                <span className="text-muted text-sm italic">
                    {getRelativeTime(row.original.last_login_at)}
                </span>
            ),
            showSetting: 'users.ui.columns.showLastLogin'
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
                    onDelete={() => handleDelete([row.original])}
                    onStatusChange={(status) => handleStatusChange(row.original, status)}
                />
            ),
            size: 50,
        },
    ];

    // Filter columns based on settings
    const columns = allColumns.filter(col => {
        const settingKey = col.showSetting;
        if (!settingKey) return true;
        // Specifically for name/username/email - if any is on, we show the combined 'name' col if it's the main handle
        if (col.id === 'name') return true;
        return visibleColumns[settingKey] !== false;
    });

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
                    {uiSettings['users.ui.allowInvite'] !== false && (
                        <button
                            onClick={handleInvite}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary/90 transition-colors"
                        >
                            <PAGE_CONFIG.addButtonIcon className="w-4 h-4" />
                            {PAGE_CONFIG.addButtonLabel}
                        </button>
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

            {/* Filters (Config-Driven) */}
            <div className={`flex flex-wrap items-center gap-4 p-4 bg-darker rounded-xl border border-border-muted ${(uiSettings['users.ui.showSearch'] === false && uiSettings['users.ui.showStatusFilter'] === false && uiSettings['users.ui.showRoleFilter'] === false) ? 'hidden' : ''}`}>
                {uiSettings['users.ui.showSearch'] !== false && (
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

                {uiSettings['users.ui.showStatusFilter'] !== false && (
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    >
                        <option value="all">All Status</option>
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                )}

                {uiSettings['users.ui.showRoleFilter'] !== false && (
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-dark border border-border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    >
                        <option value="all">All Roles</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.slug}>{role.name}</option>
                        ))}
                    </select>
                )}
                {hasActiveFilters && (
                    <button onClick={clearFilters} className="flex items-center gap-2 px-3 py-2 text-muted hover:text-primary text-sm">
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>

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
                data={paginatedUsers}
                columns={columns}
                isLoading={isLoading}
                onDelete={handleDelete}
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
                    <UserDetails user={selectedUser} roles={roles} onEdit={() => setDrawerMode('edit')} />
                ) : (
                    <InviteUserForm
                        user={selectedUser}
                        roles={roles}
                        onSave={handleSave}
                        onCancel={() => setDrawerOpen(false)}
                        isEdit={drawerMode === 'edit'}
                    />
                )}
            </RightDrawer>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function UserDetails({ user, roles, onEdit }: { user: User; roles: Role[]; onEdit: () => void }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
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

            <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border-muted">
                    <span className="text-muted">Last Login</span>
                    <span>{getRelativeTime(user.last_login_at)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border-muted">
                    <span className="text-muted">Created</span>
                    <span>{new Date(user.created_at * 1000).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="space-y-2">
                <button onClick={onEdit} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg">
                    <Edit className="w-4 h-4" /> Edit User
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5">
                    <Key className="w-4 h-4" /> Reset Password
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5">
                    <History className="w-4 h-4" /> View Activity
                </button>
            </div>

            <div className="pt-4 border-t border-red-500/30 space-y-2">
                <div className="text-xs font-medium text-red-400 uppercase tracking-wider mb-2">Danger Zone</div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10">
                    <UserX className="w-4 h-4" /> Suspend Account
                </button>
            </div>
        </div>
    );
}

interface InviteUserFormProps {
    user: User | null;
    roles: Role[];
    onSave: (data: any) => void;
    onCancel: () => void;
    isEdit: boolean;
}

function InviteUserForm({ user, roles, onSave, onCancel, isEdit }: InviteUserFormProps) {
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
                <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90">
                    {isEdit ? 'Save Changes' : sendInvite ? 'Send Invitation' : 'Create User'}
                </button>
            </div>
        </form>
    );
}
