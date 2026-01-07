## Project Overview

**ReactPress 2.0** is a 100% Cloudflare-native, enterprise-grade SaaS orchestration platform. Built with React 19, Hono, and Cloudflare Workers, it utilizes a **Schema-less Dynamic Content Engine** that allows for instantaneous "Zero-Code" application building. It follows a **Content-Type-First Modular Architecture** inspired by WordPress's Custom Post Types, allowing you to extend the CMS to build ANY content-driven application (job listings, business directories, law libraries, tools directory, etc.) with zero code changes.

ReactPress is designed to run multiple independent applications from a **single codebase**, handling multi-tenancy at the edge with near-zero latency.

---

## 🎯 Core Philosophy & Stability

### 1. **Ultra-Isolation Multi-Tenancy (Tiered Isolation)**
- **Database Partitioning**: Drizzle ORM + D1 with automated tenant-scoped repositories. Every database query is automatically wrapped in a tenant-specific middleware. No data leakage is possible.
- **R2 Asset Scoping**: Storage is isolated via tenant-prefixed paths with signed URL access control.
- **Edge Configuration**: Tenant settings are cached in Workers KV with sub-10ms resolution.
- **Durable Objects Orchestration**: Real-time synchronization and consistency for tenant-specific settings.

### 2. **Dynamic Schema Engine (CMS 2.0)**
- **Field-Agnostic Architecture**: Define custom content types via an interactive UI without code changes.
- **Advanced Field Types**: Support for Relationships (One-to-Many, Many-to-Many), JSON metadata, Geo-location, and Versioned Assets.
- **Auto-Generated APIs**: New content types automatically register REST and GraphQL-lite endpoints.

---

## 🛠 Technology Stack (Cloudflare-Native)

### Core Technologies
- **Runtime**: Cloudflare Workers (Production & Development)
- **Language**: TypeScript 5.8+ (Strict Mode)
- **Monorepo**: NPM Workspaces

### Backend (`/backend`)
- **Framework**: Hono 4.x (Optimized for Workers Runtime)
- **Database**: Cloudflare D1 + Drizzle ORM
- **Cache**: **Cloudflare Cache API** (Browser/Edge) + Workers KV (Config) + Durable Objects (State)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Auth**: Multi-tenant Auth (JWT-based, supporting external providers like Clerk/Supabase)
- **AI**: **Cloudflare Workers AI** (Llama 3, Flux) for built-in edge inference.

### Frontend (`/web`)
- **Framework**: Vite 6.x + React 19.2.3 (Server Components ready)
- **Routing**: TanStack Router 1.x (File-based + Dynamic Tenant Routes)
- **State**: TanStack Query 5.x (Optimistic UI & Server-state sync)
- **Tables**: TanStack Table 8.x
- **UI**: TailwindCSS 4.x + Radix UI + Framer Motion
- **Icons**: Lucide React 0.562.0
- **Validation**: Zod 4.2.1
- **Rich Text**: Tiptap 3.14.x
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

### 3. **Intelligent Caching (SWR)**
- **Stale-While-Revalidate**: All tenant configurations and public content use an SWR strategy with Workers KV and the Cache API.
- **Predictive Pre-fetching**: TanStack Router pre-fetches data for links in the viewport.

---

## 🤖 AI Agent & Assistant Workflow

ReactPress 2.0 integrates a powerful AI Orchestration layer for automated content and site management.

### 1. **AI Co-Pilot & Page Agent**
- **Page Generation**: Describe a layout, and the AI generates the **Block Builder** JSON structure.
- **Content Creation**: Generate blog posts, job descriptions, or directory listings based on the tenant's dynamic schema.
- **SEO Automation**: Auto-generation of meta titles, descriptions, and alt-text for uploaded media.

### 2. **Codebase-Aware Assistant**
- **Schema Suggestions**: AI analyzes existing content types and suggests fields or taxonomies.
- **Automatic Migrations**: AI proposes D1 schema changes and Hono route updates based on feature requests.

### 3. **Edge-Native RAG**
- **Vectorize Integration**: Every tenant gets an isolated vector namespace for semantic search and AI retrieval (RAG).

---

## 📦 Project Structure

```
reactpress/
├── packages/                        # Core modules and shared packages
│   ├── shared-types/               # Shared TypeScript types
│   ├── config/                     # Module/tenant/content-type registry
│   ├── core-engine/                # Dynamic schema & field resolution
│   ├── tenant-orchestrator/        # Domain mapping & provisioning
│   ├── ai-orchestrator/            # AI Agent logic & Vectorize integration
│   ├── shared-ui/                  # Reusable Radix-based design system
│   └── modules-*/                  # Pluggable feature modules
├── backend/                        # Hono + Cloudflare Workers
│   ├── src/
│   │   ├── middleware/             # TenantResolver, CacheControl, Security
│   │   ├── services/               # AI-Service, SchemaService, StorageService
│   │   ├── db/                     # Drizzle schemas & migrations
│   │   └── index.ts                # Global Worker entry
├── web/                            # Vite React frontend
│   ├── src/
│   │   ├── admin/                  # Dashboards with integrated AI Assistant
│   │   ├── theme-engine/           # Dynamic CSS variable injection
│   │   ├── routes/                 # TanStack dynamic route tree
│   │   └── components/             # Shared & module components
├── scripts/                        # Automation scripts
└── wrangler.toml                   # Edge configuration
```

---

## 🚀 Advanced Multi-Tenant & SaaS Orchestration

### 1. **Zero-Touch Provisioning**
1. **Domain Mapping**: Automatic SSL/DNS verification via Cloudflare.
2. **Schema Initialization**: New tenants receive a "Base Schema" immediately.
3. **Module Activation**: One-click toggle for modules (CRM, SEO, AI-Assistant).

### 2. **Global Admin vs. Tenant Admin**
- **Global Admin**: System health, Marketplace management, Global provisioning.
- **Tenant Admin**: Content creation, Local users, Branding, Module activation.

### 3. **Smart Module Lifecycle**
- **Micro-Backends**: Modules register D1 migrations and custom Hono routes upon activation.
- **Lazy Hydration**: Frontend bundles split per module; load only what is enabled.

---

## 🛡 Security & Resilience

- **Shadow Branching**: Test D1 schema changes in shadow databases.
- **Graceful Fallbacks**: Serve cached content from KV if D1 is unavailable.
- **Tiered Rate Limiting**: Intelligent edge protection.

---

## 📦 Project Structure (Original Details Merged)

```
reactpress/
├── packages/                        # Core modules and shared packages
│   ├── shared-types/               # Shared TypeScript types
│   ├── config/                     # Module/tenant/content-type registry
│   ├── debug/                     # Debug layer
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
│       └── modules-template/       # Module template
├── backend/                        # Hono + Cloudflare Workers
│   ├── src/
│   │   ├── index.ts               # Main Workers entry
│   │   ├── modules-loader.ts       # Dynamic module loading
│   │   ├── middleware/            # Auth, CORS, CSRF, rate limit
│   │   ├── db/                   # Drizzle schemas & repositories
│   │   │   ├── migrations/        # D1 migration files
│   │   │   └── repositories/     # Data access layer
│   │   ├── storage/               # R2 & KV operations
│   │   ├── routes/                # Core API routes
│   │   └── modules/              # Local module route overrides
│   ├── wrangler.toml              # Workers configuration
│   └── package.json
├── web/                            # Vite React frontend
│   ├── src/
│   │   ├── routes/                 # TanStack Router (file-based)
│   │   │   ├── __root.tsx         # Root layout
│   │   │   ├── hpanel/            # Admin panel
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
│   │   │   └── shared/           # Shared components
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
├── package.json                    # Root workspace config
├── tsconfig.json                  # Root TypeScript config
└── wrangler.toml                  # Root Workers config
```

---

##  Multi-Tenant Architecture (CRITICAL)

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

### 9. Tenant Module Assignment API

```typescript
// backend/src/routes/tenant-modules.ts
import { Hono } from 'hono';
import { z } from 'zod';

const tenantModulesRouter = new Hono();

// Get modules for a tenant
tenantModulesRouter.get('/:tenantId/modules', async (c) => {
  const { tenantId } = c.req.param();
  // ... implementation
});
```

---

[... ADDITIONAL SECTIONS FROM ORIGINAL DOCUMENT ...]
