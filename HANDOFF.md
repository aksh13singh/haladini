# Haladini Handoff

This file is the quick bridge for moving between Codex, Claude, and future editing sessions.

## Current State

Haladini is a Next.js 14 storefront for handcrafted home and fashion products: bedsheets, cushions, suits, and shirts.

The project includes:

- Premium homepage with video hero, category cards, new arrivals, editorial banners, brand statement, bulk orders, trust badges, and rich footer.
- Shop, category, subcategory, and product detail pages.
- Product gallery with multiple images, thumbnail switching, hover zoom, and fullscreen lightbox.
- Cart, checkout, COD orders, Razorpay-ready payment layer, order confirmation, wishlist, account/profile, and orders pages.
- Supabase foundation: schema, client helpers, products/orders/profiles tables, storage bucket, and admin-oriented data layer.
- Policy/content pages: About, Contact, Journal, FAQs, Terms, Privacy, Returns, Shipping.
- About page now includes a "Founder's Corner" section with "A Letter from the Founder" and the highlighted Pink City / Rajput heritage quote.

For the deeper technical map, read `PROJECT_CONTEXT.md`.

## How Live Changes Should Work

If the live site is connected to Git/Netlify:

1. Make code changes locally in this folder.
2. Test locally with `npm run dev`.
3. Commit and push to the connected Git repository.
4. Netlify rebuilds and deploys automatically.

If the live site was uploaded manually instead of connected to Git, changes made here will not appear live until the updated build is uploaded or the hosting is connected to the repository.

## Important Rules

- Do not commit `.env.local`; it contains real keys.
- Use `.env.local.example` for variable names only.
- Avoid running a production build while the dev server is active, because both use `.next` and it can make the local preview look unstyled. Stop the dev server first.
- Supabase service-role key is secret. Never paste it into chat or commit it.
- Product images should eventually be managed from `/admin`; before that, static images live in `public/products/`.

## Key Files

- `PROJECT_CONTEXT.md` - detailed project state and architecture.
- `DEPLOY.md` - Netlify + custom domain deployment steps.
- `supabase/schema.sql` - database tables, RLS policies, and storage bucket.
- `lib/products-db.ts` - Supabase product read layer with sample fallback.
- `lib/sample-products.ts` - fallback/sample catalogue and product query helpers.
- `components/product/product-gallery.tsx` - multiple image gallery and zoom/lightbox.
- `lib/site-config.ts` - nav, categories, contact details, footer links, brand config.

## Next Suggested Work

Finish the Supabase/admin handoff:

1. Add the Supabase `service_role` key to `.env.local`.
2. Run the seed script to load the starter products.
3. Finish/verify `/admin` product CRUD and image upload.
4. Confirm live deployment reads from Supabase.
