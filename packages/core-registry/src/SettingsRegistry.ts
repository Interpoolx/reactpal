import type { SettingSection, SettingField, SettingsContext } from './types';

/**
 * Central registry for settings sections.
 * Modules register their settings sections on import.
 * 
 * Settings Resolution Order:
 * User Settings > Tenant Settings > Platform Settings > Default Value
 */
class SettingsRegistryClass {
    private sections: Map<string, SettingSection> = new Map();

    /**
     * Register a settings section
     */
    register(section: SettingSection): void {
        if (this.sections.has(section.id)) {
            console.warn(`Settings section "${section.id}" already registered, merging fields.`);
            const existing = this.sections.get(section.id)!;
            existing.fields = [...existing.fields, ...section.fields];
            return;
        }

        this.sections.set(section.id, section);
        console.log(`✓ Settings section registered: ${section.label} (${section.id})`);
    }

    /**
     * Get all registered sections
     */
    getAll(): SettingSection[] {
        return Array.from(this.sections.values()).sort((a, b) => a.order - b.order);
    }

    /**
     * Get section by ID
     */
    get(id: string): SettingSection | undefined {
        return this.sections.get(id);
    }

    /**
     * Get sections available for current context
     */
    getAvailableSections(context: SettingsContext): SettingSection[] {
        return this.getAll().filter(section => {
            // Platform-only sections require super admin
            if (!section.availableForTenants && !context.isSuperAdmin) {
                return false;
            }

            // Check required roles
            if (section.requiredRoles && section.requiredRoles.length > 0) {
                // Role check would be implemented by calling code
                // This is just the filter interface
            }

            return true;
        });
    }

    /**
     * Get all fields grouped by key prefix
     */
    getAllFields(): SettingField[] {
        const fields: SettingField[] = [];
        for (const section of this.getAll()) {
            fields.push(...section.fields);
        }
        return fields;
    }

    /**
     * Get field definition by key
     */
    getField(key: string): SettingField | undefined {
        for (const section of this.getAll()) {
            const field = section.fields.find(f => f.key === key);
            if (field) return field;
        }
        return undefined;
    }

    /**
     * Get default value for a setting key
     */
    getDefaultValue(key: string): any {
        const field = this.getField(key);
        return field?.defaultValue;
    }

    /**
     * Get all keys for a section
     */
    getKeysForSection(sectionId: string): string[] {
        const section = this.sections.get(sectionId);
        if (!section) return [];
        return section.fields.map(f => f.key);
    }
}

// Singleton instance
export const settingsRegistry = new SettingsRegistryClass();
