# ReactPress 2.0 Global Implementation Plan (Admin-Centric)
> [!IMPORTANT]
> **Status**: Finalized Technical Roadmap (Ready for Implementation)

This plan follows an **Admin-First** strategy. We build the "Control Center" first, allowing us to manage tenants, modules, and settings incrementally via the UI as we develop the rest of the platform.

---

D1 db name: reactpal
ID: 39a4d54d-a335-4e15-bb6b-b02362fa16ea

## Phase 1: Foundation & "Breeze" Skeleton
**Goal**: Build the Control Center (HPanel) so we can manage the platform through its own UI.

### [Component] Admin Infrastructure
- **Base Foundation**: Setup D1, R2, and KV Adapters in `@reactpress/shared`.
- **Data Isolation**: Implement `BaseRepository` to enforce tenant-scoped queries by default.
- **HPanel (Admin Hub) Frontend**: Yes, Phase 1 includes the **Skeletal Frontend** for the Admin Hub.
- **Public Page Skeleton**: A minimal "Hello, {tenantId}" landing page for any resolved domain.
- **Admin Tenant Switcher**: Display a floating "Tenant Switcher" on the public page ONLY if `isAdmin === true`. This allows developers/admins to quickly hop between tenants without changing domains during Phase 1 testing.
- **Breeze Skeleton**: Build the "Tenants" management UI where you can add/edit a tenant.
- **Module Toggle**: Build the UI to enable/disable modules for a specific tenant.
- **Universal Resolver (Including Subdomains)**: The middleware MUST resolve `jobs.xy.com` and `xy.com` identically. A tenant can have multiple subdomains or apex domains mapped to it in the `tenant_domains` table.

### [Technical Checklist] Sub-Tasks for Phase 1
1.  **Shared Foundation**:
    *   Initialize `@reactpress/shared` with `D1Adapter`, `KVAdapter`, and `R2Adapter`.
    *   Implement the `BaseRepository` abstract class with mandatory `tenantId` logic.
2.  **Database Seeding**:
    *   Create `001_initial.sql` for `tenants` and `tenant_domains`.
    *   Create a reusable `db:seed` script that handles JSON bulk imports.
3.  **HPanel Shell (Studio Dark)**:
    *   **Aesthetic**: Implementation of the "Studio Dark" UI (Sleek, Compact, Enterprise-level).
    *   **Layout**: `SideNav` + `TopBar` + **Right Drawer (Sheet)** service for contextual edits.
    *   **Dynamic Dashboard**: Initial widget grid that filters visibility by `role`/`isAdmin`.
    *   State-aware "Active Tenant" context provider in React.
4.  **Breeze API & Context**:
    *   `POST /api/v1/tenants/bulk`: Handles `db.batch()` and KV synchronization.
    *   Define **Hono Variables Type**: `Variables: { tenantId: string, tenant: Tenant, isAdmin: boolean }`.
    *   Implement **Master Key Check**: A simple middleware that sets `isAdmin: true` if `x-admin-key` header matches `env.ADMIN_KEY`.
5.  **Database Workflow & Synchronization**:
    *   Initialize `drizzle-kit` for schema "push" (local) and "migrations" (remote).
    *   Create a `scripts/db-sync.ts` utility that uses `wrangler d1 execute` to pull/push data between local and remote D1 for testing.
    *   Ensure the seeding script supports **Multipart SQL execution** to handle large data sets without hitting the Workers instruction limit.
6.  **Infrastructure Config**:
    *   Update `wrangler.toml` to bind the D1 database `reactpal` (ID: `39a4d54d-a335-4e15-bb6b-b02362fa16ea`).
    *   Configure KV namespace for `TENANT_MANIFESTS`.

### [Details] Tenant Storage & Format (Hybrid Strategy)
To achieve both **High Performance** and **Structured Scalability**, we use a hybrid approach:

1.  **D1 Database (Relational/Indexed)**:
    - **Flat Columns**: `id`, `slug`, `primary_domain`, `status`, `created_at`.
    - **JSON Column (`config`)**: A single column containing the "Tenant Manifest" (Modules, Themes, Feature Flags).
2.  **Cloudflare KV (The Edge Manifest)**:
    - **Key Format**: `tenant:{domain}`
    - **Value Format**: A **Full JSON Blob** representing the complete tenant object. This ensures we get ALL settings in a single <10ms read at the edge, rather than firing multiple K/V lookups.

### [Details] Key/Value Schema (Inside the Manifest)
The `config` JSON object (and the KV value) follow this Key-Value structure:
- `meta`: `[Key: siteTitle, siteDescription, contactEmail]`
- `appearance`: `[Key: brandColor, logoUrl, fontPrimary]`
- `modules`: 
    - `activeList`: List of module IDs.
    - `visibility`: Role-based visibility map (e.g., `{"cms": ["admin", "editor"], "seo": ["admin"]}`).
    - `settings`: Namespaced module settings (e.g., `{"seo": {"sitemap": true}, "cms": {"perPage": 10}}`).
- `features`: `[Key: betaAccess, analyticsEnabled, customCss]`

### [Details] Dynamic Settings & Visibility
- **Visibility Controller**: The sidebar logic will check the `config.modules.visibility` map. If a user's role isn't in the list for a specific module, that module's menu entry is hidden.
- **Settings Registry**: The `/settings` route in HPanel will be a "Dynamic Hub". It will iterate through all enabled modules and render their settings sub-menus automatically based on the `ModuleDefinition`.
- **Incremental Growth**: New global settings (e.g., "Maintenance Mode", "Analytics ID") are added to the `config.meta` namespace without altering the DB schema.

### [Example] Bulk Import Payload (JSON)
```json
[
  {
    "slug": "web4strategy",
    "name": "Web4 Strategy",
    "primaryDomain": "web4strategy.com",
    "config": {
      "meta": {
        "siteTitle": "Web4 Strategy | Enterprise SaaS"
      },
      "appearance": {
        "brandColor": "#0f172a"
      },
      "modules": {
        "activeList": ["cms", "seo"],
        "visibility": {
          "cms": ["admin", "editor"],
          "seo": ["admin"]
        }
      }
    }
  }
]
```

### [Details] Bulk Operations
- **D1 Batch API**: Use `db.batch()` to ensure atomicity when importing multiple tenants.
- **KV Bulk Write**: Use `kv.put()` for each tenant, or a background worker to sync D1 to KV if the batch is extremely large (>50).
- **Validation**: Strict collision check for `slugs` and `domains` before execution.
- **CLI Seeder**: A `scripts/seed-tenants.ts` tool for developer use.

### [Phase 1 Guidelines] Dos and Don'ts
| **DO** | **DON'T** |
| :--- | :--- |
| **DO**: Use `BaseRepository` for ALL database calls. | **DON'T**: Implement AI or complex modules yet. |
| **DO**: Validate all inputs with **Zod** patterns. | **DON'T**: Hardcode ANY tenant-specific strings. |
| **DO**: Store tenant resolution in **KV** for <10ms lookup. | **DON'T**: Run D1 queries without a `tenantId` index. |
| **DO**: Pass `tenantId` via **Hono Context Variables**. | **DON'T**: Use manual session management (use Master Key). |
| **DO**: Set up **Drizzle Migrations** for core tables. | **DON'T**: Skip the "Default Tenant" fallback logic. |
| **DO**: Use **Atomic Writes** for JSON config updates. | **DON'T**: Allow cross-tenant data in a single batch. |
| **DO**: Test large migrations on a **Preview D1** first. | **DON'T**: Commit large SQL seed data directly to git (use R2/External storage if >1MB). |

### [Infrastructure] Core Tables (Phase 1)
- `tenants`: The master list with `id`, `name`, `slug`, `config`.
- `tenant_domains`: Mapping table for many-to-one (Domain -> Tenant).
- `audit_logs`: Initial table for recording the provisioning events.

### [Success Criteria] Phase 1 "Definition of Done"
- [ ] `wrangler dev` starts without errors and connects to local D1.
- [ ] A new tenant created in D1 is instantly queryable via its domain or `?tenant=id`.
- [ ] Bulk import of 10 tenants takes < 2 seconds.
- [ ] Direct database access without a Repository throws a TypeScript error (architectural enforcement).
- [ ] The HPanel sidebar correctly displays the current tenant's name and branding color.

---

## Phase 2: Content-Type System (CORE)
**Goal**: Build the tools to manage data structures visually.

### [Component] Dynamic Schema Engine
- **Field Renderer**: Build the dynamic form system for the HPanel.
- **ContentType Manager**: The UI where you can define fields and taxonomies.
- **ContentItem Manager**: The list/edit views for items created under any Content Type.
- **Database Alignment**: Unified table structure to support the visual schema builder.

---

## Phase 3: Identity & Roles (PREREQUISITE)
**Goal**: Secure the Hub we just built.

### [Component] Authentication & RBAC
- **Supabase Integration**: Move from skeletal HPanel access to real auth.
- **Role Manager**: UI to define "Super Admin", "Editor", etc.
- **Permission Middleware**: Enforce RBAC in the backend Hono routes.

---

## Phase 4: Foundational Modules (CMS / Menus / Themes)
**Goal**: Add the first "Useful" tools to our Hub.

### [Component] Core Features
- **CMS Module**: Standard blog and pages management.
- **Theme Engine**: The UI for managing Design Tokens (Colors, Fonts) per tenant.
- **Menu Builder**: A visual tool to manage navigation menus.

---

## Phase 5: Stability Foundation
**Goal**: Make the HPanel and its tenants "Unbreakable."

### [Component] Resilience
- **Error Boundaries**: Catch UI/API crashes.
- **Circuit Breaker**: Protect the Hub from external API failures.
- **Health Dashboard**: A new "Health" tab in HPanel to monitor D1/KV status.

---

## Phase 6: Observability
**Goal**: Gain visibility into platform usage.

### [Component] Monitoring Layer
- **Metrics Dashboard**: View traffic and error rates inside HPanel.
- **Audit Logs UI**: A searchable history of "Who changed what" in the Admin Hub.

---

## Phase 7: Security Hardening
- **Security Headers & WAF**: Protect the management interface.
- **Advanced Rate Limiting**: Prevent brute-force attacks on the HPanel.

---

## Phase 8: AI Orchestration
- **Co-Pilot Panel**: Integrated AI assistant inside the HPanel.
- **RAG Implementation**: Semantic search for tenant content.

---

## Phase 9: Elite Performance
- **ESR & Streaming**: Speed up public-facing pages.
- **Asset Optimization**: On-the-fly transformations for all media.

---

## Phase 10: "Breeze" Automation (The Polish)
**Goal**: Turn the Manual "Step 1" into "Zero-Touch" automation.

### [Component] Automation
- **Auto-Provisioning**: Automate DNS/DB setup when clicking "New Tenant."
- **Onboarding Wizard**: A slick UI for first-time tenant setup.

---

## Verification Plan
### Stage 1: Hub Verification
- Can I create a tenant?
- Can I switch to that tenant's "View" using the HPanel?
- Can I toggle a module on/off and see the sidebar change?

### Stage 2: Data Verification
- Does the Content-Type builder update the D1 schema logic correctly?
- Do the dynamic forms handle all 20+ field types?
