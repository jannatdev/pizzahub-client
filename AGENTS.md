<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PizzaHub Project — Agent Guide

This document describes the PizzaHub project requirements, repo layout, conventions, and current progress so agents can work consistently across phases. **It is documentation only — no business code lives here.**

## 1. Project Overview

PizzaHub is a pizza ordering marketplace with three roles:

- **Customer** — browses the menu, places orders, manages their profile/orders.
- **Vendor** — lists menu items (subject to plan limits), accepts/rejects orders, upgrades to Premium via Stripe.
- **Admin** — manages users and menu-item approvals, views transactions. Admin registration is **never** allowed publicly.

Design identity: **red primary**, **orange accents**, **cream/light backgrounds**. Responsive, professional, simple motion animations where appropriate.

## 2. Repository Layout

Two sibling repositories under `C:\Node.projects\`:

| Repo | Path | Stack | Purpose |
| --- | --- | --- | --- |
| **pizzahub-client** (this repo) | `C:\Node.projects\pizzahub-client` | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui | Frontend: public site, auth pages, role dashboards |
| **pizzahub-server** | `C:\Node.projects\pizzahub-server` | Express 5 (ESM), MongoDB native driver, dotenv, cors, nodemon | Backend: REST API, JWT auth, role authorization, Stripe webhooks |

There is **no monorepo/workspace wiring** — they are separate git repos with separate `node_modules`. Cross-repo changes must be made by opening the other repo (or referencing its absolute path). Do not import code between them.

## 3. This Repo (pizzahub-client) — Current Structure

```
pizzahub-client/
├── AGENTS.md                  # This file (project docs; managed block above is from next dev)
├── next.config.ts             # cacheComponents, partialPrefetching, reactCompiler, Turbopack CSS rule
├── tsconfig.json              # strict, path alias @/* -> ./src/*
├── components.json            # shadcn config: style "base-nova", baseColor neutral, RSC on
├── eslint.config.mjs          # eslint-config-next (core-web-vitals + typescript), ESLint CLI
├── .env                       # git-ignored secrets (MONGODB_URI, Google OAuth, BETTER_AUTH_URL, ...)
├── src/
│   ├── proxy.ts               # Next 16 "middleware": session-cookie check for /dashboard* + /browse-menu/[id] → /menu/[id] redirect
│   ├── app/
│   │   ├── layout.tsx         # Root layout (typed with LayoutProps<"/">), Geist fonts, Toaster
│   │   ├── globals.css        # Tailwind 4 CSS-first config + shadcn theme variables
│   │   ├── (root)/            # Public site: Navbar, homepage, browse-menu list, menu/[id] details
│   │   ├── (auth)/            # sign-in / sign-up pages
│   │   ├── api/auth/[...all]/ # Better Auth route handler
│   │   └── (dashboard)/dashboard/   # Role-based dashboard (tree below)
│   ├── components/
│   │   ├── ui/                # ~80 shadcn/ui primitives (button, card, sheet, tooltip, sidebar, ...)
│   │   ├── navbar.tsx         # Public navbar (useSession, role-aware Dashboard link)
│   │   ├── auth/              # SignInForm, SignUpForm (Better Auth)
│   │   └── dashboard/         # Reusable dashboard shell (see §7)
│   ├── context/auth-context.tsx  # UserRole / AuthUser types (session comes from Better Auth)
│   ├── hooks/                 # use-mobile, use-highlighted-code
│   └── lib/
│       ├── auth.ts            # Better Auth server config (MongoDB adapter, `role` additionalField)
│       ├── auth-client.ts     # Better Auth react client (useSession, signIn, signOut)
│       ├── session.ts         # Server DAL: getCurrentUser() / requireRole() — role guards
│       ├── dashboard-paths.ts # DASHBOARD_HOME per role (safe to import client + server)
│       ├── api/               # fetch helpers: menu.ts, browseMenu.ts, order.ts, admin/, payment.ts
│       ├── utils.ts           # re-exports { cn } from the "cn" package
│       └── highlighter.tsx
├── public/                    # static assets
└── package.json               # scripts: dev / build / start / lint (eslint)
```

### Dashboard routes (Phase-8 style role protection)

```
src/app/(dashboard)/dashboard/
├── layout.tsx                 # Session guard behind <Suspense> + renders DashboardLayout shell
├── page.tsx                   # /dashboard → redirects to the role's overview
├── loading.tsx                # ContentSkeleton while a dashboard page loads
├── customer/                  # layout.tsx → requireRole("customer"); page, orders/, profile/
├── vendor/                    # layout.tsx → requireRole("vendor"); page, menu/, menu/AddMenu/, menu/EditMenu/[id]/, orders/, subscription/, profile/
└── admin/                     # layout.tsx → requireRole("admin"); page, users/, menu/, transactions/, profile/
```

Protection layers (in order): `src/proxy.ts` (cookie presence, no DB) → `dashboard/layout.tsx` (valid session, or → `/sign-in`) → `customer|vendor|admin/layout.tsx` (`requireRole`, wrong role → that user's `DASHBOARD_HOME`). New dashboard routes must live under a role segment so the existing guard covers them. Feature pages are `PagePlaceholder` stubs until their phases build them.

**Not yet present** (expected by later phases — create them when the phase calls for it): menu update/delete APIs, the Phase-16 order fields (delivery date/address), and admin transaction records in pizzahub-server — basic menu browse/details/create, order create/list, admin, and payment-verify routes already exist there; real dashboard feature pages (menu CRUD, orders, transactions, Stripe) are still `PagePlaceholder` stubs.

## 4. This Repo (pizzahub-server) — Sibling Structure

Layered structure is now in place — **one route file per item**, mounted in `index.js`:

```
pizzahub-server/
├── index.js                  # Express app: cors + Better Auth (/api/auth/*splat) + json, mounts every route file, error handler last
├── package.json              # express ^5, mongodb ^7, better-auth, multer, cors, nodemon, zod
│                             #   "dev": nodemon --ext js,ts index.js  (watches .ts edits!)
├── .env                      # MONGODB_URI, IMGBB_API_KEY, CLIENT_URL, BETTER_AUTH_URL,
│                             #   BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID/SECRET (MUST match the client's .env)
├── config/
│   └── db.config.ts          # MongoDB connection + shared collections (users, menus, orders)
├── lib/
│   └── auth.ts               # Better Auth server config (MongoDB adapter, `role` additionalField)
├── route/                    # Path wiring only → mounted 1:1 in index.js
│   ├── image.route.ts        #   POST /images/profile   (used by the client SignUpForm)
│   ├── menu.route.ts         #   POST /api/menu/:email  (attachSession runs first)
│   ├── browseMenu.route.ts   #   GET /api/browse-menu/all (public: approved+active, facets, search/sort)
│   ├── singleMenu.route.ts   #   GET /api/menu/:id      (public details + vendorImage join)
│   ├── order.route.ts        #   POST|GET /api/orders   (requireAuth; create is customer-only)
│   ├── admin/                #   admin users/overview + admin menu actions on /api/menu
│   └── payment.route.ts      #   POST /api/payment/checkout_verify (Stripe verify → payments record)
├── controllers/
│   ├── image.controller.ts   # profile image → ImgBB
│   ├── menu.controller.ts    # menu create: session guard, role, ownership, validation, free-plan 3-item limit
│   ├── browseMenu.controller.ts # public browse: Approved+isActive, search/sort/facets, vendor image join
│   ├── singleMenu.controller.ts # details: 400 invalid id, 404 missing, vendor image join
│   ├── order.controller.ts   # createOrder: 401/403 gates, approved+active checks, price read from DB
│   └── admin/                # admin controllers (users, menu, overview)
├── middleware/
│   ├── auth.middleware.ts    # attachSession → req.user; requireAuth → 401 without a session
│   └── upload.middleware.ts  # multer memory upload (JPG/PNG/WEBP, 2 MB)
└── services/
    └── imgbb.service.ts      # ImgBB upload helper
```

Conventions: `.ts` files run natively via Node ≥23 type stripping (Node 26 in use) — imports must carry the `.ts` extension. Controllers import collections from `config/db.config.ts` (never from `index.js`); **`users` points at Better Auth's `user` collection** — the legacy `users` collection is never written to, so reading user data from it always comes back empty. Handlers that need the logged-in user read `req.user`, which `middleware/auth.middleware.ts` fills from the Better Auth session cookie, and **fail closed with 401 (no session) / 403 (wrong role or not the owner)** — the backend never trusts the frontend for role checks; every protected endpoint must verify session + role + resource ownership server-side (the JWT middleware of Phase 7 will slot into the same place). To add a new item: create `route/<item>.route.ts` + `controllers/<item>.controller.ts`, then one `app.use("/api", ...)` line in `index.js`.

Auth sharing rules (both repos): **`BETTER_AUTH_SECRET` (and the Google OAuth credentials) must be identical in both `.env` files.** Better Auth signs the session cookie with that secret, and each app verifies it — if they differ, the Next.js server-side session read (`src/lib/session.ts`) returns `null`, so `/dashboard/**` bounces signed-in users back to `/sign-in`. Likewise, any browser `fetch` from the client to `NEXT_PUBLIC_API_URL` (another origin) must pass `credentials: "include"` or the session cookie is never sent and the API answers 401.

## 5. Phase Roadmap (Requirements Reference)

Status markers: ⬜ not started, 🟡 in progress, ✅ done. Update this table as phases complete.

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Frontend setup: Next.js App Router, TS, Tailwind, shadcn/ui; clean structure; **no auth/dashboards/APIs/business features yet** | ⬜ |
| 2 | Backend setup: Express + MongoDB; routes/controllers/middleware/config/utilities; env vars + Mongo connection; **no business APIs yet**; explain structure when done | ✅ |
| 3 | Design system: pizza theme (red primary, orange accent, cream bg); reusable **Button, Card, Input, Badge, Loader, Section Heading**; responsive | ⬜ |
| 4 | Reusable **Navbar** (Home, Browse Menu, Sign In, Sign Up) + **Footer**, themed consistently | ⬜ |
| 5 | **Better Auth**: email/password signup + login, Google OAuth, MongoDB adapter, env vars; roles Customer/Vendor only — **public users cannot register as Admin**; simple and secure | ⬜ |
| 6 | **Sign Up page**: Full Name, Email, Password, Profile Image, Role (Customer/Vendor). **Sign In page**: Email, Password, Google Login. Validation + toasts; redirect by role after login | ⬜ |
| 7 | Backend **JWT auth + role authorization**: middleware for JWT verification, Admin, Vendor, Customer; **401 unauthenticated, 403 wrong role** | ⬜ |
| 8 | Frontend **role-based dashboard protection** (Admin/Vendor/Customer); URL-tampering blocked; must work with production route refreshes (server-side checks, not client-only) | ✅ |
| 9 | **Homepage**: Hero, Featured Menu Items, Pizza Categories, Why Choose PizzaHub, How PizzaHub Works; themed, responsive, simple motion animations | ⬜ |
| 10 | **Menu CRUD APIs**: create/get/get-by-id/update/delete; auth + vendor ownership checks; only **approved + active** items public | ⬜ |
| 11 | **Browse Menu page**: approved/active items; search by name, category tabs/filter, location filter, price asc/desc sort, loading + empty states; wired to backend API | ✅ |
| 12 | **Menu details page** `/menu/[id]`: images, name, category, description, price, location, vendor info, Order button. Ordering rules: only logged-in Customers; vendors can't order own items; Admins can't place customer orders; invalid IDs handled | ✅ |
| 13 | **Vendor Dashboard**: responsive sidebar (Overview, My Menu Items, Add Menu Item, Customer Orders, Subscription, Profile Settings) + overview stats. **Menu management**: CRUD, availability toggle; Free plan max **3 active** items, Premium unlimited (backend-enforced); **ImgBB** image upload; loading/error handling; keep existing menu functionality | ⬜ |
| 14 | **Admin Dashboard**: sidebar (Overview, Manage Users, Manage Menu Items, Transactions) + platform stats. **Manage Users**: view/search/filter by role/block/unblock. **Manage Menu Items**: view/search/filter/approve/reject/delete. Admin-only APIs; not all actions implemented yet | ⬜ |
| 15 | **Customer Dashboard**: Overview (total/pending/accepted/rejected orders), My Orders, Profile Settings. Customers view own orders + details, cancel **Pending only**; ownership verified on backend | ⬜ |
| 16 | **Order system**: form with Delivery Date, Delivery Address, Additional Message; auto Customer/Item/Vendor; default status **Pending**; statuses Pending/Accepted/Rejected/Cancelled; prevent duplicate active orders for same item + delivery date | ⬜ |
| 17 | **Vendor order management**: sees orders for own items (customer, item, date, address, message, status); Accept/Reject **Pending only**; cannot modify other vendors' orders | ⬜ |
| 18a | **Stripe Checkout (Vendor Premium)**: Upgrade → backend creates Checkout Session → payment → **Stripe webhook** verifies → update subscription → save transaction. **Never activate Premium from the frontend success page** — webhook only | ⬜ |
| 18b | **Admin Transactions page**: vendor, plan, amount, currency, payment status, date; view-only (no editing payment records). *(Spec lists this as a second "Phase-18" — treat as 18b.)* | ⬜ |
| 19 | **Profile Settings** (Customer + Vendor): update name, profile image, other editable info; **cannot** change role or subscription status; success/error toasts | ⬜ |
| 20 | **Security audit**: JWT verification, role authorization, resource ownership, blocked users, env vars, protected APIs, Admin/Vendor/Customer protection, Stripe webhook verification. Fix issues **without changing unrelated functionality** | ⬜ |

## 6. Next.js 16 Conventions (This Installation)

Read the matching guide in `node_modules/next/dist/docs/` before writing code. Key points for this project:

- **`proxy.ts`, not `middleware.ts`** — as of Next.js 16 the middleware file convention is deprecated and renamed. `src/proxy.ts` exists and runs an optimistic session-cookie check on `/dashboard*` (no DB reads). Real authorization (valid session + role) stays in the dashboard layouts via `src/lib/session.ts`. See `01-app/01-getting-started/16-proxy.md` and `01-app/03-api-reference/03-file-conventions/proxy.md`.
- **Typed route helpers** — use the globally available `PageProps<'/route'>` / `LayoutProps<'/route'>` helpers instead of hand-written prop types (already used in `layout.tsx`).
- **Cache Components is on** (`cacheComponents: true` + `partialPrefetching` in `next.config.ts`) — data fetching follows the Cache Components model (`'use cache'`, `cacheTag`/`cacheLife`). Per-user/auth data must not be statically cached; see `01-app/02-guides/authentication-with-cache-components.md` and `01-app/01-getting-started/08-caching.md`.
- **Turbopack is the default** for `next dev` / `next build`; CSS goes through the `@tailwindcss/turbopack` loader rule in `next.config.ts`. `reactCompiler: true` is enabled (babel-plugin-react-compiler) — avoid patterns that break the React Compiler.
- **Async request APIs** — `params`, `searchParams`, `cookies()`, `headers()` are async (`await` them).
- **`next lint` is gone** — lint with `npm run lint` (ESint CLI directly).
- **Docs index**: `node_modules/next/dist/docs/` (`01-app/` for App Router guides + API reference; `02-pages/`; `03-architecture/`).

## 7. Frontend Conventions

- **Stack**: Next.js 16.4.6, React 19.3, TypeScript (strict), Tailwind CSS **4.3.3** (CSS-first — no `tailwind.config`; theme tokens live in `src/app/globals.css` via `@theme` + CSS variables), shadcn/ui with **style `base-nova`** built on **@base-ui/react** primitives (not Radix).
- **Path aliases**: `@/*` → `src/*` (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).
- **`cn` helper**: import from `cn` package via `@/lib/utils` (`export { cn } from "cn"`).
- **Icons**: lucide-react (`iconLibrary: "lucide"`).
- **Theming**: extend the shadcn CSS variables in `src/app/globals.css` to establish the PizzaHub red/orange/cream palette (Phase 3) rather than hardcoding colors in components.
- **Component layers**: keep shadcn primitives in `src/components/ui/` (regenerate/extend via shadcn CLI, don't hand-edit unnecessarily); build PizzaHub feature components (Button wrappers, Section Heading, Loader, Navbar, Footer, dashboards) in `src/components/` (or colocated under `src/app/<route>/_components/` for route-private UI — note `_folder` is private/non-routable).
- **No business logic in `ui/` primitives**; reusable themed components (Phase 3/4) compose the shadcn primitives.
- **Toasts**: shadcn `toast`/`sonner`-style components already available in `ui/` — use them for validation feedback (Phase 6+).
- **Server vs client**: default to Server Components; add `'use client'` only where interaction is required (forms, toasts, filters, dashboard interactivity).

## 8. Auth & Security Rules (Phases 5–8, 20)

- **Better Auth** on the frontend with **MongoDB adapter**; email/password + Google sign-in.
- Roles: `customer`, `vendor` (public sign-up), `admin` (**no public registration path — never expose a role field that accepts `admin`**).
- Backend **JWT** middleware: missing/invalid token → **401**; valid token but wrong role → **403**.
- **Resource ownership** checks on every mutating endpoint (vendor owns menu item/order; customer owns order; admin-only routes gated by role).
- **Blocked users** cannot authenticate/act (enforced server-side).
- **Phase 8 route protection** must survive hard refreshes / direct URL entry → enforce server-side (proxy + server-side session/role checks in layouts/pages), never rely solely on client-side redirects.
- **Stripe**: only the **verified webhook** activates Premium; webhook signature verification required; the success/return page must not grant entitlements.
- **Secrets** only in `.env*` files (git-ignored); never commit `.env`, never expose `SECRET_KEY`/DB URI/Stripe secret/ImgBB key to `NEXT_PUBLIC_*`.
- Frontend auth is UX-only; **the backend is the source of truth** for every authorization decision.

## 9. Backend Conventions (Phases 2, 7, 10, 16–18, 20)

- ESM (`"type": "module"`), Express 5, MongoDB native driver.
- Layered structure: `routes/` (path wiring) → `controllers/` (request handling) → `middleware/` (JWT verify, `requireAdmin` / `requireVendor` / `requireCustomer`, ownership checks) → `config/` (env, Mongo connection) → `utilities/`.
- Consistent JSON error shape; **401** unauthenticated, **403** unauthorized role, **404** missing resource, **409** duplicate (e.g., duplicate active order).
- Public menu queries filter `status: 'approved'` + `active: true`.
- Vendor plan limits (Free = 3 active items) enforced **in the backend**, not the UI.
- CORS configured for the frontend origin; all env vars via `dotenv`.

## 10. Working Agreement

1. **Scope discipline** — implement only what the current phase asks; earlier phases explicitly forbid building ahead (no auth/APIs before their phase).
2. **Read the version-matched Next.js docs** before touching routing, caching, proxy, or data fetching (§6).
3. **Keep both repos consistent** — an API added on the server should be consumed by the client in the same phase when the spec says so.
4. **Don't break existing features** — especially menu functionality (Phase 13) and, during Phase 20, unrelated functionality while fixing security issues.
5. **Update this file** when structure, conventions, or phase status changes — and keep the `next dev`-managed block at the top intact.
6. **Verification**: `npm run lint` and `npm run build` for the client; server smoke-tested via `nodemon`/`node index.js`. No test framework is configured in either repo yet.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
