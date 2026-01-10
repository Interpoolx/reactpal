import React, { useState, useEffect } from 'react';
import { Database, HardDrive, GitCompare, Loader2, CheckCircle2, XCircle, AlertTriangle, Download, Upload, Trash2, RefreshCw, Play, Lock, Unlock, ArrowRight, Clock, Activity, FolderOpen, Settings } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useToast } from '../ui/Toast';

export default function DatabaseSettings() {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const [dbStatus, setDbStatus] = useState<any>(null);
    const [tables, setTables] = useState<any[]>([]);
    const [schemaDiff, setSchemaDiff] = useState<any[]>([]);
    const [tablePage, setTablePage] = useState(1);
    const [tableMeta, setTableMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [migrationPage, setMigrationPage] = useState(1);
    const [migrationMeta, setMigrationMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [migrations, setMigrations] = useState<any[]>([]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'tables', label: 'Tables', icon: Database },
        { id: 'schema', label: 'Schema', icon: GitCompare },
        { id: 'migrations', label: 'Migrations', icon: FolderOpen },
        { id: 'advanced', label: 'Advanced', icon: Settings },
    ];

    useEffect(() => {
        fetchAllData();
    }, [tablePage, migrationPage]);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await Promise.allSettled([
                apiFetch('/api/v1/database/status'),
                apiFetch(`/api/v1/database/tables?page=${tablePage}&limit=10`),
                apiFetch('/api/v1/database/schema/compare'),
                apiFetch(`/api/v1/database/migrations?page=${migrationPage}&limit=10`),
                apiFetch('/api/v1/database/audit-logs')
            ]);

            const responses = results.map(r => r.status === 'fulfilled' ? r.value : null);

            if (responses[0]?.ok) {
                const data = await responses[0].json();
                setDbStatus(data);
            }

            if (responses[1]?.ok) {
                const data = await responses[1].json();
                setTables(data.data || []);
                setTableMeta(data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
            }

            if (responses[2]?.ok) {
                const data = await responses[2].json();
                setSchemaDiff(data);
            }

            if (responses[3]?.ok) {
                const data = await responses[3].json();
                setMigrations(data.data || []);
                setMigrationMeta(data.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
            }

            if (responses[4]?.ok) {
                const data = await responses[4].json();
                setRecentActivity(data);
            }

            const rejected = results.find(r => r.status === 'rejected');
            const failedResp = responses.find(r => r && !r.ok);

            if (rejected || failedResp) {
                let msg = 'Some data failed to load';
                if (rejected && rejected.status === 'rejected') {
                    msg = (rejected.reason as any)?.message || msg;
                } else if (failedResp) {
                    try {
                        const err = await failedResp.json();
                        msg = err.message || `Error ${failedResp.status}: ${failedResp.statusText}`;
                    } catch (e) {
                        msg = `Error ${failedResp.status}: ${failedResp.statusText}`;
                    }
                }
                setError(msg);
                showToast(msg, 'error');
            }

        } catch (e: any) {
            console.error('Critical fetch error:', e);
            setError(e.message);
            showToast('Failed to connect to database API', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleExportDatabase = async () => {
        try {
            showToast('Generating database export...', 'info');
            const response = await apiFetch('/api/v1/database/export');

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `d1-backup-${Date.now()}.sql`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showToast('Database exported successfully', 'success');
            } else {
                showToast('Export failed', 'error');
            }
        } catch (e) {
            showToast('Export failed', 'error');
        }
    };

    const handleRollback = async () => {
        if (!confirm('Are you sure you want to rollback the last migration?')) return;
        try {
            const res = await apiFetch('/api/v1/database/migrations/rollback', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'success');
                fetchAllData();
            } else {
                showToast(data.message, 'error');
            }
        } catch (e) {
            showToast('Rollback failed', 'error');
        }
    };

    const handleSchemaSync = async (table: string) => {
        try {
            const dryRunRes = await apiFetch('/api/v1/database/schema/sync', {
                method: 'POST',
                body: JSON.stringify({ table, action: 'push', dryRun: true })
            });
            const dryRunData = await dryRunRes.json();
            if (!dryRunData.success) {
                showToast(dryRunData.message, 'error');
                return;
            }

            if (dryRunData.sql?.length > 0) {
                if (confirm(`Execute SQL?\n\n${dryRunData.sql.join('\n')}`)) {
                    const runRes = await apiFetch('/api/v1/database/schema/sync', {
                        method: 'POST',
                        body: JSON.stringify({ table, action: 'push', dryRun: false })
                    });
                    const runData = await runRes.json();
                    if (runData.success) {
                        showToast(runData.message, 'success');
                        fetchAllData();
                    } else {
                        showToast(runData.message, 'error');
                    }
                }
            } else {
                showToast('No changes.', 'success');
            }
        } catch (e) {
            showToast('Sync failed', 'error');
        }
    };

    const handleMigrationApply = async (migrationName: string) => {
        try {
            const res = await apiFetch('/api/v1/database/migrations/run', {
                method: 'POST',
                body: JSON.stringify({ migration: migrationName })
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, 'success');
                fetchAllData();
            } else {
                showToast(data.message, 'error');
            }
        } catch (e) {
            showToast('Migration failed', 'error');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Command copied to clipboard', 'success');
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const config: Record<string, any> = {
            match: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Match' },
            mismatch: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Mismatch' },
            missing: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Missing' },
            extra: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Extra' },
            success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Success' },
            applied: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Applied' },
            pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
            healthy: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Healthy' },
        };
        const { icon: Icon, color, bg, label } = config[status] || config.match;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${bg} ${color}`}>
                <Icon className="w-3 h-3" />
                {label}
            </span>
        );
    };

    if (loading && !dbStatus) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-gray-100 p-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Database className="w-8 h-8 text-blue-400" />
                    <h1 className="text-3xl font-bold text-white">Database Settings</h1>
                </div>
                <p className="text-gray-400">Manage backups, schema, migrations, and database operations</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}


            <div className="flex gap-2 mb-6 border-b border-gray-800">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${activeTab === tab.id
                                ? 'text-blue-400 border-b-2 border-blue-400'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Database Size', value: dbStatus?.sizeFormatted || 'Managed by D1', icon: HardDrive, color: 'blue' },
                            { label: 'Total Tables', value: dbStatus?.tableCount || 0, icon: Database, color: 'purple' },
                            { label: 'Health Status', value: <StatusBadge status={dbStatus?.status || 'unknown'} />, icon: CheckCircle2, color: 'green' },
                            { label: 'Database ID', value: <span className="text-xs font-mono">{dbStatus?.databaseId || '-'}</span>, icon: Activity, color: 'blue' },
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button
                                onClick={handleExportDatabase}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export Database
                            </button>
                            <button
                                onClick={() => setActiveTab('schema')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all"
                            >
                                <GitCompare className="w-4 h-4" />
                                Compare Schema
                            </button>
                            <button
                                onClick={() => setActiveTab('migrations')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-medium transition-all"
                            >
                                <Play className="w-4 h-4" />
                                Run Migrations
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivity.length === 0 ? (
                                <p className="text-gray-500 text-sm">No recent activity.</p>
                            ) : (
                                recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                                            <div>
                                                <div className="text-gray-200 text-sm font-medium">{activity.action}</div>
                                                <div className="text-gray-500 text-xs">{activity.details}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Tables Tab */}
            {activeTab === 'tables' && (
                <div className="space-y-6">
                    {/* Tables Header */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Database Tables</h3>
                                <p className="text-sm text-gray-400">View and compare table structures across environments</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium transition-all">
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Tables Grid */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Table Name
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider" colSpan={2}>
                                            Local
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider" colSpan={2}>
                                            Remote
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    <tr className="border-t border-gray-800">
                                        <th className="px-6 py-2"></th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-blue-400">Records</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-blue-400">Columns</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-green-400">Records</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-green-400">Columns</th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {tables.map((table: any) => (
                                        <React.Fragment key={table.name}>
                                            <tr
                                                className="hover:bg-gray-900/30 transition-colors cursor-pointer"
                                                onClick={() => setSelectedTable(selectedTable === table.name ? null : table.name)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Database className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium text-white">{table.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-center text-sm text-gray-300">
                                                    {table.records.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-4 text-center text-sm text-gray-300">
                                                    {Array.isArray(table.columns) ? table.columns.length : table.columns}
                                                </td>
                                                <td className="px-3 py-4 text-center">
                                                    <StatusBadge status="match" />
                                                </td>
                                                <td className="px-3 py-4 text-center">
                                                    <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform mx-auto ${selectedTable === table.name ? 'rotate-90' : ''}`} />
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="text-sm text-gray-400">
                            Showing page {tableMeta.page} of {tableMeta.totalPages} ({tableMeta.total} total)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTablePage(p => Math.max(1, p - 1))}
                                disabled={tablePage === 1}
                                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setTablePage(p => Math.min(tableMeta.totalPages, p + 1))}
                                disabled={tablePage === tableMeta.totalPages}
                                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schema Tab */}
            {activeTab === 'schema' && (
                <div className="space-y-6">
                    {/* Schema Actions */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Schema Comparison</h3>
                                <p className="text-sm text-gray-400">Compare local schema definitions with remote database</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium transition-all">
                                <RefreshCw className="w-4 h-4" />
                                Refresh Comparison
                            </button>
                        </div>
                    </div>

                    {/* Schema Comparison Table */}
                    <div className="space-y-4">
                        {schemaDiff.length === 0 ? (
                            <div className="text-center py-12 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg">
                                <GitCompare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-gray-300">No Schema Differences</h3>
                                <p className="text-gray-500">Your local schema matches the remote database.</p>
                            </div>
                        ) : (
                            schemaDiff.map((table: any) => (
                                <div
                                    key={table.table}
                                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden"
                                >
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-900/30 transition-colors"
                                        onClick={() => setSelectedTable(selectedTable === table.table ? null : table.table)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Database className="w-5 h-5 text-gray-400" />
                                                <span className="font-semibold text-white">{table.table}</span>
                                                <StatusBadge status={table.status} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {table.status !== 'match' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleSchemaSync(table.table); }}
                                                            className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded text-sm text-blue-400 transition-all"
                                                        >
                                                            Push
                                                        </button>
                                                    </div>
                                                )}
                                                <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform ${selectedTable === table.table ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {selectedTable === table.table && (
                                        <div className="border-t border-gray-800 p-4 bg-gray-900/20">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left">Column</th>
                                                            <th className="px-4 py-2 text-left">Type</th>
                                                            <th className="px-4 py-2 text-center">Local</th>
                                                            <th className="px-4 py-2 text-center">Remote</th>
                                                            <th className="px-4 py-2 text-center">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800">
                                                        {table.columns.map((col: any) => (
                                                            <tr key={col.name} className="hover:bg-gray-800/30">
                                                                <td className="px-4 py-2 font-mono">{col.name}</td>
                                                                <td className="px-4 py-2 text-gray-400">{col.type}</td>
                                                                <td className="px-4 py-2 text-center">
                                                                    {col.local ? <CheckCircle2 className="w-4 h-4 text-blue-400 mx-auto" /> : <XCircle className="w-4 h-4 text-gray-600 mx-auto" />}
                                                                </td>
                                                                <td className="px-4 py-2 text-center">
                                                                    {col.remote ? <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" /> : <XCircle className="w-4 h-4 text-gray-600 mx-auto" />}
                                                                </td>
                                                                <td className="px-4 py-2 text-center">
                                                                    {col.match ? <span className="text-green-400">Synced</span> : <span className="text-yellow-400">Mismatch</span>}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Migrations Tab */}
            {activeTab === 'migrations' && (
                <div className="space-y-6">
                    {/* Migration Actions */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Database Migrations</h3>
                                <p className="text-sm text-gray-400">Track and apply database migrations</p>
                                <div className="mt-2 text-xs text-yellow-500/80 bg-yellow-500/10 px-2 py-1 rounded inline-block border border-yellow-500/20">
                                    <span className="font-semibold">Note:</span> Applying migrations here marks them as resolved in the dashboard. Ensure DDL has been executed.
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-all">
                                <Play className="w-4 h-4" />
                                Run Pending Migrations
                            </button>
                        </div>
                    </div>

                    {/* Migrations List */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Migration</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Applied At</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {(migrations.length === 0) ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No applied migrations found in the database.
                                            </td>
                                        </tr>
                                    ) : (
                                        migrations.map((migration: any) => (
                                            <tr key={migration.id} className="hover:bg-gray-900/30 transition-colors">
                                                <td className="px-6 py-4 text-sm font-mono text-gray-300">{migration.name}</td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={migration.status} />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {migration.appliedAt ? new Date(migration.appliedAt).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {migration.status === 'pending' ? (
                                                        <button
                                                            onClick={() => handleMigrationApply(migration.name)}
                                                            className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-sm text-green-400 transition-all"
                                                        >
                                                            Apply
                                                        </button>
                                                    ) : (
                                                        <div className="flex gap-2 justify-end">
                                                            <span className="text-xs text-gray-500 py-1">Applied</span>
                                                            {/* Only allow rollback of the MOST RECENT applied migration on the first page */}
                                                            {migrationPage === 1 && migration.id === migrations[0]?.id && (
                                                                <button
                                                                    onClick={handleRollback}
                                                                    className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-sm text-red-400 transition-all"
                                                                >
                                                                    Rollback
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <div className="text-sm text-gray-400">
                            Showing page {migrationMeta.page} of {migrationMeta.totalPages} ({migrationMeta.total} total)
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMigrationPage(p => Math.max(1, p - 1))}
                                disabled={migrationPage === 1}
                                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setMigrationPage(p => Math.min(migrationMeta.totalPages, p + 1))}
                                disabled={migrationPage === migrationMeta.totalPages}
                                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Advanced Settings</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-yellow-400 mb-1">Danger Zone</h4>
                                        <p className="text-sm text-gray-400 mb-3">These actions are irreversible. Proceed with caution.</p>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all">
                                                Reset Database
                                            </button>
                                            <button className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 font-medium transition-all">
                                                Clear All Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Detail Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[400px] bg-[#0f1623] border-l border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${selectedTable && activeTab === 'tables' ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedTable && activeTab === 'tables' && (
                    <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Database className="w-5 h-5 text-blue-400" />
                                    {selectedTable}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    {tables.find(t => t.name === selectedTable)?.records?.toLocaleString()} records
                                </p>
                            </div>
                            <button onClick={() => setSelectedTable(null)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <h4 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Table Structure</h4>
                            <div className="space-y-3">
                                {tables.find(t => t.name === selectedTable)?.columns?.map((col: any) => (
                                    <div key={col.name} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-blue-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-mono text-sm text-blue-300 font-semibold">{col.name}</span>
                                            <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300 font-mono">{col.type}</span>
                                        </div>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${col.pk ? 'bg-green-400' : 'bg-gray-600'}`} />
                                                {col.pk ? 'Primary Key' : 'Standard'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${col.notnull ? 'bg-purple-400' : 'bg-gray-600'}`} />
                                                {col.notnull ? 'Required' : 'Nullable'}
                                            </div>
                                        </div>
                                        {col.dflt_value !== null && (
                                            <div className="mt-2 text-xs font-mono text-gray-400 bg-gray-900/50 p-1.5 rounded border border-gray-800 px-2">
                                                Default: <span className="text-yellow-500">{col.dflt_value}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Reference Section */}
            <div className="mt-12 space-y-6 border-t border-gray-800 pt-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Database Notes */}
                    <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-blue-200 font-semibold mb-2">Cloudflare D1 Database Notes:</h4>
                                <ul className="space-y-2 text-sm text-blue-300/60">
                                    <li className="flex gap-2"><span>•</span> Database size is estimated based on record count (actual size managed by D1)</li>
                                    <li className="flex gap-2"><span>•</span> Export creates SQL dump for backup purposes</li>
                                    <li className="flex gap-2"><span>•</span> For exact metrics, check Cloudflare Dashboard or use <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-xs">wrangler d1 info</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CLI Reference */}
                    <div className="bg-purple-500/5 border border-purple-500/10 p-6 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Settings className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-purple-200 font-semibold">CLI Reference (package.json)</h4>
                                </div>
                                <div className="space-y-2 max-w-md">
                                    {[
                                        { cmd: 'db:generate', desc: 'Create migration' },
                                        { cmd: 'db:migrate', desc: 'Apply local' },
                                        { cmd: 'db:sync:remote', desc: 'Push to prod' },
                                        { cmd: 'db:backup:local', desc: 'Backup local' },
                                        { cmd: 'db:backup:remote', desc: 'Backup prod' },
                                        { cmd: 'db:studio', desc: 'Studio (Local)' },
                                        { cmd: 'db:studio:remote', desc: 'Studio (Remote)' },
                                        { cmd: 'db:info', desc: 'Remote stats' },
                                        { cmd: 'db:tables:local', desc: 'List tables' },
                                    ].map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleCopy(`npm run ${action.cmd}`)}
                                            className="w-full flex items-center justify-between gap-4 p-3 bg-gray-900/50 hover:bg-gray-800/80 border border-gray-800/50 hover:border-purple-500/30 rounded-lg group transition-all"
                                            title="Click to copy"
                                        >
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs text-purple-300 font-mono group-hover:text-purple-200 transition-colors">npm run {action.cmd}</code>
                                            </div>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{action.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[11px] text-gray-500 italic">
                    * Run these commands from the project root for automatic D1 database resolution.
                </p>
            </div>
        </div>
    );
}