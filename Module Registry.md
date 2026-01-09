Here's a comprehensive plan for **Dynamic Module-Based Admin Sidebar with Auto-Registration**:

---

## Module Registry System

### Core Concept:
Each module registers itself with a central registry that controls:
- Admin sidebar menu items
- Routes
- Permissions
- Tenant availability
- Settings integration

---

## Module Structure Enhancement:

```
modules/
├── core/
│   └── registry/
│       ├── ModuleRegistry.ts       // Central module registry
│       ├── types.ts                // Module interface definitions
│       └── index.ts
│
├── users/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── settings/
│   │   └── userSettings.ts         // Settings registration
│   ├── module.config.ts            // ⭐ MODULE REGISTRATION
│   └── index.ts
│
├── auth/
│   ├── controllers/
│   ├── services/
│   ├── settings/
│   ├── module.config.ts            // ⭐ MODULE REGISTRATION
│   └── index.ts
│
├── tenants/
│   ├── controllers/
│   ├── services/
│   ├── settings/
│   ├── module.config.ts            // ⭐ MODULE REGISTRATION
│   └── index.ts
```

---

## 1. Module Registry Interface:

```typescript
// modules/core/registry/types.ts

export interface ModuleConfig {
  // Module identity
  id: string;                    // 'users', 'tenants', 'auth', etc.
  name: string;                  // Display name
  description?: string;
  version: string;
  
  // UI Configuration
  menu: ModuleMenuItem;
  
  // Availability
  availability: {
    requiresPlatformAdmin?: boolean;    // Only for super admin
    availableForTenants?: boolean;      // Can tenants enable this?
    defaultEnabled?: boolean;           // Enabled by default for new tenants
    enterpriseOnly?: boolean;           // Requires enterprise plan
  };
  
  // Permissions
  permissions: string[];         // Permissions this module provides
  requiredPermission?: string;   // Permission needed to access module
  
  // Routes (optional - if module has frontend routes)
  routes?: ModuleRoute[];
  
  // Settings (optional - auto-registers settings)
  settings?: SettingSection;
  
  // Dependencies (optional)
  dependencies?: string[];       // Other modules this depends on
  
  // Lifecycle hooks (optional)
  onEnable?: (tenantId: string) => Promise<void>;
  onDisable?: (tenantId: string) => Promise<void>;
  onInstall?: () => Promise<void>;
}

export interface ModuleMenuItem {
  label: string;
  icon: string;                  // Lucide icon name
  href: string;                  // Route path
  order: number;                 // Menu order (lower = higher up)
  badge?: {                      // Optional badge
    type: 'count' | 'status' | 'new';
    getValue?: () => Promise<number | string>;
  };
  children?: ModuleMenuItem[];   // Submenu items
}

export interface ModuleRoute {
  path: string;
  component: string;             // Path to component
  requiredPermission?: string;
  exact?: boolean;
}

export interface ModuleStatus {
  moduleId: string;
  tenantId?: string;             // null = platform level
  enabled: boolean;
  enabledAt?: Date;
  enabledBy?: string;
  settings?: Record<string, any>;
}
```

---

## 2. Central Module Registry:

```typescript
// modules/core/registry/ModuleRegistry.ts

class ModuleRegistry {
  private modules: Map<string, ModuleConfig> = new Map();
  
  /**
   * Register a module
   */
  register(config: ModuleConfig): void {
    if (this.modules.has(config.id)) {
      throw new Error(`Module ${config.id} is already registered`);
    }
    
    // Validate dependencies
    if (config.dependencies) {
      for (const dep of config.dependencies) {
        if (!this.modules.has(dep)) {
          throw new Error(`Module ${config.id} depends on ${dep} which is not registered`);
        }
      }
    }
    
    this.modules.set(config.id, config);
    
    // Auto-register settings if provided
    if (config.settings) {
      settingsRegistry.register(config.settings);
    }
    
    console.log(`✓ Module registered: ${config.name} (${config.id})`);
  }
  
  /**
   * Get all registered modules
   */
  getAll(): ModuleConfig[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Get module by ID
   */
  get(id: string): ModuleConfig | undefined {
    return this.modules.get(id);
  }
  
  /**
   * Get available modules for a specific context
   */
  getAvailableModules(context: {
    user: User;
    tenant?: Tenant;
    isSuperAdmin: boolean;
  }): ModuleConfig[] {
    return this.getAll()
      .filter(module => this.isModuleAvailable(module, context))
      .sort((a, b) => a.menu.order - b.menu.order);
  }
  
  /**
   * Get sidebar menu items for current context
   */
  async getSidebarMenu(context: {
    user: User;
    tenant?: Tenant;
    isSuperAdmin: boolean;
  }): Promise<ModuleMenuItem[]> {
    const availableModules = this.getAvailableModules(context);
    const menuItems: ModuleMenuItem[] = [];
    
    for (const module of availableModules) {
      // Check if module is enabled for this tenant
      if (context.tenant && !context.isSuperAdmin) {
        const isEnabled = await this.isModuleEnabled(module.id, context.tenant.id);
        if (!isEnabled) continue;
      }
      
      // Check permissions
      if (module.requiredPermission) {
        const hasPermission = await this.checkPermission(
          context.user.id,
          module.requiredPermission
        );
        if (!hasPermission) continue;
      }
      
      // Add badge value if configured
      if (module.menu.badge?.getValue) {
        const badgeValue = await module.menu.badge.getValue();
        menuItems.push({
          ...module.menu,
          badge: { ...module.menu.badge, value: badgeValue },
        });
      } else {
        menuItems.push(module.menu);
      }
    }
    
    return menuItems;
  }
  
  /**
   * Check if module is available for context
   */
  private isModuleAvailable(
    module: ModuleConfig,
    context: { user: User; tenant?: Tenant; isSuperAdmin: boolean }
  ): boolean {
    // Platform admin modules
    if (module.availability.requiresPlatformAdmin && !context.isSuperAdmin) {
      return false;
    }
    
    // Tenant-specific checks
    if (context.tenant && !context.isSuperAdmin) {
      if (!module.availability.availableForTenants) {
        return false;
      }
      
      // Enterprise only check
      if (module.availability.enterpriseOnly && context.tenant.plan !== 'enterprise') {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Check if module is enabled for tenant
   */
  async isModuleEnabled(moduleId: string, tenantId: string): Promise<boolean> {
    const status = await db.moduleStatus.findUnique({
      where: { moduleId_tenantId: { moduleId, tenantId } }
    });
    
    if (!status) {
      // Check default enabled
      const module = this.get(moduleId);
      return module?.availability.defaultEnabled ?? false;
    }
    
    return status.enabled;
  }
  
  /**
   * Enable module for tenant
   */
  async enableModule(
    moduleId: string,
    tenantId: string,
    enabledBy: string
  ): Promise<void> {
    const module = this.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }
    
    // Check dependencies
    if (module.dependencies) {
      for (const dep of module.dependencies) {
        const isEnabled = await this.isModuleEnabled(dep, tenantId);
        if (!isEnabled) {
          throw new Error(`Module ${moduleId} requires ${dep} to be enabled first`);
        }
      }
    }
    
    // Enable in database
    await db.moduleStatus.upsert({
      where: { moduleId_tenantId: { moduleId, tenantId } },
      create: {
        moduleId,
        tenantId,
        enabled: true,
        enabledAt: new Date(),
        enabledBy,
      },
      update: {
        enabled: true,
        enabledAt: new Date(),
        enabledBy,
      },
    });
    
    // Run onEnable hook
    if (module.onEnable) {
      await module.onEnable(tenantId);
    }
    
    // Emit event
    eventEmitter.emit('module.enabled', { moduleId, tenantId });
  }
  
  /**
   * Disable module for tenant
   */
  async disableModule(
    moduleId: string,
    tenantId: string
  ): Promise<void> {
    const module = this.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }
    
    // Check if other modules depend on this
    const dependentModules = this.getAll().filter(m => 
      m.dependencies?.includes(moduleId)
    );
    
    for (const dep of dependentModules) {
      const isEnabled = await this.isModuleEnabled(dep.id, tenantId);
      if (isEnabled) {
        throw new Error(`Cannot disable ${moduleId}. Module ${dep.id} depends on it.`);
      }
    }
    
    // Disable in database
    await db.moduleStatus.update({
      where: { moduleId_tenantId: { moduleId, tenantId } },
      data: { enabled: false },
    });
    
    // Run onDisable hook
    if (module.onDisable) {
      await module.onDisable(tenantId);
    }
    
    // Emit event
    eventEmitter.emit('module.disabled', { moduleId, tenantId });
  }
}

export const moduleRegistry = new ModuleRegistry();
```

---

## 3. Module Registration Examples:

### Users Module:

```typescript
// modules/users/module.config.ts
import { ModuleConfig } from '@/modules/core/registry';
import { userSettingsSection } from './settings/userSettings';

export const usersModuleConfig: ModuleConfig = {
  id: 'users',
  name: 'Users',
  description: 'User management and permissions',
  version: '1.0.0',
  
  menu: {
    label: 'Users',
    icon: 'Users',
    href: '/admin/users',
    order: 20,
    badge: {
      type: 'count',
      getValue: async () => {
        // Return count of pending user invitations
        const count = await db.invitation.count({
          where: { status: 'pending' }
        });
        return count > 0 ? count : undefined;
      }
    }
  },
  
  availability: {
    requiresPlatformAdmin: false,
    availableForTenants: true,
    defaultEnabled: true,  // Always enabled
  },
  
  permissions: [
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'users.invite',
    'roles.manage',
    'permissions.manage',
  ],
  
  requiredPermission: 'users.view',
  
  settings: userSettingsSection,
  
  dependencies: ['auth', 'tenants'],
};

// Auto-register on import
moduleRegistry.register(usersModuleConfig);
```

### Tenants Module:

```typescript
// modules/tenants/module.config.ts
export const tenantsModuleConfig: ModuleConfig = {
  id: 'tenants',
  name: 'Tenants',
  description: 'Manage all tenants and organizations',
  version: '1.0.0',
  
  menu: {
    label: 'Tenants',
    icon: 'Building2',
    href: '/admin/tenants',
    order: 10,
  },
  
  availability: {
    requiresPlatformAdmin: true,  // ⭐ Only super admin
    availableForTenants: false,
    defaultEnabled: false,
  },
  
  permissions: [
    'tenants.view',
    'tenants.create',
    'tenants.update',
    'tenants.delete',
    'tenants.suspend',
  ],
  
  requiredPermission: 'tenants.view',
  
  settings: tenantSettingsSection,
};

moduleRegistry.register(tenantsModuleConfig);
```

### Auth Module:

```typescript
// modules/auth/module.config.ts
export const authModuleConfig: ModuleConfig = {
  id: 'auth',
  name: 'Authentication',
  description: 'Authentication and security settings',
  version: '1.0.0',
  
  menu: {
    label: 'Security',
    icon: 'Shield',
    href: '/admin/security',
    order: 30,
  },
  
  availability: {
    requiresPlatformAdmin: false,
    availableForTenants: true,
    defaultEnabled: true,
  },
  
  permissions: [
    'auth.settings.manage',
    'sessions.view',
    'sessions.revoke',
  ],
  
  requiredPermission: 'auth.settings.manage',
  
  settings: authSettingsSection,
};

moduleRegistry.register(authModuleConfig);
```

### Example Custom Module (e.g., Analytics):

```typescript
// modules/analytics/module.config.ts
export const analyticsModuleConfig: ModuleConfig = {
  id: 'analytics',
  name: 'Analytics',
  description: 'Usage analytics and reporting',
  version: '1.0.0',
  
  menu: {
    label: 'Analytics',
    icon: 'BarChart3',
    href: '/admin/analytics',
    order: 50,
    badge: {
      type: 'new',  // Show "NEW" badge
    }
  },
  
  availability: {
    requiresPlatformAdmin: false,
    availableForTenants: true,
    defaultEnabled: false,         // Must be enabled
    enterpriseOnly: true,          // Only for enterprise plan
  },
  
  permissions: [
    'analytics.view',
    'analytics.export',
  ],
  
  requiredPermission: 'analytics.view',
  
  dependencies: ['users'],  // Depends on users module
  
  onEnable: async (tenantId: string) => {
    // Initialize analytics tables for tenant
    await db.analyticsSettings.create({
      data: { tenantId, initialized: true }
    });
  },
  
  onDisable: async (tenantId: string) => {
    // Cleanup or archive analytics data
    console.log(`Analytics disabled for tenant ${tenantId}`);
  },
};

moduleRegistry.register(analyticsModuleConfig);
```

---

## 4. Bootstrap All Modules:

```typescript
// modules/index.ts - Bootstrap file
import './users/module.config';
import './tenants/module.config';
import './auth/module.config';
import './analytics/module.config';
// ... import all module configs

// This file is imported early in your app startup
// All modules auto-register themselves
```

---

## 5. Database Schema for Module Status:

```typescript
// Database table: module_status
interface ModuleStatus {
  id: string;
  moduleId: string;
  tenantId: string;
  
  enabled: boolean;
  enabledAt?: Date;
  enabledBy?: string;
  
  settings?: Record<string, any>;  // Module-specific settings
  
  createdAt: Date;
  updatedAt: Date;
}

// Unique constraint: (moduleId, tenantId)
```

---

## 6. Frontend Integration:

### Admin Sidebar Component:

```typescript
// web/src/components/admin/AdminSidebar.tsx
import { useAuth } from '@/hooks/useAuth';
import { useModuleMenu } from '@/hooks/useModuleMenu';

const AdminSidebar = () => {
  const { user, tenant, isSuperAdmin } = useAuth();
  const { data: menuItems, isLoading } = useModuleMenu();
  
  if (isLoading) return <SidebarSkeleton />;
  
  return (
    <aside className="sidebar">
      {/* Dashboard - Always visible */}
      <SidebarItem icon="LayoutDashboard" label="Dashboard" href="/admin" />
      
      {/* Dynamic module menu items */}
      {menuItems.map(item => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          badge={item.badge}
        />
      ))}
      
      {/* Settings - Always at bottom */}
      <SidebarItem icon="Settings" label="Settings" href="/admin/settings" />
    </aside>
  );
};
```

### React Hook for Menu:

```typescript
// web/src/hooks/useModuleMenu.ts
export const useModuleMenu = () => {
  const { user, tenant, isSuperAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['module-menu', user?.id, tenant?.id],
    queryFn: async () => {
      const response = await api.get('/admin/modules/menu');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
```

### API Endpoint:

```typescript
// Backend API endpoint
router.get('/admin/modules/menu', authenticate, async (req, res) => {
  const menuItems = await moduleRegistry.getSidebarMenu({
    user: req.user,
    tenant: req.tenant,
    isSuperAdmin: req.user.role === 'super_admin',
  });
  
  res.json(menuItems);
});
```

---

## 7. Tenant Module Management UI:

```typescript
// web/src/pages/admin/settings/modules.tsx
const ModulesSettings = () => {
  const { tenant } = useAuth();
  const { data: modules } = useAvailableModules();
  const enableModule = useEnableModule();
  const disableModule = useDisableModule();
  
  return (
    <div className="modules-settings">
      <h1>Modules</h1>
      <p>Enable or disable modules for your organization</p>
      
      <div className="modules-grid">
        {modules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            enabled={module.enabled}
            onToggle={(enabled) => {
              if (enabled) {
                enableModule.mutate(module.id);
              } else {
                disableModule.mutate(module.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 8. Benefits of This Architecture:

✅ **Automatic Integration** - Modules self-register, no manual menu config
✅ **Type Safety** - Full TypeScript support with interfaces
✅ **Permission-Based** - Automatic permission checking
✅ **Tenant Isolation** - Modules can be enabled per tenant
✅ **Dependency Management** - Automatic dependency resolution
✅ **Easy to Extend** - Add new modules by creating config file
✅ **Dynamic UI** - Sidebar updates automatically based on context
✅ **Plan-Based Features** - Enterprise-only modules supported
✅ **Lifecycle Hooks** - Modules can react to enable/disable events
✅ **Badge Support** - Show counts/notifications per module

---
