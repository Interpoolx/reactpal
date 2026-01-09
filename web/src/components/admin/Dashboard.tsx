import React, { useState, useEffect } from 'react';
import { Package, Users, Globe, Building2, ArrowUpRight, FileText, PenTool, Eye, BarChart3, Mail, Clock, AlertTriangle } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useRole, type RoleType } from '../../context/RoleContext';
import { AccessDenied } from './AccessDenied';

interface Widget {
    id: string;
    title: string;
    value: string;
    change: string;
    icon: React.ComponentType<any>;
    href?: string;
    minRole: RoleType;
}

// Super Admin dashboard widgets
const SUPER_ADMIN_WIDGETS: Widget[] = [
    { id: '1', title: 'Active Tenants', value: '0', change: '+0', icon: Building2, href: '/hpanel/tenants', minRole: 'super_admin' },
    { id: '2', title: 'Enabled Modules', value: '0', change: '+0%', icon: Package, href: '/hpanel/modules', minRole: 'super_admin' },
    { id: '3', title: 'Total Users', value: '0', change: '+0%', icon: Users, href: '/hpanel/users', minRole: 'super_admin' },
    { id: '4', title: 'System Health', value: '100%', change: 'OK', icon: Globe, minRole: 'super_admin' },
];

// Admin dashboard widgets (tenant-specific)
const ADMIN_WIDGETS: Widget[] = [
    { id: '1', title: 'Team Members', value: '0', change: '+0', icon: Users, href: '/hpanel/users', minRole: 'admin' },
    { id: '2', title: 'Active Modules', value: '0', change: '+0%', icon: Package, href: '/hpanel/modules', minRole: 'admin' },
    { id: '3', title: 'Total Content', value: '0', change: '+0%', icon: FileText, href: '/hpanel/cms', minRole: 'admin' },
    { id: '4', title: 'Form Submissions', value: '0', change: '+0%', icon: Mail, href: '/hpanel/crm', minRole: 'admin' },
];

// Editor dashboard widgets (content-focused)
const EDITOR_WIDGETS: Widget[] = [
    { id: '1', title: 'My Drafts', value: '0', change: 'pending', icon: PenTool, href: '/hpanel/cms', minRole: 'editor' },
    { id: '2', title: 'Published Content', value: '0', change: '+0', icon: FileText, href: '/hpanel/cms', minRole: 'editor' },
    { id: '3', title: 'Pending Reviews', value: '0', change: 'awaiting', icon: Clock, href: '/hpanel/cms', minRole: 'editor' },
    { id: '4', title: 'Form Submissions', value: '0', change: 'last 7d', icon: Mail, href: '/hpanel/crm', minRole: 'editor' },
];

// Viewer dashboard widgets (analytics-focused)
const VIEWER_WIDGETS: Widget[] = [
    { id: '1', title: 'Total Content', value: '0', change: 'pages', icon: FileText, minRole: 'viewer' },
    { id: '2', title: 'Form Submissions', value: '0', change: 'total', icon: Mail, minRole: 'viewer' },
    { id: '3', title: 'Site Traffic', value: '0', change: 'visitors', icon: BarChart3, minRole: 'viewer' },
    { id: '4', title: 'Popular Pages', value: '0', change: 'views', icon: Eye, minRole: 'viewer' },
];

function WidgetCard({ widget, roleColor }: { widget: Widget; roleColor: string }) {
    const Wrapper = widget.href ? 'a' : 'div';
    const wrapperProps = widget.href ? { href: widget.href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`glass p-6 rounded-2xl border border-border-muted hover:border-brand-primary/50 transition-all group ${widget.href ? 'cursor-pointer' : ''}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className="p-2 rounded-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${roleColor}20`, border: `1px solid ${roleColor}40` }}
                >
                    <widget.icon className="w-5 h-5" style={{ color: roleColor }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                    {widget.change}
                    {widget.href && <ArrowUpRight className="w-3 h-3" />}
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-sm text-muted font-medium">{widget.title}</div>
                <div className="text-2xl font-bold">{widget.value}</div>
            </div>
        </Wrapper>
    );
}

function DashboardHeader({ title, description }: { title: string; description: string }) {
    return (
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted text-sm mt-1">{description}</p>
        </div>
    );
}

function ActivityPanel({ title, emptyMessage }: { title: string; emptyMessage: string }) {
    return (
        <div className="glass rounded-2xl border border-border-muted h-80 flex flex-col p-6">
            <div className="text-sm font-semibold mb-4">{title}</div>
            <div className="space-y-4 flex-1 flex items-center justify-center">
                <div className="text-xs text-muted italic">{emptyMessage}</div>
            </div>
        </div>
    );
}

function PerformancePanel({ title }: { title: string }) {
    return (
        <div className="lg:col-span-2 glass rounded-2xl border border-border-muted h-80 flex flex-col p-6">
            <div className="text-sm font-semibold mb-4">{title}</div>
            <div className="flex-1 rounded-xl bg-black/20 border border-dashed border-border-muted flex items-center justify-center">
                <span className="text-muted text-xs italic">Chart Visualization Placeholder</span>
            </div>
        </div>
    );
}

export function Dashboard() {
    const { tenants } = useTenant();
    const { currentRole, getRoleColor, getRoleDefinition } = useRole();
    const [moduleCount, setModuleCount] = useState(0);

    const roleColor = getRoleColor();
    const roleDefinition = getRoleDefinition(currentRole);

    useEffect(() => {
        // Fetch module count from the same endpoint as ModulesPage
        fetch('/api/v1/modules')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data)) {
                    // Core modules are always enabled
                    const enabled = data.filter((m: any) => m.isCore || m.platformEnabled).length;
                    setModuleCount(enabled);
                }
            })
            .catch(() => setModuleCount(0));
    }, []);

    // Regular User - Access Denied
    if (currentRole === 'user') {
        return <AccessDenied />;
    }

    // Get widgets and config based on role
    const getRoleConfig = () => {
        switch (currentRole) {
            case 'super_admin':
                return {
                    title: 'Studio Overview',
                    description: "Welcome back. Here's what's happening across all tenants.",
                    widgets: SUPER_ADMIN_WIDGETS.map(w => ({
                        ...w,
                        value: w.id === '1' ? tenants.length.toString() :
                            w.id === '2' ? moduleCount.toString() :
                                w.id === '3' ? '1' : w.value,
                        change: w.id === '1' ? `+${tenants.length}` : w.change
                    })),
                    activityTitle: 'Recent Activity',
                    activityEmpty: 'No recent system activity.',
                    performanceTitle: 'Real-time Performance',
                };
            case 'admin':
                return {
                    title: 'Tenant Dashboard',
                    description: 'Manage your tenant settings and team.',
                    widgets: ADMIN_WIDGETS.map(w => ({
                        ...w,
                        value: w.id === '2' ? moduleCount.toString() : w.value
                    })),
                    activityTitle: 'Tenant Activity',
                    activityEmpty: 'No recent tenant activity.',
                    performanceTitle: 'Tenant Performance',
                };
            case 'editor':
                return {
                    title: 'Content Dashboard',
                    description: "Here's your content overview.",
                    widgets: EDITOR_WIDGETS,
                    activityTitle: 'My Recent Activity',
                    activityEmpty: 'Start creating content to see activity.',
                    performanceTitle: 'Content Performance',
                };
            case 'viewer':
                return {
                    title: 'Analytics Dashboard',
                    description: 'View site performance and metrics.',
                    widgets: VIEWER_WIDGETS,
                    activityTitle: 'Site Activity',
                    activityEmpty: 'No activity data available.',
                    performanceTitle: 'Traffic Overview',
                };
            default:
                return {
                    title: 'Dashboard',
                    description: 'Welcome',
                    widgets: [],
                    activityTitle: 'Activity',
                    activityEmpty: 'No activity.',
                    performanceTitle: 'Performance',
                };
        }
    };

    const config = getRoleConfig();

    return (
        <div className="space-y-8">
            <DashboardHeader title={config.title} description={config.description} />

            {/* Role indicator for clarity */}
            <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                    backgroundColor: `${roleColor}15`,
                    color: roleColor,
                    border: `1px solid ${roleColor}30`
                }}
            >
                <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: roleColor }}
                />
                Viewing as {roleDefinition.name}
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {config.widgets.map((widget) => (
                    <WidgetCard key={widget.id} widget={widget} roleColor={roleColor} />
                ))}
            </div>

            {/* Viewer restriction notice */}
            {currentRole === 'viewer' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-amber-200">
                        <strong>Read-only access:</strong> As a Viewer, you can see all data but cannot create, edit, or delete content.
                    </p>
                </div>
            )}

            {/* Performance and Activity Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PerformancePanel title={config.performanceTitle} />
                <ActivityPanel title={config.activityTitle} emptyMessage={config.activityEmpty} />
            </div>
        </div>
    );
}

