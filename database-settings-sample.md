import React, { useState } from 'react';
import { Database, HardDrive, GitCompare, Loader2, CheckCircle2, XCircle, AlertTriangle, Download, Upload, Trash2, RefreshCw, Play, Lock, Unlock, ArrowRight, Clock, Activity, FolderOpen, Settings } from 'lucide-react';

export default function DatabaseSettings() {
  const [activeTab, setActiveTab] = useState('overview');
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Mock data
  const dbStats = {
    size: '524 MB',
    tables: 12,
    records: '287,543',
    lastBackup: '2 hours ago',
    health: 'healthy'
  };

  const backups = [
    { id: 1, timestamp: '2026-01-10 14:30:00', size: '523 MB', status: 'success', duration: '2m 34s' },
    { id: 2, timestamp: '2026-01-10 08:15:00', size: '521 MB', status: 'success', duration: '2m 28s' },
    { id: 3, timestamp: '2026-01-09 20:00:00', size: '518 MB', status: 'success', duration: '2m 31s' },
  ];

  const schemaDiff = [
    { 
      table: 'users', 
      local: ['id', 'email', 'name', 'created_at', 'status'],
      remote: ['id', 'email', 'name', 'created_at'],
      status: 'mismatch'
    },
    { 
      table: 'posts', 
      local: ['id', 'title', 'content', 'user_id', 'created_at'],
      remote: ['id', 'title', 'content', 'user_id', 'created_at'],
      status: 'match'
    },
    { 
      table: 'comments', 
      local: ['id', 'post_id', 'user_id', 'content', 'created_at'],
      remote: ['id', 'post_id', 'user_id', 'content', 'created_at', 'deleted_at'],
      status: 'extra'
    },
  ];

  const migrations = [
    { id: 1, name: '20260110_add_user_status.sql', status: 'applied', appliedAt: '2026-01-10 10:00:00' },
    { id: 2, name: '20260109_create_audit_logs.sql', status: 'applied', appliedAt: '2026-01-09 15:30:00' },
    { id: 3, name: '20260111_add_soft_deletes.sql', status: 'pending', appliedAt: null },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'backups', label: 'Backups', icon: HardDrive },
    { id: 'schema', label: 'Schema', icon: GitCompare },
    { id: 'migrations', label: 'Migrations', icon: FolderOpen },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  const StatusBadge = ({ status }) => {
    const config = {
      match: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Match' },
      mismatch: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Mismatch' },
      extra: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Extra Columns' },
      success: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Success' },
      applied: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Applied' },
      pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Pending' },
      healthy: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Healthy' },
    };

    const { icon: Icon, color, bg, label } = config[status] || config.match;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${bg} ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Database Settings</h1>
        </div>
        <p className="text-gray-400">Manage backups, schema, migrations, and database operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                activeTab === tab.id
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
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Database Size', value: dbStats.size, icon: HardDrive, color: 'blue' },
              { label: 'Total Tables', value: dbStats.tables, icon: Database, color: 'purple' },
              { label: 'Total Records', value: dbStats.records, icon: Activity, color: 'green' },
              { label: 'Health Status', value: <StatusBadge status={dbStats.health} />, icon: CheckCircle2, color: 'green' },
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

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-all">
                <Download className="w-4 h-4" />
                Create Backup
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-medium transition-all">
                <GitCompare className="w-4 h-4" />
                Compare Schema
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-medium transition-all">
                <Play className="w-4 h-4" />
                Run Migrations
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Backup created', time: '2 hours ago', type: 'success' },
                { action: 'Migration applied: add_user_status', time: '5 hours ago', type: 'success' },
                { action: 'Schema comparison completed', time: '1 day ago', type: 'info' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`} />
                    <span className="text-gray-200">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          {/* Backup Actions */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Backup Management</h3>
                <p className="text-sm text-gray-400">Last backup: {dbStats.lastBackup}</p>
              </div>
              <button 
                onClick={() => setBackupInProgress(true)}
                disabled={backupInProgress}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all"
              >
                {backupInProgress ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Create Backup Now
                  </>
                )}
              </button>
            </div>

            {backupInProgress && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="font-medium text-blue-400">Backup in progress...</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Processing table: users (135,000/300,000 rows)</span>
                  <span>ETA: 2m 15s</span>
                </div>
              </div>
            )}
          </div>

          {/* Backup History */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Backup History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {backups.map(backup => (
                    <tr key={backup.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">{backup.timestamp}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{backup.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{backup.duration}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={backup.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Restore">
                            <Upload className="w-4 h-4 text-gray-400 hover:text-green-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            {schemaDiff.map(table => (
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
                        <>
                          <button className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded text-sm text-blue-400 transition-all">
                            Push to Remote
                          </button>
                          <button className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-sm text-green-400 transition-all">
                            Pull to Local
                          </button>
                        </>
                      )}
                      <ArrowRight className={`w-4 h-4 text-gray-400 transition-transform ${selectedTable === table.table ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>

                {selectedTable === table.table && (
                  <div className="border-t border-gray-800 p-4 bg-gray-900/20">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Local Schema */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Lock className="w-4 h-4 text-blue-400" />
                          <h4 className="font-medium text-blue-400">Local Schema</h4>
                        </div>
                        <div className="space-y-2">
                          {table.local.map(col => (
                            <div key={col} className="px-3 py-2 bg-gray-800/50 rounded text-sm text-gray-300">
                              {col}
                              {!table.remote.includes(col) && (
                                <span className="ml-2 text-xs text-yellow-400">(new)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Remote Schema */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Unlock className="w-4 h-4 text-green-400" />
                          <h4 className="font-medium text-green-400">Remote Database</h4>
                        </div>
                        <div className="space-y-2">
                          {table.remote.map(col => (
                            <div key={col} className="px-3 py-2 bg-gray-800/50 rounded text-sm text-gray-300">
                              {col}
                              {!table.local.includes(col) && (
                                <span className="ml-2 text-xs text-red-400">(extra)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
                  {migrations.map(migration => (
                    <tr key={migration.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-300">{migration.name}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={migration.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {migration.appliedAt || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {migration.status === 'pending' ? (
                          <button className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-sm text-green-400 transition-all">
                            Apply
                          </button>
                        ) : (
                          <button className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-sm text-red-400 transition-all">
                            Rollback
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    </div>
  );
}