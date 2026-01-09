# Role-Based View Switcher - UI/UX Specification

## Overview
This specification defines how the admin interface should dynamically adapt when different roles are selected in the "Preview as Role" feature. The system should accurately reflect what each role type would see and be able to access.

---

## Current Interface Reference

![Current Admin Interface](C:/Users/respo/.gemini/antigravity/brain/18c28b2e-4409-428f-b2a1-7bf4ebf1e48c/uploaded_image_1767876620911.png)

---

## Visual Indicators

### Preview Mode Banner
When **not** viewing as the user's actual role, display a prominent banner:

**Position:** Fixed at top of page, below header  
**Styling:**
- Background: Warning color (amber/yellow with opacity)
- Icon: Eye icon
- Text: "👁️ Previewing as [ROLE_NAME] • Click 'Exit Preview Mode' to return to your view"
- Exit button: Outlined button on the right

**Example:**
```
┌─────────────────────────────────────────────────────────────┐
│ 👁️ Previewing as Editor • [Exit Preview Mode] ×            │
└─────────────────────────────────────────────────────────────┘
```

### Role Badge in Header
- Display current preview role as a badge next to username
- Badge color should match role hierarchy (see Role Colors section)

---

## Role Hierarchy & Permissions

### 1. **Super Admin** (Highest Privilege)
**Description:** Platform owner with unrestricted access to all features and data across all tenants.

#### Admin Sidebar
**All items visible:**
- ✅ Dashboard
- ✅ Modules
- ✅ Tenants
- ✅ Users
- ✅ Security
- ✅ Settings
- ✅ System Logs (if exists)
- ✅ Billing (if multi-tenant SaaS)

#### Dashboard Content
**Studio Overview showing:**
- Active Tenants (3) - **Full list with management links**
- Enabled Modules (3) - **System-wide module registry**
- Total Users (1) - **All users across all tenants**
- System Health (100%) - **Server metrics, uptime, errors**
- Real-time Performance - **Complete system analytics**
- Recent Activity - **All system activity across tenants**

**Additional Widgets:**
- Tenant Management Quick Actions
- Global Module Enabler/Disabler
- User Activity Heatmap (all tenants)
- System Resource Usage
- Database Health
- API Rate Limits

**Action Capabilities:**
- Create/Edit/Delete tenants
- Enable/Disable modules globally
- Manage all users across tenants
- View audit logs for all actions
- Modify system configuration
- Access developer tools

---

### 2. **Admin** (Tenant-Level Admin)
**Description:** Administrator with full control over their assigned tenant(s) but no cross-tenant access.

#### Admin Sidebar
**Visible items:**
- ✅ Dashboard
- ✅ Modules
- ✅ Users (within tenant)
- ✅ Settings (tenant-specific)
- ❌ Tenants (hidden)
- ❌ Security (global - hidden)
- ❌ System Logs (hidden)

**Modified Labels:**
- "Users" → "Manage Team"
- "Settings" → "Tenant Settings"

#### Dashboard Content
**Tenant-Specific Overview showing:**
- Active Users (tenant only) - **Team members count**
- Enabled Modules (tenant only) - **Modules enabled for this tenant**
- Content Metrics - **CMS pages, posts, media count**
- Form Submissions - **CRM submissions (if CRM enabled)**
- Real-time Performance - **Tenant-specific analytics**
- Recent Activity - **Tenant activity feed only**

**Widgets:**
- Tenant Module Enabler (request to enable modules)
- User Management (add/remove users to tenant)
- Content Overview (CMS summary)
- Form Analytics (CRM summary)
- Recent Logins
- Storage Usage

**Action Capabilities:**
- Enable/Disable modules for their tenant
- Create/Edit/Delete users within tenant
- Manage content (CMS, CRM, etc.)
- Configure tenant settings
- View tenant-specific reports
- Cannot access other tenants' data
- Cannot modify global settings

---

### 3. **Editor**
**Description:** Content manager with rights to create, edit, and publish content but limited administrative access.

#### Admin Sidebar
**Visible items:**
- ✅ Dashboard (limited view)
- ✅ CMS (if enabled - should show as "Content")
- ✅ CRM (if enabled - should show as "Forms")
- ✅ Media Library
- ✅ SEO (if enabled)
- ❌ Modules (hidden)
- ❌ Tenants (hidden)
- ❌ Users (hidden)
- ❌ Security (hidden)
- ❌ Settings (hidden)

**New Structure:**
- Dashboard (Editor view)
- Content Management
  - Pages
  - Posts
  - Media
- Forms
- SEO Tools

#### Dashboard Content
**Content-Focused Overview showing:**
- My Drafts (count) - **Editor's draft content**
- Published Content (count) - **Total published items**
- Pending Reviews (count) - **Items awaiting approval**
- Form Submissions (last 7 days) - **Recent submissions**
- Content Performance - **Page views, engagement**
- My Recent Activity - **Editor's recent actions**

**Widgets:**
- Quick Draft Creator
- Recent Pages/Posts
- Form Submission Summary
- Content Calendar
- SEO Score Overview
- Media Usage

**Action Capabilities:**
- Create/Edit/Publish content (pages, posts)
- Upload and manage media files
- View and respond to form submissions
- Edit SEO metadata
- Cannot change site structure
- Cannot manage users or modules
- Cannot access system settings
- View-only access to analytics

---

### 4. **Viewer**
**Description:** Read-only access to content and analytics. Cannot create or modify anything.

#### Admin Sidebar
**Visible items:**
- ✅ Dashboard (read-only)
- ✅ Reports/Analytics
- ✅ Content (read-only)
- ❌ All management items hidden

**Structure:**
- Dashboard (Viewer)
- Reports
- Content Library (read-only)

#### Dashboard Content
**Analytics-Focused Overview showing:**
- Content Overview (count only) - **Total pages, posts**
- Form Submissions (count only) - **Total submissions**
- Site Traffic - **Analytics charts**
- Popular Content - **Top performing pages**
- Recent Activity - **Read-only activity feed**

**Widgets:**
- Traffic Overview
- Content Performance
- Form Analytics
- User Engagement Metrics
- SEO Performance (if enabled)

**Action Capabilities:**
- View all content (cannot edit)
- View form submissions (cannot respond)
- View analytics and reports
- Export reports (if permitted)
- No create/edit/delete permissions
- Cannot access any settings
- Cannot upload media
- All action buttons should be disabled with tooltip: "Viewer role cannot perform this action"

---

### 5. **Regular User** (Lowest Privilege - Frontend Only)
**Description:** Standard website visitor with no admin panel access.

#### Admin Sidebar
**Completely hidden** - Should redirect to main website or show access denied page.

#### Dashboard Content
**Access Denied Screen:**
```
┌─────────────────────────────────────────────┐
│                                             │
│          🚫 Access Denied                   │
│                                             │
│   You don't have permission to access       │
│   the admin panel.                          │
│                                             │
│   [Return to Website]                       │
│                                             │
└─────────────────────────────────────────────┘
```

**Action Capabilities:**
- No admin access
- Frontend-only interactions
- Can submit forms
- Can view published content
- Cannot access /hpanel routes

---

## Sidebar Behavior Specification

### Dynamic Menu Items

Each sidebar item should have a `requiredPermission` property:

| Sidebar Item | Super Admin | Admin | Editor | Viewer | Regular User |
|--------------|-------------|-------|--------|--------|--------------|
| Dashboard | ✅ Full | ✅ Tenant | ✅ Content | ✅ Analytics | ❌ |
| Modules | ✅ | ✅ | ❌ | ❌ | ❌ |
| Tenants | ✅ | ❌ | ❌ | ❌ | ❌ |
| Users | ✅ All | ✅ Tenant | ❌ | ❌ | ❌ |
| Security | ✅ | ❌ | ❌ | ❌ | ❌ |
| Settings | ✅ Global | ✅ Tenant | ❌ | ❌ | ❌ |
| CMS | ✅ | ✅ | ✅ Full | ✅ Read | ❌ |
| CRM | ✅ | ✅ | ✅ Full | ✅ Read | ❌ |
| SEO | ✅ | ✅ | ✅ | ✅ Read | ❌ |
| Analytics | ✅ | ✅ | ✅ Read | ✅ | ❌ |

### Visual States

**Enabled (has permission):**
- Full opacity
- Clickable
- Shows hover effect

**Disabled (no permission):**
- Option 1: Completely hidden (recommended)
- Option 2: Visible but grayed out at 40% opacity with lock icon 🔒
  - Tooltip on hover: "This feature requires [ROLE_NAME] permission"

---

## Dashboard Widget Specifications

### Widget Visibility Matrix

| Widget | Super Admin | Admin | Editor | Viewer | Regular User |
|--------|-------------|-------|--------|--------|--------------|
| Active Tenants | ✅ All | ❌ | ❌ | ❌ | ❌ |
| System Health | ✅ | ❌ | ❌ | ❌ | ❌ |
| Global Modules | ✅ | ✅ Tenant | ❌ | ❌ | ❌ |
| All Users | ✅ | ✅ Tenant | ❌ | ❌ | ❌ |
| Content Metrics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Form Analytics | ✅ | ✅ | ✅ | ✅ | ❌ |
| SEO Performance | ✅ | ✅ | ✅ | ✅ Read | ❌ |
| Real-time Activity | ✅ All | ✅ Tenant | ✅ Own | ✅ | ❌ |
| Quick Actions | ✅ All | ✅ Limited | ✅ Content | ❌ | ❌ |

### Widget Behavior

**Interactive Elements:**
- Cards should be clickable only if user has permission to view details
- Hover effect should only appear for actionable items
- Percentages and growth indicators should update based on role's data scope

**Data Scoping:**
- Super Admin: Cross-tenant aggregated data
- Admin: Single tenant data
- Editor: Own content + team content within tenant
- Viewer: Read-only data, same scope as Editor

---

## Action Button States

### Button Visibility by Role

| Action | Super Admin | Admin | Editor | Viewer |
|--------|-------------|-------|--------|--------|
| Create Tenant | ✅ | ❌ | ❌ | ❌ |
| Enable Module | ✅ Global | ✅ Request | ❌ | ❌ |
| Add User | ✅ All | ✅ Tenant | ❌ | ❌ |
| Create Content | ✅ | ✅ | ✅ | ❌ |
| Edit Content | ✅ All | ✅ Tenant | ✅ Own | ❌ |
| Delete Content | ✅ All | ✅ Tenant | ✅ Own | ❌ |
| Publish Content | ✅ | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ✅ |
| Export Data | ✅ | ✅ | ✅ Limited | ✅ View only |
| System Settings | ✅ | ❌ | ❌ | ❌ |

### Disabled Button Behavior
When a button is disabled due to role restrictions:
- Show disabled state (grayed out, not clickable)
- Display tooltip on hover: "Requires [PERMISSION_NAME] permission"
- Optional: Show lock icon 🔒 next to button text

---

## Role Colors & Visual Hierarchy

Assign distinct colors to each role for quick visual recognition:

- **Super Admin:** `#9333EA` (Purple) - Highest authority
- **Admin:** `#DC2626` (Red) - Administrative power
- **Editor:** `#2563EB` (Blue) - Content management
- **Viewer:** `#059669` (Green) - Read access
- **Regular User:** `#6B7280` (Gray) - No admin access

Use these colors for:
- Role badges
- Preview banner
- Dropdown selected state
- Role indicators in user lists

---

## Responsive Behavior

### Desktop (1024px+)
- Full sidebar visible
- All dashboard widgets in grid layout
- Preview banner spans full width

### Tablet (768px - 1023px)
- Collapsible sidebar (hamburger menu)
- Dashboard widgets in 2-column grid
- Preview banner remains visible

### Mobile (< 768px)
- Hidden sidebar (access via menu)
- Dashboard widgets stack vertically
- Preview banner shows compact version:
  - "👁️ Previewing: [ROLE]"
  - Tap to exit

---

## State Persistence

### Session Storage
Store the current preview role in `sessionStorage`:
```json
{
  "previewRole": "editor",
  "actualRole": "super_admin",
  "previewStartTime": "2026-01-08T12:45:00Z"
}
```

### Behavior
- Preview role persists across page navigation
- Preview role resets on browser close/refresh (security measure)
- Option to "Lock Preview Mode" (persist until explicitly exited)
- Show preview duration in banner: "Previewing for 5m 23s"

---

## Edge Cases & Special Scenarios

### 1. Module Not Enabled for Tenant
**Scenario:** Admin previews as Editor, but CMS module is disabled for this tenant.

**Behavior:**
- CMS menu item should be hidden entirely
- Dashboard should not show CMS widgets
- If Editor navigates to `/hpanel/cms`, show:
  ```
  ┌─────────────────────────────────────┐
  │  ℹ️ CMS Module Not Enabled          │
  │                                     │
  │  This module is not enabled for     │
  │  this tenant. Contact your admin.   │
  └─────────────────────────────────────┘
  ```

### 2. Empty Dashboard
**Scenario:** Viewer role but no content exists yet.

**Behavior:**
- Show empty states for each widget
- Display helpful messages:
  - "No content published yet"
  - "No form submissions yet"
- Keep the dashboard layout structure
- Don't show "Create" prompts (they can't create)

### 3. Permission Escalation Prevention
**Scenario:** Editor tries to access `/hpanel/tenants` via direct URL while in preview mode.

**Behavior:**
- Redirect to Dashboard or show 403 Forbidden
- Log the attempt (security audit)
- Display toast: "You don't have permission to access this page"

### 4. Tenant Switching While in Preview Mode
**Scenario:** Admin switches tenant while previewing as Editor.

**Behavior:**
- Maintain the preview role
- Update the data scope to the new tenant
- Show confirmation: "Switched to [TENANT] while previewing as Editor"
- Update preview banner: "👁️ Previewing as Editor on [TENANT_NAME]"

---

## Implementation Checklist

### Phase 1: Core Functionality
- [ ] Role dropdown in header
- [ ] Session storage for role state
- [ ] Preview banner component
- [ ] Sidebar permission filtering
- [ ] Dashboard widget filtering

### Phase 2: Data Scoping
- [ ] API calls respecting preview role
- [ ] Dashboard queries filtered by role
- [ ] Tenant context in all requests
- [ ] Permission checks on all actions

### Phase 3: Visual Polish
- [ ] Role color system
- [ ] Disabled states for buttons
- [ ] Tooltips for restricted actions
- [ ] Preview duration counter
- [ ] Exit confirmation dialog

### Phase 4: Security
- [ ] Server-side permission validation
- [ ] Direct URL access prevention
- [ ] Audit logging for preview sessions
- [ ] Permission escalation detection

---

## Success Metrics

The implementation is successful when:

1. **Accuracy:** Each role sees exactly what they should have access to
2. **Clarity:** Users understand which role they're previewing
3. **Safety:** No permission bypass via direct URLs or API calls
4. **Performance:** Role switching is instant (<100ms)
5. **Consistency:** Same behavior across all modules and pages

---

## Future Enhancements

### Custom Roles
- Allow creating custom roles with granular permissions
- Role inheritance (Editor extends Viewer)
- Permission templates

### Preview History
- Track which roles were previewed
- Quick switch to recently previewed roles
- Preview session analytics

### Collaborative Preview
- Share preview link with team
- Time-limited preview tokens
- Comment on UI elements: "As editor, this is confusing"

### A/B Testing
- Preview different UI layouts per role
- Analytics on role-specific UX patterns
- Optimize dashboards per role type

---

## Notes for Developers

1. **Always validate permissions server-side** - Never trust client-side role state
2. **Use middleware** for route protection based on role
3. **Implement graceful degradation** - If a widget fails to load, don't break the entire dashboard
4. **Test role transitions** - Ensure no data leakage when switching roles
5. **Log preview sessions** - Helpful for debugging permission issues

