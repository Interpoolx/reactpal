## Project Overview

**ReactPress 2.0** is a 100% Cloudflare-native, enterprise-grade SaaS orchestration platform. Built with React 19, Hono, and Cloudflare Workers, it utilizes a **Schema-less Dynamic Content Engine** that allows for instantaneous "Zero-Code" application building.

ReactPress is designed to run multiple independent applications from a **single codebase**, handling multi-tenancy at the edge with near-zero latency.

---

## 🎯 Core Philosophy & Stability

### 1. **Ultra-Isolation Multi-Tenancy (Tiered Isolation)**
- **Database Partitioning**: D1 queries are automatically scoped via middleware using `tenant_id`.
- **R2 Asset Scoping**: Storage is isolated via tenant-prefixed paths with signed URL access control.
- **Edge Configuration**: Tenant settings are cached in Workers KV with sub-10ms resolution.
- **Durable Objects Orchestration**: Real-time synchronization and consistency for tenant-specific settings.

### 2. **Dynamic Schema Engine (CMS 2.0)**
- **Field-Agnostic Architecture**: Define custom content types (Job Listings, Business Directories, Wiki, etc.) via an interactive UI.
- **Advanced Field Types**: Support for Relationships (One-to-Many, Many-to-Many), JSON metadata, Geo-location, and Versioned Assets.
- **Auto-Generated APIs**: New content types automatically register REST and GraphQL-lite endpoints.

---

## 🛠 Technology Stack (Cloudflare-Native)

### Backend (`/backend`)
- **Framework**: Hono 4.x (Optimized for Workers Runtime)
- **Database**: Cloudflare D1 + Drizzle ORM (Type-safe migrations)
- **Cache**: Workers KV + Durable Objects (Consistency layer)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Auth**: Multi-tenant Auth (JWT-based, supporting external providers like Clerk/Supabase)

### Frontend (`/web`)
- **Framework**: Vite 6.x + React 19 (Server Components ready)
- **Routing**: TanStack Router (File-based + Dynamic Tenant Routes)
- **State**: TanStack Query (Optimistic UI & Server-state sync)
- **UI**: TailwindCSS 4.x + Radix UI + Framer Motion
- **Dynamic Theming**: CSS Variable injection based on tenant configuration.

---

## 📦 Enhanced Project Structure

```
reactpress/
├── packages/
│   ├── core-engine/             # Logic for dynamic schema & field resolution
│   ├── tenant-orchestrator/     # Domain mapping, provisioning, and lifecycle
│   ├── shared-ui/               # Reusable Radix-based design system
│   └── modules/                 # Auto-discovered feature plugins
├── backend/
│   ├── src/
│   │   ├── middleware/          # TenantResolver, RBAC, RateLimiting, CSRF
│   │   ├── services/            # DynamicSchemaService, StorageService, MailService
│   │   ├── db/                  # Drizzle schemas & tenant-scoped repositories
│   │   └── index.ts             # Global Worker entry
├── web/
│   ├── src/
│   │   ├── admin/               # Global Admin (SaaS owner) & Tenant Admin
│   │   ├── theme-engine/        # Dynamic CSS variable injection per tenant
│   │   ├── routes/              # TanStack dynamic route tree
│   │   └── components/          # Shared & module-specific components
├── scripts/                     # Automation for migrations & tenant setup
└── wrangler.toml                # Edge configuration (D1, R2, KV, Queues)
```

---

## 🚀 Advanced Multi-Tenant & SaaS Orchestration

### 1. **Zero-Touch Provisioning (The "Breeze" Setup)**
The Admin Panel handles the entire lifecycle of a tenant:
1.  **Domain Mapping**: Automatic SSL/DNS verification via Cloudflare for Custom Domains.
2.  **Schema Initialization**: New tenants receive a "Base Schema" (Users, Media, Pages) immediately.
3.  **Module Activation**: One-click toggle for modules (CRM, SEO, E-commerce, etc.).
4.  **Billing Integration**: Automatic tier management linked to module access.

### 2. **Global Admin vs. Tenant Admin**
-   **Global Admin (Master Control)**: 
    -   System-wide health & performance monitoring.
    -   Module Marketplace management.
    -   Global tenant suspension/provisioning.
    -   Cross-tenant analytics.
-   **Tenant Admin (App Control)**: 
    -   Custom Content Type creation.
    -   Local User/Staff management.
    -   Branding & Theme configuration.
    -   Content moderation.

### 3. **Smart Module Lifecycle**
Modules are self-contained "Micro-Apps":
-   **Backend**: Register D1 migrations and custom Hono routes automatically upon activation.
-   **Frontend**: Inject sidebar items, dashboard widgets, and custom settings screens.
-   **Performance**: **Lazy Hydration** ensures users only download the JS for modules they actually use.

---

## 🛡 Security, Resilience & Performance

-   **Automatic CSRF/CORS**: Dynamically allow-listed based on tenant domains.
-   **Tiered Rate Limiting**: Enforced at the edge to protect against noisy neighbors.
-   **Safe Migrations**: "Shadow Branching" for D1 to test schema changes before applying to production.
-   **Workers Smart Placement**: Backend logic automatically moves closer to the database or the user.
-   **KV Stale-While-Revalidate**: Instant configuration loading with background updates.

---

## 🎨 Sophisticated Branding Engine

-   **Design Tokens**: Full control over typography, colors, spacing, and border radius.
-   **Layout Switcher**: Swap between "Business Directory", "Blog", "Dashboard", or "Marketplace" layouts instantly.
-   **Headless Capability**: Every tenant app is a headless API by default; build custom frontends on top of the same backend.

---

## 📈 Roadmap

1.  **AI Orchestration**: Workers AI integration for tenant-specific chatbots and content generation.
2.  **Vector Search**: Integrated Vectorize for semantic search across all content types.
3.  **Edge Queues**: Background job processing for heavy tasks (image optimization, email blasts).
