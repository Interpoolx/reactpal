# ReactPress 2.0

## Overview

ReactPress 2.0 is a Cloudflare-native SaaS orchestration platform designed to run multiple independent applications from a single codebase. It features a schema-less dynamic content engine that allows defining custom content types through an interactive UI, with automatic API generation for each content type.

The platform handles multi-tenancy at the edge with database partitioning, scoped storage, and cached tenant configurations. It supports advanced features like relationship fields, geo-location data, versioned assets, and real-time synchronization through Durable Objects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Multi-Tenancy Strategy
- **Database Isolation**: All D1 queries are automatically scoped using `tenant_id` through middleware, ensuring complete data separation between tenants
- **Storage Isolation**: R2 assets use tenant-prefixed paths with signed URL access control for secure file handling
- **Configuration Caching**: Tenant settings cached in Workers KV for sub-10ms resolution at the edge
- **Real-time Sync**: Durable Objects handle consistency for tenant-specific settings

### Dynamic Schema Engine
- **Field-Agnostic Design**: Custom content types (job listings, directories, wikis) defined via UI without code changes
- **Advanced Field Support**: Relationships (one-to-many, many-to-many), JSON metadata, geo-location, versioned assets
- **Auto-Generated APIs**: New content types automatically register REST endpoints

### Backend Architecture
- **Runtime**: Cloudflare Workers with Hono 4.x framework
- **Database**: Cloudflare D1 with Drizzle ORM for type-safe migrations
- **Caching Layer**: Workers KV for fast reads, Durable Objects for consistency
- **Storage**: Cloudflare R2 (S3-compatible) for assets
- **Authentication**: JWT-based multi-tenant auth with support for external providers (Clerk, Supabase)

### Frontend Architecture
- **Build Tool**: Vite 6.x with React 19
- **Routing**: TanStack Router with file-based and dynamic tenant routes
- **State Management**: TanStack Query for server-state sync and optimistic UI
- **Styling**: TailwindCSS 4.x with CSS variable injection for tenant-specific theming
- **Components**: Radix UI primitives with Framer Motion animations

### Package Structure
- `packages/core-engine/` - Dynamic schema and field resolution logic
- `packages/tenant-orchestrator/` - Domain mapping, provisioning, tenant lifecycle
- `packages/shared-ui/` - Reusable Radix-based design system
- `packages/modules/` - Auto-discovered feature plugins

## External Dependencies

### Cloudflare Services
- **D1**: SQLite-based relational database for persistent storage
- **Workers KV**: Key-value store for tenant configuration caching
- **R2**: Object storage for user uploads and assets
- **Durable Objects**: Stateful coordination for real-time features
- **Workers**: Edge compute runtime for API and SSR

### Authentication Providers
- JWT-based internal auth system
- Optional integration with Clerk or Supabase for external auth

### Frontend Libraries
- TanStack Router and Query for routing and data fetching
- Radix UI for accessible component primitives
- Framer Motion for animations
- TailwindCSS for utility-first styling