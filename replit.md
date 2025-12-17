# APIKeys.io - API Key Marketplace

## Overview

APIKeys.io is a developer-focused API key marketplace that allows users to purchase API access plans with multiple payment options. The application provides a complete e-commerce flow from browsing pricing tiers through checkout and payment confirmation, with instant API key delivery upon successful payment.

The platform offers three pricing tiers (Starter, Professional, Enterprise) and supports PayPal, Solana cryptocurrency, and bank transfer payment methods.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React Context for cart state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Build Tool**: Vite with hot module replacement
- **Form Handling**: React Hook Form with Zod validation

**Key Design Decisions**:
- Single-page application with client-side routing for smooth navigation
- Component-based architecture using shadcn/ui for consistent, accessible UI
- Theme support (light/dark mode) via CSS variables and ThemeProvider context
- Cart context provides global shopping cart state without external state libraries

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with connect-pg-simple for PostgreSQL storage

**Key Design Decisions**:
- Monorepo structure with shared schema types between client and server
- In-memory storage fallback (MemStorage class) when database is not available
- API key generation using cryptographically random strings with `sk_live_` prefix
- Request logging middleware for debugging API calls

### Data Storage
- **Primary Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema synchronization

**Database Tables**:
- `products`: API pricing tiers with features, limits, and pricing
- `orders`: Customer purchases with payment status and generated API keys
- `users`: User accounts for future authentication features

### Payment Integration
- **PayPal**: Server SDK integration for order creation and capture flows
- **Solana**: Client-side wallet address display for manual crypto payments
- **Bank Transfer**: Manual payment flow with order tracking

**PayPal Configuration**: Requires `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` environment variables. Gracefully degrades when credentials are missing.

### Build System
- **Development**: Vite dev server with Express API middleware
- **Production**: esbuild bundles server code, Vite builds client assets
- **Output**: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

## External Dependencies

### Payment Services
- **PayPal**: `@paypal/paypal-server-sdk` for payment processing (sandbox/production environments)
- **Solana**: Client-side wallet address only, no server SDK required

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: Session storage in PostgreSQL

### UI Component Libraries
- **Radix UI**: Headless component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component variants built on Radix
- **Lucide React**: Icon library
- **react-icons**: Additional icon sets (PayPal, Solana, social media)

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation (shared between client and server)
- **@hookform/resolvers**: Zod resolver for React Hook Form

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Class name deduplication