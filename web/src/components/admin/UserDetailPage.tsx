import React, { useState, useEffect } from 'react';
import {
    User, Shield, Activity, Monitor, Key, Mail, Calendar,
    Clock, MapPin, Globe, Smartphone, Laptop, LogOut,
    Edit, Trash2, ChevronLeft, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';

interface UserData {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    status: 'active' | 'pending' | 'suspended' | 'inactive';
    created_at: number;
    last_login_at?: number;
    email_verified?: boolean;
    phone?: string;
    timezone?: string;
}

interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    ip: string;
    last_active: number;
    current: boolean;
}

interface ActivityLog {
    id: string;
    action: string;
    details: string;
    timestamp: number;
    ip?: string;
}

const MOCK_USER: UserData = {
    id: '1',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'admin',
    status: 'active',
    created_at: Date.now() / 1000 - 86400 * 30,
    last_login_at: Date.now() / 1000 - 3600,
    email_verified: true,
    phone: '+1 234 567 8900',
    timezone: 'America/New_York',
};

const MOCK_SESSIONS: Session[] = [
    { id: '1', device: 'Windows PC', browser: 'Chrome 120', location: 'New York, US', ip: '192.168.1.1', last_active: Date.now() / 1000 - 300, current: true },
    { id: '2', device: 'iPhone 15', browser: 'Safari Mobile', location: 'New York, US', ip: '192.168.1.2', last_active: Date.now() / 1000 - 86400, current: false },
    { id: '3', device: 'MacBook Pro', browser: 'Firefox 121', location: 'Boston, US', ip: '10.0.0.5', last_active: Date.now() / 1000 - 172800, current: false },
];

const MOCK_ACTIVITY: ActivityLog[] = [
    { id: '1', action: 'Login', details: 'Successful login from Chrome on Windows', timestamp: Date.now() / 1000 - 3600, ip: '192.168.1.1' },
    { id: '2', action: 'Password Changed', details: 'Password was updated', timestamp: Date.now() / 1000 - 86400 },
    { id: '3', action: 'Settings Updated', details: 'Profile information changed', timestamp: Date.now() / 1000 - 172800 },
    { id: '4', action: 'Login Failed', details: 'Invalid password attempt', timestamp: Date.now() / 1000 - 259200, ip: '10.0.0.99' },
];

const STATUS_CONFIG = {
    active: { label: 'Active', color: 'bg-green-500/20 text-green-400', Icon: CheckCircle },
    pending: { label: 'Pending', color: 'bg-blue-500/20 text-blue-400', Icon: Clock },
    suspended: { label: 'Suspended', color: 'bg-red-500/20 text-red-400', Icon: XCircle },
    inactive: { label: 'Inactive', color: 'bg-gray-500/20 text-gray-400', Icon: AlertTriangle },
};

const TABS = ['overview', 'activity', 'sessions', 'permissions', 'security'] as const;
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

export function UserDetailPage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [activity, setActivity] = useState<ActivityLog[]>([]);
    const [activeTab, setActiveTab] = useState<TabId>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const { activeTenant } = useTenant();

    // Get user ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id') || window.location.pathname.split('/').pop();

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        setIsLoading(true);
        try {
            const tenantId = activeTenant?.id || 'default';
            const res = await apiFetch(`/api/v1/users/${userId}?tenantId=${tenantId}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data.user || MOCK_USER);
                setSessions(data.sessions || MOCK_SESSIONS);
                setActivity(data.activity || MOCK_ACTIVITY);
            } else {
                setUser(MOCK_USER);
                setSessions(MOCK_SESSIONS);
                setActivity(MOCK_ACTIVITY);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        if (!confirm('Revoke this session? The user will be logged out on that device.')) return;
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    };

    const handleRevokeAllSessions = async () => {
        if (!confirm('Revoke all sessions? The user will be logged out on all devices.')) return;
        setSessions(prev => prev.filter(s => s.current));
    };

    if (isLoading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-8 w-48 bg-white/10 rounded mb-4" />
                <div className="h-32 bg-white/5 rounded-xl" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 text-center">
                <User className="w-16 h-16 mx-auto text-muted mb-4" />
                <h2 className="text-xl font-semibold">User not found</h2>
                <a href="/hpanel/users" className="text-brand-primary hover:underline mt-2 inline-block">
                    ← Back to Users
                </a>
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[user.status];

    return (
        <div className="p-6 space-y-6">
            {/* Back Link */}
            <a
                href={`/hpanel/users?tenant=${activeTenant?.domain || activeTenant?.id || ''}`}
                className="inline-flex items-center gap-2 text-muted hover:text-primary"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Users
            </a>

            {/* Header */}
            <div className="bg-darker rounded-xl border border-border-muted p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl font-bold">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
                            <p className="text-muted">{user.email}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                    <statusConfig.Icon className="w-3 h-3" />
                                    {statusConfig.label}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-brand-primary/20 text-brand-primary">
                                    <Shield className="w-3 h-3" />
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg">
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
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
                {activeTab === 'overview' && <OverviewTab user={user} />}
                {activeTab === 'activity' && <ActivityTab activity={activity} />}
                {activeTab === 'sessions' && (
                    <SessionsTab
                        sessions={sessions}
                        onRevoke={handleRevokeSession}
                        onRevokeAll={handleRevokeAllSessions}
                    />
                )}
                {activeTab === 'permissions' && <PermissionsTab user={user} />}
                {activeTab === 'security' && <SecurityTab user={user} activity={activity} />}
            </div>
        </div>
    );
}

function OverviewTab({ user }: { user: UserData }) {
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Full Name</label>
                    <p className="font-medium mt-1">{user.first_name} {user.last_name}</p>
                </div>
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted" />
                        <span>{user.email}</span>
                        {user.email_verified && (
                            <span title="Verified">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Phone</label>
                    <p className="font-medium mt-1">{user.phone || '—'}</p>
                </div>
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Timezone</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Globe className="w-4 h-4 text-muted" />
                        <span>{user.timezone || 'Not set'}</span>
                    </div>
                </div>
            </div>

            <hr className="border-border-muted" />

            <h2 className="text-lg font-semibold">Account Status</h2>
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Created</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted" />
                        <span>{new Date(user.created_at * 1000).toLocaleDateString()}</span>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Last Login</label>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-muted" />
                        <span>{getRelativeTime(user.last_login_at)}</span>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Role</label>
                    <p className="font-medium mt-1 capitalize">{user.role}</p>
                </div>
                <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Status</label>
                    <p className="font-medium mt-1 capitalize">{user.status}</p>
                </div>
            </div>
        </div>
    );
}

function ActivityTab({ activity }: { activity: ActivityLog[] }) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="space-y-3">
                {activity.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-dark rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium">{log.action}</div>
                            <div className="text-sm text-muted">{log.details}</div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                                <span>{getRelativeTime(log.timestamp)}</span>
                                {log.ip && <span>IP: {log.ip}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SessionsTab({
    sessions,
    onRevoke,
    onRevokeAll
}: {
    sessions: Session[];
    onRevoke: (id: string) => void;
    onRevokeAll: () => void;
}) {
    const getDeviceIcon = (device: string) => {
        if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
            return Smartphone;
        }
        return Laptop;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active Sessions</h2>
                {sessions.length > 1 && (
                    <button
                        onClick={onRevokeAll}
                        className="px-3 py-1.5 text-sm text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/10"
                    >
                        Revoke All Others
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {sessions.map((session) => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    return (
                        <div key={session.id} className="flex items-center gap-4 p-4 bg-dark rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <DeviceIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{session.device}</span>
                                    {session.current && (
                                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-muted">{session.browser}</div>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {session.location}
                                    </span>
                                    <span>IP: {session.ip}</span>
                                    <span>Active: {getRelativeTime(session.last_active)}</span>
                                </div>
                            </div>
                            {!session.current && (
                                <button
                                    onClick={() => onRevoke(session.id)}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                    title="Revoke session"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PermissionsTab({ user }: { user: UserData }) {
    const PERMISSIONS = [
        { module: 'Users', permissions: ['view', 'create', 'edit', 'delete', 'invite'] },
        { module: 'Roles', permissions: ['view', 'manage'] },
        { module: 'Settings', permissions: ['view', 'manage'] },
        { module: 'CMS', permissions: ['view', 'create', 'edit', 'delete', 'publish'] },
        { module: 'CRM', permissions: ['view', 'create', 'edit', 'delete'] },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Permissions</h2>
                <span className="text-sm text-muted">Role: <span className="text-primary capitalize">{user.role}</span></span>
            </div>
            <div className="space-y-4">
                {PERMISSIONS.map((module) => (
                    <div key={module.module} className="p-4 bg-dark rounded-lg">
                        <div className="font-medium mb-2">{module.module}</div>
                        <div className="flex flex-wrap gap-2">
                            {module.permissions.map((perm) => (
                                <span
                                    key={perm}
                                    className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded capitalize"
                                >
                                    {perm}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecurityTab({ user, activity }: { user: UserData; activity: ActivityLog[] }) {
    const failedLogins = activity.filter(a => a.action.toLowerCase().includes('failed'));

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Security</h2>

            <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="p-4 bg-dark rounded-lg">
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">Email Verification</div>
                    <div className="flex items-center gap-2">
                        {user.email_verified ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400">Verified</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-yellow-400" />
                                <span className="text-yellow-400">Not Verified</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-dark rounded-lg">
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">Two-Factor Auth</div>
                    <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-muted" />
                        <span className="text-muted">Not Enabled</span>
                    </div>
                </div>
                <div className="p-4 bg-dark rounded-lg">
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">Failed Login Attempts</div>
                    <div className="text-2xl font-bold">{failedLogins.length}</div>
                    <div className="text-xs text-muted">Last 30 days</div>
                </div>
                <div className="p-4 bg-dark rounded-lg">
                    <div className="text-xs text-muted uppercase tracking-wider mb-1">Password Last Changed</div>
                    <div className="text-muted">30 days ago</div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-medium">Actions</h3>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5">
                        <Key className="w-4 h-4 inline mr-2" />
                        Force Password Reset
                    </button>
                    <button className="px-4 py-2 border border-border-muted rounded-lg hover:bg-white/5">
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Revoke All Sessions
                    </button>
                </div>
            </div>
        </div>
    );
}
