import React, { useState } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { RightDrawer } from './RightDrawer';

interface ShellProps {
    children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState('');

    // Global methods to control the drawer (could be moved to a Context)
    const openEdit = (title: string) => {
        setDrawerTitle(title);
        setIsDrawerOpen(true);
    };

    return (
        <div className="admin-studio flex h-screen bg-dark text-primary selection:bg-brand-primary/30 overflow-hidden font-sans">
            <SideNav />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar />

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>

            <RightDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={drawerTitle}
            >
                <div className="space-y-6">
                    <p className="text-muted text-sm">
                        Quickly edit properties for the selected item without losing your current context.
                    </p>
                    <div className="h-64 rounded-xl bg-white/5 border border-dashed border-border-muted flex items-center justify-center">
                        <span className="text-muted italic">Form Fields Placeholder</span>
                    </div>
                </div>
            </RightDrawer>
        </div>
    );
}
