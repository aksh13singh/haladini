# Haladini — Project Context & Handoff

> Premium boutique e-commerce storefront for **Haladini**, a real brand selling
> handcrafted block-print **bedsheets, cushions, suits, and shirts** (₹ INR,
> India). This is a production project intended to actually sell — not a demo.

Last updated: June 2026.

---

## 1. Overview

- **Type:** Full-stack e-commerce (custom storefront + admin) for a single brand.
- **Status:** Feature-complete and database-backed. Working locally. **Not yet deployed.**
- **Domain (planned):** `haladini.in` (registrar: GoDaddy or Hostinger — TBD).
- **Hosting (planned):** Netlify (free tier) — `netlify.toml` + `@netlify/plugin-nextjs` already configured.
- **Backend:** Supabase (decided to keep — see Decisions). Project ref `yyuoobyizrusnlqmhmar`, FREE tier, Tokyo region.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 14.2.x** (App Router) + **TypeScript** |
| Styling | **Tailwind CSS** + shadcn/ui-style components (hand-rolled in `components/ui`) |
| Animation | **Framer Motion** (scroll reveals, card hovers) + CSS keyframes |
| State | **Zustand** (+ `persist` to localStorage) — cart, wishlist, orders |
| Backend | **Supabase** — Postgres DB, Auth, Storage |
| Auth | Supabase Auth (email+password, Google ready) + `@supabase/ssr` middleware |
| Payments | **Razorpay** (modular, server-verified) + **Cash on Delivery** |
| Images | `next/image`, `sharp` (build-time generation scripts) |
| Misc | `nextjs-toploader` (route progress bar), `lucide-react` (icons) |
| Fonts | **Poppins** (sans) + **Fraunces** (serif display) via `next/font/google` |

### Design tokens (`tailwind.config.ts`)
- Flamingo `#FC8EAC` / deep `#F76C9C` / tint `#FFE9F0`
- Wine `#7A2E45` (footer, dark banners) · cream `#FFF7FA` · canvas white · ink `#1F1A1C`
- Custom CSS animations in `app/globals.css`: `hero-aurora`/`hero-pan`, `cat-banner-bg`/`cat-pan`, `marquee`, `fade-up`.

---

## 3. Architecture

### Rendering & data flow
- Product-reading pages are **`export const dynamic = "force-dynamic"`** so admin changes appear instantly.
- **`lib/products-db.ts`** is the read layer: a plain anon Supabase client with a **`{ cache: "no-store" }` fetch** (critical — `force-dynamic` alone did NOT bust the supabase-js fetch cache). It maps DB rows (snake_case) → `Product` (camelCase) and **falls back to `lib/sample-products.ts`** if Supabase is empty/unreachable, so the storefront never breaks.
- `lib/sample-products.ts` holds the 16-product sample catalogue + `applyProductQuery(list, opts)` (shared filter/sort) + `queryProducts`, `getNewArrivals`, `getProductBySlug`, etc. `products-db.ts` mirrors these as async.

### Auth
- Real **Supabase Auth**. `middleware.ts` (+ `lib/supabase/middleware.ts`) refreshes the session cookie on every request.
- Server pages read the user via `lib/supabase/server.ts` (`createClient()` using `cookies()`).
- Client components read the user via `lib/supabase/use-user.ts` (`useSupabaseUser()` hook).
- `is_admin` flag lives in the `profiles` table; `/admin` is gated server-side in `app/admin/layout.tsx`.

### Payments (modular — `lib/payments/`)
- `processPayment(method, ctx)` dispatches to `cod.ts` or `razorpay.ts`. Add Stripe as another case.
- COD: no gateway, order placed as `pending`.
- Razorpay: client loads checkout → `POST /api/razorpay/create-order` (server, secret key) → Razorpay modal → `POST /api/razorpay/verify` (HMAC SHA-256 signature check). Gated by `NEXT_PUBLIC_RAZORPAY_KEY_ID`; returns 503 if keys absent.

### Orders (dual-write — see Known Issues)
- On checkout success, the order is saved to **both** the local `order-store` (drives confirmation + customer "My Orders") **and** Supabase `orders` (best-effort, drives the admin Orders page).

### Admin (`/admin`, protected by `is_admin`)
- Product CRUD via server actions in `app/admin/actions.ts` (`assertAdmin()` then service-role write).
- Image upload: client-side in `components/admin/product-form.tsx` → Supabase Storage `product-images` bucket (public) → public URL stored in the product `images[]`.
- Orders list + status update.

---

## 4. Project structure (key files)

Everything below was built in this project. Mostly **created**; notable later
**modifications** are flagged.

```
middleware.ts                         Supabase session refresh
netlify.toml                          Netlify + @netlify/plugin-nextjs
.env.local.example                    All env vars documented
.env.local                            REAL keys (gitignored — Supabase live)
next.config.mjs                       remotePatterns: *.supabase.co, unsplash, pexels
tailwind.config.ts / globals.css      Design tokens + animations
supabase/schema.sql                   DB schema, RLS, triggers, storage bucket

app/
  layout.tsx                          Root: fonts, metadata, NextTopLoader, header/footer
  page.tsx                            Homepage (force-dynamic; sections wrapped in <Reveal>)
  not-found.tsx                       Branded custom 404
  opengraph-image.tsx                 OG image (edge) using app/og-logo-data.ts
  icon.png / apple-icon.png           Peacock favicon (generated)
  globals.css
  shop/page.tsx                       Shop All (force-dynamic, reads products-db)
  shop/loading.tsx                    Skeleton
  shop/[category]/page.tsx            Category page
  shop/[category]/[subcategory]/page.tsx   Subcategory (e.g. /shop/bedsheets/handblock-print)
  product/[slug]/page.tsx             Product detail (gallery, buy box, related)
  cart/page.tsx · checkout/page.tsx · order/[id]/page.tsx
  account/page.tsx                    Server: session → AuthPanel or AccountDashboard
  account/orders/page.tsx · wishlist/page.tsx
  about · contact · journal · journal/[slug] · faqs · terms · privacy · returns · shipping
  admin/layout.tsx                    is_admin guard + sidebar
  admin/page.tsx                      Dashboard stats
  admin/products/{page,new/page,[id]/edit/page}.tsx
  admin/orders/page.tsx
  admin/actions.ts                    saveProduct / deleteProduct / updateOrderStatus
  api/razorpay/create-order/route.ts · api/razorpay/verify/route.ts

components/
  brand/logo.tsx                      <Logo> (image + text fallback) + <HaladiniMark>
  layout/{announcement-bar,header,mobile-nav,footer,coupon-tab}.tsx
  ui/{button,input,badge,sheet,dialog,separator,reveal}.tsx
  home/{hero,hero-video-background,shop-by-category,category-card,new-in,
        editorial-banners,brand-statement,bulk-orders,trust-badges}.tsx
  product/{product-card,product-grid,product-card-skeleton,product-gallery,product-buy-box}.tsx
  shop/{shop-toolbar,subcategory-chips,category-banner,empty-state}.tsx
  cart/{cart-drawer,cart-content}.tsx
  checkout/{checkout-form,order-confirmation}.tsx
  contact/contact-form.tsx
  account/{auth-panel,account-dashboard,orders-screen}.tsx
  wishlist/wishlist-screen.tsx
  admin/{product-form,delete-product-button,order-status-select}.tsx

lib/
  utils.ts                            cn(), formatINR(), slugify()
  site-config.ts                      siteConfig, categories (+ subcategories), mainNav, contact, footerLinks
  types.ts                            Product, CartItem, Order, ShippingAddress, etc.
  sample-products.ts                  16 products + query helpers + applyProductQuery (fallback data)
  products-db.ts                      Supabase read layer (no-store + fallback)
  cart.ts                             getCartTotals(), SHIPPING_FEE=99
  journal.ts                          3 journal posts
  blur.ts                             BLUR_DATA_URL (image blur-up placeholder)
  use-has-mounted.ts
  supabase/{client,server,admin,middleware,use-user}.ts
  payments/{index,types,cod,razorpay}.ts

store/
  cart-store.ts · wishlist-store.ts · order-store.ts
  (auth-store.ts was DELETED — replaced by Supabase Auth)

scripts/                              One-off generators (run with `node scripts/X.mjs`)
  remove-logo-bg.mjs                  Logo background cutout → public/haladini-logo.png
  make-favicon.mjs                    Peacock favicon → app/icon.png, app/apple-icon.png
  make-og-logo.mjs                    → app/og-logo-data.ts
  make-product-placeholders.mjs       48 block-print swatches → public/products/*.jpg
  optimize-poster.mjs                 hero poster jpg
  seed.ts                            `npm run seed` → upsert sample products into Supabase

assets/haladini-logo-source.jpg       Original logo (pink bg) — source for cutout script
public/
  haladini-logo.png                   Transparent logo (header/footer/OG)
  hero-video.mp4 · hero-poster.jpg    Hero background
  products/<slug>.jpg, -2.jpg, -3.jpg Product placeholder swatches (16 × 3 = 48)
  categories/                         (empty) drop <slug>.jpg here for photo banners/cards
```

---

## 5. Database (Supabase)

- **Project:** ref `yyuoobyizrusnlqmhmar`, FREE, Tokyo (ap-northeast-1). URL is `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
- **Schema:** in `supabase/schema.sql` (already run). Re-runnable.
  - `profiles` (id → auth.users, full_name, **is_admin**, created_at) + `handle_new_user()` trigger + `is_admin()` helper.
  - `products` (name, slug unique, description, price [₹ int], compare_at_price, category, subcategory, images[], sizes[], fabric, care, stock, is_new, created_at).
  - `orders` (user_id, items jsonb, total, shipping_address jsonb, payment_method, payment_ref, status, created_at).
  - **RLS:** products public-read / admin-write; orders insert-own + admin-read/update; profiles own + admin.
  - **Storage bucket** `product-images` (public read, admin write).
- **Seeded:** 16 sample products (`npm run seed`).
- **Admin user:** `shekhawataksh13@gmail.com` has `is_admin = true`.
- To make another user admin: `update public.profiles set is_admin = true where id = (select id from auth.users where email = '<email>');`

---

## 6. Environment variables

See `.env.local.example` for the full list. Real values live in `.env.local` (gitignored). Required:

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL            (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY       (public)
SUPABASE_SERVICE_ROLE_KEY           (SECRET — server only; seed + admin)
NEXT_PUBLIC_RAZORPAY_KEY_ID         (empty until Razorpay set up)
RAZORPAY_KEY_SECRET                 (SECRET)
```
On deploy (Netlify): add all of these in the site's environment settings.

---

## 7. Commands & scripts

```bash
npm install                 # install deps
npm run dev                 # dev server (http://localhost:3000)
npm run build               # production build (see Known Issues #1!)
npm run start               # run production build
npm run lint
npm run seed                # tsx scripts/seed.ts → upsert sample products to Supabase

node scripts/remove-logo-bg.mjs           # regenerate transparent logo
node scripts/make-favicon.mjs             # regenerate peacock favicon
node scripts/make-og-logo.mjs             # regenerate OG logo data
node scripts/make-product-placeholders.mjs# regenerate product swatch placeholders
```

---

## 8. Important decisions

1. **Keep Supabase (do NOT build a custom backend).** This is a real business — prioritize reliability, security, backups, and speed over resume/custom-backend considerations.
2. **Storefront reads from Supabase** via `products-db.ts` with **sample-data fallback** and a **no-store fetch** so admin edits show immediately. Product/shop/category pages are `force-dynamic`.
3. **"Kurtis" was renamed to "Suits"** (slug `suits`, `/shop/suits`).
4. **Real Supabase Auth** replaced an earlier localStorage demo-auth (which was deleted). Customer login + admin both use it.
5. **Logo:** original is a pink-background JPEG; a flood-fill cutout script (`remove-logo-bg.mjs`) produced the transparent `public/haladini-logo.png`. Peacock-only favicon generated separately.
6. **Product placeholders** are generated block-print "swatch" gradients — meant to be **replaced with real photos** (same filenames in `public/products/`, or upload via admin).
7. **Modular payments**: COD fully works now; Razorpay is fully wired but **gated behind keys** (shows "add keys" until configured).
8. **Orders dual-written** (local store for customer confirmation/My Orders + Supabase for admin) — see Known Issues #3.
9. **Category banners** support a config-driven photo upgrade: set `image` on a category in `site-config.ts` (and drop `public/categories/<slug>.jpg`) → banner + homepage card both use the photo.
10. **Deploy target:** Netlify (free) + domain on GoDaddy/Hostinger pointed at it (DNS).

---

## 9. Known issues / gotchas / bugs

1. **⚠️ Never run `npm run build` while `npm run dev` is running.** They share `.next`; a build corrupts the dev server's CSS/JS chunks → site renders **unstyled/"distorted."** Fix: stop dev → build (or `rm -rf .next` + restart dev). Always **stop the dev server before any production build.**
   - **Windows/OneDrive follow-up:** after a production build, `next dev` may fail to start with `EINVAL: invalid argument, readlink '.next/server/chunks/*.js'`. Fix: delete `.next` (`Remove-Item -Recurse -Force .next`) then start dev. (The repo lives under OneDrive, which doesn't play nicely with Next's `.next` symlink cleanup.)
2. **Preview-screenshot tooling times out** on pages with infinite CSS animations (hero video, aurora gradient, marquee, category-banner drift). This is a tooling limitation, **not a code bug** — the pages render fine in a real browser. Verify those pages via HTTP/DOM checks or a real browser.
3. **Customer "My Orders" reads the LOCAL order-store, not Supabase.** Orders are dual-written, but the customer-facing list/confirmation read local state. A guest's order isn't tied to an account. *Next step: unify customer order reads to Supabase (by `user_id`).*
4. **Razorpay is not live.** Needs Razorpay KYC + live keys in env. COD works end-to-end today.
5. **Google sign-in button exists but is inert** until Google OAuth is configured in Supabase (Auth → Providers → Google).
6. **Email confirmation is ON by default in Supabase**, so new signups must confirm via email before signing in. For easy testing, disable it (Auth → Sign In/Providers → Email → "Confirm email" off), or confirm via the email link.
7. **No transactional email yet** (order confirmations / shipping updates). Needs an email provider (e.g. Resend) wired into checkout.
8. **Product images are placeholders** (gradient swatches) — replace with real photography for the premium look. Hover cross-fade + lifestyle banners are already wired for real photos.

---

## 10. Pending tasks & next steps (prioritized for go-live)

1. **Verify a clean production build** (`npm run build` with dev stopped) before deploying.
2. **Deploy to Netlify** + set env vars there + **point `haladini.in` DNS** at Netlify (GoDaddy/Hostinger). This is the last remaining step of the original plan.
3. **Razorpay live**: complete KYC (+ likely GST), add live keys → online payments activate automatically.
4. **Transactional email** (Resend or similar) for order confirmations + password reset SMTP.
5. **Real product + lifestyle photography** (the single biggest visual upgrade) — upload via `/admin`; set category `image` paths for photo banners.
6. **Unify customer orders to Supabase** (read by `user_id`) instead of local store.
7. Optional premium polish already discussed but not built: quick-view modal, star ratings/reviews, logo loading splash, smooth/inertia scrolling, size guide, "complete the look".
8. Optional: Google OAuth setup; rotating announcement-bar messages.

---

## 11. How things were verified (testing approach)

No automated test suite yet. Verification this build used:
- **HTTP probes** (status + content) against the dev server.
- **DOM/eval checks** + direct Supabase REST calls to confirm data flows (e.g., changed a DB price → confirmed it appeared on the page; created a product via the admin form → confirmed it hit the DB and the storefront).
- The **admin create-product → live storefront** flow was verified end-to-end with a temporary test admin (since removed).

Suggested future testing: Playwright e2e for the checkout + admin flows; a CI `npm run build` check.
