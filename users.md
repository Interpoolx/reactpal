Suggested Module Structure:
modules/
├── users/
│   ├── controllers/
│   │   ├── UserController.ts
│   │   └── RoleController.ts
│   ├── services/
│   │   ├── UserService.ts
│   │   ├── RoleService.ts
│   │   └── InvitationService.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   ├── Permission.ts
│   │   └── UserRole.ts
│   ├── repositories/
│   │   ├── UserRepository.ts
│   │   └── RoleRepository.ts
│   ├── dto/
│   │   ├── CreateUserDto.ts
│   │   └── UpdateUserDto.ts
│   ├── middleware/
│   │   └── checkPermission.ts
│   ├── validators/
│   │   └── userValidators.ts
│   ├── routes/
│   │   └── userRoutes.ts
│   └── index.ts
│
├── auth/
│   └── (login, tokens, sessions)
│
└── tenants/
    └── (multi-tenancy logic)

    
Core Critical Features:
1. Authentication & Security ✅ MUST HAVE

Email verification status
Password requirements (strength, expiry)
Session management (active sessions, force logout)
Failed login tracking & account lockout

2. Multi-Tenancy ✅ MUST HAVE

Tenant assignment (which org user belongs to)
Tenant-level permissions
Cross-tenant data isolation
Support for users in multiple tenants (if needed for your use case)

3. Roles & Permissions ✅ MUST HAVE

Custom roles (create, edit, delete)
Granular permissions (CRUD at resource level)
Role assignment to users

4. User Management ✅ MUST HAVE

User status (Active, Inactive, Suspended)
Basic profile fields (name, email, phone, timezone)
Avatar/profile photo
Bulk operations (invite, delete, export)

5. Audit & Compliance ✅ MUST HAVE

Audit logs (who did what, when)
Last login timestamp
Created by / Modified by tracking
Soft delete (recoverable deletion)

6. Invitations ✅ MUST HAVE

Email invitation system with expiring tokens
Invitation status tracking (pending, accepted, expired)
Resend invitations

7. Access Control ✅ MUST HAVE

Account expiry date (for contractors/temp access)

8. UI/UX Essentials ✅ MUST HAVE

Search & filters (by role, status, tenant)
Export functionality (CSV)
Column sorting

9. Data Management ✅ MUST HAVE

GDPR compliance (data export, account deletion)