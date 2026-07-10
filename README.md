# Xental - Frontend

Xental is a B2B Fintech Infrastructure and Payment Platform. This repository contains the frontend application, encompassing both the **Merchant Dashboard** (for businesses to manage their dedicated virtual accounts, payments, settlements, and developer API integrations) and the **Internal Admin Portal** (for the Xental team to manage onboarding, KYC/KYB, and reconciliation).

## Tech Stack

- **Framework:** Next.js (App Router, v16)
- **Library:** React 19
- **Styling:** Tailwind CSS v4
- **State Management & Data Fetching:** TanStack React Query v5
- **Forms & Validation:** React Hook Form + Zod
- **UI Components:** shadcn/ui (Radix Primitives) + Base UI
- **Icons:** Lucide React
- **HTTP Client:** Axios (configured with intercepts in `src/lib/http.ts`)
- **Package Manager:** pnpm

## Project Structure

The project strictly follows the App Router architecture and keeps logic modular.

```text
src/
├── actions/        # Next.js Server Actions (if any)
├── api/            # API integration layer (Axios endpoints, React Query hooks, Types)
├── app/            # Next.js App Router (Pages, Layouts, Routing)
│   ├── (admin)/    # Internal Admin Portal routes
│   ├── (auth)/     # Public authentication routes
│   └── (dashboard)/# Merchant Dashboard routes
├── components/     # React Components
│   ├── admin/      # Admin-specific components
│   ├── dashboard/  # Merchant-specific components
│   └── ui/         # Reusable design system / shadcn components
├── lib/            # Utilities (HTTP clients, cookie managers, formatting, utils)
├── schemas/        # Zod validation schemas
└── proxy.ts        # Next.js Middleware/Proxy logic for route protection
```

## Local Development Setup

### 1. Prerequisites
- Node.js (v20+ recommended)
- `pnpm` installed (`npm install -g pnpm`)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
Copy the example environment file and fill in the required variables (like the backend API base URL).
```bash
cp src/.env.example src/.env
```
*(Ensure your API endpoint points to either the Sandbox or your local backend server.)*

### 4. Run the Development Server
```bash
pnpm dev
```
Open http://localhost:3000 in your browser.

## Authentication Flow

The application handles two distinct authentication realms seamlessly using a proxy/middleware approach (`src/proxy.ts`):
1. **Merchant Portal:** Authentication is handled by the backend via `HttpOnly` cookies (`xnt_access` and `xnt_refresh`). Because these are invisible to the frontend client, `universal-cookie` is used to set a first-party sentinel cookie (`xnt_session`) upon successful login. This sentinel is what the Next.js middleware uses to gate access to the `/dashboard` routes.
2. **Admin Portal:** Uses a separate set of `xnt_admin_access` and `xnt_admin_role` cookies. These are explicitly returned in the login response body and securely managed and set on the client-side via `universal-cookie` (see `src/lib/get-token.ts`).

## Styling & UI Patterns

- **Tailwind v4:** Utility-first styling is used exclusively. Avoid inline styles unless absolutely necessary for dynamic calculations.
- **shadcn/ui:** Component code is located in `src/components/ui/`. These primitives form the foundation of our internal design system and are customized strictly according to Xental brand guidelines.
- **Framer Motion:** Used for micro-interactions, layout transitions, and fluid animations.

## Developer Integration Support

Xental provides robust APIs for seamless business integration. When building or debugging integrations via the frontend:
1. API Keys for Staging and Production environments can be generated via the Developer Settings in the Merchant Dashboard.
2. Ensure you are directing requests to the correct base URLs (`api.staging.xental.online` for testing, `api.xental.online` for live production).
3. Production enablement requires full KYB compliance. Refer to our API documentation for detailed endpoint specs regarding virtual accounts, settlements, and webhooks.

## Scripts

- `pnpm dev` - Starts the Next.js dev server.
- `pnpm build` - Builds the application for production.
- `pnpm start` - Starts the built Next.js production server.
- `pnpm lint` - Runs ESLint to check for code quality.
