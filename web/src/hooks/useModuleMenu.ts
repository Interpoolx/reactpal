import { useState, useEffect } from 'react';
import { useTenant } from '../context/TenantContext';
import { apiFetch } from '../lib/api';

/**
 * Module menu item from the backend
 */
export interface ModuleMenuItem {
    label: string;
    icon: string;
    href: string;
    order: number;
    badge?: {
        type: 'count' | 'status' | 'new';
        value?: number | string;
    };
    children?: ModuleMenuItem[];
}

/**
 * Hook to fetch dynamic module menu items
 * 
 * Fetches sidebar menu from API based on current tenant and user context.
 * Provides fallback default menu if API fails. Updates whenever active tenant changes.
 * 
 * @returns {Object} Menu state with:
 *   - menuItems: Array of menu items with label, icon, href, order
 *   - isLoading: True while fetching from API
 *   - error: Error object if fetch failed (but defaults still provided)
 * 
 * @example
 * const { menuItems, isLoading, error } = useModuleMenu();
 * 
 * if (isLoading) return <div>Loading menu...</div>;
 * 
 * return (
 *   <nav>
 *     {menuItems
 *       .sort((a, b) => a.order - b.order)
 *       .map(item => (
 *         <a key={item.href} href={item.href}>
 *           {item.label}
 *         </a>
 *       ))}
 *   </nav>
 * );
 * 
 * @note Falls back to hardcoded default menu if API unavailable
 * @note Refetches menu when active tenant changes (via activeTenant.id dependency)
 */
export function useModuleMenu() {
    const [menuItems, setMenuItems] = useState<ModuleMenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { activeTenant } = useTenant();

    useEffect(() => {
        async function fetchMenu() {
            setIsLoading(true);
            try {
                const tenantParam = activeTenant?.id ? `?tenantId=${activeTenant.id}` : '';
                const response = await apiFetch(`/api/v1/modules/menu${tenantParam}`);

                if (!response.ok) {
                    // Fallback to default menu if API not available
                    setMenuItems(getDefaultMenu());
                    return;
                }

                const data = await response.json();
                setMenuItems(data);
            } catch (err) {
                console.warn('Failed to fetch module menu, using defaults:', err);
                setMenuItems(getDefaultMenu());
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMenu();
    }, [activeTenant?.id]);

    return { menuItems, isLoading, error };
}

/**
 * Get default menu items fallback
 * 
 * Returns hardcoded default menu when API is unavailable or fails.
 * Used as fallback to ensure UI always shows navigation.
 * 
 * @returns {ModuleMenuItem[]} Default menu items
 * 
 * @note This is a fallback; real menu should come from API for dynamic modules
 */
function getDefaultMenu(): ModuleMenuItem[] {
    return [
        { label: 'Dashboard', icon: 'LayoutDashboard', href: '/hpanel', order: 0 },
        { label: 'Modules', icon: 'Package', href: '/hpanel/modules', order: 5 },
        { label: 'Tenants', icon: 'Building2', href: '/hpanel/tenants', order: 10 },
        { label: 'Users', icon: 'Users', href: '/hpanel/users', order: 20 },
        { label: 'Security', icon: 'Shield', href: '/hpanel/security', order: 30 },
        { label: 'Settings', icon: 'Settings', href: '/hpanel/settings', order: 100 },
    ];
}

/**
 * Hook to check if user has permission for a module
 * 
 * Checks whether the current user has access to a specific module.
 * Currently returns true for all users (permission system TODO).
 * 
 * @param {string} moduleId - Module ID to check permission for (e.g., 'cms', 'crm')
 * @returns {boolean} True if user can access the module, false otherwise
 * 
 * @example
 * const canAccessCMS = useModulePermission('cms');
 * if (canAccessCMS) {
 *   return <CMSModule />;
 * }
 * 
 * @todo Implement actual permission checking based on user role and module config
 * @todo Consider pulling from moduleRegistry availability rules
 */
export function useModulePermission(moduleId: string): boolean {
    // For now, always return true
    // Will be enhanced with actual permission checking
    return true;
}
