import React, { useState, useEffect, useRef } from 'react';
import {
    Shield, Plus, Edit, Trash2, Users, Check, X,
    ChevronDown, ChevronUp, MoreVertical, Lock, Info
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useToast } from '../ui/Toast';
import { useTenant } from '../../context/TenantContext';

interface Role {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_system: boolean;
    color?: string;
    user_count?: number;
    permissions?: string[];
}

interface ModulePermissions {
    moduleId: string;
    moduleName: string;
    permissions: string[];
}

const PERMISSION_MODULES = [
    {
        name: 'Users',
        permissions: ['view', 'create', 'edit', 'delete', 'invite'],
    },
    {
        name: 'Roles',
        permissions: ['view', 'manage'],
    },
    {
        name: 'Settings',
        permissions: ['view', 'manage'],
    },
    {
        name: 'CMS',
        permissions: ['view', 'create', 'edit', 'delete', 'publish'],
    },
    {
        name: 'CRM',
        permissions: ['view', 'create', 'edit', 'delete'],
    },
];

const DEFAULT_ROLES: Role[] = [
    { id: '1', name: 'Super Admin', slug: 'super_admin', description: 'Full platform access', is_system: true, color: '#9333ea', user_count: 1 },
    { id: '2', name: 'Admin', slug: 'admin', description: 'Full tenant access', is_system: true, color: '#3b82f6', user_count: 3 },
    { id: '3', name: 'Editor', slug: 'editor', description: 'Can create and edit content', is_system: true, color: '#eab308', user_count: 12 },
    { id: '4', name: 'Viewer', slug: 'viewer', description: 'Read-only access', is_system: true, color: '#6b7280', user_count: 25 },
];

export function RolesPage() {
    const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
    const [availablePermissions, setAvailablePermissions] = useState<ModulePermissions[]>([]);
    const [totalUserCount, setTotalUserCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [expandedRole, setExpandedRole] = useState<string | null>(null);
    const { showToast } = useToast();
    const { activeTenant } = useTenant();

    const fetchPermissions = async () => {
        try {
            const res = await apiFetch('/api/v1/permissions');
            if (res.ok) {
                setAvailablePermissions(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
        }
    };

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeTenant?.id) params.set('tenantId', activeTenant.id);

            const res = await apiFetch(`/api/v1/roles?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setRoles(data);
                    // Update total user count from unique assignments or fetch separate total
                    const uniqueUsersCount = data.reduce((acc: number, r: Role) => acc + (r.user_count || 0), 0);
                    setTotalUserCount(uniqueUsersCount);
                }
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
            showToast('Failed to load roles', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRoleDetails = async (roleId: string) => {
        try {
            const res = await apiFetch(`/api/v1/roles/${roleId}`);
            if (res.ok) {
                const detailedRole = await res.json();
                setRoles(prev => prev.map(r => r.id === roleId ? detailedRole : r));
            }
        } catch (error) {
            console.error('Failed to fetch role details:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [activeTenant]);

    useEffect(() => {
        if (expandedRole) {
            const role = roles.find(r => r.id === expandedRole);
            if (role && !role.permissions) {
                fetchRoleDetails(expandedRole);
            }
        }
    }, [expandedRole]);

    const handleCreate = () => {
        setEditingRole(null);
        setModalOpen(true);
    };

    const handleEdit = async (role: Role) => {
        // Fetch full details including permissions before editing
        setIsLoading(true);
        try {
            const res = await apiFetch(`/api/v1/roles/${role.id}`);
            if (res.ok) {
                const detailedRole = await res.json();
                setEditingRole(detailedRole);
                setModalOpen(true);
            } else {
                setEditingRole(role);
                setModalOpen(true);
            }
        } catch (error) {
            setEditingRole(role);
            setModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (role: Role) => {
        if (role.is_system) {
            alert('Cannot delete system roles');
            return;
        }
        if (!confirm(`Delete role "${role.name}"?`)) return;
        // API call
        setRoles(prev => prev.filter(r => r.id !== role.id));
    };

    const handleSave = async (data: Partial<Role>) => {
        setIsLoading(true);
        try {
            const url = editingRole ? `/api/v1/roles/${editingRole.id}` : '/api/v1/roles';
            const method = editingRole ? 'PATCH' : 'POST';

            const res = await apiFetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    tenantId: activeTenant?.id || 'default'
                }),
            });

            if (res.ok) {
                showToast(`Role ${editingRole ? 'updated' : 'created'} successfully`, 'success');
                fetchRoles();
                setModalOpen(false);
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to save role', 'error');
            }
        } catch (error) {
            showToast('An error occurred while saving', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Roles & Permissions</h1>
                    <p className="text-muted text-sm mt-1">Manage user roles and their permissions</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90"
                >
                    <Plus className="w-4 h-4" />
                    Create Role
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-dark rounded-xl border border-border-muted p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{roles.length}</div>
                            <div className="text-xs text-muted">Total Roles</div>
                        </div>
                    </div>
                </div>
                <div className="bg-dark rounded-xl border border-border-muted p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{roles.filter(r => r.is_system).length}</div>
                            <div className="text-xs text-muted">System Roles</div>
                        </div>
                    </div>
                </div>
                <div className="bg-dark rounded-xl border border-border-muted p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{totalUserCount}</div>
                            <div className="text-xs text-muted">Total Users</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roles List */}
            <div className="space-y-4">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="bg-dark rounded-xl border border-border-muted overflow-hidden"
                    >
                        {/* Role Header */}
                        <div
                            className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5"
                            onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${role.color || '#6b7280'}20` }}
                            >
                                <Shield className="w-5 h-5" style={{ color: role.color || '#6b7280' }} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{role.name}</h3>
                                    {role.is_system && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">System</span>
                                    )}
                                </div>
                                <p className="text-sm text-muted">{role.description}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="font-medium">{role.user_count || 0}</div>
                                    <div className="text-xs text-muted">users</div>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEdit(role); }}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <Edit className="w-4 h-4 text-muted" />
                                </button>

                                {!role.is_system && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(role); }}
                                        className="p-2 hover:bg-red-500/10 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                )}

                                {expandedRole === role.id ? (
                                    <ChevronUp className="w-5 h-5 text-muted" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-muted" />
                                )}
                            </div>
                        </div>

                        {/* Permissions Panel */}
                        {expandedRole === role.id && (
                            <div className="border-t border-border-muted p-4 bg-darker">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">Role Permissions</h4>
                                    <div className="text-xs text-muted">
                                        {role.permissions?.length || 0} permissions active
                                    </div>
                                </div>

                                {availablePermissions.length === 0 ? (
                                    <div className="text-sm text-muted italic p-4 text-center border border-dashed border-border-muted rounded-lg">
                                        Loading permissions...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {availablePermissions.map((module) => (
                                            <div key={module.moduleId} className="space-y-3 p-4 bg-dark/50 rounded-xl border border-border-muted/50">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                                                    {module.moduleName}
                                                </div>
                                                <div className="space-y-2">
                                                    {module.permissions.map((perm) => {
                                                        const isGranted = role.permissions?.includes(perm);
                                                        return (
                                                            <div key={perm} className="flex items-center gap-2 group">
                                                                {isGranted ? (
                                                                    <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                                                        <Check className="w-3 h-3 text-green-400" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-4 h-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                                                        <X className="w-3 h-3 text-red-400/50" />
                                                                    </div>
                                                                )}
                                                                <span className={`text-xs capitalize transition-colors ${isGranted ? 'text-primary' : 'text-muted'}`}>
                                                                    {perm.split('.').pop()?.replace('_', ' ')}
                                                                </span>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                                                    <span className="text-[10px] text-muted font-mono">{perm}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-dark rounded-xl border border-border-muted p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl scale-in-center">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">
                                {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-muted" />
                            </button>
                        </div>

                        <RoleForm
                            role={editingRole}
                            availablePermissions={availablePermissions}
                            onSave={handleSave}
                            onCancel={() => setModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function RoleForm({
    role,
    availablePermissions,
    onSave,
    onCancel
}: {
    role: Role | null;
    availablePermissions: ModulePermissions[];
    onSave: (data: Partial<Role>) => void;
    onCancel: () => void
}) {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [color, setColor] = useState(role?.color || '#3b82f6');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role?.permissions || []);

    const togglePermission = (perm: string) => {
        setSelectedPermissions(prev =>
            prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
        );
    };

    const toggleModule = (modulePerms: string[]) => {
        const allPresent = modulePerms.every(p => selectedPermissions.includes(p));
        if (allPresent) {
            setSelectedPermissions(prev => prev.filter(p => !modulePerms.includes(p)));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePerms])]);
        }
    };

    const [customTemplates, setCustomTemplates] = useState<Record<string, string[]>>(() => {
        const saved = localStorage.getItem('role_permission_templates');
        return saved ? JSON.parse(saved) : {};
    });

    const applyTemplate = (type: 'admin' | 'editor' | 'viewer' | 'none' | string) => {
        if (type === 'none') {
            setSelectedPermissions([]);
            return;
        }

        const allPerms = availablePermissions.flatMap(m => m.permissions);
        if (allPerms.length === 0) return;

        // Handle system templates
        if (type === 'admin') {
            setSelectedPermissions(allPerms);
        } else if (type === 'editor') {
            setSelectedPermissions(allPerms.filter(p =>
                p.endsWith('.view') || p.endsWith('.create') || p.endsWith('.edit') || p.endsWith('.update') || p.includes('.manage')
            ));
        } else if (type === 'viewer') {
            setSelectedPermissions(allPerms.filter(p => p.endsWith('.view')));
        } else if (customTemplates[type]) {
            // Handle custom templates
            setSelectedPermissions(customTemplates[type]);
        }
    };

    const hasAutoApplied = useRef(false);

    // Auto-apply on load if name matches and permissions are empty
    useEffect(() => {
        if (!hasAutoApplied.current && selectedPermissions.length === 0 && name && availablePermissions.length > 0) {
            const lower = name.toLowerCase();
            let applied = false;
            if (lower === 'admin' || lower === 'administrator') { applyTemplate('admin'); applied = true; }
            else if (lower === 'editor') { applyTemplate('editor'); applied = true; }
            else if (lower === 'viewer') { applyTemplate('viewer'); applied = true; }
            else if (customTemplates[name]) { applyTemplate(name); applied = true; }

            if (applied) hasAutoApplied.current = true;
        }
    }, [availablePermissions.length, name]); // Re-run when permissions are loaded or name changes

    const handleSaveTemplate = () => {
        if (selectedPermissions.length === 0) return;
        const templateName = prompt('Enter a name for this template:');
        if (templateName) {
            const newTemplates = { ...customTemplates, [templateName]: selectedPermissions };
            setCustomTemplates(newTemplates);
            localStorage.setItem('role_permission_templates', JSON.stringify(newTemplates));
        }
    };

    const handleNameChange = (newName: string) => {
        setName(newName);
        // Auto-apply if permissions are currently empty
        if (selectedPermissions.length === 0) {
            const lower = newName.toLowerCase();
            if (lower === 'admin' || lower === 'administrator') applyTemplate('admin');
            else if (lower === 'editor') applyTemplate('editor');
            else if (lower === 'viewer') applyTemplate('viewer');
            else if (customTemplates[newName]) applyTemplate(newName);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            slug: role?.slug || name.toLowerCase().replace(/\s+/g, '_'),
            description,
            color,
            permissions: selectedPermissions
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Role Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full px-3 py-2 bg-darker border border-border-muted rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                            placeholder="e.g. Content Manager"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-darker border border-border-muted rounded-lg focus:ring-2 focus:ring-brand-primary outline-none h-20 resize-none"
                            placeholder="What can this role do?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Accent Color</label>
                        <div className="flex flex-wrap gap-2">
                            {['#9333ea', '#3b82f6', '#10b981', '#eab308', '#ef4444', '#6b7280', '#ec4899', '#f97316'].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-lg border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-darker border border-border-muted rounded-xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <label className="block text-sm font-bold">Permission Matrix</label>
                            <span className="text-[10px] text-muted">{selectedPermissions.length} selected</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleSaveTemplate}
                                title="Save current selection as a template"
                                className="text-[10px] text-muted hover:text-primary uppercase tracking-wider font-semibold bg-white/5 px-2 py-1 rounded transition-colors"
                            >
                                Save Template
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('admin')}
                                className="text-[10px] text-muted hover:text-primary uppercase tracking-wider font-semibold bg-white/5 px-2 py-1 rounded transition-colors"
                            >
                                All
                            </button>
                            <button
                                type="button"
                                onClick={() => applyTemplate('none')}
                                className="text-[10px] text-muted hover:text-primary uppercase tracking-wider font-semibold bg-white/5 px-2 py-1 rounded transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => applyTemplate('editor')}
                            className="flex-1 text-[10px] py-1.5 bg-white/5 hover:bg-white/10 rounded border border-border-muted transition-colors font-medium min-w-[80px]"
                        >
                            Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => applyTemplate('viewer')}
                            className="flex-1 text-[10px] py-1.5 bg-white/5 hover:bg-white/10 rounded border border-border-muted transition-colors font-medium min-w-[80px]"
                        >
                            Viewer
                        </button>
                        {Object.keys(customTemplates).map(tmpl => (
                            <button
                                key={tmpl}
                                type="button"
                                onClick={() => applyTemplate(tmpl)}
                                className="flex-1 text-[10px] py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 rounded border border-brand-primary/20 transition-colors font-medium min-w-[80px]"
                            >
                                {tmpl}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[300px] custom-scrollbar">
                        {availablePermissions.map((module) => (
                            <div key={module.moduleId} className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => toggleModule(module.permissions)}
                                    className="flex items-center gap-2 text-xs font-bold text-muted hover:text-primary transition-colors uppercase tracking-widest"
                                >
                                    {module.moduleName}
                                    <div className="h-px flex-1 bg-border-muted" />
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    {module.permissions.map((perm) => (
                                        <label
                                            key={perm}
                                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${selectedPermissions.includes(perm)
                                                ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
                                                : 'bg-dark border-border-muted/50 hover:bg-white/5 text-muted'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes(perm)}
                                                onChange={() => togglePermission(perm)}
                                                className="hidden"
                                            />
                                            <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${selectedPermissions.includes(perm) ? 'bg-brand-primary border-brand-primary' : 'border-muted'
                                                }`}>
                                                {selectedPermissions.includes(perm) && <Check className="w-2.5 h-2.5 text-white" />}
                                            </div>
                                            <span className="text-[11px] truncate capitalize">
                                                {perm.split('.').pop()?.replace('_', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-muted">
                <button type="button" onClick={onCancel} className="px-6 py-2 border border-border-muted rounded-lg font-medium hover:bg-white/5 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="flex-1 px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
                    {role ? 'Update Role Settings' : 'Create Access Role'}
                </button>
            </div>
        </form>
    );
}
