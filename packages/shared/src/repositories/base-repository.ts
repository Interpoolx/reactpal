import { and, eq, SQL } from 'drizzle-orm';

export abstract class BaseRepository<TTable extends { tenantId: any }> {
    constructor(protected db: any, protected tenantId: string) { }

    abstract getTable(): TTable;

    /**
     * Enforces tenantId on every query condition.
     */
    protected withTenant(condition?: SQL) {
        const table = this.getTable();
        // @ts-ignore - tenantId is mandatory in our schema contract
        const tenantFilter = eq(table.tenantId, this.tenantId);
        return condition ? and(tenantFilter, condition) : tenantFilter;
    }

    /**
     * Universal findMany with tenant scoping.
     */
    async findMany(condition?: SQL) {
        return this.db
            .select()
            .from(this.getTable())
            .where(this.withTenant(condition))
            .all();
    }

    /**
     * Universal findOne with tenant scoping.
     */
    async findFirst(condition?: SQL) {
        const result = await this.db
            .select()
            .from(this.getTable())
            .where(this.withTenant(condition))
            .limit(1)
            .all();
        return result[0] || null;
    }
}
