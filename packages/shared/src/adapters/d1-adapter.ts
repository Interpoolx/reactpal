import { type D1Database, type D1Result } from '@cloudflare/workers-types';

export class D1Adapter {
  constructor(private db: D1Database) {}

  async execute<T = any>(sql: string, params: any[] = []): Promise<D1Result<T>> {
    return this.db.prepare(sql).bind(...params).run();
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const { results } = await this.db.prepare(sql).bind(...params).all<T>();
    return results || [];
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const result = await this.db.prepare(sql).bind(...params).first<T>();
    return result;
  }

  async batch(statements: string[]): Promise<any[]> {
    const prepared = statements.map(s => this.db.prepare(s));
    return this.db.batch(prepared);
  }
}
