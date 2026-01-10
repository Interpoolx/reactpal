# Database Management Task List

This document tracks the implementation and status of database administrative features for the Cloudflare D1 environment.

## 🚀 Core Features & Status

### 1. Database Overview & Metrics
- [x] **Real-time Stats**: Display total tables and record counts.
- [x] **Size Estimation**: Mathematical estimation of DB size (since D1 restricts direct PRAGMA).
- [x] **D1 Environment Notes**: UI warning/info box about D1 specifics (estimated size, wrangler commands).
- [x] **Status Health**: Visual indicator of database connectivity.

### 2. Schema Management
- [x] **Schema Introspection**: Compare local Drizzle schema files with remote D1 structure.
- [x] **Diff Matrix**: Side-by-side view showing Match/Mismatch/Missing states.
- [x] **Auto-Sync (Additive)**: One-click "Apply" for missing columns using `ALTER TABLE ADD COLUMN`.
- [x] **Dry-run SQL**: Show generated SQL to user before execution for confirmation.

### 3. Migration Tracking
- [x] **Robust File Discovery**: Backend scans multiple paths (`db/migrations`, `backend/migrations`) to find `.sql` files.
- [x] **Status Tracking**: Compare filesystem files against `__drizzle_migrations` table.
- [x] **Batch Execution**: Mark migrations as applied/pending in the DB tracker.
- [x] **Rollback (Tracker)**: Ability to unmark the latest migration as applied.
- [x] **Pagination**: Server-side pagination for large migration histories.

### 4. Data Protection & Export
- [x] **SQL Export**: Generate a full SQL dump (`CREATE TABLE` + `INSERT`) for download.
- [x] **Audit Logging**: Every schema change or migration action is logged to `audit_logs`.
- [ ] **Point-in-Time Restore**: Logic for full database restoration from export.
- [ ] **Maintenance Mode**: UI toggle to disable public access during heavy migrations.

### 5. Advanced / Danger Zone
- [ ] **Table Data Clear**: Delete all records from a specific table with confirmation.
- [ ] **Database Reset**: Wipe and re-apply all migrations from scratch.
- [ ] **Schema Conflict Resolution**: Manual edit of Drizzle schema files from UI (Security Risk TBD).

## 🛠 Technical Notes
- **Backend API**: `backend/src/routes/v1/database.ts`
- **Frontend Component**: `web/src/components/admin/DatabaseSettings.tsx`
- **Schema Source**: `backend/src/db/schema/index.ts`
- **Migration Storage**: `db/migrations/*.sql`

---
*Last updated: January 10, 2026*