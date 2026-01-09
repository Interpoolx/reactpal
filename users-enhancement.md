Here's a comprehensive prompt to instruct an LLM to update the Users UI:

---

# Prompt: Update Users Module UI Based on Revised Specifications

## Context
I have a multi-tenant SaaS application with a Users module. Currently, the "Add User" form only has basic fields (Username, Password, Role). I need to update the entire Users module UI to match the comprehensive specifications we've defined.

## Current State
- Simple "Add User" modal with only: Username, Password, Role dropdown
- Basic users table showing minimal information
- No invitation system, no email verification, no advanced features

## Required Updates

### 1. Update "Add User" / "Invite User" Modal

Replace the current basic form with a comprehensive invitation system:

**Fields Required:**
- **Email** (primary field, required)
- **First Name** (required)
- **Last Name** (required)
- **Role** (dropdown with custom roles from database)
- **Send Invitation Email** (toggle, default: ON)
- **Custom Message** (optional textarea for invitation email)
- **Account Expiry Date** (optional date picker for temporary access)
- **Permissions Override** (optional, expandable section for custom permissions)

**UI Improvements:**
- Change title from "Add User" to "Invite User"
- Add email validation with real-time feedback
- Show role description on hover/selection
- Display permissions included with selected role
- Add "Send invitation now" vs "Create as draft" options
- Show invitation preview before sending
- Better form layout with proper spacing and grouping

**Validation:**
- Email format validation
- Check if email already exists in tenant
- Password strength indicator (if manual creation)
- Required fields highlighted

### 2. Update Users Table/List View

Transform from basic table to comprehensive user management interface:

**Columns to Display:**
- Checkbox (for bulk selection)
- Avatar + Name (first name + last name)
- Email
- Role (with badge styling)
- Status (Active, Inactive, Pending, Suspended - with color-coded badges)
- Last Login (relative time: "2 hours ago")
- Created Date
- Actions (dropdown menu)

**Status Badge Colors:**
- Active: Green
- Pending: Blue (email verification pending)
- Suspended: Red
- Inactive: Gray

**Actions Dropdown:**
- Edit User
- Change Role
- Suspend/Activate Account
- Resend Invitation (if pending)
- View Login History
- Delete User

**Table Features:**
- Search by name/email
- Filter by:
  - Role (multi-select)
  - Status (multi-select)
  - Date range (created, last login)
- Sort by all columns
- Pagination with page size selector (10, 25, 50, 100)
- Bulk actions toolbar (appears when items selected):
  - Bulk invite
  - Bulk role assignment
  - Bulk suspend/activate
  - Bulk export
  - Bulk delete

**Empty States:**
- No users: "No users yet. Invite your first team member!"
- No search results: "No users found matching your criteria"
- Filtered out: "No users match the selected filters"

### 3. Create Users Dashboard (Main Entry Point)

Add `/admin/users` dashboard page with:

**Stats Cards (Top Row):**
- Total Users (with trend ↑ +12%)
- Active Users (green)
- Pending Invites (blue, clickable)
- Total Roles (clickable)

**Quick Actions Section:**
- Invite User (primary button)
- Manage Roles (secondary)
- Bulk Import (secondary)
- User Settings (link to settings)

**Tabs:**
- All Users (table with recent 10 users + "View All" button)
- Pending Invitations (table with invitation status)
- Roles & Permissions (overview cards)

**Recent Activity Feed:**
- User created
- User invited
- Role changed
- User suspended
- Login from new device

### 4. Add User Detail Page

Create `/admin/users/:id` page with:

**Header:**
- Large avatar
- Name and email
- Status badge
- Quick actions: Edit, Suspend, Delete

**Tabs:**
- **Overview**
  - Personal information (name, email, phone, timezone)
  - Account status and dates
  - Assigned roles and permissions
  - Profile completeness indicator
  
- **Activity**
  - Login history (date, IP, location, device)
  - Actions performed (audit log)
  - Session history
  
- **Sessions**
  - Active sessions list (device, browser, location, last active)
  - Revoke session button per session
  - "Logout all devices" button
  
- **Permissions**
  - Visual permissions matrix
  - Role-based permissions (inherited)
  - Custom permission overrides
  
- **Security**
  - Failed login attempts
  - Password last changed
  - Email verification status
  - Two-factor authentication status (if enabled)
  - Account lockout info

### 5. Add Roles Management Page

Create `/admin/users/roles` page:

**Roles List:**
- Card-based or table layout
- Show role name, description, user count
- Built-in roles (cannot delete): Admin, User, Viewer
- Custom roles (can edit/delete)
- "Create Role" button

**Create/Edit Role Modal:**
- Role name
- Description
- Color picker (for badge)
- Permissions checklist (organized by resource)
  - Users (view, create, edit, delete, invite)
  - Roles (view, manage)
  - Settings (view, manage)
  - [Other modules...]

**Permissions Matrix View:**
- Visual grid showing roles vs permissions
- Quick overview of what each role can do

### 6. Add Invitations Page

Create `/admin/users/invitations` page:

**Invitations Table:**
- Email
- Invited by
- Invited on
- Expires on
- Status (Pending, Accepted, Expired, Cancelled)
- Actions (Resend, Cancel, Copy link)

**Bulk Invite:**
- CSV upload
- Manual entry (multiple emails)
- Template selection
- Schedule send

**Invitation Templates:**
- Default template
- Custom templates with placeholders
- Preview before sending

### 7. Update Settings Integration

Add Users settings section at `/admin/settings/users`:

**User Management Settings:**
- Default role for new users
- Require email verification (toggle)
- Allow self-registration (toggle)
- Require admin approval (toggle)
- Account expiry default (days)

**Invitation Settings:**
- Invitation expiry (days)
- Max invitations per user
- Custom email template
- Branding (logo, colors)

**Password Policies:**
- Minimum length
- Require uppercase/numbers/special chars
- Password expiry (days)
- Password history (prevent reuse)

**Security Settings:**
- Max login attempts
- Account lockout duration
- Session timeout
- Force logout on password change

### 8. UI/UX Enhancements

**General Improvements:**
- Use consistent spacing (Tailwind: p-4, gap-4, etc.)
- Consistent button styles (primary, secondary, ghost, destructive)
- Loading states for all async operations
- Success/error toast notifications
- Confirmation dialogs for destructive actions
- Keyboard shortcuts (Cmd+K for search, etc.)
- Responsive design (mobile-friendly)
- Dark mode support

**Icons (Lucide React):**
- Users: `<Users />`
- UserPlus: `<UserPlus />`
- Shield: `<Shield />`
- Mail: `<Mail />`
- Calendar: `<Calendar />`
- Activity: `<Activity />`
- Settings: `<Settings />`
- MoreVertical: `<MoreVertical />`

**Color Palette:**
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Gray: (#6B7280)

### 9. Form Validation & Error Handling

**Implement:**
- Real-time validation on blur
- Clear error messages below fields
- Prevent submission if validation fails
- Network error handling with retry
- Optimistic updates with rollback on error

### 10. Accessibility

**Ensure:**
- Proper ARIA labels
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly
- Color contrast meets WCAG AA standards

---

## Technical Requirements

**Frontend Stack:**
- React with TypeScript
- Tanstack Router for navigation
- Tanstack Query for data fetching
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn/ui for components (or similar)
- Tanstack Form for form management
- Zod for validation

**API Integration:**
- Use existing endpoints from backend
- Implement proper loading states
- Cache user list with React Query
- Optimistic updates where appropriate
- Handle pagination server-side

**File Structure:**
```
modules/users/
├── pages/
│   ├── UsersDashboard.tsx
│   ├── UsersList.tsx
│   ├── UserDetail.tsx
│   ├── RolesPage.tsx
│   └── InvitationsPage.tsx
├── components/
│   ├── InviteUserModal.tsx
│   ├── EditUserModal.tsx
│   ├── UsersTable.tsx
│   ├── UserCard.tsx
│   ├── RoleSelector.tsx
│   ├── PermissionsMatrix.tsx
│   ├── SessionsList.tsx
│   └── ActivityLog.tsx
├── hooks/
│   ├── useUsers.ts
│   ├── useInviteUser.ts
│   ├── useRoles.ts
│   └── useUserPermissions.ts
└── types/
    └── index.ts
```

---

## Please Implement

1. Update the existing "Add User" modal to the new "Invite User" modal with all specified fields
2. Transform the users table to include all columns, filters, and bulk actions
3. Create the Users Dashboard as the main entry point
4. Build the User Detail page with all tabs
5. Add Roles management page
6. Add Invitations page
7. Integrate with Settings page
8. Ensure all UI follows the design system and is fully responsive
9. Add proper loading states, error handling, and success messages
10. Make it production-ready with accessibility and validation

---

## Expected Output

A fully functional, production-ready Users module UI that matches modern SaaS standards (similar to platforms like Vercel, Linear, or Notion's user management interfaces) with all features properly integrated and working seamlessly.