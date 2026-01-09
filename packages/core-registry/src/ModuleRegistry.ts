import type { ModuleConfig, ModuleMenuItem, ModuleAvailability } from './types';
import { settingsRegistry } from './SettingsRegistry';

/**
 * Central registry for all modules in the platform.
 * Modules register themselves on import via module.config.ts
 */
class ModuleRegistryClass {
    private modules: Map<string, ModuleConfig> = new Map();
    private loadOrder: string[] = [];

    /**
     * Register a module with the registry
     * @throws Error if module already registered or dependencies missing
     */
    register(config: ModuleConfig): void {
        // Check for duplicate registration
        if (this.modules.has(config.id)) {
            console.warn(`Module ${config.id} is already registered, skipping.`);
            return;
        }

        // Validate dependencies exist
        if (config.dependencies) {
            for (const dep of config.dependencies) {
                if (!this.modules.has(dep)) {
                    throw new Error(
                        `Module "${config.id}" depends on "${dep}" which is not registered. ` +
                        `Ensure ${dep} is imported before ${config.id}.`
                    );
                }
            }
        }

        // Store module
        this.modules.set(config.id, config);
        this.loadOrder.push(config.id);

        // Auto-register settings if provided
        if (config.settings) {
            settingsRegistry.register(config.settings);
        }

        console.log(`✓ Module registered: ${config.name} (${config.id}) v${config.version}`);
    }

    /**
     * Get all registered modules
     */
    getAll(): ModuleConfig[] {
        return Array.from(this.modules.values());
    }

    /**
     * Get module by ID
     */
    get(id: string): ModuleConfig | undefined {
        return this.modules.get(id);
    }

    /**
     * Get modules in dependency-safe load order
     */
    getInLoadOrder(): ModuleConfig[] {
        return this.loadOrder.map(id => this.modules.get(id)!);
    }

    /**
     * Get available modules for a specific context
     */
    getAvailableModules(context: {
        isSuperAdmin: boolean;
        tenantPlan?: string;
        enabledModules?: string[];
    }): ModuleConfig[] {
        return this.getAll()
            .filter(module => this.isModuleAvailable(module, context))
            .sort((a, b) => a.menu.order - b.menu.order);
    }

    /**
     * Get sidebar menu items for current context
     */
    async getSidebarMenu(context: {
        isSuperAdmin: boolean;
        tenantPlan?: string;
        enabledModules?: string[];
    }): Promise<ModuleMenuItem[]> {
        const availableModules = this.getAvailableModules(context);
        const menuItems: ModuleMenuItem[] = [];

        for (const module of availableModules) {
            const menuItem = { ...module.menu };

            // Resolve badge value if configured
            if (menuItem.badge?.getValue) {
                try {
                    const value = await menuItem.badge.getValue();
                    if (value !== undefined) {
                        (menuItem.badge as any).value = value;
                    }
                } catch (err) {
                    console.warn(`Failed to get badge for ${module.id}:`, err);
                }
            }

            menuItems.push(menuItem);
        }

        return menuItems;
    }

    /**
     * Check if module is available for given context
     */
    private isModuleAvailable(
        module: ModuleConfig,
        context: {
            isSuperAdmin: boolean;
            tenantPlan?: string;
            enabledModules?: string[];
        }
    ): boolean {
        const { availability } = module;

        // Platform admin modules only visible to super admins
        if (availability.requiresPlatformAdmin && !context.isSuperAdmin) {
            return false;
        }

        // Enterprise-only modules
        if (availability.enterpriseOnly && context.tenantPlan !== 'enterprise') {
            return false;
        }

        // Core/foundation modules are always visible
        if (module.isCore || availability.defaultEnabled) {
            return true;
        }

        // Optional modules only visible if explicitly enabled
        if (context.enabledModules && context.enabledModules.includes(module.id)) {
            return true;
        }

        // Not enabled, don't show
        return false;
    }

    /**
     * Get module IDs that should be loaded for a tenant
     */
    getModulesToLoad(enabledModules: string[]): ModuleConfig[] {
        const toLoad: ModuleConfig[] = [];
        const visited = new Set<string>();

        const addWithDeps = (id: string) => {
            if (visited.has(id)) return;
            visited.add(id);

            const module = this.modules.get(id);
            if (!module) return;

            // Add dependencies first
            if (module.dependencies) {
                for (const dep of module.dependencies) {
                    addWithDeps(dep);
                }
            }

            toLoad.push(module);
        };

        // Add foundation modules (always enabled)
        for (const module of this.getAll()) {
            if (module.availability.defaultEnabled) {
                addWithDeps(module.id);
            }
        }

        // Add explicitly enabled modules
        for (const id of enabledModules) {
            addWithDeps(id);
        }

        return toLoad;
    }
}

// Singleton instance
export const moduleRegistry = new ModuleRegistryClass();
