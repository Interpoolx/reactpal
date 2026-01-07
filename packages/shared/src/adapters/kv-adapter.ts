import { type KVNamespace } from '@cloudflare/workers-types';

export class KVAdapter {
    constructor(private kv: KVNamespace) { }

    async get<T>(key: string): Promise<T | null> {
        return this.kv.get<T>(key, { type: 'json' });
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        await this.kv.put(key, JSON.stringify(value), {
            expirationTtl: ttlSeconds
        });
    }

    async delete(key: string): Promise<void> {
        await this.kv.delete(key);
    }

    async list(prefix?: string): Promise<string[]> {
        const { keys } = await this.kv.list({ prefix });
        return keys.map(k => k.name);
    }
}
