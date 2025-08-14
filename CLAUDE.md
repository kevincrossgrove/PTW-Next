# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Setup
- Install Docker Desktop
- Run: `docker run -d --name mongo-ptw -p 27018:27018 mongo:latest mongod --port 27018`
- Note: Uses port 27018 instead of default 27017

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: MongoDB with better-auth adapter
- **Authentication**: better-auth with email/password and Google OAuth
- **UI**: Radix UI components with Tailwind CSS v4
- **State Management**: React 19 with built-in features
- **Table Management**: TanStack Table
- **Routing**: Next.js App Router + React Router (for trainer portal)

### Project Structure

#### Core Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components organized by domain
- `lib/` - Utilities, database connection, auth configuration
- `trainer-portal/` - Separate React Router app for trainer functionality

#### Authentication & Authorization
- Uses better-auth with MongoDB adapter (`lib/auth.ts`)
- User roles: `player`, `parent`, `trainer`, `admin`
- Additional `appRole` field for app-specific permissions
- Middleware protects `/dashboard`, `/login`, `/signup` routes
- Admin layout checks for admin role, trainer portal has separate routing

#### Portal Architecture
1. **Main App** (Next.js App Router):
   - Public pages, auth, dashboard, admin portal
   - Admin portal at `/admin/*` with role-based access
   
2. **Trainer Portal** (React Router SPA):
   - Separate routing system at `/trainer/*`  
   - Embedded as client component in `app/(trainer-portal)/trainer/[[...app]]/page.tsx`

#### Component Organization
- `components/ui/` - shadcn/ui base components
- `components/app/` - App-specific reusable components (AppSelect, AppLoader, AppDrawer, etc.)
- `components/admin/` - Admin portal specific components
- `components/auth/` - Authentication related components

#### API Structure
- `app/api/admin/` - Admin management endpoints
- `app/api/auth/[...all]/` - better-auth API routes
- `app/api/constants.ts` - API constants

### Key Features
- Multi-role user system with invite-based admin/trainer onboarding
- Responsive design with mobile-first approach
- Theme support via next-themes
- Table interfaces for user management in admin portal
- Custom AppSelect component for form inputs

### Development Notes
- Uses Turbopack for faster development builds
- TypeScript throughout with strict configuration
- ESLint configured for Next.js
- Custom utilities in `lib/utils.ts` using clsx and tailwind-merge
- **Zod Validation**: Always use `schema.parse()` wrapped in try-catch blocks instead of `safeParse()` for consistent error handling
- **Data Fetching**: Always use `useQuery` from @tanstack/react-query for data fetching, never use `useEffect` for this purpose
- **Drawers**: Use `@components/app/AppDrawer.tsx` when a drawer is requested
- **Function Placement**: Place handler functions below the JSX return statement, using function declarations instead of arrow functions