# TatuTicket - SaaS Ticket Management Platform

## Overview

TatuTicket is a comprehensive multi-tenant SaaS platform for ticket management and customer support. The system enables companies (tenants) to sign up online, choose subscription plans, and immediately start managing their customer support operations. The platform features ticket management, hour bank tracking, knowledge base, customer management, and detailed reporting capabilities.

Key features include:
- Multi-tenant architecture with complete data isolation
- Ticket management with status tracking, priorities, and SLA monitoring
- Hour bank system for tracking billable time and client hours
- Knowledge base for self-service and internal documentation  
- Customer management and communication
- Dashboard with analytics and reporting
- Subscription management with Stripe integration
- Email notifications via SendGrid

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18** and **TypeScript**, using modern tooling:
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and caching
- **Tailwind CSS** with **shadcn/ui** components for styling
- **React Hook Form** with **Zod** validation for form handling
- **Stripe React components** for payment processing

### Backend Architecture
The backend follows a **modular monolith** pattern with clear separation of concerns:
- **Express.js** server with TypeScript
- **Modular architecture** - each feature (auth, tickets, customers, etc.) is organized in separate modules with their own controller, service, repository, and types
- **Base classes** provide common functionality across modules (BaseController, BaseRepository, BaseService)
- **Centralized error handling** and request logging middleware
- **Authentication** via Replit's OpenID Connect integration with Passport.js
- **Session management** using PostgreSQL session store

### Data Storage
- **PostgreSQL** database with **Drizzle ORM** for type-safe database operations
- **Neon Database** as the PostgreSQL provider
- **Multi-tenant data isolation** - all entities include tenantId for complete data separation
- **Schema-first approach** with shared TypeScript types between frontend and backend
- **Database migrations** managed through Drizzle Kit

### Authentication & Authorization
- **OpenID Connect (OIDC)** integration with Replit for user authentication
- **Role-based access control** with user roles: global_admin, tenant_admin, agent, customer
- **Multi-tenant user management** - users can be associated with specific tenants
- **Session-based authentication** with secure HTTP-only cookies

### External Dependencies

**Payment Processing:**
- **Stripe** for subscription management, payment processing, and billing
- Supports multiple plan types (free, pro, enterprise) with different feature limits

**Email Services:**
- **SendGrid** for transactional emails and notifications
- Automated ticket notifications and system alerts

**Database & Infrastructure:**
- **Neon Database** (PostgreSQL) for primary data storage
- **WebSocket support** for real-time database connections
- **Session storage** in PostgreSQL for scalable session management

**Development & Testing:**
- **Jest** for unit testing with TypeScript support
- **ESBuild** for production builds
- **Vite plugins** for development experience (error overlay, dev banner)

The architecture emphasizes type safety with shared TypeScript schemas, clear separation of concerns through modular design, and scalability through proper multi-tenant patterns. The system is designed to handle multiple companies (tenants) with complete data isolation while sharing the same codebase and infrastructure.