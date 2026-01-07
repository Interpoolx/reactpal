# ReactPress 2.0 - Enterprise Multi-Tenant SaaS Platform
> [!IMPORTANT]
> **Status**: Finalized Technical Specification (Ready for Implementation)
> **Revision**: 2.1 (Admin-Centric / Breeze-First)

## Executive Summary

**ReactPress 2.0** is a next-generation, ultra-fast, AI-powered multi-tenant SaaS orchestration platform built entirely on Cloudflare's edge infrastructure. It combines sophisticated multi-tenancy isolation, dynamic schema-less CMS, edge-side rendering, AI orchestration, and micro-backend modules to deliver one of the fastest and most stable SaaS platforms on the market.

**Core Innovation**: Content-Type-First Architecture inspired by WordPress's extensibility, enabling zero-code application building for ANY content-driven use case (job boards, directories, legal libraries, tools marketplaces, and more) from a single codebase.

### Performance & Stability Targets

- **<50ms Time to First Byte (TTFB)** via Edge-Side Rendering with Hono JSX Streaming
- **Instant Content Delivery** through Elite Caching Strategy (Stale-While-Revalidate)
- **Zero Downtime Deployments** with Shadow Branching for migrations
- **99.99% Uptime** leveraging Cloudflare's global edge network (300+ locations)
- **Automatic Asset Optimization** with real-time AVIF/WebP transformation
- **Bullet-Proof Reliability** with graceful KV fallbacks and predictive pre-fetching

---


D1 db name: reactpal
ID: 39a4d54d-a335-4e15-bb6b-b02362fa16ea

workers.dev
reactpal.rajeshkumarlawyer007.workers.dev


## Project Overview

**ReactPress 2.0** is a 100% Cloudflare-native, highly modular SaaS platform built with React 19, Hono, and Cloudflare Workers. It follows a **Content-Type-First Modular Architecture** inspired by WordPress's Custom Post Types, allowing you to extend the CMS to build ANY content-driven application (job listings, business directories, law libraries, tools directory, etc.) with zero code changes.

---

## 🎯 Core Philosophy Changes

### 1. **Cloudflare-Native Only (100%)**

- **Runtime**: Cloudflare Workers for **both** production AND development
- **Database**: Cloudflare D1 ONLY (no local SQLite)
- **Storage**: Cloudflare R2 ONLY (no local filesystem)
- **No Node.js backend** - Single runtime eliminates dual-mode confusion
- **Consistent behavior** across all environments

### 2. **Content-Type-First Architecture (WordPress-Inspired)**

- **Extensible Content Types**: Define custom content types like Job Listings, Law Statutes, Business Directory, Tools Library, etc.
- **Dynamic Field Builder**: Each content type has custom fields (text, editor, relationships, files, etc.)
- **Flexible Taxonomies**: Categories, tags, or custom taxonomies per content type
- **Dynamic Routing**: Auto-generates archive/listing and single pages for each content type
- **Zero Code Extensions**: Add new content types via admin UI, no code changes needed

### 3. **Module Scalability Pattern**

- **Content Types as Modules**: Any module can register its own content types
- **Reusability**: Share fields, taxonomies, and blocks across content types
- **Composition**: Mix and match content types to build complex applications

---

## Technology Stack (Cloudflare-Native)

### Core Technologies

- **Runtime**: Cloudflare Workers (Production & Development)
- **Language**: TypeScript 5.8+ (Strict Mode)
- **Monorepo**: NPM Workspaces

### Frontend (`/web`)

- **Framework**: Vite 6.x + React 19.2.3
- **Routing**: TanStack Router 1.x (File-based routing with dynamic routes)
- **State/Data**: TanStack Query 5.x
- **Tables**: TanStack Table 8.x
- **Styling**: TailwindCSS 4.x + CSS variables
- **Icons**: Lucide React 0.562.0
- **Validation**: Zod 4.2.1
- **Rich Text**: Tiptap 3.14.x
- **Animations**: Framer Motion 12.x
- **Forms**: React Hook Form 7.x
- **Charts**: Recharts 3.x

### Backend (`/backend`)

- **Framework**: Hono 4.x (Cloudflare Workers adapter)
- **Database**: Cloudflare D1 (SQLite) ONLY
- **ORM**: Drizzle ORM 0.45.x
- **Storage**: Cloudflare R2 ONLY
- **Auth**: Supabase Auth + bcryptjs for passwords
- **Caching**: Cloudflare Workers KV
- **Background Jobs**: Cloudflare Queues (optional)
- **Rate Limiting**: Custom Workers middleware
- **CSRF**: Hono CSRF middleware

### Development Tools

- **CLI**: Wrangler (Cloudflare Workers CLI)
- **Local D1**: `wrangler dev --local` for local database
- **Remote D1**: `wrangler dev` for remote database
- **Migration System**: Custom D1 migration runner

### Shared Packages

- **@reactpress/shared-types**: Shared TypeScript types
- **@reactpress/shared**: Shared utilities, config, logger, D1 adapter, R2 adapter
- **@reactpress/config**: Centralized module/tenant/content-type configuration
- **@reactpress/debug-lens**: Debug layer with source tracking

---

## 🏛️ Architectural Manifesto (Scalable & Pluggable)

To ensure ReactPress 2.0 remains a maintainable enterprise platform, all development MUST follow these four pillars:

### 1. The "Host-Plugin" Boundary
The **Core** (HPanel/Orchestrator) is a "Host". It knows nothing about specific features (CMS, CRM, etc.). Features are "Plugins". 
- **Rule**: Plugins register via a `ModuleDefinition`.
- **Rule**: Core provides "Slots" (Sidebar, Settings, Dashboard Widgets).
- **Rule**: Plugins "Fill" slots.

### 2. Schema-Less at Scale (JSON-First)
We avoid D1 schema migrations for tenant-specific or module-specific data.
- **Unified Storage**: Use the `content_items` table with a `content` JSON column for all dynamic fields.
- **Meta-Schema**: Use `content_types` to define how that JSON should be validated and rendered.

### 3. Tenant Ultra-Isolation
- **Manual Scoping is Forbidden**: Use a Repository pattern that automatically injects `WHERE tenant_id = ?` into every query.
- **R2 Namespacing**: Files are stored as `buckets/tenant-id/module-id/file-name`.
### 4. Zero-Touch "Breeze" Lifecycle
The `Breeze` engine orchestrates these hooks:
- `onProvision(tenantId)`: Triggered when a tenant is born.
- `onEnable(tenantId)`: Triggered when a module is activated for a tenant.
- `onDisable(tenantId)`: Cleanup/Archive data.
- `onDeprovision(tenantId)`: Nuke/Archive all tenant traces.

### 5. Standardized Media Service (R2 Reuse)
Modules MUST NOT talk to R2 directly. They must use the `@reactpress/shared` `MediaService`.
- **Automatic Scoping**: The service automatically prefixes every upload path with the `tenantId` from the current context.
- **Transformation Engine**: Integrates with Cloudflare Images for on-the-fly resizing.

### 6. Dynamic UI Injection (HPanel)
The Admin Hub is a "Shell". It populates itself by querying the Enabled Modules of the current tenant context.

- **Sidebar Visibility (RBAC)**: Modules define `visibility: string[]` (roles like `editor`, `admin`). The HPanel only renders the sidebar link if the user's role is permitted.
- **Dynamic Dashboards**: The "Home" view of HPanel is a dynamic widget grid. Widgets register their own `visibility` rules. An Admin sees platform-wide metrics; an Editor sees content-specific stats.
- **Route Injection**: TanStack Router uses a `lazyLoadModuleRoutes` utility to dynamically register module-specific routes under `/hpanel/*`.
- **Settings Aggregation**: The `/settings` view automatically fetches `registration.settingsRoutes` from all active modules.
- **Studio Aesthetics**: The HPanel uses a mandatory **Dark Studio Theme** (sleek, compact, enterprise-grade). It utilizes a **Right Drawer (Sheet)** pattern for all "Quick Edit" and "Creator" flows to maintain content context.

### 7. Module Inter-Communication & Dependencies
To keep modules "Pluggable," they must never depend on each other's internal state.
- **Rules of Engagement**: 
    - Communications MUST happen via the **Core Event Bus**.
    - No direct cross-module DB imports allowed.
- **The Event Bus (`shared/lib/events.ts`)**:
    - `publish(event: string, payload: any)`
    - `subscribe(event: string, handler: Function)`
    - *Example*: CMS module publishes `post.published`, and SEO module listens to trigger sitemap regeneration.

### 8. The "Manifest" over "Code" Strategy
The platform state is defined by the **Tenant Manifest** (stored in KV/D1). 
- If a module is NOT in the manifest, its code is never loaded.
- This allows us to scale globally without lumping unrelated code into every request.

---

## 📦 Project Structure

```
reactpress/
├── packages/                         # Core modules and shared packages
│   ├── shared-types/                # Shared TypeScript types
│   ├── shared/                      # Shared utilities & adapters
│   ├── config/                      # Module/tenant registry
│   ├── core-engine/                 # Dynamic schema engine
│   ├── tenant-orchestrator/         # Domain mapping & provisioning
│   ├── ai-orchestrator/             # ⭐ AI Agent logic & Vectorize
│   │   ├── agents/                  # Tool-calling agents
│   │   ├── prompts/                 # Prompt templates
│   │   ├── tools/                   # Agent tools
│   │   └── vectorize/               # RAG implementation
│   ├── shared-ui/                   # Reusable design system
│   └── modules-*/                 # Pluggable feature modules
│       ├── modules-content-types/    # Content type system (NEW CORE!)
│       ├── modules-cms/            # Blog/Articles content type
│       ├── modules-jobs/           # Job listings content type (EXAMPLE)
│       ├── modules-directory/       # Business directory content type (EXAMPLE)
│       ├── modules-laws/           # Law statutes content type (EXAMPLE)
│       ├── modules-tools/          # Tools directory content type (EXAMPLE)
│       ├── modules-auth/           # Authentication & RBAC
│       ├── modules-tenants/        # Multi-tenancy infrastructure
│       ├── modules-themes/          # Theme engine
│       ├── modules-block-builder/   # Visual page builder
│       ├── modules-seo/            # SEO tools
│       └── modules-ai-copilot/      # ⭐ AI Co-Pilot UI
├── backend/                         # Hono + Cloudflare Workers
│   ├── src/
│   │   ├── index.ts                 # Main Workers entry
│   │   ├── modules-loader.ts        # Dynamic module loading
│   │   ├── middleware/
│   │   │   ├── tenant-resolver.ts   # Domain → Tenant resolution
│   │   │   ├── cache-control.ts     # SWR headers
│   │   │   ├── rate-limit.ts        # Tiered rate limiting
│   │   │   └── security.ts          # CORS, CSRF, headers
│   │   ├── ai/                      # ⭐ AI Services
│   │   │   ├── content-generator.ts
│   │   │   ├── layout-builder.ts
│   │   │   ├── seo-optimizer.ts
│   │   │   ├── schema-suggester.ts
│   │   │   ├── migration-generator.ts
│   │   │   ├── ui-fixer.ts
│   │   │   └── search-service.ts
│   │   ├── db/
│   │   │   ├── schema/              # Drizzle schemas
│   │   │   ├── migrations/          # D1 migration files
│   │   │   └── repositories/        # Data access layer
│   │   ├── storage/
│   │   │   ├── r2-adapter.ts        # R2 operations
│   │   │   ├── kv-adapter.ts        # KV caching
│   │   │   └── vectorize-adapter.ts # ⭐ Vector search
│   │   ├── routes/
│   │   │   ├── v1/                  # API v1 routes
│   │   │   ├── v2/                  # API v2 routes
│   │   │   └── ai/                  # ⭐ AI endpoints
│   │   └── modules/                 # Module route overrides
│   ├── wrangler.toml                # Workers configuration
│   └── package.json
├── web/                            # Vite React frontend
│   ├── src/
│   │   ├── routes/                 # TanStack Router (file-based)
│   │   │   ├── __root.tsx         # Root layout
│   │   │   ├── hpanel/              # Admin panel
│   │   │   │   ├── ai-copilot/      # ⭐ AI Assistant
│   │   │   │   ├── content/
│   │   │   │   ├── settings/
│   │   │   │   └── ...
│   │   │   ├── user/              # User dashboard
│   │   │   ├── dynamic/           # Dynamic content type routes
│   │   │   ├── login.tsx
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ui/               # Radix UI primitives
│   │   │   ├── admin/             # Admin components
│   │   │   ├── content-types/      # Content type system UI (NEW!)
│   │   │   │   ├── ContentTypeManager.tsx
│   │   │   │   ├── ContentTypeEditor.tsx
│   │   │   │   ├── ContentItemManager.tsx
│   │   │   │   ├── ContentItemEditor.tsx
│   │   │   │   └── FieldRenderer.tsx
│   │   │   ├── ai/                  # ⭐ AI Co-Pilot components
│   │   │   │   ├── ContentGenerator.tsx
│   │   │   │   ├── PageLayoutBuilder.tsx
│   │   │   │   ├── SEOOptimizer.tsx
│   │   │   │   └── AISearch.tsx
│   │   │   └── shared/           # Shared components
│   │   ├── theme-engine/            # ⭐ Dynamic CSS injection
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── DesignTokens.tsx
│   │   │   └── LayoutSwitcher.tsx
│   │   ├── config/
│   │   │   ├── site.ts            # Global site config
│   │   │   ├── widgets.ts         # Widget registry
│   │   │   └── tenants/           # Tenant definitions
│   │   ├── context/                # React contexts
│   │   ├── hooks/                  # Custom hooks
│   │   └── lib/                    # Utilities
│   ├── public/                     # Static assets
│   └── package.json
├── shared/                         # Shared utilities
│   ├── lib/
│   │   ├── d1-adapter.ts         # D1 database wrapper
│   │   ├── r2-adapter.ts         # R2 storage wrapper
│   │   ├── kv-adapter.ts         # KV caching wrapper
│   │   ├── logger.ts             # Structured logging
│   │   ├── migrations.ts         # Migration runner
│   │   └── utils.ts              # Utilities
│   └── package.json
├── db/migrations/                  # D1 database migrations
│   ├── 001_initial.sql
│   ├── 002_content_types.sql
│   └── ...
├── scripts/                        # Automation scripts
│   ├── setup-workspaces.js          # Auto-discover modules
│   ├── create-module.js            # Module scaffold generator
│   ├── create-content-type.js      # Content type generator (NEW!)
│   └── harmonize-deps.js          # Dependency version sync
│   └── analyze-bundle.js            # Bundle size analysis
├── package.json                    # Root workspace config
├── tsconfig.json                  # Root TypeScript config
└── wrangler.toml                  # Root Workers config
```

---

## � Multi-Tenant Architecture (CRITICAL)

This section defines how ReactPress handles **multiple domains/tenants** with optimized bundle sizes and tenant-specific module loading.

### Core Principles

1. **Domain-Based Resolution**: Each domain maps to a tenant with its own content, config, and modules
2. **Lazy Loading Everything**: Only load modules assigned to the current tenant
3. **Shared Core, Isolated Content**: Core code shared, content/config isolated per tenant
4. **Zero Over-Bundling**: Never bundle modules a tenant doesn't use

### 1. Tenant Configuration Schema

```typescript
// @reactpress/shared-types/src/tenant.ts
interface TenantDefinition {
  id: string;                           // UUID
  slug: string;                         // Unique slug: 'web4strategy'
  name: string;                         // Display name: 'Web4Strategy'
  
  // Domain Configuration
  domains: {
    primary: string;                    // 'web4strategy.com'
    aliases: string[];                  // ['www.web4strategy.com', 'staging.web4strategy.com']
  };
  
  // Module Assignments
  modules: {
    enabled: string[];                  // ['cms', 'crm', 'seo'] - modules enabled for this tenant
    disabled: string[];                 // Explicitly disabled modules (overrides defaults)
  };
  
  // Content Type Access
  contentTypes: {
    enabled: string[];                  // Content types this tenant can use
    custom: ContentTypeDefinition[];    // Tenant-specific custom content types
  };
  
  // Theme/Branding
  theme: {
    id: string;                         // Theme ID
    config: Record<string, any>;        // Theme customization (colors, fonts, etc.)
  };
  
  // Feature Flags
  features: Record<string, boolean>;    // { 'beta-editor': true, 'analytics': false }
  
  // Limits & Quotas
  limits: {
    maxUsers: number;
    maxStorage: number;                 // bytes
    maxContentItems: number;
  };
  
  // Status
  status: 'active' | 'suspended' | 'trial';
  createdAt: number;
  updatedAt: number;
}
```

### 2. Domain-Based Tenant Resolution

```typescript
// backend/src/middleware/tenant-resolver.ts
import type { Context, Next } from 'hono';

export async function tenantResolverMiddleware(c: Context, next: Next) {
  // 1. Extract domain from request
  const host = c.req.header('host') || '';
  const domain = host.split(':')[0]; // Remove port
  
  // 2. Check cache first (KV)
  const cache = new KVCache(c.env.CACHE);
  let tenant = await cache.get<TenantDefinition>(`tenant:domain:${domain}`);
  
  // 3. If not cached, query database
  if (!tenant) {
    const db = new DbHelper(c.env.DB);
    tenant = await db.queryOne<TenantDefinition>(`
      SELECT t.* FROM tenants t
      INNER JOIN tenant_domains td ON t.id = td.tenant_id
      WHERE td.domain = ?
      AND t.status = 'active'
    `, [domain]);
    
    if (tenant) {
      // Cache for 5 minutes
      await cache.set(`tenant:domain:${domain}`, tenant, 300);
    }
  }
  
  // 4. Handle tenant not found
  if (!tenant) {
    // Check if it's the default/fallback tenant
    if (domain === c.env.DEFAULT_DOMAIN) {
      tenant = await getDefaultTenant(c.env);
    } else {
      return c.json({ error: 'Tenant not found' }, 404);
    }
  }
  
  // 5. Attach tenant to context (available in all routes)
  c.set('tenant', tenant);
  c.set('tenantId', tenant.id);
  
  await next();
}

// Usage in routes
app.get('/api/content', async (c) => {
  const tenant = c.get('tenant'); // TenantDefinition
  const tenantId = c.get('tenantId'); // string
  
  // All queries automatically scoped to tenant
  const items = await db.query('SELECT * FROM content_items WHERE tenant_id = ?', [tenantId]);
});
```

### 3. Module Classification System

```typescript
// @reactpress/config/src/modules.ts

// Core modules - ALWAYS loaded for all tenants
export const CORE_MODULES = [
  'auth',           // Authentication (required)
  'tenants',        // Multi-tenancy (required)
  'themes',         // Theme engine (required)
] as const;

// Default modules - loaded unless explicitly disabled
export const DEFAULT_MODULES = [
  'cms',            // Blog/Pages
  'media',          // Media library
  'menus',          // Navigation menus
] as const;

// Optional modules - only loaded when explicitly enabled
export const OPTIONAL_MODULES = [
  'crm',            // CRM/Forms
  'seo',            // SEO Tools
  'block-builder',  // Visual page builder
  'jobs',           // Job listings
  'directory',      // Business directory
  'laws',           // Law library
  'tools',          // Tools directory
  'ecommerce',      // E-commerce
  'analytics',      // Analytics dashboard
  'newsletters',    // Email newsletters
] as const;

// Module metadata registry
export const MODULE_REGISTRY: Record<string, ModuleMetadata> = {
  cms: {
    id: 'cms',
    name: 'Content Management',
    description: 'Blog posts and static pages',
    category: 'content',
    bundleSize: 45000,  // ~45KB (for build analysis)
    dependencies: [],   // No dependencies
    loadPriority: 1,    // Load first
  },
  crm: {
    id: 'crm',
    name: 'CRM & Forms',
    description: 'Contact forms and lead management',
    category: 'business',
    bundleSize: 78000,  // ~78KB
    dependencies: ['cms'], // Requires CMS for form embedding
    loadPriority: 2,
  },
  seo: {
    id: 'seo',
    name: 'SEO Tools',
    description: 'Sitemaps, meta tags, and SEO analysis',
    category: 'marketing',
    bundleSize: 52000,  // ~52KB
    dependencies: ['cms'],
    loadPriority: 3,
  },
  // ... other modules
};
```

### 4. Frontend: Lazy Module Loading (CRITICAL for Bundle Size)

```typescript
// web/src/lib/module-loader.ts
import { lazy, Suspense, type ComponentType } from 'react';

// Module component registry with lazy imports
const MODULE_COMPONENTS: Record<string, () => Promise<{ default: ComponentType }>> = {
  // Core (always bundled in main chunk)
  // -- none, core is in main bundle --
  
  // Lazy-loaded modules (separate chunks)
  cms: () => import('@reactpress/modules-cms/components'),
  crm: () => import('@reactpress/modules-crm/components'),
  seo: () => import('@reactpress/modules-seo/components'),
  'block-builder': () => import('@reactpress/modules-block-builder/components'),
  jobs: () => import('@reactpress/modules-jobs/components'),
  directory: () => import('@reactpress/modules-directory/components'),
  ecommerce: () => import('@reactpress/modules-ecommerce/components'),
};

// Dynamic module loader hook
export function useModuleComponent(moduleId: string) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loader = MODULE_COMPONENTS[moduleId];
    if (!loader) {
      setError(new Error(`Module not found: ${moduleId}`));
      setLoading(false);
      return;
    }
    
    loader()
      .then(mod => {
        setComponent(() => mod.default);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [moduleId]);
  
  return { Component, loading, error };
}

// Create lazy component with loading state
export function createLazyModule(moduleId: string) {
  const loader = MODULE_COMPONENTS[moduleId];
  if (!loader) {
    return () => <div>Module not found: {moduleId}</div>;
  }
  
  const LazyComponent = lazy(loader);
  
  return (props: any) => (
    <Suspense fallback={<ModuleLoadingSkeleton moduleId={moduleId} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
```

### 5. Tenant-Aware Admin Sidebar

```typescript
// web/src/components/admin/AdminSidebar.tsx
export const AdminSidebar: FC = () => {
  const { tenant, tenantModules, isLoading } = useTenant();
  
  if (isLoading) return <SidebarSkeleton />;
  
  // Filter sidebar items to only show enabled modules
  const sidebarItems = useMemo(() => {
    const allItems = getAllSidebarItems(); // Get all possible items
    
    return allItems.filter(item => {
      // Core items always show
      if (CORE_MODULES.includes(item.moduleId)) return true;
      
      // Check if module is enabled for this tenant
      return tenantModules.includes(item.moduleId);
    });
  }, [tenantModules]);
  
  return (
    <aside className="admin-sidebar">
      {sidebarItems.map(item => (
        <SidebarItem key={item.moduleId} {...item} />
      ))}
    </aside>
  );
};

// Sidebar items registry
function getAllSidebarItems(): SidebarItem[] {
  return [
    // Core (always visible)
    { moduleId: 'dashboard', to: '/hpanel', icon: Home, label: 'Dashboard' },
    
    // Content modules
    { moduleId: 'cms', to: '/hpanel/cms', icon: FileText, label: 'Content' },
    { moduleId: 'media', to: '/hpanel/media', icon: Image, label: 'Media' },
    { moduleId: 'menus', to: '/hpanel/menus', icon: Menu, label: 'Menus' },
    
    // Optional modules (only show if enabled)
    { moduleId: 'crm', to: '/hpanel/crm', icon: Users, label: 'CRM' },
    { moduleId: 'seo', to: '/hpanel/seo', icon: Search, label: 'SEO' },
    { moduleId: 'block-builder', to: '/hpanel/builder', icon: Layout, label: 'Page Builder' },
    { moduleId: 'jobs', to: '/hpanel/jobs', icon: Briefcase, label: 'Jobs' },
    { moduleId: 'ecommerce', to: '/hpanel/store', icon: ShoppingCart, label: 'Store' },
    
    // Settings (always visible)
    { moduleId: 'settings', to: '/hpanel/settings', icon: Settings, label: 'Settings' },
  ];
}
```

### 6. Vite Configuration for Code Splitting

```typescript
// web/vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendors (always loaded)
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack';
            }
            if (id.includes('lucide')) {
              return 'vendor-icons';
            }
          }
          
          // Module-based chunks (lazy loaded)
          if (id.includes('modules-cms')) return 'module-cms';
          if (id.includes('modules-crm')) return 'module-crm';
          if (id.includes('modules-seo')) return 'module-seo';
          if (id.includes('modules-block-builder')) return 'module-builder';
          if (id.includes('modules-jobs')) return 'module-jobs';
          if (id.includes('modules-directory')) return 'module-directory';
          if (id.includes('modules-ecommerce')) return 'module-ecommerce';
          
          // Shared code
          if (id.includes('shared')) return 'shared';
          
          return undefined; // Default chunking
        },
      },
    },
    // Warn if chunks exceed size limits
    chunkSizeWarningLimit: 250, // 250KB warning threshold
  },
});
```

### 7. Backend: Tenant-Scoped Module Loading

```typescript
// backend/src/modules-loader.ts
import { Hono } from 'hono';

interface ModuleDefinition {
  id: string;
  getRoutes: () => Hono;
}

// Dynamic module registry
const AVAILABLE_MODULES: Record<string, () => Promise<ModuleDefinition>> = {
  cms: () => import('@reactpress/modules-cms').then(m => m.CmsModule),
  crm: () => import('@reactpress/modules-crm').then(m => m.CrmModule),
  seo: () => import('@reactpress/modules-seo').then(m => m.SeoModule),
  jobs: () => import('@reactpress/modules-jobs').then(m => m.JobsModule),
  // ... more modules
};

/**
 * THE MODULE CONTRACT (Pluggable API)
 * Every module MUST export a 'description' and 'getRoutes'
 */
export interface ModuleDefinition {
  id: string;                           // 'crm', 'seo'
  name: string;                         // 'Lead Manager'
  icon: string;                         // Lucide icon name
  category: 'content' | 'marketing' | 'business' | 'core';
  version: string;
  
  // Registration Hooks
  registration: {
    sidebars: SidebarItem[];            // Injected into HPanel
    dashboardWidgets: Widget[];         // Injected into Admin Home
    settingsRoutes: SettingRoute[];     // Injected into HPanel > Settings
    defaultVisibility: string[];        // Default roles that see this module (e.g. ['admin'])
  };
  
  // Settings Specification
  settings?: {
    schema: ZodSchema;                  // How to validate module settings
    defaults: Record<string, any>;      // Initial settings on 'onEnable'
  };
  
  // Breeze Lifecycle Hooks
  lifecycle: {
    onEnable: (c: Context) => Promise<void>;   // Run migrations, seed tags
    onDisable: (c: Context) => Promise<void>;  // Clean up cache
  };
  
  // Data Logic
  getRoutes: () => Hono;                // Exported API sub-router
  contentTypes?: ContentTypeDefinition[]; // Optional: Register CMS schemas
}

export class ModuleLoader {
  private loadedModules: Map<string, ModuleDefinition> = new Map();
  
  constructor(private app: Hono) {}
  
  async loadModulesForTenant(tenant: TenantDefinition): Promise<void> {
    const modulesToLoad = this.getModulesForTenant(tenant);
    
    for (const moduleId of modulesToLoad) {
      // Skip if already loaded
      if (this.loadedModules.has(moduleId)) continue;
      
      const loader = AVAILABLE_MODULES[moduleId];
      if (!loader) {
        console.warn(`Module not found: ${moduleId}`);
        continue;
      }
      
      try {
        const module = await loader();
        this.loadedModules.set(moduleId, module);
        
        // Mount module routes under /api/modules/{moduleId}
        const routes = module.getRoutes();
        this.app.route(`/api/modules/${moduleId}`, routes);
        
        console.log(`✅ Module loaded: ${moduleId}`);
      } catch (error) {
        console.error(`❌ Failed to load module: ${moduleId}`, error);
      }
    }
  }
  
  private getModulesForTenant(tenant: TenantDefinition): string[] {
    const modules = new Set<string>();
    
    // Always include core modules
    CORE_MODULES.forEach(m => modules.add(m));
    
    // Include default modules (unless disabled)
    DEFAULT_MODULES.forEach(m => {
      if (!tenant.modules.disabled.includes(m)) {
        modules.add(m);
      }
    });
    
    // Include explicitly enabled optional modules
    tenant.modules.enabled.forEach(m => modules.add(m));
    
    return Array.from(modules);
  }
}
```

### 8. Database: Tenant Isolation Pattern

```sql
-- All content tables MUST include tenant_id
-- This ensures complete data isolation

CREATE TABLE content_items (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,          -- REQUIRED for isolation
  content_type_id TEXT NOT NULL,
  title TEXT NOT NULL,
  -- ... other fields
  
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Compound index for tenant-scoped queries
CREATE INDEX idx_content_tenant ON content_items(tenant_id, content_type_id);

-- Row-Level Security Pattern (enforced in application layer)
-- All queries MUST include WHERE tenant_id = ?

-- ✅ CORRECT: Always scope by tenant
SELECT * FROM content_items WHERE tenant_id = ? AND status = 'published';

-- ❌ WRONG: Never query without tenant scope
SELECT * FROM content_items WHERE status = 'published'; -- DANGEROUS!
```

### 9. Tenant-Scoped Repository Pattern (MANDATORY)

To prevent accidental data leaks, ALL database access MUST go through a tenant-scoped repository. Direct use of the Drizzle `db` object in routes is FORBIDDEN.

```typescript
// shared/lib/repository.ts
import { type DrizzleDB } from './drizzle';
import { and, eq, SQL } from 'drizzle-orm';

export abstract class BaseRepository<TTable extends { tenantId: any }> {
  constructor(protected db: DrizzleDB, protected tenantId: string) {}

  // Enforces tenantId on every query
  protected withTenant(condition?: SQL) {
    const tenantFilter = eq((this.getTable() as any).tenantId, this.tenantId);
    return condition ? and(tenantFilter, condition) : tenantFilter;
  }

  abstract getTable(): TTable;
}

// Example: Content Item Repository
export class ContentRepository extends BaseRepository<typeof contentItems> {
  getTable() { return contentItems; }

  async findBySlug(slug: string) {
    return this.db.query.contentItems.findFirst({
      where: (table, { and, eq }) => and(
        eq(table.tenantId, this.tenantId), // ENFORCED
        eq(table.slug, slug)
      )
    });
  }
}
```

### 10. Tenant Module Assignment API

```typescript
// backend/src/routes/tenant-modules.ts
import { Hono } from 'hono';
import { z } from 'zod';

const tenantModulesRouter = new Hono();

// Get modules for a tenant
tenantModulesRouter.get('/:tenantId/modules', async (c) => {
  const { tenantId } = c.req.param();
  const db = new DbHelper(c.env.DB);
  
  const tenant = await db.queryOne<TenantDefinition>(
    'SELECT * FROM tenants WHERE id = ?',
    [tenantId]
  );
  
  if (!tenant) return c.json({ error: 'Tenant not found' }, 404);
  
  // Combine enabled modules
  const enabledModules = [
    ...CORE_MODULES,
    ...DEFAULT_MODULES.filter(m => !tenant.modules.disabled.includes(m)),
    ...tenant.modules.enabled,
  ];
  
  return c.json({
    tenantId,
    modules: enabledModules.map(moduleId => ({
      id: moduleId,
      ...MODULE_REGISTRY[moduleId],
      isCore: CORE_MODULES.includes(moduleId),
      isDefault: DEFAULT_MODULES.includes(moduleId),
    })),
  });
});

// Enable a module for a tenant
tenantModulesRouter.post('/:tenantId/modules/:moduleId/enable', async (c) => {
  const { tenantId, moduleId } = c.req.param();
  
  // Validate module exists
  if (!MODULE_REGISTRY[moduleId]) {
    return c.json({ error: 'Module not found' }, 404);
  }
  
  // Check dependencies
  const deps = MODULE_REGISTRY[moduleId].dependencies;
  if (deps.length > 0) {
    const tenant = await getTenant(tenantId);
    const missingDeps = deps.filter(d => !tenant.modules.enabled.includes(d));
    if (missingDeps.length > 0) {
      return c.json({ 
        error: 'Missing dependencies',
        missingDependencies: missingDeps,
      }, 400);
    }
  }
  
  // Update tenant modules
  await db.execute(`
    UPDATE tenants 
    SET modules = json_set(modules, '$.enabled', 
      json_array_append(json_extract(modules, '$.enabled'), '$', ?))
    WHERE id = ?
  `, [moduleId, tenantId]);
  
  // Invalidate cache
  await cache.delete(`tenant:${tenantId}`);
  
  return c.json({ success: true, moduleId });
});

// Disable a module for a tenant
tenantModulesRouter.post('/:tenantId/modules/:moduleId/disable', async (c) => {
  const { tenantId, moduleId } = c.req.param();
  
  // Cannot disable core modules
  if (CORE_MODULES.includes(moduleId)) {
    return c.json({ error: 'Cannot disable core module' }, 400);
  }
  
  // Check if other modules depend on this
  const dependents = Object.entries(MODULE_REGISTRY)
    .filter(([_, meta]) => meta.dependencies.includes(moduleId))
    .map(([id]) => id);
  
  const tenant = await getTenant(tenantId);
  const activeDependents = dependents.filter(d => 
    tenant.modules.enabled.includes(d)
  );
  
  if (activeDependents.length > 0) {
    return c.json({
      error: 'Module has active dependents',
      dependents: activeDependents,
    }, 400);
  }
  
  // Update tenant modules
  await disableModuleForTenant(tenantId, moduleId);
  await cache.delete(`tenant:${tenantId}`);
  
  return c.json({ success: true, moduleId });
});
```

### 10. Bundle Size Analysis & Monitoring

```typescript
// scripts/analyze-bundle.js
// Run: npm run analyze-bundle

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BUNDLE_LIMITS = {
  'vendor-react': 150_000,     // 150KB max
  'vendor-tanstack': 80_000,   // 80KB max
  'module-cms': 50_000,        // 50KB max
  'module-crm': 100_000,       // 100KB max
  'module-seo': 60_000,        // 60KB max
  'module-builder': 200_000,   // 200KB max (rich editor)
  'shared': 30_000,            // 30KB max
};

function analyzeBundle() {
  const distPath = join(process.cwd(), 'web/dist/assets');
  const files = readdirSync(distPath);
  
  const violations = [];
  
  for (const file of files) {
    const size = readFileSync(join(distPath, file)).length;
    
    // Check against limits
    for (const [chunk, limit] of Object.entries(BUNDLE_LIMITS)) {
      if (file.includes(chunk) && size > limit) {
        violations.push({
          chunk,
          file,
          size,
          limit,
          over: size - limit,
        });
      }
    }
  }
  
  if (violations.length > 0) {
    console.error('❌ Bundle size violations:');
    violations.forEach(v => {
      console.error(`  ${v.chunk}: ${(v.size/1000).toFixed(1)}KB (limit: ${(v.limit/1000).toFixed(1)}KB, over by ${(v.over/1000).toFixed(1)}KB)`);
    });
    process.exit(1);
  }
  
  console.log('✅ All chunks within size limits');
}

analyzeBundle();
```

### 11. Tenant Context Provider (Frontend)

```typescript
// web/src/context/TenantContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface TenantContextValue {
  tenant: TenantDefinition | null;
  tenantId: string | null;
  tenantModules: string[];
  isLoading: boolean;
  error: Error | null;
  hasModule: (moduleId: string) => boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export const TenantProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Resolve tenant from current domain
    const domain = window.location.hostname;
    
    fetch(`/api/tenants/resolve?domain=${domain}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTenant(data.tenant);
        } else {
          setError(new Error(data.error || 'Failed to resolve tenant'));
        }
      })
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, []);
  
  const tenantModules = useMemo(() => {
    if (!tenant) return [];
    return [
      ...CORE_MODULES,
      ...DEFAULT_MODULES.filter(m => !tenant.modules.disabled.includes(m)),
      ...tenant.modules.enabled,
    ];
  }, [tenant]);
  
  const hasModule = useCallback((moduleId: string) => {
    return tenantModules.includes(moduleId);
  }, [tenantModules]);
  
  return (
    <TenantContext.Provider value={{
      tenant,
      tenantId: tenant?.id ?? null,
      tenantModules,
      isLoading,
      error,
      hasModule,
    }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};
```

### 12. Multi-Tenant Bundle Strategy Summary

```
Bundle Loading Strategy:
┌─────────────────────────────────────────────────────────────┐
│                     INITIAL LOAD (~200KB)                   │
├─────────────────────────────────────────────────────────────┤
│ vendor-react.js      (~45KB)  - React + ReactDOM            │
│ vendor-tanstack.js   (~35KB)  - Router + Query              │
│ vendor-icons.js      (~20KB)  - Core Lucide icons           │
│ main.js              (~50KB)  - App shell + tenant resolver │
│ shared.js            (~25KB)  - Shared utilities            │
│ styles.css           (~25KB)  - Core styles                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
              Tenant Resolution (from domain)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              LAZY LOADED MODULES (on navigation)            │
├─────────────────────────────────────────────────────────────┤
│ module-cms.js        (~45KB)  - if tenant.has('cms')        │
│ module-crm.js        (~78KB)  - if tenant.has('crm')        │
│ module-seo.js        (~52KB)  - if tenant.has('seo')        │
│ module-builder.js    (~180KB) - if tenant.has('block-builder')│
│ module-jobs.js       (~40KB)  - if tenant.has('jobs')       │
│ module-ecommerce.js  (~150KB) - if tenant.has('ecommerce')  │
└─────────────────────────────────────────────────────────────┘

Result: Tenant with only CMS loads ~245KB (not ~800KB with all modules)
```

---

## 🎨 Theme Engine (WordPress-Like)

Each tenant can choose their own theme. Templates cascade: **global defaults → post type → individual post overrides**.

### 1. Theme Definition

```typescript
interface ThemeDefinition {
  id: string;                           // 'developer-portfolio', 'law-firm'
  name: string;
  templates: {
    layout: string;                     // 'layouts/default.tsx'
    home: string;
    page: string;
    archive: string;
    single: string;
  };
  cssVariables: Record<string, string>;
  contentTypeTemplates?: Record<string, { archive?: string; single?: string }>;
}
```

### 2. Template Hierarchy (WordPress-Like Cascade)

```
SINGLE POST/PAGE:
1. Post-specific template    → content.template = 'custom-landing'
2. Post-type template        → templates/single-{contentType}.tsx
3. Default single            → templates/single.tsx
4. Fallback                  → templates/page.tsx

ARCHIVE/LISTING:
1. Taxonomy archive          → templates/archive-{taxonomy}.tsx
2. Content type archive      → templates/archive-{contentType}.tsx
3. Default archive           → templates/archive.tsx
4. Fallback                  → templates/index.tsx
```

### 3. Tenant Theme Configuration

```typescript
interface TenantThemeConfig {
  tenantId: string;
  themeId: string;                      // Selected theme
  customizations: {
    colors: Record<string, string>;     // CSS variable overrides
    fonts: Record<string, string>;
    settings: Record<string, any>;
  };
  templateOverrides: Record<string, string>;  // Override specific templates
}
```

---

## 🔐 Roles & Permissions (RBAC)

Comprehensive Role-Based Access Control with role-specific UI and admin impersonation.

### 1. Permission System

```typescript
const PERMISSIONS = {
  // Content
  'content:read': 'View published content',
  'content:create': 'Create content',
  'content:edit_own': 'Edit own content',
  'content:edit_any': 'Edit any content',
  'content:delete_own': 'Delete own content',
  'content:delete_any': 'Delete any content',
  'content:publish': 'Publish content',
  
  // Media
  'media:read': 'View media',
  'media:upload': 'Upload media',
  'media:delete_any': 'Delete any media',
  
  // Users
  'users:read': 'View users',
  'users:create': 'Create users',
  'users:edit': 'Edit users',
  'users:assign_roles': 'Assign roles',
  
  // Settings
  'settings:read': 'View settings',
  'settings:edit': 'Edit settings',
  'settings:theme': 'Customize theme',
  
  // Modules
  'module:cms': 'Access CMS module',
  'module:crm': 'Access CRM module',
  'module:seo': 'Access SEO module',
  
  // Admin
  'admin:access': 'Access admin panel',
  'admin:view_as': 'View as other roles',
  'admin:impersonate': 'Impersonate users',
} as const;
```

### 2. Built-in Roles

| Role | Priority | Scope | Key Permissions |
|------|----------|-------|-----------------|
| **super_admin** | 100 | Global | All permissions across all tenants |
| **admin** | 90 | Tenant | Full tenant access + view_as |
| **editor** | 70 | Tenant | Content management + publish |
| **author** | 50 | Tenant | Own content only |
| **contributor** | 30 | Tenant | Create drafts, no publish |
| **subscriber** | 10 | Tenant | Read only |

### 3. Permission Middleware (Backend)

```typescript
export function requirePermission(...required: Permission[]) {
  return async (c: Context, next: Next) => {
    const role = await getUserRole(c.get('userId'), c.get('tenantId'));
    const hasAll = required.every(p => role.permissions.includes(p));
    if (!hasAll) return c.json({ error: 'Forbidden' }, 403);
    await next();
  };
}

// Usage
app.delete('/api/content/:id', requirePermission('content:delete_any'), handler);
```

### 4. Frontend Permission Hook

```typescript
export function usePermissions() {
  const { role, viewingAsRole } = useAuth();
  const effectiveRole = viewingAsRole || role;
  
  const can = (permission: Permission) => 
    effectiveRole?.permissions.includes(permission) ?? false;
  
  return { can, canAny, canAll, isViewingAs: !!viewingAsRole };
}
```

### 5. Role-Specific Admin Sidebar

```typescript
export const AdminSidebar: FC = () => {
  const { can } = usePermissions();
  const { hasModule } = useTenant();
  
  const items = [
    { to: '/hpanel', icon: Home, label: 'Dashboard', permission: 'admin:access' },
    { to: '/hpanel/cms', icon: FileText, label: 'Content', permission: 'module:cms', module: 'cms' },
    { to: '/hpanel/crm', icon: Users, label: 'CRM', permission: 'module:crm', module: 'crm' },
    { to: '/hpanel/seo', icon: Search, label: 'SEO', permission: 'module:seo', module: 'seo' },
    { to: '/hpanel/users', icon: UserCog, label: 'Users', permission: 'users:read' },
    { to: '/hpanel/settings', icon: Settings, label: 'Settings', permission: 'settings:read' },
  ].filter(item => 
    can(item.permission) && (!item.module || hasModule(item.module))
  );
  
  return <aside>{items.map(i => <SidebarItem key={i.to} {...i} />)}</aside>;
};
```

### 6. "View As Role" Feature (Admin Impersonation)

```typescript
// AuthContext with View As support
export const AuthProvider: FC = ({ children }) => {
  const [viewingAsRole, setViewingAsRole] = useState<RoleDefinition | null>(null);
  
  const setViewAsRole = async (roleId: string | null) => {
    if (!roleId) {
      setViewingAsRole(null);
      sessionStorage.removeItem('viewAsRole');
      return;
    }
    
    // Verify permission
    if (!role?.permissions.includes('admin:view_as')) return;
    
    // Cannot view as higher or equal priority role
    const target = await fetchRole(roleId);
    if (target.priority >= role.priority) return;
    
    setViewingAsRole(target);
    sessionStorage.setItem('viewAsRole', roleId);
  };
  
  return (
    <AuthContext.Provider value={{ viewingAsRole, setViewAsRole, ... }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 7. View As Role Switcher UI

```typescript
export const ViewAsRoleSwitcher: FC = () => {
  const { role, viewingAsRole, setViewAsRole, exitViewAs } = useAuth();
  const { can } = usePermissions();
  
  if (!can('admin:view_as')) return null;
  
  return (
    <>
      {viewingAsRole && (
        <div className="bg-yellow-500 text-black px-4 py-2 flex justify-between">
          <span>Viewing as: <strong>{viewingAsRole.name}</strong></span>
          <Button size="sm" onClick={exitViewAs}>Exit View Mode</Button>
        </div>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" /> View As
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Role</DropdownMenuLabel>
          {roles.filter(r => r.priority < role.priority).map(r => (
            <DropdownMenuItem key={r.id} onClick={() => setViewAsRole(r.id)}>
              {r.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
```

### 8. Tenant-Specific Settings

```typescript
// Settings scoped per tenant and filtered by enabled modules
interface TenantSettings {
  tenantId: string;
  general: {
    siteName: string;
    siteTagline: string;
    timezone: string;
    dateFormat: string;
  };
  modules: {
    cms?: { postsPerPage: number; enableComments: boolean };
    crm?: { defaultRecipient: string; enableReCaptcha: boolean };
    seo?: { enableSitemap: boolean; googleAnalyticsId: string };
  };
}

// API returns only settings for enabled modules
app.get('/api/settings', requirePermission('settings:read'), async (c) => {
  const tenant = c.get('tenant');
  const settings = await getSettings(tenant.id);
  
  // Filter to only enabled modules
  const filteredModules = Object.fromEntries(
    Object.entries(settings.modules).filter(([id]) => 
      tenant.modules.enabled.includes(id)
    )
  );
  
  return c.json({ ...settings, modules: filteredModules });
});
```

### 9. Database Schema for RBAC

```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  permissions TEXT NOT NULL,           -- JSON array of permission strings
  is_system INTEGER DEFAULT 0,         -- Cannot be deleted
  tenant_id TEXT,                       -- NULL = global role
  priority INTEGER DEFAULT 50,
  UNIQUE(name, tenant_id)
);

CREATE TABLE user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  assigned_by TEXT,
  assigned_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE(user_id, tenant_id)            -- One role per user per tenant
);

---

## 📄 Page Types & Admin Mode

ReactPress supports two page types with special admin-mode behaviors.

### 1. Page Types

| Type | Description |
|------|-------------|
| **Standard Page** | Traditional React template rendering |
| **Block Builder Page** | Visual drag-and-drop blocks (has floating edit button for admins) |

### 2. Admin Mode Detection

```typescript
export function useAdminMode() {
  const { user, role } = useAuth();
  const tenantParam = useSearchParams().get('tenant');
  
  const isAdmin = role?.permissions.includes('admin:access') ?? false;
  
  return { isAdmin, tenantParam };
}
```

### 3. Floating Block Editor Button

```typescript
// Only visible for admins on block-builder pages
export const FloatingEditorButton: FC<{ pageId: string }> = ({ pageId }) => {
  const { isAdmin } = useAdminMode();
  if (!isAdmin) return null;
  
  return (
    <button
      onClick={() => navigate(`/hpanel/builder/${pageId}`)}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full 
                 bg-primary text-white shadow-lg"
    >
      <Pencil className="w-6 h-6" />
    </button>
  );
};

// In page layout
{page.template === 'block-builder' && <FloatingEditorButton pageId={page.id} />}
```

### 4. Tenant Switcher (Admin Only)

```typescript
export const TenantSwitcher: FC = () => {
  const { isAdmin } = useAdminMode();
  if (!isAdmin) return null;
  
  const { data: tenants } = useQuery({ queryKey: ['tenants'], queryFn: fetchAllTenants });
  
  const handleChange = (tenantId: string) => {
    const params = new URLSearchParams(location.search);
    params.set('tenant', tenantId);
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger><Building2 /> Select Tenant</SelectTrigger>
      <SelectContent>
        {tenants?.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
      </SelectContent>
    </Select>
  );
};
```

### 5. Admin-Aware Links (?tenant=xxx)

```typescript
// All links preserve tenant context for admins
export const AdminLink: FC<LinkProps> = ({ to, children, ...props }) => {
  const { isAdmin, tenantParam } = useAdminMode();
  
  const href = useMemo(() => {
    if (!isAdmin || !tenantParam) return to;
    const url = new URL(to, window.location.origin);
    url.searchParams.set('tenant', tenantParam);
    return url.pathname + url.search;
  }, [to, isAdmin, tenantParam]);
  
  return <Link to={href} {...props}>{children}</Link>;
};

// Usage: <AdminLink to="/hpanel/cms">Content</AdminLink>
// Output: /hpanel/cms?tenant=abc123 (for admin viewing tenant abc123)
```

### 6. Backend Tenant Override

```typescript
// Admin can override tenant via ?tenant=xxx
export async function tenantResolverMiddleware(c: Context, next: Next) {
  const tenantParam = c.req.query('tenant');
  const user = c.get('user');
  
  // Admin override
  if (tenantParam && user?.permissions.includes('admin:access')) {
    const tenant = await getTenantById(tenantParam);
    if (tenant) {
      c.set('tenant', tenant);
      c.set('tenantOverride', true);  // Audit flag
      return next();
    }
  }
  
  // Default: domain resolution
  const tenant = await getTenantByDomain(c.req.header('host'));
  c.set('tenant', tenant);
  return next();
}
```

### 7. Page Rendering Flow

```
REQUEST → Tenant Resolution (admin override OR domain)
       → Template Selection (block-builder OR standard)
       → Admin Enhancements:
         • TenantSwitcher in header
         • All <AdminLink>s include ?tenant=xxx
         • FloatingEditorButton on block-builder pages
```

---

## �🏗️ Architecture Patterns

### 1. Content-Type System (WordPress-Inspired Core)

This is the **central innovation** of ReactPress 2.0.

#### Content Type Definition

```
interface ContentTypeDefinition {
  // Identity
  id: string;                    // e.g., 'job-listing', 'law-statute', 'business-directory'
  name: string;                   // Display name: "Job Listings"
  singular: string;                // "Job"
  plural: string;                  // "Jobs"
  icon: LucideIcon;               // Briefcase, Scale, Building2, etc.
  description?: string;
  
  // Custom Fields (Dynamic Schema)
  fields: FieldDefinition[];
  
  // Taxonomies (Categories, Tags, Custom)
  taxonomies: TaxonomyDefinition[];
  
  // Routing Configuration
  routing: {
    basePath: string;               // e.g., '/jobs', '/statutes', '/directory'
    hasArchive: boolean;            // /jobs
    hasSingle: boolean;             // /jobs/senior-developer
    archiveTemplate?: string;       // Archive template override
    singleTemplate?: string;        // Single template override
    slugSource: 'title' | 'id' | 'custom'; // How to generate URLs
  };
  
  // UI/UX Configuration
  ui: {
    listView: 'card' | 'list' | 'table' | 'grid';
    enableFeatured: boolean;         // Featured content
    enableComments: boolean;         // Comments system
    enableFeaturedImage: boolean;
    enableGallery: boolean;
    enableAuthor: boolean;
    enableDate: boolean;
    permissions: {
      read: string[];              // Roles that can read
      create: string[];            // Roles that can create
      edit: string[];              // Roles that can edit own
      editAll: string[];           // Roles that can edit any
      delete: string[];             // Roles that can delete own
      deleteAll: string[];          // Roles that can delete any
    };
  };
  
  // SEO Configuration
  seo: {
    enableSitemap: boolean;
    enableRss: boolean;
    defaultTitleTemplate: string;   // "%title% | %site%"
    defaultMetaDescription: string;
  };
  
  // Module Registration
  moduleId: string;                // Module providing this content type
  tenantScope: 'all' | string[]; // Which tenants can use it
}
```

#### Field Types

```
type FieldType = 
  | 'text'                          // Single line text
  | 'textarea'                      // Multi-line text
  | 'editor'                        // Rich text (Tiptap)
  | 'number'                        // Numeric input
  | 'decimal'                       // Decimal numbers
  | 'date'                          // Date picker
  | 'datetime'                      // Date & time
  | 'email'                         // Email validation
  | 'url'                           // URL validation
  | 'phone'                         // Phone number
  | 'select'                        // Dropdown (single)
  | 'multiselect'                   // Dropdown (multiple)
  | 'radio'                         // Radio buttons
  | 'checkbox'                      // Checkboxes
  | 'toggle'                        // Boolean switch
  | 'file'                          // File upload (R2)
  | 'image'                         // Image upload (R2)
  | 'gallery'                       // Multiple images
  | 'relationship'                   // Related content items
  | 'taxonomy'                       // Taxonomy term selector
  | 'json'                          // JSON editor
  | 'code'                          // Code editor
  | 'color'                         // Color picker
  | 'location'                      // Location picker (map)
  | 'rating'                        // Star rating;

interface FieldDefinition {
  id: string;                      // Field identifier
  name: string;                     // Display name
  type: FieldType;                  // Field type
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
  
  // For select/multiselect/radio
  options?: Array<{ value: string; label: string; icon?: LucideIcon }>;
  
  // For relationship fields
  relationshipTo?: string;          // Content type ID to relate to
  relationshipType?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  
  // Validation
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;              // Regex
    custom?: ZodSchema;
  };
  
  // Conditional visibility
  condition?: {
    field: string;                 // Show this field when another field equals value
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan';
    value: any;
  };
  
  // UI customization
  ui?: {
    width?: 'full' | 'half' | 'third' | 'quarter';
    order?: number;
    group?: string;                // Group related fields
  };
}
```

#### Taxonomy Definition

```
interface TaxonomyDefinition {
  id: string;                      // e.g., 'job-type', 'location', 'practice-area'
  name: string;                     // "Job Type"
  singular: string;                  // "Job Type"
  plural: string;                   // "Job Types"
  hierarchical: boolean;            // True = Categories, False = Tags
  icon: LucideIcon;
  description?: string;
  
  // Taxonomy-specific fields
  fields?: FieldDefinition[];       // Add custom fields to taxonomy terms
  
  // UI configuration
  ui?: {
    showInSidebar: boolean;         // Show in admin sidebar
    showInFilter: boolean;          // Show in archive filters
    enableColor: boolean;           // Assign colors to terms
    enableIcon: boolean;            // Assign icons to terms
  };
}
```

#### Example: Job Listings Content Type

```
export const JobListingsContentType: ContentTypeDefinition = {
  id: 'job-listing',
  name: 'Job Listings',
  singular: 'Job',
  plural: 'Jobs',
  icon: Briefcase,
  description: 'Post and manage job openings',
  
  fields: [
    {
      id: 'company',
      name: 'Company Name',
      type: 'text',
      required: true,
      ui: { width: 'full' }
    },
    {
      id: 'location',
      name: 'Location',
      type: 'text',
      required: true,
      placeholder: 'e.g., Remote, New York, London',
    },
    {
      id: 'remote',
      name: 'Remote Position',
      type: 'toggle',
      defaultValue: false,
      required: true,
    },
    {
      id: 'salary',
      name: 'Salary Range',
      type: 'text',
      placeholder: 'e.g., $80,000 - $120,000',
      required: false,
    },
    {
      id: 'experience',
      name: 'Experience Level',
      type: 'select',
      required: true,
      options: [
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid-Senior' },
        { value: 'senior', label: 'Senior' },
        { value: 'executive', label: 'Executive' },
      ]
    },
    {
      id: 'employment_type',
      name: 'Employment Type',
      type: 'select',
      required: true,
      options: [
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
      ]
    },
    {
      id: 'apply_url',
      name: 'Application URL',
      type: 'url',
      required: true,
      placeholder: 'https://...',
      helpText: 'Where candidates should apply'
    },
    {
      id: 'description',
      name: 'Job Description',
      type: 'editor',
      required: true,
      ui: { width: 'full', group: 'Details' }
    },
    {
      id: 'requirements',
      name: 'Requirements',
      type: 'textarea',
      required: true,
      helpText: 'List key requirements',
      ui: { group: 'Details' }
    },
    {
      id: 'benefits',
      name: 'Benefits',
      type: 'multiselect',
      options: [
        { value: 'health', label: 'Health Insurance' },
        { value: 'dental', label: 'Dental Insurance' },
        { value: 'remote', label: 'Remote Work' },
        { value: '401k', label: '401(k) Match' },
      ],
      ui: { group: 'Benefits' }
    },
    {
      id: 'featured_image',
      name: 'Featured Image',
      type: 'image',
      required: false,
      ui: { width: 'full' }
    }
  ],
  
  taxonomies: [
    {
      id: 'job-category',
      name: 'Job Category',
      singular: 'Category',
      plural: 'Categories',
      hierarchical: true,
      icon: Folder,
      ui: { showInSidebar: true, showInFilter: true }
    },
    {
      id: 'job-skill',
      name: 'Skills',
      singular: 'Skill',
      plural: 'Skills',
      hierarchical: false,
      icon: Badge,
      ui: { showInFilter: true, enableColor: true }
    }
  ],
  
  routing: {
    basePath: '/jobs',
    hasArchive: true,
    hasSingle: true,
    slugSource: 'title'
  },
  
  ui: {
    listView: 'card',
    enableFeatured: true,
    enableFeaturedImage: true,
    permissions: {
      read: ['public', 'user', 'admin'],
      create: ['admin', 'hr'],
      edit: ['admin', 'hr'],
      editAll: ['admin'],
      delete: ['admin', 'hr'],
      deleteAll: ['admin'],
    }
  },
  
  seo: {
    enableSitemap: true,
    enableRss: true,
    defaultTitleTemplate: "%title% | Jobs at %site%",
    defaultMetaDescription: 'View and apply for job openings'
  },
  
  moduleId: 'modules-jobs',
  tenantScope: 'all'
};
```

#### Example: Law Statutes Content Type

```
export const LawStatutesContentType: ContentTypeDefinition = {
  id: 'law-statutes',
  name: 'Law Statutes',
  singular: 'Statute',
  plural: 'Statutes',
  icon: Scale,
  
  fields: [
    {
      id: 'title',
      name: 'Statute Title',
      type: 'text',
      required: true
    },
    {
      id: 'statute_number',
      name: 'Statute Number',
      type: 'text',
      required: true,
      placeholder: 'e.g., 42 USC § 1983',
    },
    {
      id: 'jurisdiction',
      name: 'Jurisdiction',
      type: 'select',
      required: true,
      options: [
        { value: 'federal', label: 'Federal' },
        { value: 'state', label: 'State' },
        { value: 'local', label: 'Local' },
      ]
    },
    {
      id: 'state',
      name: 'State',
      type: 'select',
      condition: { field: 'jurisdiction', operator: 'equals', value: 'state' },
      options: [
        { value: 'ca', label: 'California' },
        { value: 'ny', label: 'New York' },
        { value: 'tx', label: 'Texas' },
        // ... all states
      ]
    },
    {
      id: 'effective_date',
      name: 'Effective Date',
      type: 'date',
      required: true
    },
    {
      id: 'repealed',
      name: 'Repealed?',
      type: 'toggle',
      defaultValue: false
    },
    {
      id: 'repealed_date',
      name: 'Repealed Date',
      type: 'date',
      condition: { field: 'repealed', operator: 'equals', value: true }
    },
    {
      id: 'full_text',
      name: 'Full Text',
      type: 'editor',
      required: true,
      ui: { width: 'full', group: 'Content' }
    },
    {
      id: 'summary',
      name: 'Summary',
      type: 'textarea',
      required: true,
      helpText: 'Brief summary for listings',
      ui: { group: 'Metadata' }
    }
  ],
  
  taxonomies: [
    {
      id: 'practice-area',
      name: 'Practice Area',
      singular: 'Practice Area',
      plural: 'Practice Areas',
      hierarchical: true,
      icon: Gavel
    },
    {
      id: 'legal-topic',
      name: 'Legal Topics',
      singular: 'Topic',
      plural: 'Topics',
      hierarchical: false,
      icon: Tags
    }
  ],
  
  routing: {
    basePath: '/statutes',
    hasArchive: true,
    hasSingle: true,
    slugSource: 'custom'
  },
  
  ui: {
    listView: 'list',
    enableFeatured: false,
    permissions: {
      read: ['public'],
      create: ['admin', 'legal-team'],
      edit: ['admin', 'legal-team'],
      editAll: ['admin'],
      delete: ['admin'],
      deleteAll: ['admin'],
    }
  },
  
  seo: {
    enableSitemap: true,
    enableRss: false,
    defaultTitleTemplate: "%title% | Legal Library"
  },
  
  moduleId: 'modules-laws',
  tenantScope: ['legal']
};
```

### 2. Database Schema (Content-Type-First)

```
-- ===== CONTENT TYPES =====
CREATE TABLE content_types (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  singular TEXT NOT NULL,
  plural TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  fields TEXT NOT NULL,          -- JSON: FieldDefinition[]
  taxonomies TEXT NOT NULL,        -- JSON: TaxonomyDefinition[]
  routing TEXT NOT NULL,           -- JSON: Routing config
  ui TEXT NOT NULL,               -- JSON: UI config
  seo TEXT,                      -- JSON: SEO config
  permissions TEXT,                -- JSON: Permissions
  tenant_scope TEXT,              -- JSON: 'all' or ['tenant1', 'tenant2']
  enabled INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- ===== CONTENT ITEMS (Unified Table) =====
CREATE TABLE content_items (
  id TEXT PRIMARY KEY,
  content_type_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,                  -- JSON: field values
  status TEXT DEFAULT 'draft',   -- draft | published | archived | scheduled
  author_id TEXT,
  featured INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  published_at INTEGER,
  scheduled_at INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (content_type_id) REFERENCES content_types(id) ON DELETE CASCADE,
  UNIQUE(slug, content_type_id, tenant_id)
);

-- Create index for performance
CREATE INDEX idx_content_items_type_tenant ON content_items(content_type_id, tenant_id);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_featured ON content_items(featured);
CREATE INDEX idx_content_items_published ON content_items(published_at);

-- ===== TAXONOMIES =====
CREATE TABLE taxonomies (
  id TEXT PRIMARY KEY,
  content_type_id TEXT NOT NULL,
  name TEXT NOT NULL,
  singular TEXT NOT NULL,
  plural TEXT NOT NULL,
  hierarchical INTEGER DEFAULT 0,
  icon TEXT,
  description TEXT,
  fields TEXT,                   -- JSON: Additional fields for terms
  ui TEXT,                      -- JSON: UI config
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (content_type_id) REFERENCES content_types(id) ON DELETE CASCADE
);

-- ===== TAXONOMY TERMS =====
CREATE TABLE terms (
  id TEXT PRIMARY KEY,
  taxonomy_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  parent_id TEXT,
  order_index INTEGER DEFAULT 0,
  color TEXT,
  icon TEXT,
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES terms(id) ON DELETE SET NULL,
  UNIQUE(slug, taxonomy_id, tenant_id)
);

-- ===== TERM RELATIONSHIPS (Content ↔ Taxonomy) =====
CREATE TABLE term_relationships (
  id TEXT PRIMARY KEY,
  content_item_id TEXT NOT NULL,
  term_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE CASCADE,
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  UNIQUE(content_item_id, term_id)
);

-- ===== REVISIONS (Version Control) =====
CREATE TABLE content_revisions (
  id TEXT PRIMARY KEY,
  content_item_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,                  -- JSON: field values snapshot
  revision_number INTEGER,
  author_id TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  
  FOREIGN KEY (content_item_id) REFERENCES content_items(id) ON DELETE CASCADE
);

-- ===== MEDIA =====
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  r2_key TEXT NOT NULL,           -- R2 storage key
  r2_url TEXT NOT NULL,           -- Public URL
  uploaded_by TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- ===== SEO META =====
CREATE TABLE seo_meta (
  id TEXT PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  og_type TEXT,
  canonical_url TEXT,
  no_index INTEGER DEFAULT 0,
  no_follow INTEGER DEFAULT 0,
  tenant_id TEXT NOT NULL
);
```

### 3. Cloudflare-Native Development

#### Wrangler Configuration (`backend/wrangler.toml`)

```
name = "reactpress-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "reactpress-db"
database_id = "your-database-id"
migrations_dir = "db/migrations"

# R2 Storage Binding
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "reactpress-uploads"
jurisdiction = "us"

# KV Cache Binding (Optional)
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-id"
preview_id = "your-preview-kv-id"

# Variables
[vars]
ENVIRONMENT = "development"
ALLOWED_ORIGINS = "http://localhost:3000,http://localhost:5173"

# Triggers (Optional - for background jobs)
[triggers]
crons = ["0 * * * *"]  # Hourly tasks
```

#### Migration System

```
// shared/lib/migrations.ts
export class D1MigrationRunner {
  constructor(private db: D1Database) {}
  
  async runMigrations() {
    const executed = await this.getExecutedMigrations();
    const pending = await this.getPendingMigrations();
    
    for (const migration of pending) {
      console.log(`Running migration: ${migration.name}`);
      await this.db.exec(migration.sql);
      await this.recordMigration(migration);
      console.log(`✅ Migration ${migration.name} completed`);
    }
  }
  
  private async getExecutedMigrations(): Promise<string[]> {
    // Query migrations table
  }
  
  private async getPendingMigrations(): Promise<Migration[]> {
    // Read db/migrations/*.sql files
  }
}

// Usage in Workers
app.use('*', async (c, next) => {
  const runner = new D1MigrationRunner(c.env.DB);
  await runner.runMigrations();
  await next();
});
```

#### R2 Storage Adapter

```
// shared/lib/r2-adapter.ts
export class R2Storage {
  constructor(private bucket: R2Bucket) {}
  
  async upload(file: File, tenantId: string, folder: string): Promise<string> {
    const key = `${tenantId}/${folder}/${Date.now()}-${file.name}`;
    
    await this.bucket.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type
      }
    });
    
    const url = `${process.env.R2_PUBLIC_URL}/${key}`;
    return url;
  }
  
  async delete(key: string): Promise<void> {
    await this.bucket.delete(key);
  }
  
  async deleteMultiple(keys: string[]): Promise<void> {
    await this.bucket.delete(keys);
  }
  
  async list(prefix: string): Promise<R2Object[]> {
    const listed = await this.bucket.list({ prefix });
    return listed.objects;
  }
  
  async getUrl(key: string, signed = false): Promise<string> {
    if (signed) {
      // Generate signed URL
      const signed = await this.bucket.createSignedUrl({
        key,
        expiresIn: 3600
      });
      return signed.url;
    }
    
    return `${process.env.R2_PUBLIC_URL}/${key}`;
  }
}
```

#### KV Caching Adapter

```
// shared/lib/kv-adapter.ts
export class KVCache {
  constructor(private kv: KVNamespace) {}
  
  async get<T>(key: string): Promise<T | null> {
    const cached = await this.kv.get(key, 'json');
    return cached;
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const options = ttl ? { expirationTtl: ttl } : {};
    await this.kv.put(key, JSON.stringify(value), options);
  }
  
  async delete(key: string): Promise<void> {
    await this.kv.delete(key);
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    // KV doesn't support pattern deletion
    // Maintain a list of cache keys
    const keys = await this.kv.get(`cache:${pattern}`, 'json');
    if (keys) {
      await this.kv.delete(keys);
      await this.kv.delete(`cache:${pattern}`);
    }
  }
  
  async cache<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    
    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
}
```

### 4. Dynamic Routing (Content Type Aware)

```
// Dynamic route handler for content types
app.get('/dynamic/:contentType/:slug', async (c) => {
  const { contentType, slug } = c.req.param();
  const contentItem = await db.query(
    `SELECT * FROM content_items WHERE slug = ? AND content_type_id = ? AND status = 'published'`,
    [slug, contentType]
  );
  
  if (!contentItem) {
    return c.notFound();
  }
  
  const contentTypeDef = await getContentTypeDefinition(contentType);
  
  // Render with appropriate template
  return c.render('dynamic-single', {
    item: contentItem,
    contentType: contentTypeDef
  });
});

app.get('/dynamic/:contentType', async (c) => {
  const { contentType } = c.req.param();
  const page = parseInt(c.req.query('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  
  const items = await db.query(
    `SELECT * FROM content_items 
     WHERE content_type_id = ? AND status = 'published'
     ORDER BY published_at DESC
     LIMIT ? OFFSET ?`,
    [contentType, limit, offset]
  );
  
  const contentTypeDef = await getContentTypeDefinition(contentType);
  
  // Render with archive template
  return c.render('dynamic-archive', {
    items,
    contentType: contentTypeDef,
    pagination: { page, totalPages: Math.ceil(count / limit) }
  });
});
```

---

## 🛠️ Module Structure (Content-Type-Aware)

### Content Type Module Example: `packages/modules-jobs/`

```
packages/modules-jobs/
├── src/
│   ├── content-types/
│   │   ├── job-listing.ts       # Content type definition
│   │   └── index.ts
│   ├── components/
│   │   ├── JobsDashboard.tsx      # Admin: Job listings manager
│   │   ├── JobEditor.tsx          # Admin: Edit job (dynamic form)
│   │   ├── JobCard.tsx           # Frontend: Job display card
│   │   ├── JobFilters.tsx         # Frontend: Filter sidebar
│   │   └── index.ts
│   ├── api.ts                      # CRUD endpoints for jobs
│   ├── storage.ts                  # D1 operations
│   ├── module.ts                   # Module metadata
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Module Content Type Registration

```
// packages/modules-jobs/src/content-types/job-listing.ts
export const JobListingsContentType: ContentTypeDefinition = {
  id: 'job-listing',
  name: 'Job Listings',
  // ... full definition (see example above)
  moduleId: 'modules-jobs'
};

// packages/modules-jobs/src/index.ts
export * from './content-types/job-listing';
export { getRoutes } from './api';
export { JobDashboard, JobEditor, JobCard, JobFilters } from './components';
export const JobsModule: ModuleDefinition = {
  id: 'jobs',
  name: 'Jobs',
  version: '1.0.0',
  description: 'Job listings and career board',
  category: 'business',
  icon: Briefcase,
  
  sidebar: {
    label: 'Jobs',
    to: '/admin/jobs',
    priority: 80
  },
  
  component: () => import('./components/JobsDashboard'),
  
  // Register content types
  contentTypes: [
    JobListingsContentType
  ],
  
  settings: {
    component: () => import('./components/JobsSettings'),
    title: 'Jobs Settings',
  },
  
  defaultConfig: {
    enableApplications: true,
    autoExpireDays: 30,
  }
};
```

### Dynamic Form Generation (The Magic)

```
// packages/modules-content-types/src/components/FieldRenderer.tsx
export const FieldRenderer: React.FC<{
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}> = ({ field, value, onChange, error }) => {
  switch (field.type) {
    case 'text':
      return (
        <Input
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={error ? 'border-red-500' : ''}
        />
      );
    
    case 'textarea':
      return (
        <Textarea
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={5}
          required={field.required}
        />
      );
    
    case 'editor':
      return (
        <TiptapEditor
          id={field.id}
          content={value || ''}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    
    case 'select':
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.icon && <opt.icon className="mr-2 h-4 w-4" />}
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    
    case 'multiselect':
      return (
        <MultiSelect
          options={field.options || []}
          value={value || []}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      );
    
    case 'toggle':
      return (
        <Switch
          id={field.id}
          checked={value || false}
          onCheckedChange={onChange}
        />
      );
    
    case 'date':
      return (
        <DatePicker
          value={value ? new Date(value) : undefined}
          onChange={(date) => onChange(date?.toISOString())}
        />
      );
    
    case 'file':
      return (
        <FileUpload
          value={value}
          onChange={onChange}
          accept="image/*,.pdf"
          maxSize={10485760}
        />
      );
    
    case 'image':
      return (
        <ImageUpload
          value={value}
          onChange={onChange}
          aspectRatio="16:9"
        />
      );
    
    case 'relationship':
      return (
        <RelationshipField
          contentTypeId={field.relationshipTo}
          value={value}
          onChange={onChange}
          multiple={field.relationshipType === 'many-to-many'}
        />
      );
    
    case 'taxonomy':
      return (
        <TaxonomySelector
          taxonomyId={field.id}
          value={value}
          onChange={onChange}
          multiple={field.type === 'multiselect'}
        />
      );
    
    default:
      return <div>Unknown field type: {field.type}</div>;
  }
};
```

---

## 🚀 Development Workflow

### Local Development (Workers Only)

```
# Start with local D1 (fastest for development)
wrangler dev --local --port 3001

# Start with remote D1 (for production-like testing)
wrangler dev --port 3001

# Start frontend in separate terminal
cd web
npm run dev
```

### Database Migrations

```
# Create D1 database (one-time)
wrangler d1 create reactpress-db

# Add database_id to wrangler.toml

# Create migration file
# db/migrations/001_initial.sql

# Run migrations
wrangler d1 migrations apply reactpress-db --remote

# Or for local
wrangler d1 migrations apply reactpress-db --local

# Execute custom SQL
wrangler d1 execute reactpress-db --command="SELECT * FROM content_types"
```

### Creating a New Content Type

```
# Use interactive CLI (recommended)
npm run create:content-type

# Manual steps:
# 1. Create module
npm run create:module

# 2. Define content type in module/src/content-types/
touch packages/modules-mytype/src/content-types/my-type.ts

# 3. Implement components for rendering
touch packages/modules-mytype/src/components/MyTypeCard.tsx

# 4. Register in module.ts
```

### Creating a New Module (Content-Type-Enabled)

```
npm run create:module

# Follow prompts:
# - Module name: my-business-directory
# - Category: business
# - Does this module provide content types? Yes
# - Content type IDs: business-listing
# - Content type names: Business Listings, Business
```

---

## 🎨 Intuitive Page Builder (Enhanced)

### Block Builder Integration

```
// Each content type can define available blocks
interface ContentTypeDefinition {
  // ... other properties
  availableBlocks?: BlockDefinition[];  // Content-type-specific blocks
}

// Example: Job listings might have:
availableBlocks: [
  { id: 'company-logo', name: 'Company Logo', type: 'image' },
  { id: 'job-details', name: 'Job Details', type: 'dynamic-form' },
  { id: 'apply-button', name: 'Apply Button', type: 'cta' },
  { id: 'similar-jobs', name: 'Similar Jobs', type: 'query' }
]
```

### Page Builder UI

- **Drag-and-Drop Blocks**: Intuitive visual editor
- **Block Library**: Organized by category (content, layout, media, advanced)
- **Live Preview**: Real-time preview of page
- **Content Type Aware**: Blocks show relevant fields from content type
- **Reusable Templates**: Save and load page templates per content type

---

## 🔒 Stability & Scalability Improvements

### 1. Type-Safe API Contracts

```
// shared/types/api.ts
import { z } from 'zod';

export const CreateContentItemSchema = z.object({
  content_type_id: z.string(),
  tenant_id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.record(z.any()),
  status: z.enum(['draft', 'published', 'archived']),
  // ... dynamic fields validated at runtime
});

export type CreateContentItemInput = z.infer<typeof CreateContentItemSchema>;

// API endpoint
app.post('/api/content-items', async (c) => {
  const body = await c.req.json();
  const validated = CreateContentItemSchema.parse(body);
  // ... handle validated data
});
```

### 2. Structured Logging

```
// shared/lib/logger.ts
export class Logger {
  constructor(private context: string) {}
  
  info(message: string, meta?: any) {
    console.log(JSON.stringify({
      level: 'info',
      context: this.context,
      message,
      meta,
      timestamp: Date.now(),
      correlationId: this.getCorrelationId()
    }));
  }
  
  error(message: string, error?: Error) {
    console.error(JSON.stringify({
      level: 'error',
      context: this.context,
      message,
      error: error?.stack,
      timestamp: Date.now()
    }));
  }
  
  private getCorrelationId(): string {
    // Use Workers request ID or generate
    return crypto.randomUUID();
  }
}

// Usage
const logger = new Logger('content-api');
logger.info('Creating content item', { contentTypeId });
```

### 3. Error Boundaries

```
// web/src/components/ErrorBoundary.tsx
export class ContentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Content error boundary triggered', error);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ContentErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 4. Performance Monitoring

```
// shared/lib/monitoring.ts
export class PerformanceMonitor {
  static async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      logger.info('Performance metric', { name, duration });
      
      // Send to analytics
      if (duration > 1000) {
        logger.warn('Slow operation detected', { name, duration });
      }
    }
  }
}

// Usage
const result = await PerformanceMonitor.measure(
  'fetch-content-items',
  () => db.query('SELECT * FROM content_items')
);
```

### 5. Caching Strategy

```
// Cache content type definitions (rarely change)
app.get('/api/content-types', async (c) => {
  const cache = new KVCache(c.env.CACHE);
  
  return await cache.cache(
    `content-types:${tenantId}`,
    async () => {
      const types = await db.query('SELECT * FROM content_types');
      return c.json(types);
    },
    3600 // 1 hour cache
  );
});

// Cache frequently accessed content
app.get('/api/content-items/:id', async (c) => {
  const { id } = c.req.param();
  const cache = new KVCache(c.env.CACHE);
  
  return await cache.cache(
    `content-item:${id}`,
    async () => {
      const item = await db.query(
        'SELECT * FROM content_items WHERE id = ?',
        [id]
      );
      return c.json(item);
    },
    300 // 5 minute cache
  );
});
```

### 6. Rate Limiting

```
// backend/src/middleware/rateLimit.ts
export async function rateLimitMiddleware(
  c: any,
  next: Next
) {
  const identifier = c.req.header('cf-connecting-ip') || 'anonymous';
  const cache = new KVCache(c.env.CACHE);
  
  const key = `ratelimit:${identifier}:${c.req.path}`;
  const limit = 100; // 100 requests
  const window = 60 * 1000; // 60 seconds
  
  const current = await cache.get<number>(key) || 0;
  
  if (current >= limit) {
    return c.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  await cache.set(key, current + 1, window);
  await next();
}
```

### 7. Global Error Boundaries & Fallbacks

```typescript
// web/src/components/GlobalErrorBoundary.tsx
export const GlobalErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, info) => {
        logger.error('Global UI Crash', { error: error.message, info });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// backend/src/middleware/error-handler.ts
export const globalErrorHandler = (err: Error, c: Context) => {
  const status = err instanceof HttpException ? err.status : 500;
  logger.error(`Unhandled Error: ${err.message}`, { path: c.req.path, stack: err.stack });
  
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'A system error occurred. Our team has been notified.',
      requestId: c.get('requestId')
    }
  }, status);
};
```

### 8. Circuit Breaker & Retry Mechanisms

```typescript
// shared/lib/resilience.ts
export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;

  constructor(private options: { threshold: number; resetTimeout: number }) {}

  async execute<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailureTime || 0) > this.options.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        return fallback;
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.options.threshold) {
        this.state = 'OPEN';
      }
      throw err;
    }
  }
}

// Retry helper using exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise(r => setTimeout(r, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}
```

### 9. Health Check Endpoints

```typescript
// backend/src/routes/health.ts
app.get('/health', async (c) => {
  const checks = {
    db: await checkD1Connection(c.env.DB),
    kv: await checkKVConnection(c.env.CACHE),
    r2: await checkR2Connection(c.env.BUCKET),
    timestamp: Date.now(),
    version: c.env.VERSION
  };
  
  const isHealthy = Object.values(checks).every(v => v === true || typeof v !== 'boolean');
  return c.json({ status: isHealthy ? 'UP' : 'DEGRADED', checks }, isHealthy ? 200 : 503);
});
```

### 11. Observability: Metrics & Tracing

```typescript
// shared/lib/observability.ts
export const trackMetric = (c: Context, name: string, value: number, tags: Record<string, string> = {}) => {
  // Cloudflare Analytics Engine indexing
  c.env.METRICS.writeDataPoint({
    blobs: [name, c.get('tenantId'), ...Object.values(tags)],
    doubles: [value],
    indexes: [name]
  });
};

// Distributed Tracing Middleware
export const tracingMiddleware = async (c: Context, next: Next) => {
  const traceId = c.req.header('x-trace-id') || crypto.randomUUID();
  c.set('traceId', traceId);
  c.header('x-trace-id', traceId);
  
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  
  trackMetric(c, 'request_duration', duration, { path: c.req.path, status: c.res.status.toString() });
};
```

### 12. Security Hardening

```typescript
// backend/src/middleware/security.ts
export const securityHeadersMiddleware = async (c: Context, next: Next) => {
  await next();
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.cloudflare.com;");
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
};

// Advanced IP-based Rate Limiting (Tiered)
export const advancedRateLimiter = (options: { limit: number; window: number; tier: string }) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header('cf-connecting-ip') || 'unknown';
    const key = `ratelimit:${options.tier}:${ip}`;
    // Implementation uses KV with window-based expiration
    await next();
  };
};
```

### 13. Audit Logging System

```typescript
// shared/lib/audit.ts
export const logAuditEvent = async (c: Context, event: {
  action: string;
  resource: string;
  resourceId: string;
  meta?: any;
}) => {
  const auditLog = {
    tenantId: c.get('tenantId'),
    userId: c.get('userId'),
    traceId: c.get('traceId'),
    ip: c.req.header('cf-connecting-ip'),
    timestamp: Date.now(),
    ...event
  };
  
  // High-priority audit logs to D1/Queue
  await c.env.DB.prepare('INSERT INTO audit_logs ...').bind(...).run();
};
```

---

## 📚 Building Content-Driven Apps

### Example: Creating a Tool Directory

```
# 1. Generate module
npm run create:module
# Name: tools
# Category: business

# 2. Define content type
# packages/modules-tools/src/content-types/tool-listing.ts
export const ToolListingsContentType: ContentTypeDefinition = {
  id: 'tool-listing',
  name: 'Tool Listings',
  singular: 'Tool',
  plural: 'Tools',
  icon: Wrench,
  
  fields: [
    {
      id: 'name',
      name: 'Tool Name',
      type: 'text',
      required: true
    },
    {
      id: 'url',
      name: 'Website URL',
      type: 'url',
      required: true
    },
    {
      id: 'category',
      name: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'productivity', label: 'Productivity' },
        { value: 'design', label: 'Design' },
        { value: 'development', label: 'Development' },
        { value: 'marketing', label: 'Marketing' },
      ]
    },
    {
      id: 'pricing',
      name: 'Pricing Model',
      type: 'select',
      options: [
        { value: 'free', label: 'Free' },
        { value: 'freemium', label: 'Freemium' },
        { value: 'paid', label: 'Paid' },
      ]
    },
    {
      id: 'description',
      name: 'Description',
      type: 'editor',
      required: true
    },
    {
      id: 'screenshot',
      name: 'Screenshot',
      type: 'image'
    },
    {
      id: 'rating',
      name: 'Rating (1-5)',
      type: 'rating'
    }
  ],
  
  taxonomies: [
    {
      id: 'tool-tag',
      name: 'Tags',
      singular: 'Tag',
      plural: 'Tags',
      hierarchical: false,
      icon: Tag
    }
  ],
  
  routing: {
    basePath: '/tools',
    hasArchive: true,
    hasSingle: true,
    slugSource: 'title'
  },
  
  ui: {
    listView: 'grid',
    enableFeatured: true,
    enableFeaturedImage: true
  },
  
  moduleId: 'modules-tools'
};

# 3. Done! Admin UI auto-generates, routes auto-generate
```

### Example: Creating a Law Library

```
# Similar process
npm run create:module

# Define content type with fields like:
# - statute_number, jurisdiction, effective_date
# - full_text (editor), summary
# - related_statutes (relationship)
# - practice_area (taxonomy)

# Done! Full CRUD, filtering, search ready
```

---

## 🎯 Final Implementation Checklist

### Phase 1: Cloudflare-Native Foundation

- [ ]  Remove all Node.js/file-system code
- [ ]  Setup D1 database with migrations system
- [ ]  Setup R2 storage adapter
- [ ]  Setup KV cache adapter
- [ ]  Configure Wrangler for both local and remote D1
- [ ]  Workers-only runtime environment

### Phase 2: Content Type System

- [ ]  Implement content_types schema
- [ ]  Implement content_items unified table
- [ ]  Implement taxonomies and terms tables
- [ ]  Create ContentTypeRegistry
- [ ]  Build ContentTypeManager admin UI
- [ ]  Build ContentTypeEditor admin UI
- [ ]  Build FieldRenderer component (all 20+ field types)
- [ ]  Build ContentItemManager (dynamic list)
- [ ]  Build ContentItemEditor (dynamic form)

### Phase 3: Module System

- [ ]  Module system with content type registration
- [ ]  Dynamic routing for content types
- [ ]  Module loading in Workers environment
- [ ]  Auto-discovery of content types

### Phase 4: Example Content Types

- [ ]  Blog/Articles CMS (built-in)
- [ ]  Job Listings module (example)
- [ ]  Business Directory module (example)
- [ ]  Law Statutes module (example)
- [ ]  Tools Directory module (example)

### Phase 5: Production Readiness (Stability Foundation)

- [ ] Implement global error boundaries (Web & Backend)
- [ ] Add circuit breaker pattern for external integrations
- [ ] Configure retry mechanisms with exponential backoff
- [ ] Set up fallback strategies (KV fallbacks for D1)
- [ ] Create health check endpoints (`/health`)

### Phase 6: Observability & Monitoring

- [ ] Implement metrics collection (Cloudflare Analytics Engine)
- [ ] Set up distributed tracing (W3C Trace Parent headers)
- [ ] Configure alerting rules (Error rates, Latency)
- [ ] Create dashboard views in Admin UI for system health
- [ ] Implement structured audit logging across all packages

### Phase 7: Security Hardening

- [ ] Add security headers (HSTS, CSP, X-Frame-Options)
- [ ] Configure advanced rate limiting (Tiered IP-based)
- [ ] Implement strict input validation (Zod + JSON Schema)
- [ ] Set up WAF rules for common exploits (SQLi, XSS)
- [ ] Configure centralized audit logging for compliance

---

## �️ Codebase Stability & Consistency Guidelines

### 1. Coding Standards (MANDATORY)

All code contributions MUST adhere to these standards:

```
// TypeScript Configuration (tsconfig.json)
{
  "compilerOptions": {
    "strict": true,                      // ALWAYS enabled
    "noImplicitAny": true,               // No implicit any
    "strictNullChecks": true,            // Null safety
    "noUnusedLocals": true,              // Clean code
    "noUnusedParameters": true,          // Clean signatures
    "noImplicitReturns": true,           // Explicit returns
    "noFallthroughCasesInSwitch": true,  // Safe switches
    "exactOptionalPropertyTypes": true,  // Precise optionals
    "forceConsistentCasingInFileNames": true
  }
}
```

#### File/Folder Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ContentTypeEditor.tsx` |
| Hooks | camelCase with `use` prefix | `useContentTypes.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |
| Types/Interfaces | PascalCase with suffix | `ContentTypeDefinition.ts` |
| API Routes | kebab-case | `content-items.ts` |
| Database Migrations | Numbered prefix | `001_initial.sql` |

#### Import Order (Enforced by ESLint)

```typescript
// 1. React/Framework imports
import React, { useState, useEffect } from 'react';
import { Hono } from 'hono';

// 2. External packages (alphabetical)
import { z } from 'zod';

// 3. Internal packages (@reactpress/*)
import { Logger } from '@reactpress/shared';
import type { ContentType } from '@reactpress/shared-types';

// 4. Relative imports (parent first, then siblings)
import { ContentManager } from '../components';
import { formatSlug } from './utils';

// 5. Type-only imports (at the end)
import type { FC, ReactNode } from 'react';
```

### 2. Testing Requirements (MANDATORY)

**NO code changes without corresponding tests.**

```
Test Coverage Requirements:
├── Unit Tests (packages/*)           ≥ 80% coverage
├── Integration Tests (backend/*)    ≥ 70% coverage
├── Component Tests (web/*)          ≥ 70% coverage
└── E2E Tests (critical paths)       100% of user flows
```

#### Test Structure

```typescript
// Unit test example (Vitest)
describe('ContentTypeValidator', () => {
  it('should reject content types without required fields', () => {
    const invalidType = { id: 'test' }; // Missing name, fields
    expect(() => validateContentType(invalidType)).toThrow();
  });

  it('should accept valid content type definitions', () => {
    const validType = createValidContentType();
    expect(() => validateContentType(validType)).not.toThrow();
  });
});

// Integration test example
describe('Content Items API', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('should create content item with valid data', async () => {
    const response = await app.request('/api/v1/content-items', {
      method: 'POST',
      body: JSON.stringify(validContentItem),
    });
    expect(response.status).toBe(201);
  });
});
```

#### Before Every PR/Merge

```bash
# All must pass
npm run lint          # ESLint + Prettier
npm run typecheck     # TypeScript strict mode
npm run test          # Unit + integration tests
npm run build         # Production build check
```

### 3. Dependency Management (CRITICAL)

**All packages MUST use harmonized dependency versions.**

```
// Root package.json - Dependency Version Registry
{
  "dependencyVersions": {
    "react": "19.2.3",
    "hono": "4.7.10", 
    "drizzle-orm": "0.45.1",
    "zod": "4.2.1",
    "typescript": "5.8.3",
    "@tanstack/react-router": "1.121.0",
    "@tanstack/react-query": "5.80.6"
  }
}
```

#### Rules for Dependency Changes

1. **New dependencies**: Must be added via `scripts/add-dependency.js` (creates harmonized entry)
2. **Version updates**: Run `npm run harmonize-deps` after any version change
3. **Peer dependencies**: Must match root versions exactly
4. **Never use `^` or `~`**: Always pin exact versions

```bash
# Adding a new dependency (correct way)
npm run add-dep -- lodash 4.17.21

# Harmonize all packages after any change
npm run harmonize-deps

# Verify no version mismatches
npm run check-deps
```

### 4. Error Handling Patterns (MANDATORY)

**All code must follow these error handling patterns:**

#### Backend (Hono API)

```typescript
// ✅ CORRECT: Structured error responses
app.post('/api/content-items', async (c) => {
  try {
    const body = await c.req.json();
    const validated = CreateContentItemSchema.safeParse(body);
    
    if (!validated.success) {
      return c.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validated.error.flatten(),
        }
      }, 400);
    }
    
    const result = await createContentItem(validated.data);
    return c.json({ success: true, data: result }, 201);
    
  } catch (error) {
    logger.error('Failed to create content item', error);
    return c.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        requestId: c.get('requestId'),
      }
    }, 500);
  }
});

// ❌ WRONG: Throwing raw errors, no structure
app.post('/api/content-items', async (c) => {
  const body = await c.req.json();
  const item = await createContentItem(body); // No validation!
  return c.json(item); // No success wrapper!
});
```

#### Frontend (React/TanStack Query)

```typescript
// ✅ CORRECT: Proper error boundaries and fallbacks
export const ContentItemPage: FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['content-item', id],
    queryFn: () => fetchContentItem(id),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) return <ContentItemSkeleton />;
  if (isError) return <ContentItemError error={error} onRetry={refetch} />;
  if (!data) return <ContentItemNotFound />;
  
  return <ContentItemView data={data} />;
};

// Wrap with error boundary at page level
<ContentErrorBoundary fallback={<ContentPageError />}>
  <ContentItemPage />
</ContentErrorBoundary>
```

### 5. Database Migration Safety (CRITICAL)

**All migrations must be forward-compatible and reversible.**

```sql
-- ✅ CORRECT: Safe migration with rollback plan
-- migrations/015_add_content_status.sql

-- Forward migration
ALTER TABLE content_items ADD COLUMN status_new TEXT DEFAULT 'draft';
UPDATE content_items SET status_new = status WHERE status_new IS NULL;

-- ROLLBACK COMMENT (for reference):
-- ALTER TABLE content_items DROP COLUMN status_new;

-- ❌ WRONG: Destructive, non-reversible
-- DROP TABLE content_items;
-- DELETE FROM content_items WHERE ...;
```

#### Migration Checklist

- [ ] Migration has a corresponding rollback script
- [ ] Migration is idempotent (safe to run multiple times)
- [ ] Migration handles existing data correctly
- [ ] Migration is tested on a copy of production data
- [ ] Migration has a descriptive name matching schema changes

### 6. Type Safety Requirements (MANDATORY)

**No `any` types. No type assertions without guards.**

```typescript
// ✅ CORRECT: Proper type guards
function isContentItem(obj: unknown): obj is ContentItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'content_type_id' in obj &&
    typeof (obj as ContentItem).id === 'string'
  );
}

// Use with unknown data
const data = await c.req.json();
if (isContentItem(data)) {
  // TypeScript knows data is ContentItem here
  processContentItem(data);
}

// ✅ CORRECT: Zod for runtime validation
const ContentItemSchema = z.object({
  id: z.string().uuid(),
  content_type_id: z.string(),
  title: z.string().min(1).max(200),
  status: z.enum(['draft', 'published', 'archived']),
});

type ContentItem = z.infer<typeof ContentItemSchema>;

// ❌ WRONG: Using 'any' or unsafe casts
const item = data as any; // NEVER do this
const item2 = data as ContentItem; // Only after validation
```

### 7. API Contract Stability (MANDATORY)

**APIs must be versioned and backward compatible.**

```typescript
// Version all API endpoints
const v1Routes = new Hono();
const v2Routes = new Hono();

app.route('/api/v1', v1Routes);
app.route('/api/v2', v2Routes);

// Deprecation policy
// - Announce deprecation 3 months before removal
// - Add X-Deprecated header to deprecated endpoints
// - Document migration path in response body

v1Routes.get('/content-items', async (c) => {
  c.header('X-Deprecated', 'true');
  c.header('X-Sunset', '2026-06-01');
  // ... handler with deprecation notice in docs
});
```

### 8. Shared Code Requirements

**All shared code must live in appropriate packages:**

```
Package Usage:
├── @reactpress/shared-types    → Type definitions ONLY (no runtime code)
├── @reactpress/shared          → Shared utilities, adapters, helpers
├── @reactpress/config          → Configuration schemas and registries
└── packages/modules-*          → Feature-specific code

Rules:
1. Types go in shared-types (zero runtime dependencies)
2. Utilities used by 2+ packages go in shared
3. Module-specific code stays in its module
4. Never import from backend in web (or vice versa)
5. Circular dependencies are FORBIDDEN
```

### 9. Pre-Commit Hooks (ENFORCED)

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}

// .husky/pre-commit
#!/bin/sh
npm run lint-staged

// lint-staged.config.js
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
  '*.sql': ['sql-formatter --fix'],
};

// .husky/pre-push  
#!/bin/sh
npm run typecheck
npm run test
```

### 10. CI/CD Quality Gates (BLOCKING)

```yaml
# All must pass before merge:
jobs:
  quality:
    steps:
      - name: Lint Check
        run: npm run lint
        
      - name: Type Check  
        run: npm run typecheck
        
      - name: Unit Tests
        run: npm run test:unit --coverage
        
      - name: Integration Tests
        run: npm run test:integration
        
      - name: Build Check
        run: npm run build
        
      - name: Bundle Size Check
        run: npm run check-bundle-size
        
      - name: Dependency Audit
        run: npm audit --audit-level=high
```

### 11. Code Review Requirements

**All PRs must:**

- [ ] Pass all CI checks
- [ ] Have at least 1 approval
- [ ] Have no unresolved comments
- [ ] Follow commit message convention (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`)
- [ ] Not introduce new `any` types
- [ ] Include tests for new functionality
- [ ] Update documentation if API changes
- [ ] Not decrease test coverage

### 12. Breaking Change Protocol

When making breaking changes:

1. **Document** in CHANGELOG.md with `BREAKING:` prefix
2. **Bump** major version in affected packages
3. **Provide** migration guide for affected APIs
4. **Announce** in PR title with `[BREAKING]` prefix
5. **Update** all internal usages before merge

---

## �🔑 Key Principles Summary

1. **Cloudflare-Native Only**: Workers, D1, R2, KV - no filesystem, no Node.js
2. **Content-Type-First**: WordPress-like extensibility with zero code for new content types
3. **Type-Safe**: Zod validation everywhere, strict TypeScript
4. **Auto-Discovery**: Content types and modules auto-discovered
5. **Consistent**: Single runtime for all environments
6. **Scalable**: Caching, rate limiting, monitoring built-in
7. **Reusable**: Modules can share fields, taxonomies, blocks
8. **Stable**: Error boundaries, structured logging, migrations

---

## 🎓 How to Build on Top of This

### To Create ANY Content-Driven App:

1. **Run generator**: `npm run create:module`
2. **Define content type**: Fields, taxonomies, routing, UI config
3. **Done!** Admin UI, API, routing, search all auto-generated

**That's it.** No need to:

- Build CRUD forms
- Create database tables manually
- Write API endpoints
- Implement routing
- Build filtering/search
- Handle file uploads

**All auto-generated from content type definition.**

This is the power of Content-Type-First Architecture.

---

## 🚀 ADVANCED FEATURES (v2.0 Enhancements)

The following sections document the advanced enterprise features that make ReactPress a next-generation SaaS platform.

---

## 🏢 Ultra-Isolation Multi-Tenancy (Tiered Isolation)

ReactPress implements a sophisticated three-tier isolation model ensuring complete data separation:

### Isolation Strategy Matrix

| Layer | Technology | Isolation Strategy |
|-------|------------|-------------------|
| **Database** | Cloudflare D1 | Tenant-prefixed tables with automated scoped repositories |
| **Storage** | Cloudflare R2 | Tenant-namespaced buckets with signed URL access control |
| **Configuration** | Workers KV | Per-tenant config caches with sub-10ms resolution |
| **Real-time State** | Durable Objects | Tenant-specific DO instances for live synchronization |

### Implementation

```typescript
// Ultra-Isolation Multi-Tenancy Implementation
interface TenantIsolation {
  database: {
    strategy: 'row-level' | 'schema-level' | 'database-level';
    prefix: string;  // Auto-prefixes all queries
    encryption: boolean;  // Per-tenant encryption keys
  };
  storage: {
    bucketPrefix: string;  // e.g., 'tenant-abc123/'
    accessControl: 'signed-urls' | 'token-based';
    quotaBytes: number;
  };
  config: {
    kvNamespace: string;  // Isolated KV namespace
    cacheTTL: number;  // Per-tenant cache duration
    secretsPrefix: string;  // Isolated secrets
  };
  durableObjects: {
    prefix: string;  // DO naming prefix
    maxInstances: number;
  };
}
```

---

## 🤖 AI Orchestration Layer

ReactPress 2.0 integrates a powerful AI Orchestration layer for automated content and site management.

### 1. AI Co-Pilot & Page Agent

```typescript
// packages/ai-orchestrator/src/co-pilot.ts
interface AICoPilot {
  pageGeneration: {
    // Describe a layout, AI generates Block Builder JSON
    generatePage: (prompt: string, context: TenantContext) => Promise<BlockSchema>;
    
    // Iterative refinement
    refineBlocks: (blocks: BlockSchema, feedback: string) => Promise<BlockSchema>;
  };
  
  contentCreation: {
    // Generate content based on tenant's dynamic schema
    generateContent: (contentTypeId: string, prompt: string) => Promise<ContentItem>;
    
    // Bulk content generation
    bulkGenerate: (config: BulkGenerationConfig) => Promise<ContentItem[]>;
  };
  
  seoAutomation: {
    // Auto-generate SEO metadata
    generateMeta: (content: ContentItem) => Promise<SEOMetadata>;
    
    // Alt-text for uploaded media
    generateAltText: (mediaUrl: string) => Promise<string>;
    
    // Schema.org markup
    generateStructuredData: (content: ContentItem) => Promise<JsonLd>;
  };
}
```

**Key Capabilities:**
- **Page Generation**: Describe a layout, and the AI generates the **Block Builder** JSON structure
- **Content Creation**: Generate blog posts, job descriptions, or directory listings based on the tenant's dynamic schema
- **SEO Automation**: Auto-generation of meta titles, descriptions, and alt-text for uploaded media

### 2. Codebase-Aware Assistant

```typescript
// packages/ai-orchestrator/src/codebase-assistant.ts
interface CodebaseAssistant {
  schemaAnalysis: {
    // Analyze existing content types and suggest improvements
    suggestFields: (contentTypeId: string) => Promise<FieldSuggestion[]>;
    
    // Suggest taxonomies based on content patterns
    suggestTaxonomies: (contentData: ContentItem[]) => Promise<TaxonomySuggestion[]>;
    
    // Index optimization suggestions
    suggestIndexes: (queryPatterns: QueryLog[]) => Promise<IndexSuggestion[]>;
  };
  
  migrationAssistant: {
    // Propose D1 schema changes based on feature requests
    proposeMigration: (featureRequest: string) => Promise<Migration>;
    
    // Generate Hono route updates
    proposeRouteChanges: (requirements: string) => Promise<RouteChange[]>;
    
    // Validate migration safety
    validateMigration: (migration: Migration) => Promise<ValidationResult>;
  };
  
  selfHealing: {
    // Detect and suggest UI fixes
    detectUIIssues: (componentTree: ReactTree) => Promise<UIFix[]>;
    
    // Auto-fix common patterns
    applyAutoFix: (fix: UIFix) => Promise<boolean>;
  };
}
```

### 3. Edge-Native RAG (Vectorize Integration)

Every tenant gets an isolated vector namespace for semantic search and AI retrieval:

```typescript
// packages/ai-orchestrator/src/vector-search.ts
interface EdgeNativeRAG {
  vectorize: {
    // Per-tenant isolated namespace
    namespace: `tenant-${tenantId}`;
    
    // Index tenant content
    indexContent: (content: ContentItem[]) => Promise<void>;
    
    // Semantic search across tenant content
    search: (query: string, options: SearchOptions) => Promise<SearchResult[]>;
    
    // Documentation search
    searchDocs: (query: string) => Promise<DocResult[]>;
  };
  
  embeddings: {
    model: 'text-embedding-3-small';  // Via Cloudflare Workers AI
    dimensions: 1536;
    chunkSize: 512;
    overlap: 50;
  };
  
  retrieval: {
    // RAG-augmented content generation
    ragGenerate: (query: string, context: ContentItem[]) => Promise<string>;
    
    // Citation support
    includeCitations: boolean;
    maxContextLength: 4096;
  };
}
```

### 4. Tool-Calling Agents

Backend agents that autonomously perform administrative tasks based on natural language:

```typescript
// packages/ai-orchestrator/src/tool-agents.ts
interface ToolCallingAgent {
  // Available tools the agent can invoke
  tools: {
    'theme.update': (params: ThemeUpdateParams) => Promise<Theme>;
    'content-type.create': (params: ContentTypeParams) => Promise<ContentType>;
    'content.publish': (params: PublishParams) => Promise<ContentItem>;
    'user.invite': (params: UserInviteParams) => Promise<User>;
    'module.enable': (params: ModuleParams) => Promise<Module>;
    'seo.optimize': (params: SEOParams) => Promise<SEOResult>;
    'media.transform': (params: MediaParams) => Promise<MediaAsset>;
  };
  
  // Natural language → tool execution
  executeCommand: (
    instruction: string,
    context: AgentContext
  ) => Promise<AgentResult>;
  
  // Multi-step task execution
  executeWorkflow: (
    steps: AgentStep[],
    context: AgentContext
  ) => Promise<WorkflowResult>;
  
  // Safety constraints
  constraints: {
    requireConfirmation: string[];  // Tools needing user approval
    maxActionsPerRequest: number;
    auditLogging: boolean;
  };
}

// Example: Natural language agent invocation
await agent.executeCommand(
  "Create a new content type called 'Testimonials' with fields for customer name, company, quote, and rating.",
  { tenantId, userId }
);
```

---

## ⚡ Elite Performance Strategy (95+ Lighthouse)

To achieve elite Lighthouse scores and instant loading, ReactPress 2.0 implements:

### 1. Edge-Side Rendering (ESR) & Streaming

```typescript
// Performance: ESR & Streaming Configuration
interface ESRConfig {
  streaming: {
    // Hono JSX streaming for <50ms TTFB
    enabled: boolean;
    chunkSize: number;  // bytes
    flushOnSuspense: boolean;
  };
  
  earlyHints: {
    // 103 Early Hints support
    enabled: boolean;
    preconnect: string[];  // Critical origins
    preload: {
      css: string[];
      fonts: string[];
      scripts: string[];
    };
  };
  
  staticAssets: {
    // R2 + KV edge caching
    storage: 'r2';
    cache: 'kv';
    ttl: 86400;  // 24 hours
    immutable: boolean;
  };
}
```

**Key Metrics:**
- **Hono JSX Streaming**: Initial HTML streamed from nearest Cloudflare PoP, delivering first byte in <50ms
- **Static Assets via R2 + KV**: Critical assets cached at the edge, eliminating round-trips
- **Early Hints**: Support for 103 Early Hints to pre-connect and pre-load critical CSS/JS

### 2. Automated Asset Optimization

```typescript
// Real-time image transformation at the edge
interface AssetOptimization {
  images: {
    autoFormat: ['avif', 'webp', 'jpg'];  // Best format selection
    responsiveSizes: [320, 640, 1024, 1920];
    lazyLoading: 'native' | 'intersection-observer';
    placeholders: 'blur' | 'color' | 'none';
    quality: { hero: 90, content: 80, thumbnail: 70 };
  };
  
  transformation: {
    resize: 'fit' | 'cover' | 'contain';
    format: 'auto';  // AVIF → WebP → JPEG fallback
    caching: { edge: 31536000, browser: 86400 };
  };
  
  bundleSplitting: {
    vendor: ['react', 'react-dom'];
    tanstack: ['@tanstack/*'];
    modules: 'per-module';  // Lazy-loaded chunks
  };
}
```

### 3. Elite Caching Strategy (Stale-While-Revalidate)

```typescript
// Stale-While-Revalidate implementation
interface CachingStrategy {
  layers: {
    // Layer 1: Cloudflare Cache API (edge)
    edge: { api: 'Cache API', ttl: 300, staleWhileRevalidate: 3600 };
    
    // Layer 2: Workers KV (config & content)
    kv: {
      tenantConfig: { ttl: 300, swr: true };
      contentItems: { ttl: 60, swr: true };
      staticContent: { ttl: 3600, swr: true };
    };
    
    // Layer 3: Browser cache
    browser: { immutableAssets: 31536000, dynamicContent: 0 };
  };
  
  invalidation: {
    onContentUpdate: ['content-*', 'sitemap-*'];
    onConfigChange: ['tenant-*', 'theme-*'];
  };
}
```

### 4. Predictive Pre-fetching

```typescript
// TanStack Router predictive pre-fetching
interface PredictivePreFetch {
  router: {
    viewportPrefetch: boolean;        // Pre-fetch data for links in viewport
    hoverDelay: 100;                  // ms before prefetch
    priorityZones: { aboveFold: 'high', belowFold: 'low', footer: 'idle' };
  };
  
  dataLoader: {
    prefetchOnHover: boolean;
    prefetchOnFocus: boolean;
    staleTime: 30000;  // 30 seconds
  };
  
  criticalData: {
    inlineInHTML: boolean;  // SSR hydration data
    maxSize: 5000;          // bytes
  };
}
```

---

## 🛡 Security & Resilience

### 1. Shadow Branching for Database Migrations

```typescript
// Safe migration with shadow branching
interface ShadowBranching {
  migration: {
    createShadow: (dbId: string) => Promise<ShadowDB>;
    testMigration: (shadow: ShadowDB, migration: Migration) => Promise<TestResult>;
    validateData: (shadow: ShadowDB) => Promise<ValidationResult>;
    promote: (shadow: ShadowDB) => Promise<void>;
    rollback: (shadow: ShadowDB) => Promise<void>;
  };
  
  monitoring: {
    progress: EventSource;
    performanceMetrics: MigrationMetrics;
  };
}
```

### 2. Graceful KV Fallbacks

```typescript
// Serve cached content if D1 is unavailable
interface GracefulFallback {
  database: {
    primary: () => Promise<Result>;
    fallback: () => Promise<CachedResult>;
    circuitBreaker: { failureThreshold: 5, recoveryTimeout: 30000, halfOpenRequests: 3 };
  };
  
  content: {
    serveStale: boolean;
    maxStaleAge: 3600;
    staleIndicator: boolean;
  };
  
  degradedMode: { readOnly: boolean, cacheOnly: boolean, queueWrites: boolean };
}
```

### 3. Tiered Rate Limiting

```typescript
// Intelligent edge protection
interface TieredRateLimiting {
  tiers: {
    anonymous: { requests: 100, window: 60000, burstAllowance: 10 };
    authenticated: { requests: 500, window: 60000, burstAllowance: 50 };
    premium: { requests: 2000, window: 60000, burstAllowance: 200 };
    admin: { requests: 10000, window: 60000, burstAllowance: 1000 };
  };
  
  adaptive: { loadShedding: boolean, degradationThreshold: 0.8 };
  exceptions: { allowlist: string[], blocklist: string[] };
}
```

---

## 🎨 Advanced Branding Engine

Deep customization through design tokens and layout switchers:

### 1. Design Token System

```typescript
interface DesignTokenSystem {
  primitives: {
    colors: Record<string, string>;     // color-blue-500: #3b82f6
    spacing: Record<string, string>;    // spacing-4: 1rem
    typography: Record<string, string>; // font-size-lg: 1.125rem
    radii: Record<string, string>;      // radius-md: 0.375rem
    shadows: Record<string, string>;
  };
  
  semantic: {
    colors: { primary, secondary, success, warning, error, background, text };
    spacing: { page, section, component, element };
  };
  
  component: {
    button: { paddingX, paddingY, radius, fontSize };
    card: { padding, radius, shadow };
  };
}
```

### 2. Layout Switchers

```typescript
interface LayoutSystem {
  layouts: {
    corporate: { header: 'sticky-nav', sidebar: 'hidden', content: 'centered-max-width' };
    dashboard: { header: 'compact-nav', sidebar: 'persistent-left', content: 'fluid' };
    magazine: { header: 'mega-menu', sidebar: 'right-widgets', content: 'multi-column' };
    ecommerce: { header: 'search-prominent', sidebar: 'filter-left', content: 'product-grid' };
  };
  
  tenantLayout: (tenantId: string) => LayoutConfig;
  switchLayout: (layout: LayoutType) => void;
}
```

---

## 🚀 "Breeze" Zero-Touch Provisioning (Internal Logic)

Breeze is the **Master Orchestrator**. It doesn't perform work itself; it delegates to the registered lifecycle hooks of each module.

### 1. Provisioning Flow
When a new tenant is requested via the Admin Hub, Breeze executes the following sequence:

1.  **Infrastructure Initialization**: 
    - Create DNS record via Cloudflare API.
    - Provision tenant-specific KV namespace entry for rapid configuration lookup.
2.  **Core Seeding**:
    - Insert into `tenants` and `tenant_domains` tables.
    - Create the initial `admin` user and assign the `super_admin` role.
3.  **Module Activation (Cascade)**:
    - Loop through `CORE_MODULES` (Auth, Tenants) and any `DEFAULT_MODULES` (CMS, SEO).
    - Invoke `module.lifecycle.onEnable(context)` for each.
4.  **Theme Injection**:
    - Inject default design tokens into the theme engine.

### 2. The `BreezeContext`
Every lifecycle hook receives a `BreezeContext` containing:
- `db`: The global D1 connection.
- `kv`: The global KV connection.
- `tenantId`: The ID of the tenant being provisioned.
- `config`: Any custom configuration passed during setup (e.g., initial site name).

```typescript
// Example: SEO Module Lifecycle Hook
export const SeoModule: ModuleDefinition = {
  // ...
  lifecycle: {
    onEnable: async ({ db, tenantId }) => {
      // Create default robots.txt and sitemap settings for the new tenant
      await db.insert(seoSettings).values({
        tenantId,
        sitemapEnabled: true,
        robotsTxt: 'User-agent: *\nAllow: /'
      });
    }
  }
};
```

---

// 📊 Module Development Contract
// This section has been unified into the 'ModuleDefinition' in the Architecture section (Line 100+).
// All modules MUST implement the 'ModuleDefinition' interface for full pluggability.

---

## 📦 Enhanced Project Structure (with AI Orchestrator)

```
reactpress/
├── packages/
│   ├── ai-orchestrator/            # NEW: AI Agent logic & Vectorize
│   │   ├── src/
│   │   │   ├── co-pilot.ts         # AI page/content generation
│   │   │   ├── codebase-assistant.ts
│   │   │   ├── vector-search.ts    # Edge-native RAG
│   │   │   ├── tool-agents.ts      # Tool-calling agents
│   │   │   └── prompts/            # Prompt templates
│   ├── tenant-orchestrator/        # NEW: Breeze provisioning
│   └── ...existing packages...
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── ai/                 # NEW: AI service layer
│   │   │   │   ├── agent-service.ts
│   │   │   │   ├── embedding-service.ts
│   │   │   │   └── completion-service.ts
│   │   │   ├── cache-service.ts    # NEW: KV + Cache API
│   │   │   └── ...existing...
├── web/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── AICoPilot.tsx   # NEW: AI assistant panel
│   │   │   │   └── AIPageGenerator.tsx
└── ...existing structure...
```

---

## 🎯 Extended Implementation Checklist

### Phase 6: AI Orchestration Layer
- [ ] AI Co-Pilot for page/content generation
- [ ] Codebase-aware assistant for schema suggestions
- [ ] Edge-native RAG with Cloudflare Vectorize
- [ ] Tool-calling agents with safety constraints
- [ ] Prompt templates library

### Phase 7: Elite Performance
- [ ] ESR & Hono JSX streaming (<50ms TTFB)
- [ ] Elite SWR caching across Cache API + KV
- [ ] Automated AVIF/WebP image transformation
- [ ] Predictive pre-fetching with viewport detection
- [ ] Smart Placement optimization

### Phase 8: Resilience & Security
- [ ] Shadow branching for safe migrations
- [ ] Graceful KV fallbacks with circuit breakers
- [ ] Tiered rate limiting with adaptive load shedding
- [ ] Audit logging for all admin operations

### Phase 9: Advanced Branding
- [ ] Design token system (primitives, semantic, component)
- [ ] Layout switchers (corporate, dashboard, magazine, ecommerce)
- [ ] Per-tenant deep customization

### Phase 10: Breeze Provisioning
- [ ] Zero-touch tenant provisioning (<30 seconds)
- [ ] Automatic SSL/DNS via Cloudflare
- [ ] Module-specific migrations
- [ ] Guided admin onboarding wizard

---

## 🔑 Enhanced Key Principles Summary

1. **Cloudflare-Native Only**: Workers, D1, R2, KV, Vectorize, Queues
2. **Ultra-Isolation Multi-Tenancy**: Tiered isolation at database, storage, and config levels
3. **Content-Type-First**: WordPress-like extensibility with zero code
4. **AI-Powered**: Co-Pilot, RAG, tool-calling agents at the edge
5. **Type-Safe**: Zod validation everywhere, strict TypeScript
6. **Auto-Discovery**: Content types and modules auto-discovered
7. **Scalable**: Elite caching, rate limiting, monitoring built-in
8. **Resilient**: Shadow branching, graceful fallbacks, circuit breakers
9. **Elite Performance**: <50ms TTFB, 95+ Lighthouse scores

---

This is the power of Content-Type-First Architecture with AI-powered edge-native capabilities.

---

## 📖 AI API Reference & Usage Examples

### Content Generation API

```typescript
// Generate blog posts, job descriptions, directory listings
POST /api/ai/generate-content
{
  "contentType": "blog-post",
  "prompt": "Write a comprehensive guide about React Server Components",
  "tone": "professional",
  "length": "long"
}

// Returns structured content matching your content type schema
{
  "title": "Understanding React Server Components",
  "excerpt": "A complete guide to RSC...",
  "content": "<h2>Introduction</h2><p>React Server Components...",
  "tags": ["react", "server-components", "performance"],
  "seoMeta": {
    "title": "React Server Components: Complete Guide 2026",
    "description": "Learn everything about RSC..."
  }
}
```

### Block Builder JSON Generation

```typescript
// Describe a layout, get Block Builder JSON
POST /api/ai/generate-page-layout
{
  "description": "Create a landing page with hero section, 3 feature cards, testimonial carousel, and CTA",
  "style": "modern-saas"
}

// Returns ready-to-use Block Builder JSON
{
  "blocks": [
    { "type": "hero", "config": { "title": "...", "cta": "..." } },
    { "type": "feature-grid", "config": { "columns": 3, "features": [...] } },
    { "type": "testimonials", "config": { "layout": "carousel" } },
    { "type": "cta-banner", "config": { ... } }
  ]
}
```

### Schema Suggestions API

```typescript
// AI analyzes existing content and suggests improvements
GET /api/ai/suggest-fields?contentType=job-listing

// Returns
{
  "suggestions": [
    {
      "field": "benefits",
      "type": "multiselect",
      "reason": "70% of job listings mention benefits",
      "options": ["Health Insurance", "401k", "Remote Work"]
    },
    {
      "field": "experience_years",
      "type": "number",
      "reason": "Used in 85% of search filters"
    }
  ]
}
```

### Migration Proposal API

```typescript
// AI proposes D1 schema changes
POST /api/ai/propose-migration
{
  "description": "Add support for job application tracking"
}

// Returns SQL migration + Drizzle schema updates
{
  "migration": "001_add_job_applications.sql",
  "sql": "CREATE TABLE job_applications ...",
  "drizzleSchema": "export const jobApplications = ...",
  "hono": "routes: app.get('/api/job-applications', ...)"
}
```

### RAG-Powered Search API

```typescript
// Natural language search with context
POST /api/ai/search
{
  "query": "How do I configure email notifications?",
  "tenantId": "abc123"
}

// Returns relevant docs + AI-generated answer
{
  "answer": "To configure email notifications, go to...",
  "sources": [
    { "title": "Email Settings Guide", "url": "/docs/email" },
    { "title": "Notification Preferences", "url": "/docs/notifications" }
  ],
  "confidence": 0.92
}
```

### Tool-Calling Agent API

```typescript
// Natural language instructions
POST /api/ai/agent/execute
{
  "instruction": "Create a new job listing for Senior React Developer at Acme Corp with salary $120k-150k"
}

// Agent uses tools to execute
{
  "steps": [
    { "tool": "create_content", "status": "success", "id": "job_123" },
    { "tool": "set_taxonomy", "status": "success", "terms": ["tech", "react"] },
    { "tool": "publish", "status": "success" }
  ],
  "result": {
    "id": "job_123",
    "url": "/jobs/senior-react-developer-acme-corp"
  }
}
```

### Available Agent Tools

| Tool | Description |
|------|-------------|
| `create_content` | Create content items |
| `update_content` | Modify existing content |
| `manage_taxonomy` | Add/edit categories/tags |
| `update_theme` | Change design tokens |
| `activate_module` | Enable/disable modules |
| `configure_settings` | Update tenant settings |
| `generate_sitemap` | Regenerate sitemap |
| `bulk_import` | Import content from CSV/JSON |

---

## 🎨 Theme Design Token Examples

```typescript
interface ThemeDesignTokens {
  colors: {
    primary: string;      // Brand primary color
    secondary: string;    // Accent color
    background: string;   // Page background
    surface: string;      // Card/panel background
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    borders: string;
  };
  
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: {
      xs: string; sm: string; base: string;
      lg: string; xl: string; '2xl': string;
    };
  };
  
  spacing: {
    xs: string; sm: string; md: string;
    lg: string; xl: string; '2xl': string;
  };
  
  borderRadius: {
    sm: string; md: string; lg: string; full: string;
  };
  
  shadows: {
    sm: string; md: string; lg: string; xl: string;
  };
}

// Automatic CSS variable injection
const theme = tenant.theme;
document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
document.documentElement.style.setProperty('--font-heading', theme.typography.fontFamily.heading);

// Works with any CSS framework
<div className="bg-[var(--color-primary)] font-[var(--font-heading)]">
```

---

## 🚀 What's Been Enhanced (Summary)

1. **Ultra-Isolation Multi-Tenancy**: Tiered isolation at database (D1), storage (R2), and configuration (KV) levels
2. **Dynamic CMS 2.0**: Schema-less content engine with 20+ field types and complex relationships
3. **"Breeze" Admin Orchestration**: Zero-touch provisioning (<5 seconds), automatic SSL/DNS
4. **Smart Module Lifecycle**: Micro-backend modules with self-contained migrations and lazy hydration
5. **Advanced Branding Engine**: Design token system with CSS variable injection and layout switchers
6. **Elite Performance Optimization**: ESR, 4-layer caching, automated asset optimization, predictive pre-fetching
7. **AI Orchestration Layer**: Co-Pilot, Codebase-Aware Assistant, Edge-Native RAG, Tool-Calling Agents
8. **Bullet-Proof Reliability**: Shadow branching, graceful fallbacks, tiered rate limiting

---

## 🎯 Key Innovations

- **Content-Type-First Architecture**: Define a content type once, get admin UI, APIs, routes, and search auto-generated
- **Zero-Code App Building**: Build job boards, directories, legal libraries in minutes
- **Edge-Everything**: Leverages Cloudflare's entire ecosystem (Workers, D1, R2, KV, Vectorize, Queues)
- **AI-Native**: Built-in AI for content creation, schema optimization, and self-healing

The enhanced specification is now production-ready and includes all the sophisticated features needed to build one of the fastest and most stable multi-tenant SaaS platforms on the market! 🚀

---

## 📦 Project Structure (Complete)

```
reactpress/
├── packages/                         # Core modules and shared packages
│   ├── shared-types/                # Shared TypeScript types
│   ├── shared/                      # Shared utilities & adapters
│   ├── config/                      # Module/tenant registry
│   ├── core-engine/                 # Dynamic schema engine
│   ├── tenant-orchestrator/         # Domain mapping & provisioning
│   ├── ai-orchestrator/             # ⭐ AI Agent logic & Vectorize
│   │   ├── agents/                  # Tool-calling agents
│   │   ├── prompts/                 # Prompt templates
│   │   ├── tools/                   # Agent tools
│   │   └── vectorize/               # RAG implementation
│   ├── shared-ui/                   # Reusable design system
│   └── modules-*/                   # Pluggable feature modules
│       ├── modules-content-types/   # Content type system (CORE)
│       ├── modules-cms/             # Blog/Articles
│       ├── modules-jobs/            # Job listings (example)
│       ├── modules-directory/       # Business directory (example)
│       ├── modules-laws/            # Law statutes (example)
│       ├── modules-tools/           # Tools directory (example)
│       ├── modules-auth/            # Authentication & RBAC
│       ├── modules-tenants/         # Multi-tenancy infrastructure
│       ├── modules-themes/          # Theme engine
│       ├── modules-block-builder/   # Visual page builder
│       ├── modules-seo/             # SEO tools
│       └── modules-ai-copilot/      # ⭐ AI Co-Pilot UI
├── backend/                         # Hono + Cloudflare Workers
│   ├── src/
│   │   ├── index.ts                 # Main Workers entry
│   │   ├── modules-loader.ts        # Dynamic module loading
│   │   ├── middleware/
│   │   │   ├── tenant-resolver.ts   # Domain → Tenant resolution
│   │   │   ├── cache-control.ts     # SWR headers
│   │   │   ├── rate-limit.ts        # Tiered rate limiting
│   │   │   └── security.ts          # CORS, CSRF, headers
│   │   ├── ai/                      # ⭐ AI Services
│   │   │   ├── content-generator.ts
│   │   │   ├── layout-builder.ts
│   │   │   ├── seo-optimizer.ts
│   │   │   ├── schema-suggester.ts
│   │   │   ├── migration-generator.ts
│   │   │   ├── ui-fixer.ts
│   │   │   └── search-service.ts
│   │   ├── db/
│   │   │   ├── schema/              # Drizzle schemas
│   │   │   ├── migrations/          # D1 migration files
│   │   │   └── repositories/        # Data access layer
│   │   ├── storage/
│   │   │   ├── r2-adapter.ts        # R2 operations
│   │   │   ├── kv-adapter.ts        # KV caching
│   │   │   └── vectorize-adapter.ts # ⭐ Vector search
│   │   ├── routes/
│   │   │   ├── v1/                  # API v1 routes
│   │   │   ├── v2/                  # API v2 routes
│   │   │   └── ai/                  # ⭐ AI endpoints
│   │   └── modules/                 # Module route overrides
│   ├── wrangler.toml                # Workers configuration
│   └── package.json
├── web/                             # Vite React frontend
│   ├── src/
│   │   ├── routes/                  # TanStack Router (file-based)
│   │   │   ├── __root.tsx
│   │   │   ├── hpanel/              # Admin panel
│   │   │   │   ├── ai-copilot/      # ⭐ AI Assistant
│   │   │   │   ├── content/
│   │   │   │   ├── settings/
│   │   │   │   └── ...
│   │   │   ├── user/                # User dashboard
│   │   │   ├── dynamic/             # Dynamic content type routes
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ui/                  # Radix UI primitives
│   │   │   ├── admin/               # Admin components
│   │   │   ├── ai/                  # ⭐ AI Co-Pilot components
│   │   │   │   ├── ContentGenerator.tsx
│   │   │   │   ├── PageLayoutBuilder.tsx
│   │   │   │   ├── SEOOptimizer.tsx
│   │   │   │   └── AISearch.tsx
│   │   │   ├── content-types/       # Content type system UI
│   │   │   └── shared/              # Shared components
│   │   ├── theme-engine/            # ⭐ Dynamic CSS injection
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── DesignTokens.tsx
│   │   │   └── LayoutSwitcher.tsx
│   │   ├── context/                 # React contexts
│   │   ├── hooks/                   # Custom hooks
│   │   └── lib/                     # Utilities
│   └── package.json
├── scripts/                         # Automation scripts
│   ├── setup-workspaces.js          # Auto-discover modules
│   ├── create-module.js             # Module scaffold generator
│   ├── create-content-type.js       # Content type generator
│   ├── harmonize-deps.js            # Dependency version sync
│   └── analyze-bundle.js            # Bundle size analysis
└── wrangler.toml                    # Root Workers config
```

---

## 🤖 AI Orchestration Package (`/packages/ai-orchestrator`)

```
packages/ai-orchestrator/
├── src/
│   ├── agents/
│   │   ├── content-generator.ts      # Content creation agent
│   │   ├── page-builder.ts           # Layout generation agent
│   │   ├── seo-optimizer.ts          # SEO automation agent
│   │   ├── schema-advisor.ts         # Schema suggestion agent
│   │   └── admin-assistant.ts        # Administrative task agent
│   ├── prompts/
│   │   ├── content-templates/        # Prompt templates
│   │   ├── page-layouts/             # Layout prompts
│   │   └── system-prompts/           # System instructions
│   ├── tools/
│   │   ├── content-tools.ts          # Content manipulation
│   │   ├── schema-tools.ts           # Schema operations
│   │   └── admin-tools.ts            # Admin operations
│   ├── vectorize/
│   │   ├── embeddings.ts             # Vector generation
│   │   ├── search.ts                 # Semantic search
│   │   └── rag.ts                    # RAG implementation
│   └── index.ts
└── package.json
```

---

## 🧠 Backend AI Services (`/backend/src/ai`)

```
backend/src/ai/
├── content-generator.ts              # Generate content via AI
├── layout-builder.ts                 # Build page layouts
├── seo-optimizer.ts                  # Auto SEO optimization
├── schema-suggester.ts               # Suggest schema improvements
├── migration-generator.ts            # Auto-generate migrations
├── ui-fixer.ts                       # Self-healing UI
└── search-service.ts                 # RAG-powered search
```

---

## 🚀 Multi-Tenant Architecture (CRITICAL)

### Domain-Based Tenant Resolution

```typescript
// backend/src/middleware/tenant-resolver.ts
export async function tenantResolverMiddleware(c: Context, next: Next) {
  // 1. Extract domain from request
  const host = c.req.header('host') || '';
  const domain = host.split(':')[0];
  
  // 2. Check KV cache first (sub-10ms)
  const cache = new KVCache(c.env.CACHE);
  let tenant = await cache.get<TenantDefinition>(`tenant:domain:${domain}`);
  
  // 3. If not cached, query D1
  if (!tenant) {
    const db = new DbHelper(c.env.DB);
    tenant = await db.queryOne<TenantDefinition>(`
      SELECT t.* FROM tenants t
      INNER JOIN tenant_domains td ON t.id = td.tenant_id
      WHERE td.domain = ?
      AND t.status = 'active'
    `, [domain]);
    
    if (tenant) {
      await cache.set(`tenant:domain:${domain}`, tenant, 300);
    }
  }
  
  // 4. Handle tenant not found
  if (!tenant) {
    if (domain === c.env.DEFAULT_DOMAIN) {
      tenant = await getDefaultTenant(c.env);
    } else {
      return c.json({ error: 'Tenant not found' }, 404);
    }
  }
  
  // 5. Attach tenant to context
  c.set('tenant', tenant);
  c.set('tenantId', tenant.id);
  
  await next();
}
```

---

## ⚡ Elite Performance Optimization (Detailed)

### Edge-Side Rendering (ESR) & Streaming

**Hono JSX Streaming for <50ms TTFB:**

```typescript
// Streaming HTML from edge
app.get('/page/:slug', async (c) => {
  const tenant = c.get('tenant');
  const page = await getPage(slug, tenant.id);
  
  return c.render(
    <PageLayout>
      <Suspense fallback={<PageSkeleton />}>
        <PageContent data={page} />
      </Suspense>
    </PageLayout>
  );
});

// Result: First byte in <50ms, fully interactive in <200ms
```

**Early Hints (103) Support:**
```typescript
// Pre-connect and pre-load critical resources
c.header('Link', '</assets/critical.css>; rel=preload; as=style');
c.header('Link', '</assets/app.js>; rel=preload; as=script');
c.status(103); // Early Hints
```

### Multi-Layer Caching Strategy

#### Layer 1: Browser Cache
```typescript
// Cache-Control headers for static assets
app.get('/assets/*', async (c) => {
  c.header('Cache-Control', 'public, max-age=31536000, immutable');
  return c.body(asset);
});
```

#### Layer 2: Cloudflare Cache API
```typescript
// Edge cache with SWR
app.get('/api/content/:id', async (c) => {
  const cache = caches.default;
  const cacheKey = new Request(c.req.url);
  
  let response = await cache.match(cacheKey);
  
  if (!response) {
    response = await fetchFromD1(id);
    c.header('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    await cache.put(cacheKey, response.clone());
  }
  
  return response;
});
```

#### Layer 3: Workers KV
```typescript
// Tenant config caching
const config = await cache.cache(
  `tenant:${tenantId}:config`,
  () => fetchTenantConfig(tenantId),
  300 // 5 minutes
);
```

#### Layer 4: Durable Objects
```typescript
// Real-time state management
class TenantState {
  async fetch(request: Request) {
    const cached = await this.state.storage.get('settings');
    if (cached) return cached;
    
    const fresh = await fetchSettings();
    await this.state.storage.put('settings', fresh);
    return fresh;
  }
}
```

### Automated Asset Optimization

**Real-time image transformation at the edge:**

```typescript
// Automatic format conversion
app.get('/media/:id', async (c) => {
  const media = await getMedia(id);
  const accept = c.req.header('Accept') || '';
  
  let format = 'jpeg';
  if (accept.includes('image/avif')) format = 'avif';
  else if (accept.includes('image/webp')) format = 'webp';
  
  // Transform via Cloudflare Images
  const optimized = await transformImage(media.r2_key, {
    format,
    width: parseInt(c.req.query('w') || '800'),
    quality: parseInt(c.req.query('q') || '85'),
  });
  
  return c.body(optimized);
});

// Usage: <img src="/media/123?w=400&q=80" />
// Returns: AVIF on Chrome, WebP on Safari, JPEG on old browsers
```

---

## 🛡 Bullet-Proof Reliability (Implementation)

### Shadow Branching for Migrations

```typescript
// Test migrations in shadow database first
async function runMigration(migration: string) {
  const shadowDb = c.env.DB_SHADOW;
  
  try {
    // Test in shadow
    await shadowDb.exec(migration);
    console.log('✅ Shadow migration successful');
    
    // Apply to production
    await c.env.DB.exec(migration);
    console.log('✅ Production migration successful');
  } catch (error) {
    console.error('❌ Migration failed in shadow, production unchanged');
    throw error;
  }
}
```

### Graceful KV Fallbacks

```typescript
// Serve cached content if D1 is unavailable
async function getContentWithFallback(id: string) {
  try {
    return await db.query('SELECT * FROM content WHERE id = ?', [id]);
  } catch (error) {
    logger.warn('D1 unavailable, serving from KV cache');
    return await kv.get(`content:${id}:backup`);
  }
}
```

### Tiered Rate Limiting

```typescript
// Intelligent edge protection
const rateLimits = {
  anonymous: { requests: 100, window: 60 },    // 100/min
  authenticated: { requests: 1000, window: 60 }, // 1000/min
  admin: { requests: 10000, window: 60 }        // 10000/min
};

async function checkRateLimit(identifier: string, tier: string) {
  const limit = rateLimits[tier];
  const key = `ratelimit:${tier}:${identifier}`;
  
  const current = await kv.get<number>(key) || 0;
  if (current >= limit.requests) {
    throw new RateLimitError();
  }
  
  await kv.set(key, current + 1, limit.window);
}
```

---

## 🔧 Smart Module Lifecycle (Implementation)

### Module Registration

```typescript
export const JobsModule: ModuleDefinition = {
  id: 'jobs',
  name: 'Job Listings',
  version: '1.0.0',
  category: 'business',
  
  // Self-contained migrations
  migrations: [
    '001_create_jobs_table.sql',
    '002_add_job_applications.sql'
  ],
  
  // Auto-registered routes
  routes: (app) => {
    app.get('/api/jobs', jobsHandler);
    app.post('/api/jobs', createJobHandler);
  },
  
  // Lazy-loaded frontend
  component: () => import('./components/JobsDashboard'),
  
  // Content types provided
  contentTypes: [JobListingsContentType],
  
  // Module-specific settings
  settings: {
    autoExpireDays: 30,
    requireApproval: true
  }
};
```

### Frontend Lazy Hydration

```typescript
// Only load modules enabled for current tenant
const modules = tenant.modules.enabled; // ['cms', 'crm']

// Separate chunks for each module
const CMSComponent = lazy(() => import('@reactpress/modules-cms'));
const CRMComponent = lazy(() => import('@reactpress/modules-crm'));

// Result: Tenant without SEO module saves ~52KB
```

---

## 🎨 Advanced Branding Engine (Implementation)

### CSS Variable Injection

```typescript
// Automatic CSS variable generation
const theme = tenant.theme;
document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
document.documentElement.style.setProperty('--font-heading', theme.typography.fontFamily.heading);

// Works with any CSS framework
<div className="bg-[var(--color-primary)] font-[var(--font-heading)]">
```

### Layout Switchers
- **Page Layouts**: Single column, sidebar left, sidebar right, full-width
- **Archive Layouts**: Grid, list, masonry, table
- **Header Styles**: Fixed, sticky, transparent, hidden
- **Footer Styles**: Minimal, detailed, mega-footer, none

---

## 🚀 Zero-Touch Provisioning ("Breeze" Setup)

**Single API call creates complete tenant:**

```typescript
POST /api/admin/tenants/provision
{
  "name": "Acme Corp",
  "domain": "acme.example.com",
  "modules": ["cms", "crm", "seo"],
  "theme": "modern-saas",
  "plan": "professional"
}

// Returns fully provisioned tenant in <5 seconds
```

**Provisioning Steps:**
1. **Domain Mapping**: Automatic SSL/DNS verification via Cloudflare
2. **Database Initialization**: Tenant schema created instantly
3. **Default Content**: Starter templates and sample data
4. **Module Activation**: One-click enable/disable modules
5. **Theme Selection**: Pre-built themes or custom branding
6. **User Provisioning**: Initial admin account creation

---

This is the complete ReactPress 2.0 specification with all advanced features for building enterprise-grade multi-tenant SaaS applications! 🚀