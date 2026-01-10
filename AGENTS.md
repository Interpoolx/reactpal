# Agent & Developer Handbook: Modular Development

This document serves as the source of truth for AI agents and human developers working on the ReactPress 2.0 modular architecture. Follow these rules strictly to avoid architectural drift and project-breaking errors.

## 🏗️ Core Architecture Principles

1.  **Self-Registration**: Modules must register themselves upon import. No hardcoded module lists in core platform code.
2.  **Dependency-Safe Loading**: Modules load in a specific order: Core -> Foundation -> Platform -> Optional.
3.  **Tenant Contextualization**: Everything in the UI and API must respect the `tenantId` (active tenant).
4.  **Loose Coupling**: Modules communicate through registries (`ModuleRegistry`, `SettingsRegistry`) and events, not direct imports where possible.

---

## Ensure migrations are applied consistently (local/remote)

## 🚀 How to Add a New Module

### 1. Create Folder Structure
Create `packages/modules-[name]` with the following structure:
```text
packages/modules-[name]/
├── src/
│   ├── routes/      # Hono API routes
│   ├── settings/    # Module-specific settings
│   └── index.ts     # Main entry point & registration
├── package.json
└── tsconfig.json
```

### 2. Configure `package.json`
- Use `@reactpress/modules-[name]` naming convention.
- Include `@reactpress/core-registry` as a dependency.
- Use `*` for workspace package versions, not `workspace:*` (for npm compatibility).

### 3. Configure `tsconfig.json`
**CRITICAL**: Do NOT add `rootDir: "./src"`. This breaks sibling package imports in the IDE.
- Set `moduleResolution` to `bundler`.
- Add `paths` to `@reactpress/core-registry`.

### 4. Implement `index.ts`
Define your `ModuleConfig` and call `moduleRegistry.register(config)`.
```typescript
import { moduleRegistry, type ModuleConfig } from '@reactpress/core-registry';

export const myModuleConfig: ModuleConfig = {
    id: 'my-module',
    name: 'My Feature',
    version: '1.0.0',
    description: '...',
    isCore: false, // Set to true ONLY for foundation modules
    routes: (app) => { /* mount your routes here */ },
    menu: { label: 'My Feature', icon: 'Box', href: '/hpanel/my-feature', order: 50 },
    availability: { defaultEnabled: false, availableForTenants: true }
};

moduleRegistry.register(myModuleConfig);
```

### 5. Add to Bootstrapping
You MUST add your module to the bootstrap files for it to be discovered:
- `backend/src/lib/bootstrap.ts`
- `web/src/lib/bootstrap.ts`

---

## 🚫 Important Do's and Don'ts

### ✅ DO
- **Use `moduleRegistry.getAll()`**: In API routes, fetch the dynamic list of modules from the registry.
- **Support Multi-Tenancy**: Ensure your database queries always include `WHERE tenant_id = ?`.
- **Use standard UI Components**: Use the shared components in the `web/src/components` to maintain visual consistency.
- **Update Workspace Dependencies**: If you add a module, update `backend/package.json` and `web/package.json` so they can resolve the package.
- **Verify Rendering**: After adding state-driven UI (modals, drawers), verify they are present in the final `return` block of the component.
- **Check for Shadowing**: Before adding routes, search for existing modules in `packages/` that might already handle the logic.

### ❌ DON'T
- **No Hardcoded Lists**: Never add a module ID directly to `SideNav.tsx` or `modules.ts` routes. Use the dynamic `getSidebarMenu` or `getAll` methods.
- **No Restrictive rootDir**: Avoid `rootDir: "./src"` in package tsconfigs. It breaks cross-package type checking.
- **No Circular Imports**: If `Module A` depends on `Module B`, ensure `Module B` is loaded first in the bootstrap process.
- **Don't Forget the Registry**: If your module has settings, register them via the `settings` property in `ModuleConfig` so they appear in Global Settings.
- **Map Database Tables**: Always list all database tables associated with your module in the `tables` property of `ModuleConfig` in `module.config.ts`.
- **No Loose Files in Routes**: Avoid adding files to `backend/src/routes/v1/` if a module in `packages/` already handles that domain.

---

## 🛡️ Code Integrity & Stability Rules

### 1. Route Shadowing Prevention
The project uses a hybrid architecture (Legacy V1 + Modular). **Modular routes always take precedence.**
- **Rule**: If you see a package in `packages/modules-[name]`, all logic for that feature MUST live there.
- **Check**: Run `grep -r "/api/v1/[name]"` to see if routes are defined in multiple places.

### 2. Syntax Hygiene (The "Comment" Rule)
When removing logs or cleaning up code:
- **Rule**: Never leave trailing comment delimiters (`/*`, `/**`, `*/`) or unbalanced braces.
- **Verification**: If a route or function "stops working" after an edit, check for accidentally commented-out code.

### 3. UI Implementation Completeness
- **Rule**: Handlers and State are only half the job. Always verify that the component is rendered in the JSX.
- **Check**: Search the file for the component usage (e.g., `<ActionConfirmModal ... />`) after implementing the logic.

### 4. KV & D1 Binding Consistency
- **Rule**: Always verify binding names in `wrangler.toml` before writing backend logic.
- **Warning**: Inconsistent names (e.g., `KV` vs `TENANT_MANIFESTS`) will cause 500 errors.

---

## 🛠️ Common Issues & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **"File not under rootDir"** | restrictive `tsconfig.json` | Remove `rootDir: "./src"` from the package tsconfig. |
| **Module not in Dashboard** | Missing registration | Ensure `register()` is called and the module is imported in `bootstrap.ts`. |
| **Menu item missing** | Availability rules | Check if `requiresPlatformAdmin` or `defaultEnabled` logic is blocking it. |
| **API returns 404** | Routes not mounted | Ensure `loadModuleRoutes(app)` is called in `backend/src/index.ts`. |

---

## 🎨 UI Consistency Guidelines

All admin pages MUST follow these patterns for consistent user experience.

### ⚙️ Config-Driven Development (MANDATORY)

**Every page/component should be config-driven.** Define configuration objects at the top of your component and pass them to shared components. This makes code maintainable, readable, and consistent.

#### Page Config Pattern

```tsx
// Define all page configuration at the top
const PAGE_CONFIG = {
    title: 'Tenants',
    description: 'Manage all registered tenants',
    apiEndpoint: '/api/v1/tenants',
    addButtonLabel: 'Add Tenant',
    searchPlaceholder: 'Search by name, slug, or domain...',
};

const STATS_CONFIG = [
    { key: 'total', label: 'Total Tenants', Icon: Building2, color: 'text-white' },
    { key: 'active', label: 'Active', Icon: Check, color: 'text-green-400' },
    { key: 'trial', label: 'Trial', Icon: Clock, color: 'text-blue-400' },
    { key: 'plans', label: 'Plans', Icon: Package, color: 'text-purple-400' },
];

const FILTER_CONFIG = {
    status: {
        label: 'All Status',
        options: ['all', 'active', 'trial', 'suspended', 'archived'],
    },
    plan: {
        label: 'All Plans',
        options: ['all', 'free', 'starter', 'pro', 'enterprise'],
    },
};

// Use config in component
<h1>{PAGE_CONFIG.title}</h1>
<p>{PAGE_CONFIG.description}</p>
<input placeholder={PAGE_CONFIG.searchPlaceholder} />
```

#### Column Config Pattern

```tsx
const COLUMNS_CONFIG: ColumnConfig[] = [
    { 
        key: 'name', 
        header: 'Name', 
        sortable: true,
        render: (row) => <NameCell row={row} />
    },
    { 
        key: 'status', 
        header: 'Status', 
        sortable: true,
        render: (row) => <StatusBadge status={row.status} />
    },
    { 
        key: 'actions', 
        header: '', 
        render: (row) => <QuickActions row={row} />
    },
];

// Transform to @tanstack/react-table columns
const columns = COLUMNS_CONFIG.map(col => ({
    accessorKey: col.key,
    header: col.header,
    cell: ({ row }) => col.render(row.original),
}));
```

#### Benefits of Config-Driven Approach

| Benefit | Description |
|---------|-------------|
| Easy Updates | Change labels, colors, options in one place |
| Consistency | Same patterns across all modules |
| Testing | Configs can be validated and tested separately |
| Documentation | Configs serve as self-documentation |
| Reusability | Share configs between similar pages |

### DataTable Page Structure

Every list/table page should include these elements in order:

```tsx
<div className="p-6 space-y-6">
    {/* 1. Header: Title + Action Buttons */}
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Page Title</h1>
            <p className="text-muted text-sm mt-1">Description text</p>
        </div>
        <div className="flex items-center gap-3">
            {/* Export, Import, Add buttons */}
        </div>
    </div>

    {/* 2. Stats Cards (4-column grid) */}
    <div className="grid grid-cols-4 gap-4">
        {/* Total, Active, Pending, etc. */}
    </div>

    {/* 3. Filter Bar */}
    <div className="flex flex-wrap items-center gap-4 p-4 bg-darker rounded-xl border border-border-muted">
        {/* Search input, Status dropdown, other filters */}
    </div>

    {/* 4. DataTable */}
    <DataTable data={paginatedData} columns={columns} ... />

    {/* 5. Pagination Controls */}
    <div className="flex items-center justify-between">
        {/* "Showing X to Y of Z" + page size selector on left */}
        {/* First/Prev/Next/Last buttons on right */}
    </div>
</div>
```

### DataTable Props Pattern

```tsx
// ✅ CORRECT: Custom header has Add button, don't pass onAdd to DataTable
<DataTable
    data={paginatedData}
    columns={columns}
    onEdit={handleEdit}
    onDelete={handleDelete}
    isLoading={isLoading}
/>

// ❌ WRONG: Creates duplicate "Add New" button
<DataTable onAdd={handleAdd} ... />
```

### Required Components for List Pages

| Component | Location | Purpose |
|-----------|----------|---------|
| Stats Cards | After header | Show counts (Total, Active, Pending, etc.) |
| Search Input | Filter bar | Debounced search (300ms) |
| Status Filter | Filter bar | Dropdown with "All Status" option |
| Page Size Selector | Pagination | 10/25/50/100 options |
| Pagination Buttons | After table | First, Prev, Page X of Y, Next, Last |

### Debounce Pattern for Search

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

// Debounce input
useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(searchQuery);
        setCurrentPage(1); // Reset to first page
    }, 300);
    return () => clearTimeout(timer);
}, [searchQuery]);

// Fetch uses debouncedSearch, not searchQuery
const fetchData = useCallback(async () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    // ...
}, [debouncedSearch, otherFilters]);
```

### Form Drawer Pattern

Use `RightDrawer` for Add/Edit forms:

```tsx
<RightDrawer
    isOpen={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    title={editing ? 'Edit Item' : 'Add Item'}
>
    <YourForm
        item={editingItem}
        onSave={handleSave}
        onCancel={() => setDrawerOpen(false)}
        isSaving={isSaving}
    />
</RightDrawer>
```

### Toast Notifications

Show success/error feedback after API operations:

```tsx
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
};

// After API call
showToast('Item saved successfully', 'success');
```

---

## 🔌 API Integration Patterns

### Standard CRUD Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/{resource}` | List with ?search, ?status, ?page, ?limit |
| GET | `/api/v1/{resource}/:id` | Get single |
| POST | `/api/v1/{resource}` | Create |
| PATCH | `/api/v1/{resource}/:id` | Update |
| DELETE | `/api/v1/{resource}/:id` | Delete |

### Query Parameters for List Endpoints

Always support these query params in GET list endpoints:
- `search` - Full-text search across relevant fields
- `status` - Filter by status field
- `page` & `limit` - Server-side pagination (optional)

### Error Response Format

```json
{
    "error": "Human-readable error message",
    "code": "VALIDATION_ERROR" 
}
```

### Tenant Context

All API routes must respect tenant context:
```typescript
const tenantId = c.req.header('x-tenant-id') || 'default';
// Use tenantId in all database queries
```

---

## ⚙️ Module Settings Pattern (MANDATORY)

Every module MUST define settings that control Admin UI features. This allows platform admins to enable/disable features without code changes.

### Settings File Location

```
packages/modules-{name}/src/settings/{name}Settings.ts
```

### Settings Structure

```typescript
export const myModuleSettingsSection: SettingSection = {
    id: 'mymodule',
    label: 'My Module',
    icon: 'Box',
    order: 50,
    availableForTenants: false, // true if tenant-specific
    requiredPermission: 'mymodule.manage',

    fields: [
        // Admin UI Settings (group: 'Admin UI')
        {
            key: 'mymodule.ui.showStatsCards',
            label: 'Show Stats Cards',
            type: 'boolean',
            defaultValue: true,
            group: 'Admin UI',
        },
        {
            key: 'mymodule.ui.showSearch',
            label: 'Enable Search',
            type: 'boolean',
            defaultValue: true,
            group: 'Admin UI',
        },
        // ... more UI toggles

        // Table Columns (group: 'Table Columns')
        {
            key: 'mymodule.ui.columns.showStatus',
            label: 'Show Status Column',
            type: 'boolean',
            defaultValue: true,
            group: 'Table Columns',
        },

        // Module-specific settings (group: 'Defaults', 'Limits', etc.)
        {
            key: 'mymodule.defaultSetting',
            label: 'Default Setting',
            type: 'text',
            defaultValue: 'value',
            group: 'Defaults',
        },
    ],
};
```

### Required Feature Groups

Every module with a list/table page MUST have these setting groups:

| Group | Purpose | Examples |
|-------|---------|----------|
| **Admin UI** | Toggle page features | Stats cards, Search, Filters, Export, Import, Quick Actions |
| **Table Columns** | Show/hide columns | Domain, Status, Plan, Created |
| **Defaults** | Default values for new items | Default plan, trial days |
| **Limits** | Resource limits | Max users, storage limits |

### TypeScript Interface for UI Settings

```typescript
// Define interface to read settings in components
interface TenantsUISettings {
    showStatsCards: boolean;
    showSearch: boolean;
    showStatusFilter: boolean;
    showPlanFilter: boolean;
    showExportCSV: boolean;
    showBulkImport: boolean;
    showQuickActions: boolean;
    allowClone: boolean;
    allowStatusChange: boolean;
    showPagination: boolean;
    defaultPageSize: number;
    columns: {
        showDomain: boolean;
        showPlan: boolean;
        showStatus: boolean;
        showCreated: boolean;
    };
}
```

### Reading Settings in Frontend

```typescript
// Hook to fetch module UI settings
const { settings, isLoading } = useModuleSettings('tenants');

// Conditionally render features based on settings
{settings.showStatsCards && <StatsCards ... />}
{settings.showSearch && <SearchInput ... />}
{settings.columns.showDomain && <DomainColumn ... />}
```

### Reference Implementation

See `packages/modules-tenants/src/settings/tenantsSettings.ts` for the gold-standard implementation.

---

## 📁 Reference Implementations

For the gold-standard implementation of these patterns, refer to:


| Pattern | Reference File |
|---------|----------------|
| DataTable Page | `web/src/components/admin/TenantsPage.tsx` |
| DataTable Page | `web/src/components/admin/UsersPage.tsx` |
| Shared DataTable | `web/src/components/admin/DataTable.tsx` |
| Right Drawer | `web/src/components/admin/RightDrawer.tsx` |
| Tabbed Form | `web/src/components/admin/TabbedTenantForm.tsx` |
| Modal Dialog | `web/src/components/admin/BulkImportModal.tsx` |
| **Module Settings (Tenants)** | `packages/modules-tenants/src/settings/tenantsSettings.ts` |
| **Module Settings (Users/Auth)** | `packages/modules-auth/src/settings/authSettings.ts` |

---

## ✅ Self-Review Checklist (CRITICAL)

**You MUST complete this checklist before marking any work as done.**

### Code Quality
- [ ] **No duplicate logic** - Check for repeated functions, components, or patterns that should be shared
- [ ] **No duplicate UI elements** - Look for duplicate buttons, columns, or controls (e.g., two "Add" buttons)
- [ ] **Variable naming consistency** - Ensure names like `debouncedSearch` are used where they should be, not raw `searchQuery`
- [ ] **Dependency arrays correct** - useCallback/useEffect dependencies match actual variables used inside

### UI States
- [ ] **Loading state** - Skeleton loading indicators, not just "Loading..." text
- [ ] **Empty state** - Helpful message with icon when no data, not blank table
- [ ] **Error state** - Clear error messages with recovery action
- [ ] **Disabled states** - Buttons disabled during loading/saving

### DataTable Specific
- [ ] **No duplicate Actions column** - If using custom `quickActions` column, don't pass `onEdit` to DataTable
- [ ] **Pagination controls** - "Showing X to Y of Z" + page size selector
- [ ] **Stats cards** - Summary cards above the table
- [ ] **Search debounce** - 300ms debounce with `debouncedSearch` state

### API Integration
- [ ] **Correct variable in API call** - Using `debouncedSearch` not `searchQuery` in fetch
- [ ] **Error handling** - try/catch with user-friendly toast
- [ ] **Loading indicators** - setIsLoading(true/false) around API calls

### Common Mistakes to Avoid

| Mistake | How to Detect | Fix |
|---------|--------------|-----|
| Duplicate buttons | Visual inspection of UI | Remove `onAdd` from DataTable if header has Add button |
| Search not working | Variable mismatch in dependency vs usage | Use same variable in fetch and dependencies |
| Double API calls | Two useEffects triggering fetch | Single source of truth for fetch trigger |
| Missing empty state | Empty table shows nothing | Add empty state with icon and message |
| Missing loading state | Flash of empty content | Add skeleton loading rows |

### Review Process

1. **Build check**: Ensure `npm run build` passes without errors
2. **Visual review**: Open the page and check all states (loading, empty, populated, error)
3. **Console check**: No console errors or warnings
4. **Interaction test**: Click all buttons, submit forms, verify toast notifications
5. **Compare to reference**: Ensure UI matches UsersPage/TenantsPage patterns

> ⚠️ **AGENTS**: Never skip this checklist. Review your work visually and functionally before notifying the user of completion.
