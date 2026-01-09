import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { tenantResolverMiddleware } from './middleware/tenant-resolver';
import { adminAuthMiddleware } from './middleware/admin-auth';
import resolver from './routes/v1/resolver';
import settings from './routes/v1/settings';
import { registerModulesRoutes } from './routes/v1/modules';
import { bootstrapBackend } from './lib/bootstrap';
import { loadModuleRoutes } from './lib/ModuleLoader';

// Import Types from Workers
import { type D1Database, type KVNamespace } from '@cloudflare/workers-types';

type Bindings = {
    DB: D1Database;
    TENANT_MANIFESTS: KVNamespace;
    ADMIN_KEY: string;
}

type Variables = {
    tenantId: string;
    tenant: any;
    isAdmin: boolean;
    user: any;
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// Middlewares
app.use('*', cors());
app.use('*', tenantResolverMiddleware);
app.use('*', adminAuthMiddleware);

// API Routes
app.route('/api/v1/resolver', resolver);
app.route('/api/v1/settings', settings);

// Module routes (management API)
registerModulesRoutes(app);

// Initialize modular system
bootstrapBackend().then(() => {
    // Mount all module routes AFTER bootstrapping is complete
    // This includes auth, users, tenants, and any enabled optional modules
    loadModuleRoutes(app);
}).catch(err => {
    console.error('Failed to bootstrap backend:', err);
});

// Health Check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error Handling
app.onError((err, c) => {
    console.error(err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
