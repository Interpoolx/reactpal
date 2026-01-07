## Project Overview

**ReactPress 2.0** is a 100% Cloudflare-native, enterprise-grade SaaS orchestration platform. Built with React 19 (Server Components ready), Hono, and Cloudflare Workers, it utilizes a **Schema-less Dynamic Content Engine** that allows for instantaneous "Zero-Code" application building. Whether it's a Job Board, a Real Estate Portal, or a complex Knowledge Base, ReactPress handles multi-tenancy at the edge with near-zero latency.

---

## 🎯 Core Philosophy & Stability

### 1. **Ultra-Isolation Multi-Tenancy**
- **D1 Tenant Partitioning**: Every database query is automatically wrapped in a tenant-specific middleware. No data leakage is possible.
- **R2 Namespace Scoping**: Assets are stored in tenant-prefixed paths with signed URL access control.
- **KV configuration Layer**: Tenant settings are cached at the edge for sub-10ms resolution.

### 2. **Dynamic Schema Engine (CMS 2.0)**
- **Field-Agnostic Architecture**: Define custom content types with an interactive builder.
- **Advanced Field Types**: Support for Relationships (One-to-Many, Many-to-Many), JSON structures, Geo-location, and Versioned Assets.
- **Instant API Generation**: New content types automatically register REST and GraphQL-lite endpoints.

---

## 🛠 Technology Stack

### Backend (`/backend`)
- **Framework**: Hono 4.x (Optimized for Workers)
- **Database**: Cloudflare D1 + Drizzle ORM (Type-safe migrations)
- **Cache**: Workers KV + Durable Objects (for real-time collaboration)
- **Storage**: Cloudflare R2
- **Auth**: Integrated Clerk or Supabase Auth (Tenant-aware)

### Frontend (`/web`)
- **Framework**: Vite 6.x + React 19
- **Routing**: TanStack Router (File-based + Dynamic Tenant Routes)
- **State**: TanStack Query (Server-state synchronization)
- **UI**: TailwindCSS 4.x + Radix UI + Framer Motion
- **CMS Builder**: Tiptap Editor + Custom Block Renderer

---

## 📦 Enhanced Project Structure

```
reactpress/
├── packages/
│   ├── core-engine/             # Logic for dynamic schema & field resolution
│   ├── tenant-orchestrator/     # Domain mapping, provisioning, and billing
│   ├── shared-ui/               # Reusable Radix-based design system
│   └── modules/                 # Auto-discovered feature plugins
├── backend/
│   ├── src/
│   │   ├── middleware/          # TenantResolver, RBAC, RateLimiting
│   │   ├── services/            # DynamicSchemaService, StorageService
│   │   └── index.ts             # Global Worker entry
├── web/
│   ├── src/
│   │   ├── admin/               # Global & Tenant Admin Dashboards
│   │   ├── theme-engine/        # Dynamic CSS variable injection per tenant
│   │   └── routes/              # TanStack dynamic route tree
```

---

## 🚀 Advanced Multi-Tenant Features

### 1. **Zero-Touch Provisioning**
When a new tenant signs up, the **Tenant Orchestrator**:
1. Creates a unique Tenant ID and Slug.
2. Initializes D1 seed data for core modules.
3. Configures KV cache for the primary domain.
4. Assigns the "Starter" theme and default modules (CMS, Media).

### 2. **Global Admin vs. Tenant Admin**
- **Global Admin**: System-wide health, module marketplace, global tenant management, and infrastructure logs.
- **Tenant Admin**: Content creation, local user management, module activation, and theme customization.

### 3. **Smart Module Loading**
Modules are not just UI components; they are "Micro-Backends". 
- **Backend Hooks**: Modules can register D1 migrations and custom Hono routes.
- **Frontend Hooks**: Modules register sidebar items and dashboard widgets.
- **Lazy Hydration**: Frontend bundles are split per module; a tenant only downloads the JS for modules they have enabled.

---

## 🛡 Security & Resilience

- **CSRF & CORS**: Automatic tenant-domain allow-listing.
- **Rate Limiting**: Tiered rate limiting based on tenant subscription level.
- **Database Migrations**: Automatic "Shadow Branching" for D1 migrations to prevent downtime during schema updates.
- **Audit Logs**: Every mutation is logged with `tenant_id` and `user_id` for compliance.

---

## 🎨 Theme & Branding Engine

Tenants can customize their entire UI without touching code:
- **Design Tokens**: Centralized CSS variables for primary/secondary colors, radius, and typography.
- **Layout Templates**: Select from pre-built layouts (Landing Page, Directory, Documentation).
- **Custom CSS**: Advanced tenants can inject scoped CSS overrides via the admin panel.

---

## 📈 Roadmap & Scaling

1. **Global Search**: Workers AI + Vectorize for semantic search across all content types.
2. **Edge Analytics**: Cloudflare Analytics Engine integration for tenant-specific traffic reports.
3. **White-Labeling**: Advanced DNS management for custom domain SSL termination at the edge.
