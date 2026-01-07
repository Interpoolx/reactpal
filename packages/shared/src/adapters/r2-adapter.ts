import { type R2Bucket } from '@cloudflare/workers-types';

export class R2Adapter {
    constructor(private bucket: R2Bucket) { }

    async upload(path: string, data: any, contentType: string): Promise<any> {
        return this.bucket.put(path, data, {
            httpMetadata: { contentType }
        });
    }

    async download(path: string): Promise<any> {
        return this.bucket.get(path);
    }

    async delete(path: string): Promise<void> {
        await this.bucket.delete(path);
    }

    async list(prefix?: string): Promise<string[]> {
        const { objects } = await this.bucket.list({ prefix });
        return objects.map(o => o.key);
    }
}
