import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Globe, Check, ExternalLink } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { motion, AnimatePresence } from 'framer-motion';

export function TopBar() {
    const { activeTenant, tenants, setActiveTenant } = useTenant();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 border-b border-border-muted bg-dark/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative max-w-md w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search commands, tenants, modules..."
                        className="w-full bg-white/5 border border-border-muted rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Tenant Switcher */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 bg-white/5 border border-border-muted px-4 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer min-w-[200px] justify-between"
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Globe className="w-4 h-4 text-brand-primary flex-shrink-0" />
                            <span className="text-xs font-medium truncate">
                                {activeTenant?.domain || activeTenant?.name || 'Select Tenant'}
                            </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-64 bg-darker border border-border-muted rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                            >
                                <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-wider">
                                    Available Tenants
                                </div>
                                {tenants.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setActiveTenant(t);
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-brand-primary/10 transition-colors group"
                                    >
                                        <div className="flex flex-col items-start overflow-hidden">
                                            <span className="font-medium truncate">{t.name}</span>
                                            <span className="text-[10px] text-muted truncate">{t.domain}</span>
                                        </div>
                                        {activeTenant?.id === t.id && (
                                            <Check className="w-4 h-4 text-brand-primary flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Open Frontend Link */}
                {activeTenant && (
                    <a
                        href={`/?tenant=${activeTenant.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Public Site"
                        className="p-2.5 bg-white/5 border border-border-muted rounded-xl hover:bg-brand-primary/20 hover:text-brand-primary transition-all group"
                    >
                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                )}
            </div>

            <button className="p-2 text-muted hover:text-primary transition-colors">
                <Bell className="w-5 h-5" />
            </button>
        </header>
    );
}
