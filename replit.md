# TatuTicket - SaaS Ticket Management Platform

## Overview

TatuTicket is a comprehensive multi-tenant SaaS platform for ticket management and customer support. The system enables companies (tenants) to sign up online through a streamlined SaaS registration flow, choose subscription plans, and immediately start managing their customer support operations. The platform features ticket management, hour bank tracking, knowledge base, customer management, and detailed reporting capabilities.

Key features include:
- Multi-tenant architecture with complete data isolation
- Ticket management with status tracking, priorities, and SLA monitoring
- Hour bank system for tracking billable time and client hours
- Knowledge base for self-service and internal documentation  
- Customer management and communication
- Dashboard with analytics and reporting
- Subscription management with Stripe integration
- Email notifications via SendGrid

## Recent Changes

**September 25, 2025** - Navigation Responsiveness Improvements:
- Fixed navigation bar responsiveness issues that caused menu items to overlap
- Implemented three-tier responsive layout: desktop (≥1024px), tablet (768px-1024px), mobile (<768px)
- Added compact tablet layout with optimized spacing and smaller text/buttons for intermediate screen sizes
- **Fixed critical responsiveness issue in 768px-863px range**: Created streamlined tablet layout with dropdown menu for navigation access
- Added MoreHorizontal dropdown menu for tablet navigation to prevent overcrowding while maintaining functionality
- Improved breakpoint transitions to eliminate content crowding and ensure all menu items remain visible
- Enhanced mobile hamburger menu with improved accessibility (aria attributes) and UX (auto-close on navigation)
- Optimized desktop and tablet navbars to use icon-only selectors for language and theme toggles to save space

**September 25, 2025** - Design Modernization:
- Completely redesigned color palette for modern, professional appearance
- Replaced green accent colors with sophisticated blue palette (hsl(217, 91%, 55%))
- Updated entire theme system with blue, white, black, and gray color scheme
- Improved accessibility with high contrast ratios for WCAG 2.1 AA compliance
- Enhanced both light and dark modes with consistent modern styling
- Updated hero gradients, buttons, charts, and sidebar colors for cohesive design

**September 25, 2025** - Replit Environment Setup:
- Successfully imported project from GitHub to Replit
- Configured Express server to run on port 5000 with host 0.0.0.0 for Replit compatibility
- Set up Vite development server with `allowedHosts: true` to work with Replit proxy
- Created and configured PostgreSQL database with full schema migration
- Set up workflow for development with webview output type
- Configured deployment settings for autoscale production deployment
- All application modules registered and running successfully (auth, tickets, customers, etc.)

**Previous Updates - September 25, 2025** - Multiple Improvements:

*SaaS Registration Flow Implementation:*
- Created new `/saas-register` page with multi-step registration process
- Integrated plan selection (Free, Professional, Enterprise) with company information and user registration
- Streamlined flow that automatically registers user, creates tenant, and completes onboarding
- Updated landing page to direct users to new SaaS registration flow
- Maintained compatibility with existing authentication and onboarding endpoints
- Added progress indicator and improved user experience with step-by-step navigation

*Angola Market Localization:*
- Migrated system from CNPJ to mandatory NIF (Número de Identificação Fiscal) for Angola market
- Updated all registration forms (saas-register, onboarding, settings) to require NIF field
- Configured system for Angola: AOA currency, Africa/Luanda timezone, pt-AO locale
- Updated validation schemas and backend services to use NIF instead of CNPJ

*Post-Registration Navigation Fix:*
- Fixed issue where users were redirected to onboarding page instead of dashboard after account creation
- Implemented smart redirection logic that waits for user cache to update with tenantId
- Applied fix to both SaaS registration and onboarding flows
- Users now go directly to company dashboard after successful account/company creation

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