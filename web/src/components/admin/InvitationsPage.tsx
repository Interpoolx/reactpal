import React, { useState, useEffect } from 'react';
import {
    Mail, Clock, Check, X, RotateCcw, Copy, Trash2,
    UserPlus, Upload, Search, Filter
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface Invitation {
    id: string;
    email: string;
    role: string;
    status: 'pending' | 'accepted' | 'expired' | 'cancelled';
    invited_by: string;
    invited_at: number;
    expires_at: number;
    accepted_at?: number;
    token: string;
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-blue-500/20 text-blue-400', Icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-green-500/20 text-green-400', Icon: Check },
    expired: { label: 'Expired', color: 'bg-yellow-500/20 text-yellow-400', Icon: Clock },
    cancelled: { label: 'Cancelled', color: 'bg-gray-500/20 text-gray-400', Icon: X },
};

const MOCK_INVITATIONS: Invitation[] = [
    { id: '1', email: 'john@example.com', role: 'editor', status: 'pending', invited_by: 'Admin', invited_at: Date.now() / 1000 - 86400, expires_at: Date.now() / 1000 + 604800, token: 'abc123' },
    { id: '2', email: 'jane@example.com', role: 'viewer', status: 'accepted', invited_by: 'Admin', invited_at: Date.now() / 1000 - 172800, expires_at: Date.now() / 1000 + 432000, accepted_at: Date.now() / 1000 - 86400, token: 'def456' },
    { id: '3', email: 'bob@example.com', role: 'admin', status: 'expired', invited_by: 'Admin', invited_at: Date.now() / 1000 - 864000, expires_at: Date.now() / 1000 - 172800, token: 'ghi789' },
];

export function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const { activeTenant } = useTenant();

    const fetchInvitations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/v1/users/invitations?tenantId=${activeTenant?.id || 'default'}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) setInvitations(data);
            }
        } catch (error) {
            console.error('Failed to fetch invitations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, [activeTenant]);

    const handleResend = async (invitation: Invitation) => {
        alert(`Resending invitation to ${invitation.email}`);
        // API call
    };

    const handleCancel = async (invitation: Invitation) => {
        if (!confirm(`Cancel invitation to ${invitation.email}?`)) return;
        setInvitations(prev => prev.map(i =>
            i.id === invitation.id ? { ...i, status: 'cancelled' as const } : i
        ));
    };

    const handleCopyLink = (invitation: Invitation) => {
        const link = `${window.location.origin}/invite/${invitation.token}`;
        navigator.clipboard.writeText(link);
        alert('Invitation link copied!');
    };

    const handleDelete = async (invitation: Invitation) => {
        if (!confirm(`Delete invitation to ${invitation.email}?`)) return;
        setInvitations(prev => prev.filter(i => i.id !== invitation.id));
    };

    // Filter
    const filteredInvitations = invitations.filter(inv => {
        const matchesSearch = !searchQuery || inv.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Stats
    const stats = {
        total: invitations.length,
        pending: invitations.filter(i => i.status === 'pending').length,
        accepted: invitations.filter(i => i.status === 'accepted').length,
        expired: invitations.filter(i => i.status === 'expired').length,
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Invitations</h1>
                    <p className="text-muted text-sm mt-1">Manage pending and sent invitations</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setBulkModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 border border-border-muted rounded-lg hover:bg-white/5"
                    >
                        <Upload className="w-4 h-4" />
                        Bulk Invite
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium">
                        <UserPlus className="w-4 h-4" />
                        New Invitation
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Sent', value: stats.total, Icon: Mail, color: 'text-white' },
                    { label: 'Pending', value: stats.pending, Icon: Clock, color: 'text-blue-400' },
                    { label: 'Accepted', value: stats.accepted, Icon: Check, color: 'text-green-400' },
                    { label: 'Expired', value: stats.expired, Icon: Clock, color: 'text-yellow-400' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-dark rounded-xl border border-border-muted p-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${stat.color}`}>
                                <stat.Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-dark border border-border-muted rounded-lg"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-dark border border-border-muted rounded-lg"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-dark rounded-xl border border-border-muted overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border-muted">
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted">Email</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted">Role</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted">Status</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted">Invited By</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted">Sent</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted">Expires</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvitations.map((inv) => {
                            const statusConfig = STATUS_CONFIG[inv.status];
                            const isExpired = inv.expires_at < Date.now() / 1000;

                            return (
                                <tr key={inv.id} className="border-b border-border-muted hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted" />
                                            {inv.email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 capitalize">
                                            {inv.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                            <statusConfig.Icon className="w-3 h-3" />
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted">{inv.invited_by}</td>
                                    <td className="px-4 py-3 text-muted text-sm">
                                        {new Date(inv.invited_at * 1000).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={isExpired ? 'text-red-400' : 'text-muted'}>
                                            {new Date(inv.expires_at * 1000).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {inv.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleResend(inv)}
                                                        className="p-2 hover:bg-white/10 rounded"
                                                        title="Resend"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCopyLink(inv)}
                                                        className="p-2 hover:bg-white/10 rounded"
                                                        title="Copy Link"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(inv)}
                                                        className="p-2 hover:bg-red-500/10 rounded text-red-400"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {inv.status === 'expired' && (
                                                <button
                                                    onClick={() => handleResend(inv)}
                                                    className="p-2 hover:bg-white/10 rounded"
                                                    title="Resend"
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(inv)}
                                                className="p-2 hover:bg-red-500/10 rounded text-red-400"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredInvitations.length === 0 && (
                    <div className="py-12 text-center text-muted">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No invitations found</p>
                    </div>
                )}
            </div>

            {/* Bulk Invite Modal */}
            {bulkModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-dark rounded-xl border border-border-muted p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Bulk Invite</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Enter emails (one per line)</label>
                                <textarea
                                    rows={6}
                                    placeholder="john@example.com&#10;jane@example.com&#10;bob@example.com"
                                    className="w-full px-3 py-2 bg-darker border border-border-muted rounded-lg resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Or upload CSV</label>
                                <div className="border-2 border-dashed border-border-muted rounded-lg p-6 text-center hover:border-brand-primary/50 cursor-pointer">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted" />
                                    <p className="text-sm text-muted">Drop CSV file here or click to browse</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Default Role</label>
                                <select className="w-full px-3 py-2 bg-darker border border-border-muted rounded-lg">
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setBulkModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-border-muted rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium">
                                    Send Invitations
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
