import type { Hono } from 'hono';
import { moduleRegistry } from '@reactpress/core-registry';

/**
 * ModuleLoader - Loads and registers all module routes
 * 
 * Import order matters for dependency resolution:
 * 1. Core modules first (auth)
 * 2. Foundation modules (users)
 * 3. Platform modules (tenants)
 * 4. Optional modules (cms, crm, seo) - can be lazy loaded
 */

// Foundation modules - always loaded
import '@reactpress/modules-auth';
import '@reactpress/modules-users';
import '@reactpress/modules-tenants';

/**
 * Load all registered module routes into the Hono app
 * 
 * Iterates through modules in dependency order and mounts their routes.
 * Handles errors gracefully - if one module fails, others continue loading.
 * 
 * @param {Hono<any>} app - Hono app instance to mount routes on
 * @throws Does not throw; logs errors and continues with next module
 * 
 * @example
 * import { Hono } from 'hono';
 * import { loadModuleRoutes } from '@/lib/ModuleLoader';
 * 
 * const app = new Hono();
 * loadModuleRoutes(app);
 * // Prints: Loading 5 modules... ✓ Auth routes mounted ✓ Users routes mounted...
 */
export function loadModuleRoutes(app: Hono<any>): void {
    const modules = moduleRegistry.getInLoadOrder();

    console.log(`\n📦 Loading ${modules.length} modules...`);

    for (const module of modules) {
        try {
            module.routes(app);
            console.log(`  ✓ ${module.name} routes mounted`);
        } catch (error) {
            console.error(`  ✗ Failed to load ${module.name}:`, error);
        }
    }

    console.log(`\n✅ All modules loaded\n`);
}

/**
 * Get sidebar menu items filtered by user context
 * 
 * Fetches menu items from moduleRegistry based on admin status, tenant plan, and enabled modules.
 * Used by API endpoint to build dynamic admin sidebar.
 * 
 * @param {Object} context - Filter context
 * @param {boolean} context.isSuperAdmin - Is user a super admin (sees all items)
 * @param {string} [context.tenantPlan] - Tenant plan level ('free', 'starter', 'pro', 'enterprise')
 * @param {string[]} [context.enabledModules] - List of module IDs enabled for tenant
 * @returns {Promise<ModuleMenuItem[]>} Menu items filtered for this context
 * 
 * @example
 * const menu = await getModuleMenu({
 *   isSuperAdmin: user.role === 'admin',
 *   tenantPlan: tenant.plan,
 *   enabledModules: ['auth', 'users', 'cms']
 * });
 */
export async function getModuleMenu(context: {
    isSuperAdmin: boolean;
    tenantPlan?: string;
    enabledModules?: string[];
}) {
    return moduleRegistry.getSidebarMenu(context);
}

/**
 * Lazy load optional module by ID
 * 
 * Dynamically imports optional modules (cms, crm, seo) that are not in the foundation set.
 * Foundation modules (auth, users, tenants) are pre-imported and should not use this function.
 * 
 * @param {string} moduleId - Module ID to load ('cms', 'crm', 'seo', etc.)
 * @returns {Promise<boolean>} True if loaded successfully, false if not found or error
 * 
 * @example
 * const loaded = await lazyLoadModule('cms');
 * if (loaded) {
 *   console.log('CMS module loaded');
 * } else {
 *   console.log('CMS module not available');
 * }
 * 
 * @note Add new optional modules by uncommenting cases and importing them
 */
export async function lazyLoadModule(moduleId: string): Promise<boolean> {
    try {
        switch (moduleId) {
            // Optional modules - uncomment as they are created
            // case 'cms':
            //   await import('@reactpress/modules-cms');
            //   return true;
            // case 'crm':
            //   await import('@reactpress/modules-crm');
            //   return true;
            // case 'seo':
            //   await import('@reactpress/modules-seo');
            //   return true;
            default:
                console.warn(`Optional module not found: ${moduleId}`);
                return false;
        }
    } catch (error) {
        console.error(`Failed to load optional module ${moduleId}:`, error);
        return false;
    }
}

/**
 * Load modules enabled for a specific tenant
 * 
 * Mounts routes for optional modules that have been enabled for a specific tenant.
 * Foundation modules are skipped since they're already loaded globally.
 * 
 * @param {Hono<any>} app - Hono app instance to mount routes on
 * @param {string[]} enabledModuleIds - List of module IDs enabled for this tenant
 * @returns {Promise<void>}
 * 
 * @example
 * const tenant = await getTenantoById('acme-corp');
 * const enabledIds = tenant.enabledModules || [];
 * await loadTenantModules(app, enabledIds);
 * // Routes for enabled optional modules are now mounted
 * 
 * @note Foundation modules (auth, users, tenants) are always available
 */
export async function loadTenantModules(
    app: Hono<any>,
    enabledModuleIds: string[]
): Promise<void> {
    for (const moduleId of enabledModuleIds) {
        const module = moduleRegistry.get(moduleId);

        // Skip if already loaded (foundation modules)
        if (module) {
            continue;
        }

        // Lazy load optional modules
        await lazyLoadModule(moduleId);

        const loadedModule = moduleRegistry.get(moduleId);
        if (loadedModule) {
            loadedModule.routes(app);
            console.log(`  ✓ ${loadedModule.name} loaded for tenant`);
        }
    }
}
