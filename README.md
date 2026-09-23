# TrioW — Luxury Fashion Storefront

A full Next.js (App Router) e-commerce storefront + admin panel for the TrioW clothing
brand: dark charcoal/gold luxury theme, smart budget filtering, slide-out cart,
Bangladesh delivery zones (Inside/Outside Dhaka), COD + bKash/Nagad/Card checkout,
and a code-free admin panel for products, stock, and orders.

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

> This project was built in a sandboxed environment with no package-registry
> access, so `npm install` / `next build` could not be run here. Every file
> was hand-written and statically checked (bracket/paren balance, all `@/...`
> imports resolved against real exports, and all business logic — pricing,
> stock status, phone validation, slugs — unit-tested in isolation). Please
> run `npm install && npm run dev` locally as your first step to confirm the
> build, and open an issue-style note back to me if anything doesn't compile
> so I can fix it immediately.

## Admin panel

Go to `/admin`. Default password is `triow-admin`, set via the
`NEXT_PUBLIC_ADMIN_PASSWORD` environment variable (see `.env.example` —
copy it to `.env.local` and change it before deploying).

From the admin panel you can:
- Add/edit/delete products, set per-size stock, toggle out-of-stock
- Manage orders and update payment/fulfillment status
- Reset demo data back to the seeded catalog

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import it in Vercel ("New Project" → select the repo).
3. Add the `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable in Vercel's
   Project Settings before your first deploy.
4. Deploy — no other config needed.

## Swapping in real data

**Product photography:** products currently render with procedurally
generated garment illustrations (`lib/garment.js`) so the store looks
complete out of the box with zero external image dependencies. To use real
photos, open a product in `/admin` → Products and paste image URLs into the
"Image URLs" field (one per line) — the storefront prefers those over the
generated art automatically.

**Backend:** all data (products, orders, cart, wishlist) currently persists
to the browser via `lib/db.js` (localStorage), which keeps every tab in sync
and lets you demo the whole flow with no backend. To move to a real database
(e.g. Supabase), you only need to edit `lib/db.js` — replace the
load/save functions with calls to your database client. Nothing else in the
app touches storage directly; everything goes through this one file plus
`context/StoreContext.jsx`.

## Project structure

```
app/                 Routes: home, /shop, /product/[slug], /checkout,
                     /wishlist, /admin (separate layout, noindex)
components/          UI components (storefront + components/admin)
context/             Global StoreContext (cart, wishlist, products, orders)
hooks/               useStore, useProductFilters, useLockBody, useEscape
lib/                 config, utils, stock logic, garment art generator,
                     seed data, db.js (persistence layer)
```

## Tech stack

Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide React.
