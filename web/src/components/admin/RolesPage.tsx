import React, { useState, useEffect } from 'react';
import {
    Shield, Plus, Edit, Trash2, Users, Check, X,
    ChevronDown, ChevronUp, MoreVertical
} from 'lucide-react';

interface Role {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_system: boolean;
    color?: string;
    user_count?: number;
}

interface Permission {
    id: string;
    module: string;
    name: string;
    slug: string;
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
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [expandedRole, setExpandedRole] = useState<string | null>(null);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/users/roles');
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setRoles(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleCreate = () => {
        setEditingRole(null);
        setModalOpen(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setModalOpen(true);
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
        if (editingRole) {
            setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...data } : r));
        } else {
            setRoles(prev => [...prev, { ...data, id: crypto.randomUUID(), is_system: false } as Role]);
        }
        setModalOpen(false);
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
                            <div className="text-2xl font-bold">{roles.reduce((a, r) => a + (r.user_count || 0), 0)}</div>
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
                                <h4 className="font-medium mb-4">Permissions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {PERMISSION_MODULES.map((module) => (
                                        <div key={module.name} className="space-y-2">
                                            <div className="text-sm font-medium">{module.name}</div>
                                            <div className="space-y-1">
                                                {module.permissions.map((perm) => (
                                                    <div key={perm} className="flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-green-400" />
                                                        <span className="text-sm text-muted capitalize">{perm}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-dark rounded-xl border border-border-muted p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingRole ? 'Edit Role' : 'Create Role'}
                        </h2>
                        <RoleForm
                            role={editingRole}
                            onSave={handleSave}
                            onCancel={() => setModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function RoleForm({ role, onSave, onCancel }: { role: Role | null; onSave: (data: Partial<Role>) => void; onCancel: () => void }) {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [color, setColor] = useState(role?.color || '#3b82f6');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, slug: name.toLowerCase().replace(/\s+/g, '_'), description, color });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-darker border border-border-muted rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-darker border border-border-muted rounded-lg"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex gap-2">
                    {['#9333ea', '#3b82f6', '#10b981', '#eab308', '#ef4444', '#6b7280'].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-lg border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-border-muted rounded-lg">
                    Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium">
                    Save
                </button>
            </div>
        </form>
    );
}
