import { Hono } from 'hono';
import { settingsRegistry } from '@reactpress/core-registry';

const settings = new Hono<{ Bindings: any; Variables: any }>();

/**
 * GET /api/v1/settings/sections/:moduleId
 * Fetches settings schema merged with database values
 */
settings.get('/sections/:moduleId', async (c) => {
    const db = c.env.DB;
    const moduleId = c.req.param('moduleId');
    const tenantId = c.req.query('tenantId') || 'default';

    const section = settingsRegistry.get(moduleId);
    console.log(`[Settings] Fetching section: ${moduleId} - Found: ${!!section} - Fields: ${section?.fields.length}`);
    if (!section) {
        return c.json({ error: 'Settings section not found' }, 404);
    }

    try {
        const results = await db.prepare(`
            SELECT key, value FROM settings 
            WHERE tenant_id = ? AND module_id = ?
        `).bind(tenantId, moduleId).all();

        const values: Record<string, any> = {};
        for (const row of (results.results || [])) {
            try {
                const val = (row as any).value;
                values[(row as any).key] = (val && (val.startsWith('{') || val.startsWith('[') || val === 'true' || val === 'false'))
                    ? JSON.parse(val)
                    : val;
            } catch (e) {
                values[(row as any).key] = (row as any).value;
            }
        }

        // Merge DB values first to preserve settings not in the registry (e.g. dynamic UI columns)
        const mergedValues: Record<string, any> = { ...values };
        section.fields.forEach(field => {
            if (mergedValues[field.key] === undefined) {
                mergedValues[field.key] = field.defaultValue;
            }
        });

        return c.json({
            ...section,
            values: mergedValues
        });
    } catch (error: any) {
        console.error('Failed to get settings:', error);
        return c.json(section);
    }
});

/**
 * PUT /api/v1/settings
 * Atomic update of multiple settings for a module
 * Uses ON CONFLICT for efficient upsert
 */
settings.put('/', async (c) => {
    const db = c.env.DB;
    const payload = await c.req.json();
    const { tenantId, moduleId, settings: newSettings } = payload;

    if (!moduleId || !newSettings) {
        return c.json({ error: 'moduleId and settings are required' }, 400);
    }

    const tId = tenantId || 'default';
    const now = Math.floor(Date.now() / 1000);

    try {
        const statements: any[] = [];
        for (const [key, value] of Object.entries(newSettings)) {
            const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);

            statements.push(
                db.prepare(`
                    INSERT INTO settings (id, tenant_id, module_id, key, value, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON CONFLICT(tenant_id, module_id, key) DO UPDATE SET
                    value = EXCLUDED.value, updated_at = EXCLUDED.updated_at
                `).bind(
                    crypto.randomUUID(),
                    tId,
                    moduleId,
                    key,
                    jsonValue,
                    now
                )
            );
        }

        if (statements.length > 0) {
            await db.batch(statements);
        }

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Failed to save settings:', error);
        return c.json({ error: 'Failed to save settings', message: error.message }, 500);
    }
});

export default settings;
