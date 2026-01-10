# 🚀 Complete Database Sync Workflows

## 📋 Setup Checklist

### 1. **Verified File Structure**
Ensure these files exist in your root:
- `scripts/d1.cjs` (The command wrapper)
- `scripts/generate-migration-manifest.cjs` (The manifest generator)
- `backups/` (Directory for SQL dumps)

### 2. **Initial Setup**
```bash
# Run from root directory
npm run db:manifest
```

---

## 🔄 Daily Development Workflows

### Workflow 1: Making Schema Changes (Local → Remote)

```bash
# 1. Edit your schema (packages/shared/src/db/schema.ts)
# 2. Generate migration (creates .sql file)
npm run db:generate

# 3. Update manifest (Required for UI to see it)
npm run db:manifest

# 4. Apply locally
npm run db:migrate

# 5. Sync to Production (Remote)
npm run db:sync:remote

# 6. Deploy backend code
npm run deploy
```

---

### Workflow 2: Exporting/Importing Data

```bash
# Export from local to backups/ folder
npm run db:backup:local

# Export from production to backups/ folder
npm run db:backup:remote

# Import into local (Specify the file)
# Example: npm run db:restore:local backups/remote-2026-01-10T10-02-19.sql
npm run db:restore:local [path]
```

---

## 🎯 Common Scenarios

### Scenario: "Migrations not showing in UI"
1. Verify `.sql` files are in `db/migrations/`.
2. Run `npm run db:manifest`.
3. Refresh the Admin Dashboard → Database → Migrations.

### Scenario: "Check Database Status"
```bash
# View remote metrics (rows read/written)
npm run db:info

# View tables list
npm run db:tables:local
npm run db:tables:remote
```

---

## ✅ Success Indicators
- [x] `db/migrations/manifest.json` contains your migration names.
- [x] UI Migrations tab shows "Applied" (Green) or "Pending" (Yellow) status.
- [x] `backups/` folder contains your exported `.sql` files.
