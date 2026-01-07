import React, { createContext, useContext, useState, useEffect } from 'react';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain: string;
}

interface TenantContextType {
    activeTenant: Tenant | null;
    tenants: Tenant[];
    setActiveTenant: (tenant: Tenant) => void;
    isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [activeTenant, setActiveTenantState] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/v1/tenants')
            .then(res => res.json())
            .then(data => {
                setTenants(data);

                // Priority: 1. URL Query Param, 2. LocalStorage, 3. Default (first)
                const params = new URLSearchParams(window.location.search);
                const urlTenant = params.get('tenant');
                const saved = localStorage.getItem('rp_active_tenant');

                const targetId = urlTenant || saved;
                const found = data.find((t: Tenant) => t.id === targetId || t.slug === targetId || t.domain === targetId);

                const initial = found || data[0] || null;
                setActiveTenantState(initial);

                // Sync URL if missing or mismatch
                if (initial && urlTenant !== initial.id) {
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('tenant', initial.id);
                    window.history.replaceState({}, '', newUrl);
                }

                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load tenants', err);
                setIsLoading(false);
            });
    }, []);

    const setActiveTenant = (tenant: Tenant) => {
        setActiveTenantState(tenant);
        localStorage.setItem('rp_active_tenant', tenant.id);

        // Update URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tenant', tenant.id);
        window.history.pushState({}, '', newUrl);
    };

    return (
        <TenantContext.Provider value={{ activeTenant, tenants, setActiveTenant, isLoading }}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);
    if (!context) throw new Error('useTenant must be used within TenantProvider');
    return context;
}
