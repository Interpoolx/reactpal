import type { ModuleEvent, EventHandler } from './types';

/**
 * Simple event bus for inter-module communication.
 * Modules should never depend on each other directly.
 * Instead, publish events and subscribe to them.
 * 
 * Example:
 * - CMS publishes 'post.published'
 * - SEO subscribes to regenerate sitemap
 */
class EventBusClass {
    private handlers: Map<string, Set<EventHandler>> = new Map();

    /**
     * Subscribe to an event
     * @returns Unsubscribe function
     */
    subscribe(event: string, handler: EventHandler): () => void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler);

        // Return unsubscribe function
        return () => {
            this.handlers.get(event)?.delete(handler);
        };
    }

    /**
     * Publish an event to all subscribers
     */
    async publish(event: string, payload: Partial<ModuleEvent>): Promise<void> {
        const handlers = this.handlers.get(event);
        if (!handlers || handlers.size === 0) {
            return;
        }

        const moduleEvent: ModuleEvent = {
            moduleId: payload.moduleId || 'unknown',
            tenantId: payload.tenantId,
            timestamp: new Date(),
            payload: payload.payload,
        };

        // Execute all handlers (don't wait for async handlers to complete)
        const promises: Promise<void>[] = [];
        for (const handler of handlers) {
            try {
                const result = handler(moduleEvent);
                if (result instanceof Promise) {
                    promises.push(result.catch(err => {
                        console.error(`Event handler error for "${event}":`, err);
                    }));
                }
            } catch (err) {
                console.error(`Event handler error for "${event}":`, err);
            }
        }

        // Wait for all async handlers
        if (promises.length > 0) {
            await Promise.all(promises);
        }
    }

    /**
     * Publish event without waiting for handlers
     */
    emit(event: string, payload: Partial<ModuleEvent>): void {
        this.publish(event, payload).catch(err => {
            console.error(`Event emit error for "${event}":`, err);
        });
    }

    /**
     * Remove all handlers for an event
     */
    clear(event: string): void {
        this.handlers.delete(event);
    }

    /**
     * Remove all handlers
     */
    clearAll(): void {
        this.handlers.clear();
    }
}

// Singleton instance
export const eventBus = new EventBusClass();

// Common event names
export const EVENTS = {
    // Module lifecycle
    MODULE_ENABLED: 'module.enabled',
    MODULE_DISABLED: 'module.disabled',

    // Tenant lifecycle
    TENANT_PROVISIONED: 'tenant.provisioned',
    TENANT_SUSPENDED: 'tenant.suspended',
    TENANT_DEPROVISIONED: 'tenant.deprovisioned',

    // User events
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    USER_INVITED: 'user.invited',

    // Auth events
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_FAILED: 'auth.login.failed',
    LOGOUT: 'auth.logout',
    PASSWORD_CHANGED: 'auth.password.changed',
    PASSWORD_RESET: 'auth.password.reset',
    SESSION_REVOKED: 'auth.session.revoked',

    // Settings events
    SETTING_CHANGED: 'settings.changed',
} as const;
