import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../lib/api';

interface Tenant {
    id: string;
    name: string;
    slug: string;
    domain: string;
    max_users?: number;
    current_users?: number;
}

interface TenantContextType {
    activeTenant: Tenant | null;
    tenants: Tenant[];
    setActiveTenant: (tenant: Tenant) => void;
    refresh: () => Promise<void>;
    isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

/**
 * Provider component for tenant context
 * 
 * Manages tenant selection and loading across the application. On mount:
 * 1. Fetches all available tenants from API
 * 2. Resolves active tenant via: URL query param > localStorage > first tenant
 * 3. Syncs URL with selected tenant (domain/slug for readability)
 * 
 * The active tenant is persisted to localStorage and URL for easy restoration.
 * Child components access tenant via useTenant() hook.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * 
 * @example
 * import { TenantProvider, useTenant } from '@/context/TenantContext';
 * 
 * function App() {
 *   return (
 *     <TenantProvider>
 *       <MyComponent />
 *     </TenantProvider>
 *   );
 * }
 * 
 * function MyComponent() {
 *   const { activeTenant, tenants, setActiveTenant, isLoading } = useTenant();
 *   
 *   if (isLoading) return <div>Loading tenants...</div>;
 *   
 *   return (
 *     <div>
 *       <p>Active: {activeTenant?.name}</p>
 *       <select onChange={(e) => {
 *         const tenant = tenants.find(t => t.id === e.target.value);
 *         if (tenant) setActiveTenant(tenant);
 *       }}>
 *         {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
 *       </select>
 *     </div>
 *   );
 * }
 */
export function TenantProvider({ children }: { children: React.ReactNode }) {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [activeTenant, setActiveTenantState] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTenants = async () => {
            try {
                const response = await apiFetch('/api/v1/tenants');
                const data = await response.json();
                const tenantsArray = Array.isArray(data) ? data : [];
                setTenants(tenantsArray);

                // Priority: 1. URL Query Param, 2. LocalStorage, 3. Default (first)
                const params = new URLSearchParams(window.location.search);
                const urlTenant = params.get('tenant');
                const saved = localStorage.getItem('rp_active_tenant');

                const targetId = urlTenant || saved;
                const found = tenantsArray.find((t: Tenant) => t.id === targetId || t.slug === targetId || t.domain === targetId);

                const initial = found || tenantsArray[0] || null;

                if (initial) {
                    await setActiveTenantWithUsage(initial);
                } else {
                    setIsLoading(false);
                }

                // Sync URL if missing or mismatch
                if (initial) {
                    const identifier = initial.domain || initial.slug || initial.id;
                    if (urlTenant !== identifier) {
                        const newUrl = new URL(window.location.href);
                        newUrl.searchParams.set('tenant', identifier);
                        window.history.replaceState({}, '', newUrl);
                    }
                }
            } catch (err) {
                console.error('Failed to load tenants', err);
                setIsLoading(false);
            }
        };

        loadTenants();
    }, []);

    const setActiveTenantWithUsage = async (tenant: Tenant) => {
        setIsLoading(true);
        try {
            // Fetch usage
            const res = await apiFetch(`/api/v1/tenants/${tenant.id}/usage`);
            if (res.ok) {
                const usage = await res.json();
                // Map usage response to Tenant interface
                // usage.users.current/max
                const updatedTenant = {
                    ...tenant,
                    current_users: usage.users?.current || 0,
                    max_users: usage.users?.max || 0
                };
                setActiveTenantState(updatedTenant);
            } else {
                setActiveTenantState(tenant);
            }
        } catch {
            setActiveTenantState(tenant);
        } finally {
            setIsLoading(false);
        }
    };

    const setActiveTenant = (tenant: Tenant) => {
        setActiveTenantWithUsage(tenant);
        localStorage.setItem('rp_active_tenant', tenant.id);

        // Update URL to a readable identifier
        const identifier = tenant.domain || tenant.slug || tenant.id;
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tenant', identifier);
    };

    const refresh = async () => {
        if (activeTenant) {
            await setActiveTenantWithUsage(activeTenant);
        }
    };

    return (
        <TenantContext.Provider value={{ activeTenant, tenants, setActiveTenant, refresh, isLoading }}>
            {children}
        </TenantContext.Provider>
    );
}

/**
 * Hook to access current tenant context
 * 
 * Must be used within a TenantProvider. Returns current tenant, all tenants, 
 * and functions to manage active tenant selection.
 * 
 * @returns {TenantContextType} Tenant context with:
 *   - activeTenant: Currently selected tenant (or null if loading)
 *   - tenants: All available tenants
 *   - setActiveTenant: Function to change active tenant (persists to localStorage and URL)
 *   - isLoading: True while fetching initial tenant list
 * @throws {Error} If not within TenantProvider
 * 
 * @example
 * const { activeTenant, tenants, setActiveTenant } = useTenant();
 * console.log(`Currently viewing: ${activeTenant?.name}`);
 * 
 * // Switch to a different tenant
 * const newTenant = tenants.find(t => t.slug === 'acme-corp');
 * if (newTenant) setActiveTenant(newTenant);
 */
export function useTenant() {
    const context = useContext(TenantContext);
    if (!context) throw new Error('useTenant must be used within TenantProvider');
    return context;
}
