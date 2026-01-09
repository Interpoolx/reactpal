# Tenant Management Enhancement - UI/UX Specification

## Overview
This specification defines comprehensive tenant management capabilities for a multi-tenant SaaS platform, including bulk operations, lifecycle management, and advanced configuration options.

---

## Current Interface Reference

![Tenant List View](C:/Users/respo/.gemini/antigravity/brain/18c28b2e-4409-428f-b2a1-7bf4ebf1e48c/uploaded_image_0_1767884985164.png)

![Edit Tenant Form](C:/Users/respo/.gemini/antigravity/brain/18c28b2e-4409-428f-b2a1-7bf4ebf1e48c/uploaded_image_1_1767884985164.png)

---

## 1. Bulk Tenant Creation

### 1.1 Bulk Import Interface

**New Button:** Add "Bulk Import" button next to "Add New" in the tenant list header.

**Icon:** Upload/Import icon (📤)

**Modal Design:**

```
┌──────────────────────────────────────────────────────────────┐
│ Bulk Import Tenants                                      × │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Import Method:                                               │
│ ○ Paste Domain List  ○ Upload CSV  ○ Connect API            │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Paste domains (one per line):                            │ │
│ │                                                          │ │
│ │ example1.com                                             │ │
│ │ example2.com                                             │ │
│ │ example3.com                                             │ │
│ │ ...                                                      │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Default Settings for All Tenants:                            │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Status:         [Active ▼]                             │   │
│ │ Plan:           [Starter ▼]                            │   │
│ │ Auto-enable:    ☑ CMS  ☑ CRM  ☐ SEO  ☐ Analytics      │   │
│ │ Admin Email:    [auto-generate@domain ▼]              │   │
│ │ Create Admin:   ☑ Auto-create admin user              │   │
│ │ Send Welcome:   ☑ Send welcome email                  │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Advanced Options: [Show ▼]                                   │
│                                                              │
│                  [Preview Import]  [Cancel]  [Import →]      │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Domain Input Options

#### Option 1: Plain Text List
**Format:**
```
domain1.com
domain2.com
domain3.com
```

**Auto-Processing:**
- Strip whitespace
- Validate domain format
- Check for duplicates
- Verify DNS records (optional)
- Auto-generate names from domain
  - `example.com` → Name: "Example", Slug: "example"
  - `my-company.com` → Name: "My Company", Slug: "my-company"

#### Option 2: CSV Upload
**Format Support:**
```csv
domain,name,slug,plan,status,admin_email
example1.com,Example One,example1,pro,active,admin@example1.com
example2.com,Example Two,example2,starter,active,admin@example2.com
```

**Features:**
- CSV template download
- Column mapping interface
- Preview before import
- Skip invalid rows with error report

#### Option 3: Excel/Spreadsheet
- Support .xlsx files
- Same format as CSV
- Multi-sheet support (different plans on different sheets)

### 1.3 Validation & Preview

**Preview Table After Processing:**

```
┌──────────────────────────────────────────────────────────────┐
│ Import Preview - 25 tenants will be created                  │
├──────────────────────────────────────────────────────────────┤
│ ✓ Valid | ✗ Errors | ⚠ Warnings                              │
│   23    |    1     |     1                                    │
├──────────────────────────────────────────────────────────────┤
│ Domain          | Name        | Slug      | Status  | Action │
├──────────────────────────────────────────────────────────────┤
│ ✓ example1.com  | Example 1   | example1  | active  | Create │
│ ✓ example2.com  | Example 2   | example2  | active  | Create │
│ ⚠ test.com      | Test        | test      | active  | Exists │
│ ✗ invalid       | -           | -         | -       | Skip   │
│ ✓ example3.com  | Example 3   | example3  | active  | Create │
├──────────────────────────────────────────────────────────────┤
│ [Edit Invalid] [Remove Duplicates] [Proceed with Valid Only] │
└──────────────────────────────────────────────────────────────┘
```

**Validation Checks:**
- ✓ **Valid:** Domain format correct, unique, no conflicts
- ✗ **Error:** Invalid format, reserved domain, system conflict
- ⚠️ **Warning:** Already exists, similar to existing tenant, no MX records

### 1.4 Progress Tracking

**During Import:**

```
┌──────────────────────────────────────────────────────────────┐
│ Importing Tenants...                              [Pause] [×] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Progress: 15/25 (60%)                                        │
│ ████████████████░░░░░░░░                                     │
│                                                              │
│ ✓ example1.com - Created successfully                        │
│ ✓ example2.com - Created successfully                        │
│ ⚙ example3.com - Creating admin user...                     │
│ ⏸ Remaining: 10 tenants queued                               │
│                                                              │
│ Time Elapsed: 1m 23s | Estimated Time: 45s                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Import Summary:**

```
┌──────────────────────────────────────────────────────────────┐
│ Import Complete!                                         ✓   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Results:                                                     │
│ ✓ Successfully created: 23 tenants                           │
│ ✗ Failed: 1 tenant (see error log)                          │
│ ⚠ Skipped: 1 tenant (already exists)                        │
│                                                              │
│ Actions Performed:                                           │
│ • Created 23 tenant records                                  │
│ • Created 23 admin users                                     │
│ • Sent 23 welcome emails                                     │
│ • Enabled 69 modules (23 × 3)                               │
│                                                              │
│ [Download Report] [View Created Tenants] [Close]             │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Advanced Tenant Configuration

### 2.1 Enhanced Edit Tenant Form

**Current fields are basic (Name, Slug, Domain). Add these sections:**

#### Basic Information (Existing)
- Name
- Slug
- Domain (primary)
- Status (Active, Suspended, Archived, Trial)

#### New Sections:

```
┌──────────────────────────────────────────────────────────────┐
│ Edit Tenant: Example Company                            × │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [Basic Info] [Domains] [Branding] [Limits] [Users] [More ▼] │
│                                                              │
│ ═══════════════════════════════════════════════════════════  │
│ BASIC INFORMATION                                            │
│ ═══════════════════════════════════════════════════════════  │
│                                                              │
│ Display Name *                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Example Company                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Slug *           Domain *                                    │
│ ┌─────────────┐  ┌──────────────────────────────────────┐    │
│ │ example     │  │ example.com                          │    │
│ └─────────────┘  └──────────────────────────────────────┘    │
│                                                              │
│ Status           Plan                                        │
│ ┌─────────────┐  ┌──────────────────────────────────────┐    │
│ │ Active ▼    │  │ Professional ▼                       │    │
│ └─────────────┘  └──────────────────────────────────────┘    │
│                                                              │
│ Timezone         Language                                    │
│ ┌─────────────────────────┐  ┌────────────────────────────┐  │
│ │ Asia/Kolkata ▼          │  │ English (US) ▼             │  │
│ └─────────────────────────┘  └────────────────────────────┘  │
│                                                              │
│ Description                                                  │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Multi-line description of tenant...                    │   │
│ │                                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Created: Jan 5, 2026 | Last Active: 2 hours ago              │
│                                                              │
│                         [Cancel]  [Save Changes]             │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Domain Management Tab

**Purpose:** Manage multiple domains for a single tenant (custom domains, redirects).

```
┌──────────────────────────────────────────────────────────────┐
│ Domains & DNS                                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Primary Domain: example.com             [Make Primary ▼]     │
│                                                              │
│ All Domains:                            [+ Add Domain]       │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Domain              Type      SSL    Status    Actions │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ ⭐ example.com       Primary   ✓     Active    [Edit]  │   │
│ │   www.example.com   Alias     ✓     Active    [Edit]  │   │
│ │   old-domain.com    Redirect  ✓     Active    [Edit]  │   │
│ │   staging.ex.com    Subdomain ⏳    Pending   [Edit]  │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ SSL Certificate Status:                                      │
│ ✓ Auto-renewing Let's Encrypt certificate                    │
│ Expires: Dec 15, 2026 | Auto-renew: Enabled                  │
│                                                              │
│ DNS Configuration:                                           │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Type   Name              Value              TTL        │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ A      example.com       192.168.1.100     3600        │   │
│ │ CNAME  www              example.com         3600        │   │
│ │ TXT    _verification     abc123...          3600        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ [Verify DNS] [Renew SSL] [Add Custom Domain]                 │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- **Primary Domain:** The main domain used in emails, links
- **Alias Domains:** Additional domains that resolve to same tenant
- **Redirect Domains:** Old domains that 301 redirect to primary
- **Subdomains:** tenant-specific subdomains
- **SSL Management:** Auto-provision, manual upload, renewal status
- **DNS Verification:** Check if domain points to platform

### 2.3 Branding & Customization Tab

```
┌──────────────────────────────────────────────────────────────┐
│ Branding & Theme                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Logo & Icons                                                 │
│ ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│ │ Main Logo  │  │ Icon       │  │ Favicon    │              │
│ │ [Upload]   │  │ [Upload]   │  │ [Upload]   │              │
│ └────────────┘  └────────────┘  └────────────┘              │
│                                                              │
│ Brand Colors                                                 │
│ Primary:    [#2563EB] ▌                                      │
│ Secondary:  [#10B981] ▌                                      │
│ Accent:     [#F59E0B] ▌                                      │
│ Background: [#0F172A] ▌                                      │
│ Text:       [#F1F5F9] ▌                                      │
│                                                              │
│ ☑ Use custom theme for admin panel                          │
│ ☑ Use custom theme for public pages                         │
│                                                              │
│ Typography                                                   │
│ Heading Font: [Inter ▼]        Body Font: [Roboto ▼]        │
│                                                              │
│ Custom CSS (Advanced)                          [Show Editor] │
│                                                              │
│ [Reset to Default] [Preview] [Apply Changes]                 │
└──────────────────────────────────────────────────────────────┘
```

### 2.4 Resource Limits & Quotas Tab

```
┌──────────────────────────────────────────────────────────────┐
│ Resource Limits & Quotas                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Current Plan: Professional                    [Change Plan]  │
│                                                              │
│ Storage                                                      │
│ Used: 2.3 GB / 10 GB (23%)                                   │
│ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│ Limit: [10] GB  ☐ Unlimited                                  │
│                                                              │
│ Bandwidth (Monthly)                                          │
│ Used: 45 GB / 100 GB (45%)                                   │
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│ Limit: [100] GB  ☐ Unlimited                                 │
│                                                              │
│ Users                                                        │
│ Active: 5 / 25 (20%)                                         │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│ Limit: [25] users  ☐ Unlimited                               │
│                                                              │
│ API Requests (Per Hour)                                      │
│ Current: 230 / 1,000                                         │
│ Limit: [1000] req/hr  ☐ Unlimited                            │
│                                                              │
│ Pages/Posts                                                  │
│ Total: 42 / 500                                              │
│ Limit: [500]  ☐ Unlimited                                    │
│                                                              │
│ Form Submissions (Monthly)                                   │
│ This month: 1,234 / 5,000                                    │
│ Limit: [5000]  ☐ Unlimited                                   │
│                                                              │
│ Media Files                                                  │
│ Count: 156 / 1,000                                           │
│ Limit: [1000]  ☐ Unlimited                                   │
│                                                              │
│ ⚠ Alert Thresholds:                                          │
│ Send warning email at [80]% usage                            │
│ ☑ Notify tenant admin                                        │
│ ☑ Notify platform admin                                      │
│                                                              │
│ [Save Limits] [View Usage History]                           │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- Visual progress bars for all quotas
- Customizable limits per tenant
- Alert thresholds
- Usage history and trends
- Overage handling (hard limit vs. soft limit)

### 2.5 User Management Tab

```
┌──────────────────────────────────────────────────────────────┐
│ Tenant Users & Access                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 5 users total                                  [+ Add User]  │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Name            Email              Role       Status   │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ John Admin      john@ex.com        Admin      Active  │   │
│ │ Jane Editor     jane@ex.com        Editor     Active  │   │
│ │ Bob Viewer      bob@ex.com         Viewer     Active  │   │
│ │ Alice Content   alice@ex.com       Editor     Invited │   │
│ │ Mike Test       mike@ex.com        Viewer     Inactive│   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Quick Actions:                                               │
│ [Invite Multiple Users] [Export User List] [Bulk Role Change]│
│                                                              │
│ Access Control:                                              │
│ ☑ Require email verification                                 │
│ ☑ Enable two-factor authentication                           │
│ ☐ Restrict to specific IP addresses                         │
│ ☑ Session timeout after 30 minutes of inactivity             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 2.6 Module Configuration Tab

```
┌──────────────────────────────────────────────────────────────┐
│ Enabled Modules                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Enabled: 4 modules                        [Browse All]       │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Module      Version  Status    Usage         Actions  │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ ✓ CMS       2.1.0    Active    142 pages     [Config] │   │
│ │ ✓ CRM       1.5.2    Active    45 forms      [Config] │   │
│ │ ✓ SEO       1.2.0    Active    Optimized     [Config] │   │
│ │ ✓ Analytics 3.0.1    Active    Tracking      [Config] │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Available Modules (Not Enabled):                             │
│ • E-commerce (paid addon)                                    │
│ • Marketing Automation (paid addon)                          │
│ • Helpdesk (included in plan)                                │
│                                                              │
│ [Enable More Modules]                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Tenant List Enhancements

### 3.1 Advanced Filtering & Search

**Add filter bar above table:**

```
┌──────────────────────────────────────────────────────────────┐
│ Filters: [All Status ▼] [All Plans ▼] [All Modules ▼]       │
│                                                              │
│ 🔍 Search: [________________]  [Advanced Search ▼]           │
│                                                              │
│ Showing 23 of 1,456 tenants                                  │
└──────────────────────────────────────────────────────────────┘
```

**Filter Options:**
- **Status:** All, Active, Trial, Suspended, Archived
- **Plan:** All, Free, Starter, Professional, Enterprise, Custom
- **Created:** Today, This week, This month, This year, Date range
- **Modules:** Has CMS, Has CRM, Has SEO, etc.
- **Usage:** High storage, High bandwidth, Over limit
- **Last Activity:** Active today, This week, Inactive 30+ days

**Advanced Search:**
- Search by domain, name, slug, admin email
- Support wildcards: `*.example.com`
- Search by custom fields
- Saved search filters

### 3.2 Enhanced Table Columns

**Current columns:** Name, Domain, Status, Actions

**Additional optional columns (user can toggle):**

| Column | Description | Example |
|--------|-------------|---------|
| Plan | Subscription tier | Professional |
| Created | When tenant was created | Jan 5, 2026 |
| Last Active | Last user activity | 2 hours ago |
| Users | Number of users | 5/25 |
| Storage | Storage usage | 2.3/10 GB |
| Modules | Enabled module count | 4 modules |
| Revenue | Monthly revenue (if billing) | $99/mo |
| Health | Overall health score | 🟢 95% |

**Column Customization:**
- Right-click header → "Customize Columns"
- Drag to reorder
- Toggle visibility
- Save as preset

### 3.3 Bulk Actions

**Add checkbox column and bulk action bar:**

```
┌──────────────────────────────────────────────────────────────┐
│ ☑ 15 selected                                                │
│ Bulk Actions: [Suspend] [Activate] [Change Plan] [Export]   │
│               [Enable Module] [Send Email] [Delete]          │
└──────────────────────────────────────────────────────────────┘
```

**Bulk Operations:**
1. **Status Changes:** Activate, Suspend, Archive multiple tenants
2. **Plan Changes:** Upgrade/downgrade selected tenants
3. **Module Management:** Enable/disable modules for multiple tenants
4. **Communication:** Send email to selected tenant admins
5. **Export:** Export selected tenants to CSV
6. **Delete:** Bulk delete with confirmation
7. **Tag Management:** Add/remove tags
8. **Limit Updates:** Update storage/user limits in bulk

**Confirmation Dialog:**
```
┌──────────────────────────────────────────────────────────────┐
│ Confirm Bulk Action                                      ⚠️  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ You are about to SUSPEND 15 tenants:                         │
│                                                              │
│ • example1.com                                               │
│ • example2.com                                               │
│ • ... and 13 more                                            │
│                                                              │
│ This will:                                                   │
│ ⚠ Disable access for all users on these tenants             │
│ ⚠ Stop all scheduled tasks and emails                        │
│ ℹ Data will be preserved (not deleted)                       │
│                                                              │
│ ☑ Send notification email to tenant admins                   │
│                                                              │
│ Type "CONFIRM" to proceed: [____________]                    │
│                                                              │
│                         [Cancel]  [Confirm Suspension]       │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Quick Actions Menu

**Expand the Actions column with dropdown:**

```
[⋮] → ┌──────────────────────┐
      │ 👁 View Details      │
      │ ✏ Edit               │
      │ 👥 Manage Users      │
      │ 🔧 Modules           │
      │ 📊 Analytics         │
      │ 💰 Billing           │
      ├──────────────────────┤
      │ 🚀 Login as Admin    │
      │ 📧 Email Admin       │
      │ 📋 Clone Tenant      │
      ├──────────────────────┤
      │ ⏸ Suspend            │
      │ 📦 Archive           │
      │ 🗑 Delete            │
      └──────────────────────┘
```

---

## 4. Additional Multi-Tenant Essentials

### 4.1 Tenant Isolation & Security
- Row-level security in database
- Separate file storage per tenant
- API rate limiting per tenant
- Audit logging for all tenant operations
- Data encryption at rest and in transit

### 4.2 Billing & Subscriptions
- Multiple pricing plans
- Usage-based billing
- Automatic payment collection
- Invoice generation
- Trial management
- Proration for plan changes

### 4.3 Tenant Lifecycle
- Trial → Active → Suspended → Archived → Deleted
- Automated email notifications
- Grace periods for payment failures
- Data retention policies

### 4.4 Performance Monitoring
- Per-tenant resource usage tracking
- Health scores
- Performance metrics
- Alert system for issues
- Capacity planning

### 4.5 White-Label Capabilities
- Custom domain support
- Branded admin panels
- Custom email templates
- Remove platform branding
- Custom login pages

### 4.6 Data Portability
- Export all tenant data
- Import from other platforms
- Backup/restore functionality
- Migration tools
- API access for integrations

### 4.7 Compliance & Legal
- GDPR/privacy compliance
- Data residency options
- Terms of service per tenant
- SLA management
- Compliance reporting

---

## Implementation Priority

### Phase 1: Bulk Import (High Priority)
- Paste domain list functionality
- CSV upload
- Auto-generate tenant details
- Progress tracking
- Error handling

### Phase 2: Enhanced Management
- Advanced filtering
- Bulk actions
- Resource limits
- User management per tenant
- Module configuration

### Phase 3: Advanced Features
- Billing integration
- White-label support
- Data export/import
- Tenant cloning
- Analytics dashboard

---

## Success Criteria

1. **Bulk import 100 tenants in < 2 minutes**
2. **Find any tenant in < 10 seconds**
3. **Zero accidental deletions** (confirmation required)
4. **99.9% data isolation** (no cross-tenant leaks)
5. **Automated lifecycle management** (trial expiry, suspensions)



# Tenant Management - Complete Specification

## Overview
Comprehensive tenant management system for ReactPress multi-tenant SaaS platform, including bulk operations, lifecycle management, advanced configuration, and complete UI/UX specifications.

---

## Current Interface

The tenant management interface currently shows:
- Basic tenant list with Name, Domain, Status, Actions
- Simple edit modal with Name, Slug, Domain fields
- Add New button for single tenant creation

**Needs Enhancement:** Bulk operations, advanced configuration, filtering, resource management, and lifecycle automation.

---

## 1. Bulk Tenant Creation (NEW - HIGH PRIORITY)

### 1.1 Bulk Import Button

**Location:** Next to "Add New" button in tenant list header

**Visual:**
```
[+ Add New]  [📤 Bulk Import]
```

### 1.2 Bulk Import Modal

```
┌──────────────────────────────────────────────────────────────┐
│ Bulk Import Tenants                                      ×  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Import Method:                                               │
│ ● Paste Domain List  ○ Upload CSV  ○ Upload Excel           │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Paste domains (one per line):                            │ │
│ │                                                          │ │
│ │ aivisibilityservice.com                                  │ │
│ │ array.im                                                 │ │
│ │ auslaws.com                                              │ │
│ │ centralcybersecurity.com                                 │ │
│ │ ...                                                      │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Default Settings for All Tenants:                            │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Status:         [Active ▼]                             │   │
│ │ Plan:           [Starter ▼]                            │   │
│ │ Auto-enable:    ☑ CMS  ☑ CRM  ☐ SEO  ☐ Analytics      │   │
│ │ Admin Email:    ○ Auto-generate  ● Custom pattern     │   │
│ │                 Pattern: admin@{domain}                │   │
│ │ Create Admin:   ☑ Auto-create admin user              │   │
│ │ Admin Password: [Generate random] or [Set default]    │   │
│ │ Send Welcome:   ☑ Send welcome email to admin         │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Advanced Options: [Show ▼]                                   │
│ • Timezone: [Asia/Kolkata ▼]                                │
│ • Language: [English ▼]                                     │
│ • Storage Limit: [10 GB]                                    │
│ • User Limit: [5 users]                                     │
│                                                              │
│                  [Preview Import]  [Cancel]  [Import →]      │
└──────────────────────────────────────────────────────────────┘
```

### 1.3 CSV Upload Format

**Download Template Button:** Provide CSV template for users

**CSV Format:**
```csv
domain,name,slug,plan,status,admin_email,storage_limit,user_limit
example1.com,Example One,example1,pro,active,admin@example1.com,50,25
example2.com,Example Two,example2,starter,active,admin@example2.com,10,5
```

**Features:**
- Column mapping interface for custom CSV formats
- Preview before import
- Validation with error highlighting
- Skip invalid rows option

### 1.4 Auto-Processing Logic

**Domain → Name Conversion:**
- `example.com` → Name: "Example"
- `my-company.com` → Name: "My Company"
- `grrajeshkumar.com` → Name: "Grrajeshkumar"

**Domain → Slug Conversion:**
- `example.com` → Slug: "example"
- `my-company.com` → Slug: "my-company"
- Strip TLD, convert to lowercase, replace spaces with hyphens

**Admin Email Generation:**
- Pattern: `admin@{domain}`
- Or: `{slug}@platform.com`
- Or: Custom pattern specified

### 1.5 Validation & Preview

```
┌──────────────────────────────────────────────────────────────┐
│ Import Preview - 16 tenants will be created                  │
├──────────────────────────────────────────────────────────────┤
│ ✓ Valid: 14 | ✗ Errors: 1 | ⚠ Warnings: 1                    │
├──────────────────────────────────────────────────────────────┤
│ Domain                    | Name           | Status  | Action│
├──────────────────────────────────────────────────────────────┤
│ ✓ aivisibilityservice.com | Aivisibility.. | Valid   | Create│
│ ✓ array.im                | Array          | Valid   | Create│
│ ✓ auslaws.com             | Auslaws        | Valid   | Create│
│ ⚠ web4strategy.com        | Web4strategy   | Exists  | Skip  │
│ ✗ invalid-domain          | -              | Invalid | Skip  │
│ ✓ centralcyber...com      | Centralcyber.. | Valid   | Create│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [Edit Errors] [Remove Duplicates] [Proceed with 14 Valid]   │
└──────────────────────────────────────────────────────────────┘
```

**Validation Checks:**
- ✓ Valid domain format (RFC compliant)
- ✓ Unique domain (not already in system)
- ✓ Unique slug
- ✓ DNS records exist (optional check)
- ⚠ Domain already exists → Skip
- ✗ Invalid format → Error

### 1.6 Import Progress

```
┌──────────────────────────────────────────────────────────────┐
│ Importing Tenants...                          [Pause] [Stop] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Progress: 8/14 (57%)                                         │
│ ████████████████████░░░░░░░░░░░░░░░░                         │
│                                                              │
│ Current: Creating admin for centralcybersecurity.com...      │
│                                                              │
│ Completed:                                                   │
│ ✓ aivisibilityservice.com - Tenant created, admin invited   │
│ ✓ array.im - Tenant created, admin invited                  │
│ ✓ auslaws.com - Tenant created, admin invited               │
│ ✓ centralcybersecurity.com - Tenant created                 │
│                                                              │
│ Remaining: 6 tenants                                         │
│                                                              │
│ Time Elapsed: 45s | Est. Remaining: 30s                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 1.7 Import Summary

```
┌──────────────────────────────────────────────────────────────┐
│ ✓ Bulk Import Complete!                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Results Summary:                                             │
│ ✓ Successfully created: 14 tenants                           │
│ ✗ Failed: 0 tenants                                          │
│ ⚠ Skipped: 2 tenants (1 duplicate, 1 invalid)               │
│                                                              │
│ Actions Performed:                                           │
│ • Created 14 tenant records in database                      │
│ • Created 14 admin user accounts                             │
│ • Sent 14 welcome emails                                     │
│ • Enabled 28 modules (2 modules × 14 tenants)               │
│ • Allocated 140 GB storage (10 GB × 14 tenants)             │
│                                                              │
│ Next Steps:                                                  │
│ • Admins will receive invitation emails                      │
│ • Each admin can set their password via email link           │
│                                                              │
│ [Download Full Report] [View Created Tenants] [Close]        │
└──────────────────────────────────────────────────────────────┘
```

**Report Includes:**
- List of all created tenants with credentials
- List of skipped tenants with reasons
- Admin login URLs
- Next billing dates
- Configuration summary

---

## 2. Enhanced Tenant Edit Form

### 2.1 Tab Structure

Current edit form only has Name, Slug, Domain. **Expand to tabbed interface:**

```
┌──────────────────────────────────────────────────────────────┐
│ Edit Tenant: Example Company                            ×  │
├──────────────────────────────────────────────────────────────┤
│ [Basic Info] [Domains] [Branding] [Limits] [Users] [More ▼] │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Basic Info Tab

```
┌──────────────────────────────────────────────────────────────┐
│ BASIC INFORMATION                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Display Name *                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Example Company                                        │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Slug *           Domain *                                    │
│ ┌─────────────┐  ┌──────────────────────────────────────┐    │
│ │ example     │  │ example.com                          │    │
│ └─────────────┘  └──────────────────────────────────────┘    │
│                                                              │
│ Status           Plan                                        │
│ ┌─────────────┐  ┌──────────────────────────────────────┐    │
│ │ Active ▼    │  │ Professional ▼                       │    │
│ └─────────────┘  └──────────────────────────────────────┘    │
│                                                              │
│ Timezone                    Language                         │
│ ┌───────────────────────┐  ┌──────────────────────────────┐  │
│ │ Asia/Kolkata ▼        │  │ English (US) ▼               │  │
│ └───────────────────────┘  └──────────────────────────────┘  │
│                                                              │
│ Description                                                  │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Internal description for this tenant...                │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Tags: [+ Add Tag]                                            │
│ 🏷 VIP  🏷 Enterprise  🏷 Beta                              │
│                                                              │
│ Created: Jan 5, 2026 | Last Active: 2 hours ago              │
│                                                              │
│                         [Cancel]  [Save Changes]             │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 Domains Tab (NEW)

```
┌──────────────────────────────────────────────────────────────┐
│ DOMAINS & DNS                                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Primary Domain: example.com             [Make Primary ▼]     │
│                                                              │
│ All Domains:                            [+ Add Domain]       │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Domain           Type      SSL   Status    Actions     │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ ⭐ example.com    Primary   ✓    Active    [Edit] [×]  │   │
│ │   www.ex.com     Alias     ✓    Active    [Edit] [×]  │   │
│ │   old-ex.com     Redirect  ✓    Active    [Edit] [×]  │   │
│ │   staging.ex.com Subdomain ⏳   Pending   [Edit] [×]  │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ SSL Certificate:                                             │
│ ✓ Auto-renewing Let's Encrypt                               │
│ Expires: Dec 15, 2026 | Auto-renew: Enabled                  │
│                                                              │
│ [Verify All DNS] [Renew SSL] [Add Custom Domain]             │
└──────────────────────────────────────────────────────────────┘
```

### 2.4 Branding Tab (NEW)

```
┌──────────────────────────────────────────────────────────────┐
│ BRANDING & THEME                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Logo & Icons                                                 │
│ ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│ │ [Preview]  │  │ [Preview]  │  │ [Preview]  │              │
│ │ Main Logo  │  │ Icon       │  │ Favicon    │              │
│ │ [Upload]   │  │ [Upload]   │  │ [Upload]   │              │
│ └────────────┘  └────────────┘  └────────────┘              │
│                                                              │
│ Brand Colors                                                 │
│ Primary:    [#2563EB] █                                      │
│ Secondary:  [#10B981] █                                      │
│ Accent:     [#F59E0B] █                                      │
│                                                              │
│ ☑ Apply custom theme to admin panel                         │
│ ☑ Apply custom theme to public pages                        │
│                                                              │
│ [Reset to Default] [Preview Theme]                           │
└──────────────────────────────────────────────────────────────┘
```

### 2.5 Resource Limits Tab (NEW)

```
┌──────────────────────────────────────────────────────────────┐
│ RESOURCE LIMITS & QUOTAS                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Current Plan: Professional                    [Change Plan]  │
│                                                              │
│ Storage                                                      │
│ Used: 2.3 GB / 10 GB (23%)                                   │
│ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│ Limit: [10] GB  ☐ Unlimited                                  │
│                                                              │
│ Bandwidth (Monthly)                                          │
│ Used: 45 GB / 100 GB (45%)                                   │
│ ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│ Limit: [100] GB  ☐ Unlimited                                 │
│                                                              │
│ Users                                                        │
│ Active: 5 / 25 users (20%)                                   │
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                │
│ Limit: [25] users  ☐ Unlimited                               │
│                                                              │
│ API Requests (Per Hour)                                      │
│ Current: 230 / 1,000 requests                                │
│ Limit: [1000] req/hr  ☐ Unlimited                            │
│                                                              │
│ ⚠ Alert Threshold: [80]% - Notify when reached               │
│ ☑ Email tenant admin  ☑ Email platform admin                │
│                                                              │
│ [View Usage History] [Save Limits]                           │
└──────────────────────────────────────────────────────────────┘
```

### 2.6 Users Tab (NEW)

```
┌──────────────────────────────────────────────────────────────┐
│ TENANT USERS                                                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 5 users (5/25 limit)                         [+ Add User]    │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Name         Email           Role    Status   Actions  │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ John Doe     john@ex.com     Admin   Active   [Edit]   │   │
│ │ Jane Smith   jane@ex.com     Editor  Active   [Edit]   │   │
│ │ Bob Wilson   bob@ex.com      Viewer  Active   [Edit]   │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ [Invite Multiple] [Export List] [Bulk Actions ▼]             │
└──────────────────────────────────────────────────────────────┘
```

### 2.7 Modules Tab (NEW)

```
┌──────────────────────────────────────────────────────────────┐
│ ENABLED MODULES                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 4 modules enabled                         [Browse All]       │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Module      Status    Usage          Actions          │   │
│ ├────────────────────────────────────────────────────────┤   │
│ │ ☑ CMS       Active    142 pages       [Configure]     │   │
│ │ ☑ CRM       Active    45 forms        [Configure]     │   │
│ │ ☑ SEO       Active    Optimized       [Configure]     │   │
│ │ ☑ Analytics Active    Tracking        [Configure]     │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                              │
│ Available Modules:                                           │
│ • E-commerce (paid addon - $49/mo)                           │
│ • Marketing Automation (included in plan)                    │
│ • Helpdesk (included in plan)                                │
│                                                              │
│ [Enable More Modules]                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Enhanced Tenant List View

### 3.1 Advanced Filtering

**Add filter bar above table:**

```
┌──────────────────────────────────────────────────────────────┐
│ Filters: [All Status ▼] [All Plans ▼] [All Modules ▼]       │
│                                                              │
│ 🔍 Search: [_____________]  [Advanced Search ▼]  [Clear All] │
│                                                              │
│ Showing 23 of 156 tenants                      [Export CSV]  │
└──────────────────────────────────────────────────────────────┘
```

**Filter Options:**
- **Status:** All, Active, Trial, Suspended, Archived
- **Plan:** All, Free, Starter, Professional, Enterprise
- **Created:** Today, This week, This month, This year, Custom range
- **Modules:** Has CMS, Has CRM, Has SEO, etc.
- **Usage:** Over storage limit, Over user limit, High API usage
- **Activity:** Active today, This week, Inactive 30+ days

### 3.2 Enhanced Table Columns

**Default columns:** ☑ Name, ☑ Domain, ☑ Status, ☑ Actions

**Additional optional columns (toggle in settings):**
- ☐ Plan
- ☐ Created Date
- ☐ Last Active
- ☐ Users (5/25)
- ☐ Storage (2.3/10 GB)
- ☐ Modules (4)
- ☐ Health Score (🟢 95%)

**Column customization:**
- Right-click header → "Customize Columns"
- Drag to reorder
- Toggle visibility
- Save as preset

### 3.3 Bulk Actions

**When rows selected, show bulk action bar:**

```
┌──────────────────────────────────────────────────────────────┐
│ ☑ 5 selected                                                 │
│ Actions: [Activate] [Suspend] [Change Plan] [Enable Module] │
│          [Send Email] [Export Selected] [Delete]             │
└──────────────────────────────────────────────────────────────┘
```

**Bulk Operations Available:**
1. Status Changes: Activate, Suspend, Archive multiple
2. Plan Changes: Upgrade/downgrade selected tenants
3. Module Management: Enable/disable modules in bulk
4. Communication: Send email to selected admins
5. Export: Export selected tenants to CSV
6. Delete: Bulk delete with confirmation

### 3.4 Quick Actions Menu

**Expand Actions dropdown:**

```
[⋮] → ┌──────────────────────┐
      │ 👁 View Dashboard    │
      │ ✏ Edit               │
      │ 👥 Manage Users      │
      │ 🔧 Configure Modules │
      ├──────────────────────┤
      │ 🚀 Login as Admin    │
      │ 📧 Email Admin       │
      │ 📋 Clone Tenant      │
      ├──────────────────────┤
      │ ⏸ Suspend            │
      │ 📦 Archive           │
      │ 🗑 Delete            │
      └──────────────────────┘
```

---

## 4. Core Features (Existing + Enhanced)

### 4.1 Tenant Configuration ✅ MUST HAVE

**Basic Settings:**
- Tenant name, slug, domain
- Logo, brand colors, app name
- Subscription/plan info
- Storage limits
- User limits
- Feature flags per tenant
- Timezone & locale

**NEW - Advanced Settings:**
- Multiple custom domains
- SSL certificate management
- White-label configuration
- Custom email templates
- API access configuration
- Webhook endpoints

### 4.2 Tenant Lifecycle ✅ MUST HAVE

**Status Field:**
- 🔵 **Trial** - Time-limited evaluation
- 🟢 **Active** - Full access, current billing
- 🟡 **Suspended** - Temporarily disabled (non-payment, violation)
- 🟠 **Cancelled** - User cancelled, in grace period
- ⚫ **Archived** - Long-term inactive, data preserved

**Lifecycle Management:**
- Trial start/end dates
- Auto-conversion from trial to active on payment
- Auto-suspension on payment failure
- Grace period before deletion
- Soft delete (retain data for compliance)
- Restoration capability

**NEW - Automated Actions:**
- Email notifications at lifecycle transitions
- Auto-suspend after X failed payments
- Auto-archive after X days inactive
- Scheduled deletion after archive period

### 4.3 Ownership & Users ✅ MUST HAVE

**Owner Information:**
- Primary account owner (name, email)
- Billing contact (if different)
- Transfer ownership capability
- User count vs limit display

**NEW - User Management:**
- List all users for tenant
- Add/remove users
- Change roles
- Bulk invite users
- Activity logs per user

### 4.4 Domain Management ✅ MUST HAVE

**Single Domain (Current):**
- Primary domain field

**NEW - Multiple Domains:**
- Primary domain (used for emails, links)
- Alias domains (www.example.com, example.org)
- Redirect domains (old domains → primary)
- Subdomains (staging.example.com)
- DNS verification status
- SSL certificate status per domain
- Auto-provision SSL via Let's Encrypt

### 4.5 Security & Compliance ✅ MUST HAVE

**Data Security:**
- Data residency (region selection)
- Encryption status (at rest, in transit)
- API access enable/disable
- IP whitelisting

**Audit & Compliance:**
- Audit logs for all config changes
- Last activity timestamp
- Login history
- GDPR compliance tools
- Data export capability
- Right to be forgotten

### 4.6 Billing Integration ✅ MUST HAVE

**Billing Status:**
- Current, Overdue, Cancelled
- Next billing date
- Payment method status
- MRR/ARR tracking
- Invoice history

**NEW - Usage-Based Billing:**
- Storage overage charges
- Bandwidth overage charges
- Extra user charges
- API call charges
- Automatic billing calculations

### 4.7 Usage & Limits ✅ MUST HAVE

**Resource Tracking:**
- Storage usage with progress bar
- API usage (calls per hour/day/month)
- Active users vs limit
- Bandwidth usage

**NEW - Usage Alerts:**
- Email when 80% of limit reached
- Dashboard warnings
- Auto-upgrade suggestions
- Usage trends and forecasting

### 4.8 Metadata ✅ MUST HAVE

**Business Information:**
- Industry/vertical
- Company size
- Internal notes
- Tags for organization

**NEW - Enhanced Metadata:**
- Account manager assignment
- Customer success notes
- Support ticket integration
- Health score calculation
- Churn risk indicators

---

## 5. Additional Multi-Tenant Essentials

### 5.1 Tenant Cloning (NEW)

**Purpose:** Duplicate tenant configuration for similar setups

```
Clone Tenant: [Source Tenant ▼]
To New Domain: [new-domain.com]

What to clone:
☑ Module configuration
☑ Branding (logo, colors)
☑ Settings and limits
☐ Content (pages, posts) - expensive
☐ Users - for security, create new admin instead

[Cancel] [Clone Tenant]
```

### 5.2 Tenant Templates (NEW)

**Pre-configured templates:**
- **Blog Template:** CMS + SEO enabled, sample pages
- **Corporate Template:** CMS + CRM + SEO, contact forms
- **E-commerce Template:** Store module + CMS + Analytics
- **Agency Template:** All modules, portfolio pages
- **Blank Template:** No content, clean start

### 5.3 Data Export/Import (NEW)

**Export Capabilities:**
- Complete backup (ZIP with DB + files)
- Database only (SQL dump)
- Content only (Markdown + media)
- Structured data (JSON)

**Import Capabilities:**
- Restore from backup
- Import from WordPress export
- Import from other CMS
- Merge or replace options

### 5.4 Automated Backups (NEW)

**Backup Schedule:**
- Daily, Weekly, Monthly options
- Custom schedule (e.g., every 6 hours)
- Retention policy (keep last N backups)

**Storage Location:**
- Platform storage (included)
- AWS S3
- Google Cloud Storage
- Custom endpoint

### 5.5 White-Label Configuration (NEW)

```
☑ Enable white-label mode

Custom Platform Name: [My CMS Platform]
Admin Panel URL: ● Custom domain: [admin.mycms.com]

Email From Name: [My Platform]
Email From Address: [noreply@mycms.com]

☑ Remove "Powered by ReactPress" footer
☑ Custom login page logo
☑ Custom documentation links
```

### 5.6 Tenant Relationships (NEW)

**For Agency/Reseller Models:**

```
Parent Tenant: [Select parent ▼] or ☑ This is a parent

Child Tenants (12): [View All]
• client1.com
• client2.com
• client3.com

Inheritance Settings:
☑ Share branding with children
☑ Centralized billing to parent
☐ Share user pool
```

---

## 6. Database Schema

### Enhanced Tenant Model

```typescript
interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string; // primary domain
  
  // Status & Lifecycle
  status: 'trial' | 'active' | 'suspended' | 'cancelled' | 'archived';
  trialEndsAt?: Date;
  suspendedAt?: Date;
  suspendedReason?: string;
  cancelledAt?: Date;
  
  // Ownership
  ownerId: string;
  ownerEmail: string;
  billingEmail?: string;
  
  // Subscription
  planId: string;
  planName: string;
  billingStatus: 'current' | 'overdue' | 'cancelled';
  nextBillingDate?: Date;
  mrr: number; // Monthly Recurring Revenue
  
  // Limits
  maxUsers: number;
  maxStorage: number; // in GB
  maxBandwidth: number; // in GB per month
  maxApiCalls: number; // per hour
  maxPages: number;
  
  // Current Usage
  currentUsers: number;
  storageUsed: number; // in GB
  bandwidthUsedThisMonth: number;
  apiCallsThisHour: number;
  pagesCount: number;
  
  // Settings
  settings: {
    logo?: string;
    icon?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    timezone: string;
    locale: string;
    features: string[]; // feature flags
    whiteLabel: boolean;
    customPlatformName?: string;
  };
  
  // Security
  dataRegion: string; // 'us-east', 'eu-west', 'asia-south'
  encryptionEnabled: boolean;
  apiAccessEnabled: boolean;
  ipWhitelist: string[];
  
  // Metadata
  industry?: string;
  companySize?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  notes?: string;
  tags: string[];
  accountManager?: string;
  healthScore?: number; // 0-100
  
  // Audit
  lastActivityAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  deletedAt?: Date; // soft delete
}
```

### Custom Domains Table (NEW)

```typescript
interface CustomDomain {
  id: string;
  tenantId: string;
  domain: string;
  type: 'primary' | 'alias' | 'redirect' | 'subdomain';
  isPrimary: boolean;
  sslStatus: 'none' | 'pending' | 'active' | 'expired';
  sslProvider: 'letsencrypt' | 'custom' | null;
  sslExpiresAt?: Date;
  dnsVerified: boolean;
  dnsVerifiedAt?: Date;
  redirectTo?: string; // for redirect type
  createdAt: Date;
  updatedAt: Date;
}
```

### Tenant Usage History (NEW)

```typescript
interface TenantUsageHistory {
  id: string;
  tenantId: string;
  date: Date; // daily snapshots
  storageUsed: number;
  bandwidthUsed: number;
  apiCalls: number;
  activeUsers: number;
  pagesCount: number;
  createdAt: Date;
}
```

---

## 7. API Endpoints

### Tenant CRUD

```typescript
// List tenants with filtering
GET /api/tenants?status=active&plan=pro&page=1&limit=20

// Get single tenant
GET /api/tenants/:id

// Create single tenant
POST /api/tenants
Body: { name, slug, domain, plan, ownerId }

// Bulk create tenants (NEW)
POST /api/tenants/bulk
Body: {
  tenants: [{ domain, name?, slug?, plan?, adminEmail? }],
  defaults: { plan, modules, limits }
}

// Update tenant
PATCH /api/tenants/:id
Body: { name?, status?, settings? }

// Delete tenant (soft delete)
DELETE /api/tenants/:id
```

### Tenant Management (NEW)

```typescript
// Clone tenant
POST /api/tenants/:id/clone
Body: { newDomain, newName, cloneContent: boolean }

// Get tenant usage
GET /api/tenants/:id/usage?period=30d

// Get tenant users
GET /api/tenants/:id/users

// Add custom domain
POST /api/tenants/:id/domains
Body: { domain, type }

// Verify domain DNS
POST /api/tenants/:id/domains/:domainId/verify

// Provision SSL
POST /api/tenants/:id/domains/:domainId/ssl

// Export tenant data
POST /api/tenants/:id/export
Body: { format: 'zip' | 'json' | 'sql' }

// Suspend tenant
POST /api/tenants/:id/suspend
Body: { reason }

// Reactivate tenant
POST /api/tenants/:id/activate
```

---

## 8. Module Structure

```
modules/tenants/
├── controllers/
│   ├── TenantController.ts           # CRUD operations
│   ├── TenantBulkController.ts       # Bulk import/export (NEW)
│   ├── TenantLifecycleController.ts  # Status management (NEW)
│   ├── TenantUsageController.ts      # Usage tracking
│   └── CustomDomainController.ts     # Domain management (NEW)
│
├── services/
│   ├── TenantService.ts              # Core tenant logic
│   ├── BulkImportService.ts          # Bulk operations (NEW)
│   ├── DomainVerificationService.ts  # DNS verification (NEW)
│   ├── SSLProvisioningService.ts     # SSL management (NEW)
│   ├── UsageLimitService.ts          # Resource tracking
│   ├── TenantCloneService.ts         # Cloning (NEW)
│   └── DataExportService.ts          # Export/backup (NEW)
│
├── models/
│   ├── Tenant.ts
│   ├── CustomDomain.ts               # (NEW)
│   ├── TenantUsageHistory.ts         # (NEW)
│   └── TenantSettings.ts
│
├── validators/
│   ├── tenantValidators.ts
│   ├── bulkImportValidators.ts       # (NEW)
│   └── domainValidators.ts           # (NEW)
│
├── routes/
│   └── tenantRoutes.ts
│
└── index.ts
```

---

## 9. Implementation Phases

### Phase 1: Bulk Import (HIGH PRIORITY)
- [ ] Bulk import modal UI
- [ ] Paste domain list processing
- [ ] CSV upload support
- [ ] Domain validation logic
- [ ] Auto-generate name/slug from domain
- [ ] Preview before import
- [ ] Progress tracking
- [ ] Import summary report
- [ ] Auto-create admin users
- [ ] Send welcome emails

### Phase 2: Enhanced Edit Form
- [ ] Tabbed interface
- [ ] Domains tab with multiple domain support
- [ ] Branding tab for logo/colors
- [ ] Resource limits tab with progress bars
- [ ] Users tab to manage tenant users
- [ ] Modules tab to enable/disable modules

### Phase 3: List Enhancements
- [ ] Advanced filtering
- [ ] Bulk actions
- [ ] Column customization
- [ ] Enhanced quick actions menu
- [ ] Export functionality

### Phase 4: Advanced Features
- [ ] Tenant cloning
- [ ] Tenant templates
- [ ] Data export/import
- [ ] Automated backups
- [ ] White-label configuration
- [ ] Parent/child relationships

### Phase 5: Automation
- [ ] Lifecycle automation (trial expiry, auto-suspend)
- [ ] Usage alerts and notifications
- [ ] Billing integration
- [ ] Health score calculation
- [ ] Churn prediction

---

## 10. Success Metrics

The tenant management system is successful when:

1. ✅ Can bulk import 100 tenants in < 2 minutes
2. ✅ Find any tenant in < 10 seconds
3. ✅ Zero accidental deletions (confirmation required)
4. ✅ 99.9% data isolation (no cross-tenant leaks)
5. ✅ Automated lifecycle saves 80% admin time
6. ✅ Usage alerts prevent 95% of limit overages
7. ✅ Clone tenant in < 30 seconds
8. ✅ Complete data export in < 5 minutes

---

## 11. Security Best Practices

1. **Data Isolation:** Every query MUST filter by tenant_id
2. **Row-Level Security:** Use database RLS if available (PostgreSQL)
3. **API Rate Limiting:** Per-tenant rate limits
4. **Audit Logging:** Log all tenant config changes
5. **Access Control:** Super Admin only for tenant management
6. **Validation:** Sanitize all inputs, validate domains
7. **Encryption:** All sensitive data encrypted at rest
8. **Backup Security:** Encrypt backups, secure storage

---

## Notes

- **Bulk import is TOP PRIORITY** - enables rapid onboarding
- **Domain auto-processing** should be smart but allow manual override
- **Progress tracking** essential for bulk operations (user feedback)
- **Validation before import** prevents bad data
- **Resource limits** should be enforced at API level, not just UI
- **Lifecycle automation** reduces manual admin work significantly
- **White-label** required for enterprise/agency use cases
