import React from 'react';
import { LayoutDashboard, Settings, Users } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hpanel' },
    { icon: Users, label: 'Tenants', path: '/hpanel/tenants' },
    { icon: Settings, label: 'Settings', path: '/hpanel/settings' },
];

export function SideNav() {
    const { activeTenant } = useTenant();
    const identifier = activeTenant?.domain || activeTenant?.slug || activeTenant?.id;
    const query = identifier ? `?tenant=${identifier}` : '';

    return (
        <aside className="w-64 h-screen border-r border-border-muted bg-darker flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold">
                        R
                    </div>
                    <span className="font-bold text-lg tracking-tight">ReactPress</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {MENU_ITEMS.map((item) => (
                    <a
                        key={item.label}
                        href={`${item.path}${query}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-primary hover:bg-white/5 transition-all group"
                    >
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-sm">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t border-border-muted">
                <div className="bg-dark p-3 rounded-xl border border-border-muted flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
                    <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-medium truncate">Master Admin</div>
                        <div className="text-[10px] text-muted truncate">master@reactpress.com</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
