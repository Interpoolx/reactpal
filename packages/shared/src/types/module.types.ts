/**
 * Module Configuration Type Definition
 * All modules must export a moduleConfig matching this interface
 */
export interface ModuleConfig {
    /** Unique module identifier (e.g., 'auth', 'cms') */
    id: string;

    /** Display name */
    name: string;

    /** Short description for cards */
    description: string;

    /** Detailed description for detail page */
    longDescription?: string;

    /** Lucide icon name */
    icon: string;

    /** Semantic version */
    version: string;

    /** Module category */
    category: 'core' | 'features' | 'integrations';

    /** Core modules cannot be disabled */
    isCore: boolean;

    /** List of feature names */
    features: string[];

    /** Module IDs this depends on */
    dependencies: string[];

    /** Searchable tags */
    tags: string[];
}

/**
 * Runtime module state (stored in database)
 */
export interface ModuleStatus {
    moduleId: string;
    tenantId: string;
    enabled: boolean;
    enabledAt?: number;
    config?: Record<string, any>;
}
