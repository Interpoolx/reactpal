## Project Overview

**ReactPress 2.0** is a 100% Cloudflare-native, enterprise-grade SaaS orchestration platform. Built with React 19, Hono, and Cloudflare Workers, it utilizes a **Schema-less Dynamic Content Engine** that allows for instantaneous "Zero-Code" application building.

ReactPress is designed to run multiple independent applications from a **single codebase**, handling multi-tenancy at the edge with near-zero latency.

---

## 🎯 Core Philosophy & Stability

### 1. **Ultra-Isolation Multi-Tenancy (Tiered Isolation)**
- **Database Partitioning**: Drizzle ORM + D1 with automated tenant-scoped repositories.
- **R2 Asset Scoping**: Storage is isolated via tenant-prefixed paths with signed URL access control.
- **Edge Configuration**: Tenant settings are cached in Workers KV with sub-10ms resolution.
- **Durable Objects Orchestration**: Real-time synchronization and consistency for tenant-specific settings.

### 2. **Dynamic Schema Engine (CMS 2.0)**
- **Field-Agnostic Architecture**: Define custom content types via an interactive UI.
- **Advanced Field Types**: Support for Relationships, JSON metadata, Geo-location, and Versioned Assets.
- **Auto-Generated APIs**: New content types automatically register REST and GraphQL-lite endpoints.

---

## 🛠 Technology Stack (Cloudflare-Native)

### Backend (`/backend`)
- **Framework**: Hono 4.x (Optimized for Workers Runtime)
- **Database**: Cloudflare D1 + Drizzle ORM
- **Cache**: **Cloudflare Cache API** (Browser/Edge) + Workers KV (Config) + Durable Objects (State)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Auth**: Multi-tenant Auth (JWT-based, supporting external providers like Clerk/Supabase)
- **AI**: **Cloudflare Workers AI** (Llama 3, Flux) for built-in edge inference.

### Frontend (`/web`)
- **Framework**: Vite 6.x + React 19 (Server Components ready)
- **Routing**: TanStack Router (File-based + Dynamic Tenant Routes)
- **State**: TanStack Query (Optimistic UI & Server-state sync)
- **UI**: TailwindCSS 4.x + Radix UI + Framer Motion
- **Performance**: **React 19 Transitions** + **Suspense** for non-blocking UI.

---

## ⚡ Performance Optimization (95+ Lighthouse Strategy)

To achieve elite Lighthouse scores and instant loading, ReactPress 2.0 implements:

### 1. **Edge-Side Rendering (ESR) & Streaming**
- **Hono JSX Streaming**: Initial HTML is streamed from the nearest Cloudflare PoP, delivering the first byte in <50ms.
- **Static Assets via R2 + KV**: Critical assets are cached at the edge, eliminating round-trips to a central server.
- **Early Hints**: Support for 103 Early Hints to pre-connect and pre-load critical CSS/JS.

### 2. **Asset Optimization & Modern Formats**
- **Automatic Image Transformation**: Images served via R2 are automatically resized and converted to **AVIF/WebP** at the edge.
- **Component-Level Code Splitting**: Vite manual chunks ensure that only the core bundle is loaded initially; module-specific code is lazy-loaded.
- **CSS Utility Extraction**: Tailwind 4.x zero-runtime engine ensures minimal CSS footprint.

### 3. **Intelligent Caching (SWR)**
- **Stale-While-Revalidate**: All tenant configurations and public content use an SWR strategy with Workers KV and the Cache API.
- **Predictive Pre-fetching**: TanStack Router pre-fetches data for links in the viewport.

---

## 🤖 AI Agent & Assistant Workflow

ReactPress 2.0 integrates a powerful AI Orchestration layer for automated content and site management.

### 1. **AI Co-Pilot & Page Agent**
- **Page Generation**: Describe a layout, and the AI generates the **Block Builder** JSON structure.
- **SEO Automation**: Auto-generation of meta titles, descriptions, and alt-text.
- **Content Creation**: Integrated Llama 3 for drafting multi-language content based on tenant schema.

### 2. **Edge-Native RAG**
- **Vectorize Integration**: Every tenant gets an isolated vector namespace for semantic search and AI retrieval.

---

## 🛡 Stability & Security Protocols

### 1. **Bullet-Proof Infrastructure**
- **Shadow Branching**: D1 schema changes are tested in a shadow database environment before production deployment.
- **Graceful Fallbacks**: If D1 is temporarily unavailable, the system serves cached content from Workers KV.
- **Audit Logging**: Every mutation is logged with `tenant_id` and `user_id` for compliance.

### 2. **Security Hardening**
- **Tiered Rate Limiting**: Intelligent edge-level protection against DDoS and noisy neighbors.
- **Automated CSRF/CORS**: Dynamically scoped to tenant-specific domains.

---

## 📦 Project Structure

```
reactpress/
├── packages/
│   ├── core-engine/             # Logic for dynamic schema & field resolution
│   ├── tenant-orchestrator/     # Domain mapping, provisioning, and lifecycle
│   ├── ai-orchestrator/         # AI Agent logic & Vectorize integration
│   ├── shared-ui/               # Reusable Radix-based design system
│   └── modules/                 # Auto-discovered feature plugins
├── backend/
│   ├── src/
│   │   ├── middleware/          # TenantResolver, CacheControl, Security
│   │   ├── services/            # AI-Service, SchemaService, StorageService
│   │   └── index.ts             # Global Worker entry
├── web/
│   ├── src/
│   │   ├── admin/               # Dashboards with integrated AI Assistant
│   │   ├── theme-engine/        # Dynamic CSS variable injection
│   │   └── routes/              # TanStack dynamic route tree
└── wrangler.toml                # Edge configuration (D1, R2, KV, AI, Vectorize)
```
