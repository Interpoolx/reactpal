import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { tenantResolverMiddleware } from './middleware/tenant-resolver';
import { adminAuthMiddleware } from './middleware/admin-auth';
import tenants from './routes/v1/tenants';
import auth from './routes/v1/auth';
import resolver from './routes/v1/resolver';

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
}

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

// Middlewares
app.use('*', cors());
app.use('*', tenantResolverMiddleware);
app.use('*', adminAuthMiddleware);

// Routes
app.route('/api/v1/auth', auth);
app.route('/api/v1/tenants', tenants);
app.route('/api/v1/resolver', resolver);

// Health Check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error Handling
app.onError((err, c) => {
    console.error(err);
    return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
