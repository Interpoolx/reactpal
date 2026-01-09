**Absolutely correct!** This should NOT be a separate module. It should be part of the **core/platform files**.

---

## Revised Structure:

```
src/
├── core/
│   ├── registry/
│   │   ├── ModuleRegistry.ts          // Central registry
│   │   ├── SettingsRegistry.ts        // Settings registry
│   │   └── types.ts                   // Shared types
│   │
│   ├── services/
│   │   ├── ModuleService.ts           // Module management logic
│   │   └── SettingsService.ts         // Settings logic
│   │
│   ├── models/
│   │   ├── ModuleStatus.ts
│   │   └── ModuleActivity.ts
│   │
│   └── middleware/
│       ├── moduleContext.ts
│       └── tenantContext.ts
│
├── web/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx              // Main admin dashboard
│   │   │   │   ├── modules/                   // ⭐ Modules management UI
│   │   │   │   │   ├── index.tsx              // Modules dashboard
│   │   │   │   │   ├── ModuleDetail.tsx       // Module detail
│   │   │   │   │   └── components/
│   │   │   │   │       ├── ModuleCard.tsx
│   │   │   │   │       ├── TenantAssignment.tsx
│   │   │   │   │       └── DependencyTree.tsx
│   │   │   │   │
│   │   │   │   └── settings/                  // Settings pages
│   │   │   │       ├── index.tsx              // Settings layout
│   │   │   │       ├── GeneralSettings.tsx
│   │   │   │       └── components/
│   │   │
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── AdminSidebar.tsx           // Uses registry for menu
│   │   │       └── AdminLayout.tsx
│   │   │
│   │   └── hooks/
│   │       ├── useModules.ts
│   │       └── useSettings.ts
│   │
│   └── ...
│
└── modules/                                    // Feature modules only
    ├── users/
    │   ├── module.config.ts                    // Registers with core
    │   ├── pages/
    │   ├── services/
    │   └── ...
    │
    ├── tenants/
    │   ├── module.config.ts
    │   └── ...
    │
    └── auth/
        ├── module.config.ts
        └── ...
```

---

## Why Core, Not Module:

✅ **Platform Infrastructure** - Module management IS the platform, not a feature
✅ **Always Available** - Can't be disabled, so shouldn't be a module
✅ **Manages Other Modules** - Meta-functionality that controls modules
✅ **No Self-Reference** - A module shouldn't manage itself
✅ **Core Bootstrap** - Needs to load before modules register themselves
✅ **Simpler Mental Model** - Core = infrastructure, Modules = features

---

## Updated Admin Sidebar Registration:

```typescript
// web/src/components/layout/AdminSidebar.tsx
import { useAuth } from '@/hooks/useAuth';
import { useModuleMenu } from '@/hooks/useModuleMenu';

const AdminSidebar = () => {
  const { user, tenant, isSuperAdmin } = useAuth();
  const { data: moduleMenuItems, isLoading } = useModuleMenu();
  
  // Core menu items (always visible, not from modules)
  const coreMenuItems = [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/admin',
      order: 0,
    },
  ];

  // Platform admin menu items (only for super admin)
  const platformMenuItems = isSuperAdmin ? [
    {
      label: 'Modules',
      icon: 'Package',
      href: '/admin/modules',
      order: 90,
      section: 'Platform',
    },
  ] : [];

  // Settings (always at bottom)
  const settingsMenuItem = {
    label: 'Settings',
    icon: 'Settings',
    href: '/admin/settings',
    order: 100,
  };

  // Combine all menu items
  const allMenuItems = [
    ...coreMenuItems,
    ...moduleMenuItems,      // Dynamic from modules
    ...platformMenuItems,
    settingsMenuItem,
  ].sort((a, b) => a.order - b.order);

  return (
    <aside className="sidebar">
      {/* Core Items */}
      <nav>
        {allMenuItems
          .filter(item => !item.section)
          .map(item => (
            <SidebarItem key={item.href} {...item} />
          ))}
      </nav>

      {/* Platform Section (Super Admin Only) */}
      {isSuperAdmin && (
        <>
          <SidebarDivider />
          <SidebarSection label="Platform">
            {allMenuItems
              .filter(item => item.section === 'Platform')
              .map(item => (
                <SidebarItem key={item.href} {...item} />
              ))}
          </SidebarSection>
        </>
      )}
    </aside>
  );
};
```

---

## Core Initialization:

```typescript
// src/core/bootstrap.ts
import { moduleRegistry } from './registry/ModuleRegistry';
import { settingsRegistry } from './registry/SettingsRegistry';

// Import all modules to auto-register them
import '@/modules/users/module.config';
import '@/modules/tenants/module.config';
import '@/modules/auth/module.config';
import '@/modules/analytics/module.config';
// ... import all module configs

export const bootstrapCore = async () => {
  console.log('🚀 Bootstrapping application...');
  
  // Verify all module dependencies are satisfied
  const modules = moduleRegistry.getAll();
  for (const module of modules) {
    if (module.dependencies) {
      for (const dep of module.dependencies) {
        if (!moduleRegistry.get(dep)) {
          throw new Error(
            `Module "${module.id}" requires "${dep}" but it's not registered`
          );
        }
      }
    }
  }
  
  console.log(`✓ ${modules.length} modules registered`);
  console.log(`✓ ${settingsRegistry.getAll().length} settings sections registered`);
  console.log('✓ Core bootstrap complete');
};
```

---

## App Entry Point:

```typescript
// src/index.ts (backend)
import express from 'express';
import { bootstrapCore } from './core/bootstrap';

const app = express();

// Bootstrap core before starting server
bootstrapCore().then(() => {
  // Setup routes, middleware, etc.
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
```

```typescript
// web/src/main.tsx (frontend)
import { bootstrapCore } from '@/core/bootstrap';

bootstrapCore().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

---

## Module vs Core Decision Matrix:

| Feature | Module | Core |
|---------|--------|------|
| Users Management | ✅ Module | ❌ |
| Tenants Management | ✅ Module | ❌ |
| Authentication | ✅ Module | ❌ |
| Analytics | ✅ Module | ❌ |
| Billing | ✅ Module | ❌ |
| **Module Management** | ❌ | ✅ **Core** |
| **Settings System** | ❌ | ✅ **Core** |
| **Registry System** | ❌ | ✅ **Core** |
| **Routing** | ❌ | ✅ **Core** |
| **Auth Middleware** | ❌ | ✅ **Core** |
| **Database Connection** | ❌ | ✅ **Core** |
| **API Server** | ❌ | ✅ **Core** |

---

## Key Principle:

> **If it can be disabled, it's a module.**  
> **If it can't be disabled, it's core.**

- Module Management **cannot** be disabled → Core
- Users **can** be disabled (theoretically) → Module
- Settings System **cannot** be disabled → Core
- Analytics **can** be disabled → Module

---

## Revised File Organization:

```
project/
├── src/                                  # Backend
│   ├── core/                             # ⭐ Core platform code
│   │   ├── registry/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── bootstrap.ts
│   │
│   ├── modules/                          # Feature modules
│   │   ├── users/
│   │   ├── tenants/
│   │   └── auth/
│   │
│   ├── config/
│   ├── database/
│   └── index.ts
│
├── web/                                  # Frontend
│   ├── src/
│   │   ├── core/                         # ⭐ Core UI components
│   │   │   └── bootstrap.ts
│   │   │
│   │   ├── pages/
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── modules/              # ⭐ Module mgmt UI (core)
│   │   │       └── settings/             # ⭐ Settings UI (core)
│   │   │
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── AdminSidebar.tsx      # Uses registry
│   │   │
│   │   ├── hooks/
│   │   └── main.tsx
│   │
│   └── modules/                          # Module-specific UI
│       ├── users/
│       │   └── pages/
│       │       └── UsersDashboard.tsx
│       └── tenants/
│           └── pages/
│               └── TenantsDashboard.tsx
│
└── shared/                               # Shared types
    └── types/
```

---

## Summary:

**Modules Management** = Part of **Core Platform**
- Lives in `src/core/` and `web/src/pages/admin/modules/`
- Not a feature module
- Infrastructure that manages feature modules
- Always available, cannot be disabled
- Registers no module config (doesn't register itself)

**Feature Modules** = Individual features
- Lives in `modules/users/`, `modules/auth/`, etc.
- Each registers via `module.config.ts`
- Can be enabled/disabled per tenant
- Managed BY the core module management system

This is the correct architecture! 🎯




Here's a comprehensive **Modules Management Page** specification:

---

## Modules Management Architecture

### Purpose:
Central admin page to manage all modules - enable/disable, configure visibility, assign to tenants, track usage, and control feature flags.

---

## 1. Module Structure:



---

## 2. Module Management Config:

```typescript
// modules/core/module.config.ts
export const coreModuleConfig: ModuleConfig = {
  id: 'core',
  name: 'Core & Modules',
  description: 'Platform core and module management',
  version: '1.0.0',
  
  menu: {
    label: 'Modules',
    icon: 'Package',
    href: '/admin/modules',
    order: 100, // Show at bottom
    badge: {
      type: 'count',
      getValue: async () => {
        // Show count of available updates
        const updates = await checkModuleUpdates();
        return updates.length > 0 ? updates.length : undefined;
      }
    }
  },
  
  availability: {
    requiresPlatformAdmin: true,  // Only super admin can manage modules
    availableForTenants: false,
    defaultEnabled: true,
  },
  
  permissions: [
    'modules.view',
    'modules.manage',
    'modules.enable',
    'modules.disable',
    'modules.configure',
  ],
  
  requiredPermission: 'modules.view',
  
  routes: [
    {
      path: '/admin/modules',
      component: 'ModulesDashboard',
      exact: true,
    },
    {
      path: '/admin/modules/marketplace',
      component: 'ModuleMarketplace',
    },
    {
      path: '/admin/modules/:moduleId',
      component: 'ModuleDetail',
    },
    {
      path: '/admin/modules/:moduleId/settings',
      component: 'ModuleSettings',
    },
  ],
};

moduleRegistry.register(coreModuleConfig);
```

---

## 3. Main Modules Dashboard Page:

```typescript
// modules/core/pages/ModulesDashboard.tsx
import { useState } from 'react';
import { useModules, useModuleStats } from '@/hooks/useModules';
import { 
  Package, Shield, Users, Building2, BarChart, 
  Plug, Bell, Mail, Calendar, FileText, CheckCircle,
  AlertTriangle, XCircle, Clock
} from 'lucide-react';

export const ModulesDashboard = () => {
  const { data: modules, isLoading } = useModules();
  const { data: stats } = useModuleStats();
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled' | 'available'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const filteredModules = modules?.filter(module => {
    if (filter === 'all') return true;
    if (filter === 'enabled') return module.status === 'enabled';
    if (filter === 'disabled') return module.status === 'disabled';
    if (filter === 'available') return module.status === 'available';
    return true;
  });

  return (
    <div className="modules-dashboard">
      {/* Header */}
      <PageHeader
        title="Modules"
        description="Manage platform modules and features"
        action={
          <Button onClick={() => navigate('/admin/modules/marketplace')}>
            <Package /> Browse Marketplace
          </Button>
        }
      />

      {/* Stats Overview */}
      <StatsGrid>
        <StatCard
          label="Total Modules"
          value={stats?.total}
          icon={Package}
        />
        <StatCard
          label="Enabled"
          value={stats?.enabled}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Disabled"
          value={stats?.disabled}
          icon={XCircle}
          color="gray"
        />
        <StatCard
          label="Available"
          value={stats?.available}
          icon={Clock}
          color="blue"
        />
      </StatsGrid>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({stats?.total})
          </Button>
          <Button
            variant={filter === 'enabled' ? 'default' : 'outline'}
            onClick={() => setFilter('enabled')}
          >
            Enabled ({stats?.enabled})
          </Button>
          <Button
            variant={filter === 'disabled' ? 'default' : 'outline'}
            onClick={() => setFilter('disabled')}
          >
            Disabled ({stats?.disabled})
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            onClick={() => setFilter('available')}
          >
            Available ({stats?.available})
          </Button>
        </div>

        <div className="flex gap-2">
          <SearchInput placeholder="Search modules..." />
          <Select defaultValue="all">
            <SelectTrigger>
              <option value="all">All Categories</option>
              <option value="core">Core</option>
              <option value="features">Features</option>
              <option value="integrations">Integrations</option>
            </SelectTrigger>
          </Select>
          <ToggleGroup type="single" value={view} onValueChange={setView}>
            <ToggleGroupItem value="grid">
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <List />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Core Modules Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Core Modules</h2>
        <p className="text-gray-600 mb-4">Essential platform modules (always enabled)</p>
        
        <div className={view === 'grid' ? 'modules-grid' : 'modules-list'}>
          {filteredModules?.filter(m => m.category === 'core').map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              view={view}
              onToggle={handleToggle}
              onClick={() => navigate(`/admin/modules/${module.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Feature Modules Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature Modules</h2>
        <p className="text-gray-600 mb-4">Optional features that can be enabled per tenant</p>
        
        <div className={view === 'grid' ? 'modules-grid' : 'modules-list'}>
          {filteredModules?.filter(m => m.category === 'features').map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              view={view}
              onToggle={handleToggle}
              onClick={() => navigate(`/admin/modules/${module.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Integration Modules Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Integrations</h2>
        <p className="text-gray-600 mb-4">Third-party service integrations</p>
        
        <div className={view === 'grid' ? 'modules-grid' : 'modules-list'}>
          {filteredModules?.filter(m => m.category === 'integrations').map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              view={view}
              onToggle={handleToggle}
              onClick={() => navigate(`/admin/modules/${module.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Empty State */}
      {filteredModules?.length === 0 && (
        <EmptyState
          icon={Package}
          title="No modules found"
          description="Try adjusting your filters"
        />
      )}
    </div>
  );
};
```

---

## 4. Module Card Component:

```typescript
// modules/core/components/ModuleCard.tsx
interface ModuleCardProps {
  module: Module;
  view: 'grid' | 'list';
  onToggle: (moduleId: string, enabled: boolean) => void;
  onClick: () => void;
}

export const ModuleCard = ({ module, view, onToggle, onClick }: ModuleCardProps) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsToggling(true);
    await onToggle(module.id, !module.enabled);
    setIsToggling(false);
  };

  if (view === 'list') {
    return (
      <div className="module-card-list" onClick={onClick}>
        <div className="flex items-center gap-4">
          <ModuleIcon icon={module.icon} status={module.status} />
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{module.name}</h3>
              <ModuleStatusBadge status={module.status} />
              {module.isNew && <Badge variant="blue">NEW</Badge>}
              {module.isCore && <Badge variant="gray">CORE</Badge>}
              {module.enterpriseOnly && <Badge variant="purple">ENTERPRISE</Badge>}
            </div>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>

          <div className="flex items-center gap-4">
            {module.tenantsEnabled > 0 && (
              <div className="text-sm">
                <span className="text-gray-600">Enabled for:</span>
                <span className="font-semibold ml-1">{module.tenantsEnabled} tenants</span>
              </div>
            )}

            {!module.isCore && (
              <Switch
                checked={module.platformEnabled}
                onCheckedChange={handleToggle}
                disabled={isToggling || module.dependencies?.some(d => !d.satisfied)}
              />
            )}

            <Button variant="ghost" size="sm">
              <MoreVertical />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <Card className="module-card-grid" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <ModuleIcon icon={module.icon} status={module.status} size="lg" />
          
          {!module.isCore && (
            <Switch
              checked={module.platformEnabled}
              onCheckedChange={handleToggle}
              disabled={isToggling}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{module.name}</h3>
            {module.isNew && <Badge variant="blue">NEW</Badge>}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{module.description}</p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <ModuleStatusBadge status={module.status} />
          </div>

          {/* Version */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Version</span>
            <span className="text-sm font-medium">{module.version}</span>
          </div>

          {/* Tenants Enabled */}
          {module.tenantsEnabled > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tenants</span>
              <span className="text-sm font-medium">{module.tenantsEnabled}</span>
            </div>
          )}

          {/* Dependencies */}
          {module.dependencies && module.dependencies.length > 0 && (
            <div>
              <span className="text-sm text-gray-600 block mb-2">Dependencies</span>
              <div className="flex flex-wrap gap-1">
                {module.dependencies.map(dep => (
                  <Badge
                    key={dep.id}
                    variant={dep.satisfied ? 'green' : 'red'}
                    size="sm"
                  >
                    {dep.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {module.tags && module.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t">
              {module.tags.map(tag => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Details →
        </Button>
      </CardFooter>
    </Card>
  );
};
```

---

## 5. Module Detail Page:

```typescript
// modules/core/pages/ModuleDetail.tsx
export const ModuleDetail = () => {
  const { moduleId } = useParams();
  const { data: module, isLoading } = useModule(moduleId);
  const { data: tenants } = useModuleTenants(moduleId);
  const enableModule = useEnableModule();
  const disableModule = useDisableModule();

  if (isLoading) return <LoadingSpinner />;
  if (!module) return <NotFound />;

  return (
    <div className="module-detail">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <BreadcrumbItem href="/admin/modules">Modules</BreadcrumbItem>
        <BreadcrumbItem>{module.name}</BreadcrumbItem>
      </Breadcrumbs>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <ModuleIcon icon={module.icon} status={module.status} size="xl" />
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{module.name}</h1>
              <ModuleStatusBadge status={module.status} />
              {module.isCore && <Badge variant="gray">CORE</Badge>}
              {module.enterpriseOnly && <Badge variant="purple">ENTERPRISE</Badge>}
            </div>
            <p className="text-gray-600">{module.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Version {module.version}</span>
              <span>•</span>
              <span>By {module.author}</span>
              <span>•</span>
              <span>Updated {formatDate(module.updatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!module.isCore && (
            <>
              {module.platformEnabled ? (
                <Button
                  variant="destructive"
                  onClick={() => disableModule.mutate(moduleId)}
                >
                  Disable Platform-Wide
                </Button>
              ) : (
                <Button
                  onClick={() => enableModule.mutate(moduleId)}
                >
                  Enable Platform-Wide
                </Button>
              )}
            </>
          )}
          
          <Button variant="outline" onClick={() => navigate(`${moduleId}/settings`)}>
            <Settings /> Configure
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View Documentation</DropdownMenuItem>
              <DropdownMenuItem>Check for Updates</DropdownMenuItem>
              <DropdownMenuItem>Export Configuration</DropdownMenuItem>
              {!module.isCore && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Uninstall Module
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenants">
            Tenants ({tenants?.length})
          </TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <h3>About</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {module.longDescription}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3>Features</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {module.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {module.screenshots && module.screenshots.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3>Screenshots</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {module.screenshots.map((screenshot, i) => (
                        <img
                          key={i}
                          src={screenshot}
                          alt={`Screenshot ${i + 1}`}
                          className="rounded-lg border"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3>Module Info</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Version" value={module.version} />
                  <InfoRow label="Category" value={module.category} />
                  <InfoRow label="Author" value={module.author} />
                  <InfoRow label="License" value={module.license} />
                  <InfoRow 
                    label="Last Updated" 
                    value={formatDate(module.updatedAt)} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3>Usage Statistics</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow 
                    label="Enabled Tenants" 
                    value={`${module.tenantsEnabled} / ${module.totalTenants}`}
                  />
                  <InfoRow 
                    label="Active Users" 
                    value={module.activeUsers}
                  />
                  <InfoRow 
                    label="API Calls (30d)" 
                    value={formatNumber(module.apiCalls30d)}
                  />
                </CardContent>
              </Card>

              {module.dependencies && module.dependencies.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3>Dependencies</h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {module.dependencies.map(dep => (
                        <li key={dep.id} className="flex items-center gap-2">
                          {dep.satisfied ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm">{dep.name}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <h3>Support</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={module.documentationUrl} target="_blank">
                      <FileText className="w-4 h-4" />
                      Documentation
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={module.supportUrl} target="_blank">
                      <MessageCircle className="w-4 h-4" />
                      Get Support
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tenants Tab */}
        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3>Tenant Assignments</h3>
                  <p className="text-sm text-gray-600">
                    Manage which tenants have access to this module
                  </p>
                </div>
                <Button onClick={() => setShowAssignModal(true)}>
                  <Plus /> Assign Tenants
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TenantAssignmentTable
                moduleId={moduleId}
                tenants={tenants}
                onUnassign={handleUnassign}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <h3>Module Permissions</h3>
              <p className="text-sm text-gray-600">
                Permissions provided by this module
              </p>
            </CardHeader>
            <CardContent>
              <PermissionsTable permissions={module.permissions} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dependencies Tab */}
        <TabsContent value="dependencies">
          <Card>
            <CardHeader>
              <h3>Dependency Tree</h3>
            </CardHeader>
            <CardContent>
              <DependencyTree moduleId={moduleId} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <ModuleSettingsForm module={module} />
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <h3>Activity Log</h3>
            </CardHeader>
            <CardContent>
              <ActivityLog moduleId={moduleId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

## 6. Tenant Assignment Component:

```typescript
// modules/core/components/TenantAssignment.tsx
export const TenantAssignmentTable = ({ moduleId, tenants, onUnassign }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tenant</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Enabled On</TableHead>
          <TableHead>Enabled By</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map(tenant => (
          <TableRow key={tenant.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar src={tenant.logo} size="sm" />
                <div>
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-gray-500">{tenant.domain}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={tenant.moduleEnabled ? 'green' : 'gray'}>
                {tenant.moduleEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </TableCell>
            <TableCell>
              {formatDate(tenant.moduleEnabledAt)}
            </TableCell>
            <TableCell>
              {tenant.moduleEnabledBy?.name || '-'}
            </TableCell>
            <TableCell>
              {tenant.activeUsers}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {tenant.moduleEnabled ? (
                    <DropdownMenuItem onClick={() => onUnassign(tenant.id)}>
                      Disable for Tenant
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onAssign(tenant.id)}>
                      Enable for Tenant
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>View Tenant Details</DropdownMenuItem>
                  <DropdownMenuItem>View Usage Stats</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

---

## 7. Module Status Badge:

```typescript
// modules/core/components/ModuleStatusBadge.tsx
export const ModuleStatusBadge = ({ status }: { status: ModuleStatus }) => {
  const config = {
    enabled: {
      label: 'Enabled',
      variant: 'green' as const,
      icon: CheckCircle,
    },
    disabled: {
      label: 'Disabled',
      variant: 'gray' as const,
      icon: XCircle,
    },
    available: {
      label: 'Available',
      variant: 'blue' as const,
      icon: Clock,
    },
    error: {
      label: 'Error',
      variant: 'red' as const,
      icon: AlertTriangle,
    },
    updating: {
      label: 'Updating',
      variant: 'yellow' as const,
      icon: Loader,
    },
  };

  const { label, variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};
```

---

## 8. Database Schema for Module Management:

```typescript
// Module Status table
interface ModuleStatus {
  id: string;
  moduleId: string;
  tenantId?: string; // null = platform level
  
  // Status
  enabled: boolean;
  status: 'enabled' | 'disabled' | 'error' | 'updating';
  
  // Configuration
  settings: Record<string, any>;
  
  // Metadata
  enabledAt?: Date;
  enabledBy?: string;
  disabledAt?: Date;
  disabledBy?: string;
  
  // Usage tracking
  lastUsedAt?: Date;
  usageCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Module Activity Log
interface ModuleActivity {
  id: string;
  moduleId: string;
  tenantId?: string;
  
  // Event
  action: 'enabled' | 'disabled' | 'configured' | 'updated' | 'installed' | 'uninstalled';
  performedBy: string;
  
  // Details
  metadata: Record<string, any>;
  ipAddress?: string;
  
  createdAt: Date;
}

// Module Dependencies (derived from ModuleConfig)
interface ModuleDependency {
  moduleId: string;
  dependsOn: string;
  version?: string;
  required: boolean;
}
```

---

## 9. API Endpoints:

```typescript
// Get all modules
GET    /api/admin/modules
GET    /api/admin/modules/stats

// Get single module
GET    /api/admin/modules/:id
GET    /api/admin/modules/:id/tenants
GET    /api/admin/modules/:id/activity

// Manage module status
POST   /api/admin/modules/:id/enable          // Platform-wide enable
POST   /api/admin/modules/:id/disable         // Platform-wide disable
POST   /api/admin/modules/:id/tenants/:tenantId/enable
POST   /api/admin/modules/:id/tenants/:tenantId/disable

// Configuration
GET    /api/admin/modules/:id/settings
PUT    /api/admin/modules/:id/settings

// Bulk operations
POST   /api/admin/modules/bulk-enable
POST   /api/admin/modules/bulk-disable

// Marketplace (future)
GET    /api/admin/modules/marketplace
POST   /api/admin/modules/install