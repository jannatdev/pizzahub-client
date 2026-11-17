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
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (typed with LayoutProps<"/">), Geist fonts
│   │   ├── page.tsx           # Home page (currently an empty shell)
│   │   ├── globals.css        # Tailwind 4 CSS-first config + shadcn theme variables
│   │   └── favicon.ico
│   ├── components/ui/         # ~80 shadcn/ui primitives (button, card, input, badge, toast, sidebar, table, ...)
│   ├── hooks/                 # use-mobile, use-highlighted-code
│   └── lib/
│       ├── utils.ts           # re-exports { cn } from the "cn" package
│       └── highlighter.tsx
├── public/                    # static assets
└── package.json               # scripts: dev / build / start / lint (eslint)
```

**Not yet present** (expected by later phases — create them when the phase calls for it): `.env*`, `src/proxy.ts` (or `middleware.ts` — see §6), any `src/app` routes beyond `/`, Better Auth config, API client/fetch helpers, feature components outside `ui/`.

## 4. This Repo (pizzahub-server) — Sibling Structure

Currently a minimal scaffold only (`index.js` is 2 lines: `import express` + `import 'dotenv/config'`):

```
pizzahub-server/
├── index.js          # ESM entry point (type: "module")
├── package.json      # express ^5, mongodb ^7, dotenv, cors, nodemon
└── (planned) routes/ controllers/ middleware/ config/ utilities/
```

Phase-2 structure to build there: `config/` (env + MongoDB connection), `routes/`, `controllers/`, `middleware/` (JWT, role guards), `utilities/`. **No business APIs until Phase-2 explicitly asks for them.** The backend never trusts the frontend for role checks — every protected endpoint verifies JWT + role + resource ownership server-side.

## 5. Phase Roadmap (Requirements Reference)

Status markers: ⬜ not started, 🟡 in progress, ✅ done. Update this table as phases complete.

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Frontend setup: Next.js App Router, TS, Tailwind, shadcn/ui; clean structure; **no auth/dashboards/APIs/business features yet** | ⬜ |
| 2 | Backend setup: Express + MongoDB; routes/controllers/middleware/config/utilities; env vars + Mongo connection; **no business APIs yet**; explain structure when done | ⬜ |
| 3 | Design system: pizza theme (red primary, orange accent, cream bg); reusable **Button, Card, Input, Badge, Loader, Section Heading**; responsive | ⬜ |
| 4 | Reusable **Navbar** (Home, Browse Menu, Sign In, Sign Up) + **Footer**, themed consistently | ⬜ |
| 5 | **Better Auth**: email/password signup + login, Google OAuth, MongoDB adapter, env vars; roles Customer/Vendor only — **public users cannot register as Admin**; simple and secure | ⬜ |
| 6 | **Sign Up page**: Full Name, Email, Password, Profile Image, Role (Customer/Vendor). **Sign In page**: Email, Password, Google Login. Validation + toasts; redirect by role after login | ⬜ |
| 7 | Backend **JWT auth + role authorization**: middleware for JWT verification, Admin, Vendor, Customer; **401 unauthenticated, 403 wrong role** | ⬜ |
| 8 | Frontend **role-based dashboard protection** (Admin/Vendor/Customer); URL-tampering blocked; must work with production route refreshes (server-side checks, not client-only) | ⬜ |
| 9 | **Homepage**: Hero, Featured Menu Items, Pizza Categories, Why Choose PizzaHub, How PizzaHub Works; themed, responsive, simple motion animations | ⬜ |
| 10 | **Menu CRUD APIs**: create/get/get-by-id/update/delete; auth + vendor ownership checks; only **approved + active** items public | ⬜ |
| 11 | **Browse Menu page**: approved/active items; search by name, category tabs/filter, location filter, price asc/desc sort, loading + empty states; wired to backend API | ⬜ |
| 12 | **Menu details page** `/menu/[id]`: images, name, category, description, price, location, vendor info, Order button. Ordering rules: only logged-in Customers; vendors can't order own items; Admins can't place customer orders; invalid IDs handled | ⬜ |
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

- **`proxy.ts`, not `middleware.ts`** — as of Next.js 16 the middleware file convention is deprecated and renamed. Create `src/proxy.ts` at the same level as `src/app/`. The role-based route protection in Phase 8 belongs here (optimistic redirects only — real authorization stays on the backend). See `01-app/01-getting-started/16-proxy.md` and `01-app/03-api-reference/03-file-conventions/proxy.md`.
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
