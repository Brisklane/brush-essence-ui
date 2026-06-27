# Brush Essence — Storefront (UI)

The customer storefront and admin dashboard for the Brush Essence oil‑painting
shop. Built with **Next.js 16 (App Router, React 19)**, **TypeScript**, and
**Tailwind CSS v4**. It talks to the separate [.NET API](../brush-essence-api).

---

## Tech stack

| Concern            | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| Framework          | Next.js 16 (App Router, React 19, React Compiler)             |
| Language           | TypeScript                                                    |
| Styling            | Tailwind CSS v4 (CSS‑first, design tokens in `globals.css`)   |
| Forms & validation | `react-hook-form` + `zod`                                     |
| Component variants | `class-variance-authority`                                    |
| Fonts              | Geist (sans) + Cormorant Garamond (display serif) via `next/font` |
| Icons              | Hand‑rolled inline SVGs (no icon library)                     |

No paid/third‑party UI libraries — primitives live in `src/components/ui`.

---

## Prerequisites

- **Node.js 20+**
- The **[Brush Essence API](../brush-essence-api)** running locally (default
  `http://localhost:5150`)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then edit if your API runs elsewhere

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

Copy `.env.example` → `.env.local`:

| Variable                   | Exposed to browser | Purpose                                                       |
| -------------------------- | ------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ yes             | Base URL the browser uses to call the API.                   |
| `API_BASE_URL`             | ❌ server‑only     | Base URL the Next.js auth route handlers (BFF) use.          |
| `NEXT_PUBLIC_SITE_URL`     | ✅ yes             | Public URL of this site, used for SEO (sitemap, canonical, OG). |

Variables are validated at startup by `src/lib/env.ts` (client) and
`src/lib/env.server.ts` (server) — a misconfiguration fails fast with a clear error.

---

## Available scripts

```bash
npm run dev          # start the dev server
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier write
```

---

## Project structure

```
src/
  app/                     # App Router: pages + BFF route handlers
    (auth)/                # login, register, forgot/reset password
    (protected)/           # account, admin, checkout, orders, custom-requests
    admin/                 # dashboard, paintings, categories, mediums, orders,
                           #   requests, reviews, users  (under (protected))
    api/auth/              # BFF: login/refresh/logout — sets the httpOnly cookie
    gallery/               # catalogue + product detail (+ reviews)
    cart/  support/        # cart, support contact page
    sitemap.ts robots.ts   # SEO
    layout.tsx globals.css # root layout + Tailwind tokens / theme
    error.tsx global-error.tsx  # error boundaries
  components/
    ui/                    # design-system primitives (button, badge, input, …)
    layout/ catalog/ cart/ orders/ custom-requests/ reviews/ admin/ support/ forms/
  lib/                     # api clients, auth helpers, zod validations, utils
  providers/               # auth, cart, theme providers
  config/site.ts           # brand, nav, social + support email
  types/                   # shared types mirroring the API DTOs
  proxy.ts                 # route protection (Next 16 "middleware")
```

---

## How it works

### Authentication (BFF pattern)

- The browser **never** stores the refresh token. The Next.js route handlers in
  `app/api/auth/*` proxy to the API and store the **refresh token in an httpOnly
  cookie**; only the short‑lived **access token** is returned to the browser and
  kept in memory (`lib/auth/token-store.ts`).
- `lib/api-client.ts` (`apiFetch`) attaches the access token as a Bearer header
  and transparently refreshes once on a `401`.
- `src/proxy.ts` gates `/account`, `/admin`, `/checkout`, `/orders`,
  `/custom-requests` by the presence of the session cookie; fine‑grained
  role/ownership checks are enforced by the API and in‑page guards
  (`components/auth/require-auth.tsx`, the admin layout).

### Theming

Light/dark mode is class‑based: an inline script sets `.dark` on `<html>` before
paint (no flash), and all colours are CSS variables in `globals.css`. The palette
is a navy + gold gallery aesthetic with semantic colour scales (brand, gold,
success, warning, danger).

### Store conventions

- **Single currency: PKR** (set by the API; the UI just formats it).
- **Dimensions** are entered/displayed in **inches**, with **cm shown
  automatically** (e.g. `8 × 10 in (20 × 25 cm)`).

### Support contact

The footer "Support" link opens `/support`, a contact form that composes a
pre‑filled email to the address in `config/site.ts` (`supportEmail`) and opens
the visitor's mail app — no mail server required. **Set your real address in
`supportEmail`.**

---

## Features

Storefront: gallery with search / category / price filters, product details with
**star ratings & reviews**, cart (guest + signed‑in, auto‑merged on login),
checkout, order history & tracking, **custom painting requests** (commissions with
reference‑image uploads).
Admin (`/admin`): dashboard analytics, manage paintings / categories / **mediums**
/ orders / custom requests / **reviews** (moderation) / users.

---

## Production notes

- `next build` output can be served with `npm run start` or any Node host.
- SEO is wired (`sitemap.xml`, `robots.txt`, Product JSON‑LD, OpenGraph) — set
  `NEXT_PUBLIC_SITE_URL` to your real domain.
- Images are loaded from the API origin with `loading="lazy"` / `decoding="async"`
  (the project intentionally avoids `next/image` remote config).
