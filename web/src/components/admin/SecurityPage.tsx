import React, { useState, useEffect } from 'react';
import { Shield, Key, History, Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { apiFetch } from '../../lib/api';

interface Session {
    id: string;
    user_agent: string;
    ip_address: string;
    last_activity_at: number;
    created_at: number;
    is_current: number;
}

interface LoginAttempt {
    id: string;
    success: number;
    failure_reason: string | null;
    ip_address: string;
    user_agent: string;
    created_at: number;
}

export function SecurityPage() {
    const [activeTab, setActiveTab] = useState<'sessions' | 'history' | 'password'>('sessions');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { activeTenant } = useTenant();

    useEffect(() => {
        loadData();
    }, [activeTab]);

    async function loadData() {
        setIsLoading(true);
        try {
            if (activeTab === 'sessions') {
                const response = await apiFetch('/api/v1/auth/sessions');
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                }
            } else if (activeTab === 'history') {
                const response = await apiFetch('/api/v1/auth/login-history');
                if (response.ok) {
                    const data = await response.json();
                    setLoginHistory(data);
                }
            }
        } catch (error) {
            console.error('Failed to load security data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function revokeSession(sessionId: string) {
        try {
            await apiFetch(`/api/v1/auth/sessions/${sessionId}`, { method: 'DELETE' });
            loadData();
        } catch (error) {
            console.error('Failed to revoke session:', error);
        }
    }

    async function revokeAllSessions() {
        try {
            await apiFetch('/api/v1/auth/logout-all', { method: 'POST' });
            loadData();
        } catch (error) {
            console.error('Failed to revoke all sessions:', error);
        }
    }

    const tabs = [
        { id: 'sessions', label: 'Active Sessions', icon: Key },
        { id: 'history', label: 'Login History', icon: History },
        { id: 'password', label: 'Password', icon: Shield },
    ];

    return (
        <div className="flex-1 p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Security</h1>
                <p className="text-muted mt-1">Manage your security settings and sessions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                            ? 'bg-brand-primary text-white'
                            : 'bg-dark text-muted hover:bg-white/10'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-dark rounded-xl border border-border-muted p-6">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-white/5 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Sessions Tab */}
                        {activeTab === 'sessions' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">Active Sessions</h3>
                                    <button
                                        onClick={revokeAllSessions}
                                        className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Revoke All
                                    </button>
                                </div>
                                {sessions.length === 0 ? (
                                    <p className="text-muted text-center py-8">No active sessions</p>
                                ) : (
                                    sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between p-4 bg-darker rounded-lg border border-border-muted"
                                        >
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    {session.user_agent?.substring(0, 50) || 'Unknown Device'}
                                                    {session.is_current ? (
                                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                                            Current
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="text-sm text-muted mt-1">
                                                    IP: {session.ip_address || 'Unknown'} • Last active:{' '}
                                                    {new Date(session.last_activity_at * 1000).toLocaleString()}
                                                </div>
                                            </div>
                                            {!session.is_current && (
                                                <button
                                                    onClick={() => revokeSession(session.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Login History Tab */}
                        {activeTab === 'history' && (
                            <div className="space-y-2">
                                <h3 className="font-medium mb-4">Recent Login Attempts</h3>
                                {loginHistory.length === 0 ? (
                                    <p className="text-muted text-center py-8">No login history</p>
                                ) : (
                                    loginHistory.map((attempt) => (
                                        <div
                                            key={attempt.id}
                                            className="flex items-center justify-between p-3 bg-darker rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${attempt.success ? 'bg-green-500' : 'bg-red-500'
                                                        }`}
                                                />
                                                <div>
                                                    <div className="text-sm">
                                                        {attempt.success ? 'Successful login' : attempt.failure_reason || 'Failed login'}
                                                    </div>
                                                    <div className="text-xs text-muted">
                                                        {attempt.ip_address} • {new Date(attempt.created_at * 1000).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="max-w-md space-y-4">
                                <h3 className="font-medium mb-4">Change Password</h3>
                                <div>
                                    <label className="block text-sm text-muted mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-darker border border-border-muted rounded-lg px-4 py-2"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-darker border border-border-muted rounded-lg px-4 py-2"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-darker border border-border-muted rounded-lg px-4 py-2"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <button className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-primary/90 transition-colors">
                                    Update Password
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
