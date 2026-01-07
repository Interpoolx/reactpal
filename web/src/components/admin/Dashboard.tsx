import React from 'react';
import { Activity, Users, Globe, Zap, ArrowUpRight } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export function Dashboard() {
    const { tenants } = useTenant();
    const isAdmin = true; // Simulating role state

    const WIDGETS = [
        { id: '1', title: 'Platform Traffic', value: '0', change: '+0%', icon: Activity, role: ['admin'] },
        { id: '2', title: 'Active Tenants', value: tenants.length.toString(), change: `+${tenants.length}`, icon: Globe, role: ['admin'] },
        { id: '3', title: 'Total Users', value: '1', change: '+0%', icon: Users, role: ['admin', 'editor'] },
        { id: '4', title: 'Edge Requests', value: '0.9M', change: '+0%', icon: Zap, role: ['admin'] },
    ];

    const visibleWidgets = WIDGETS.filter(w =>
        isAdmin ? true : w.role.includes('editor')
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Studio Overview</h1>
                <p className="text-muted text-sm mt-1">Welcome back. Here is what's happening across your tenants.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleWidgets.map((widget) => (
                    <div key={widget.id} className="glass p-6 rounded-2xl border border-border-muted hover:border-brand-primary/50 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-white/5 border border-border-muted group-hover:bg-brand-primary/10 transition-colors">
                                <widget.icon className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                                {widget.change}
                                <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted font-medium">{widget.title}</div>
                            <div className="text-2xl font-bold">{widget.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl border border-border-muted h-80 flex flex-col p-6">
                    <div className="text-sm font-semibold mb-4">Real-time Performance</div>
                    <div className="flex-1 rounded-xl bg-black/20 border border-dashed border-border-muted flex items-center justify-center">
                        <span className="text-muted text-xs italic">Chart Visualization Placeholder</span>
                    </div>
                </div>
                <div className="glass rounded-2xl border border-border-muted h-80 flex flex-col p-6">
                    <div className="text-sm font-semibold mb-4">Recent Activity</div>
                    <div className="space-y-4">
                        <div className="text-xs text-muted italic">No recent system activity.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
