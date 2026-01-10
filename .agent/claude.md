# Agent Stability & Hygiene Rules (claude.md)

This file contains strict instructions for AI agents to maintain codebase stability and prevent regression.

## 🛡️ Critical Safety Checks

### 1. Dual-Path Logic (Shadowing)
**Scenario**: Logic exists in both `backend/src/routes/v1/` and `packages/modules-*/`.
- **Instruction**: Always search `packages/` before editing or creating a route in the legacy `backend/src/` directory.
- **Action**: If a module exists for the domain, remove the legacy file and consolidate logic in the package.

### 2. UI Completeness (The JSX Rule)
**Scenario**: Handler logic is written but the UI element doesn't show up.
- **Instruction**: Every time you add a Modal, Drawer, or Toast state, verify that the component is actually invoked in the `return` block of the React component.
- **Action**: Search for the component name (e.g., `<ActionConfirmModal`) after making edits.

### 3. Syntax Preservation (The comment rule)
**Scenario**: Cleaning up code breaks the build or disables routes.
- **Instruction**: When removing `console.log` or temporary debugging code, perform a "Brace & Comment Scan".
- **Action**: Ensure all `/* ... */` blocks are correctly closed and all `{}` are balanced.

### 4. Database & KV Bindings
**Scenario**: Backend operations fail with "Binding not found" or "No such column".
- **Instruction**: Check `backend/wrangler.toml` for the correct environment variable names (`DB`, `TENANT_MANIFESTS`, etc.).
- **Action**: Check `db/migrations/` to see the actual column names before writing SQL queries.

### 5. Module-Table Mapping
**Scenario**: New tables are created but don't show up in module settings.
- **Instruction**: Always add associated database tables to the `tables` array in `module.config.ts`.
- **Action**: Check `db/migrations/` for newly created tables and map them to the corresponding module in `packages/modules-*/src/module.config.ts`.

## 🚀 Architectural Source of Truth
- **Module Registration**: `packages/core-registry`
- **Tenant Context**: `TenantContext.tsx` and `tenant-resolver.ts` middleware.
- **Master UI Config**: `AGENTS.md` (Design Patterns section)

## 🚫 forbidden actions
- **DO NOT** create hardcoded lists of modules.
- **DO NOT** use `rootDir: "./src"` in workspace package `tsconfig.json`.
- **DO NOT** skip the visual verification of UI changes if the browser tool is available.

## Ensure migrations are applied consistently (local/remote)