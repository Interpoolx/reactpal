import { moduleRegistry } from '@reactpress/core-registry';

/**
 * Bootstrap the frontend modular system.
 * This function imports all the foundation modules, which triggers their 
 * self-registration with the moduleRegistry in the browser.
 */
export async function bootstrapFrontend() {
    console.log('[App] Bootstrapping Frontend...');

    // Core modules (Foundation)
    // We import the main entry points which call moduleRegistry.register()
    const { registerCoreModules } = await import('@reactpress/modules-core');
    registerCoreModules();

    await import('@reactpress/modules-auth');
    await import('@reactpress/modules-users');
    await import('@reactpress/modules-tenants');

    // Optional Features
    await import('@reactpress/modules-cms');
    await import('@reactpress/modules-crm');
    await import('@reactpress/modules-seo');

    const modules = moduleRegistry.getAll();
    console.log(`[App] Registered ${modules.length} modules:`, modules.map(m => m.id));

    return true;
}
