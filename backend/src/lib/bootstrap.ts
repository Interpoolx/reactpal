import { moduleRegistry } from '@reactpress/core-registry';

/**
 * Bootstrap the backend modular system.
 * This function imports all the foundation modules, which triggers their 
 * self-registration with the moduleRegistry.
 */
export async function bootstrapBackend() {
    console.log('\n🚀 Bootstrapping Modular Platform...');

    // 1. Import all foundation modules to trigger registration
    const { registerCoreModules } = await import('@reactpress/modules-core');
    registerCoreModules();

    // Core modules (Foundation)
    await import('@reactpress/modules-auth');
    await import('@reactpress/modules-users');
    await import('@reactpress/modules-tenants');

    // Optional Features
    await import('@reactpress/modules-cms');
    await import('@reactpress/modules-crm');
    await import('@reactpress/modules-seo');

    // 2. Log registered modules
    const modules = moduleRegistry.getAll();
    console.log(`📦 Registered ${modules.length} foundation modules:`);
    modules.forEach(m => console.log(`  - ${m.name} (${m.id}) v${m.version}`));

    // 3. Verify dependencies
    const modulesInOrder = moduleRegistry.getInLoadOrder();
    console.log(`✅ System ready. Load order: ${modulesInOrder.map(m => m.id).join(' -> ')}\n`);

    return true;
}
