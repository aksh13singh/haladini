# Deploying Haladini (Netlify + custom domain)

This puts `haladini.in` live. The app is a **Next.js 14 SSR** app with a
Supabase backend — it needs a Node host, which Netlify provides via
`@netlify/plugin-nextjs` (already configured in `netlify.toml`).

**Prerequisites:** a (free) GitHub account, a (free) Netlify account, and your
domain (GoDaddy or Hostinger). The repo is already committed locally with your
secrets safely git-ignored.

---

## Step 1 — Push the code to GitHub

The repo is initialised and committed. Create an empty repo on GitHub and push.

**Option A — GitHub website:**
1. Go to <https://github.com/new>. Name it `haladini` (Private is fine). **Do NOT** add a README/.gitignore/license (the project already has them).
2. Copy the repo URL, then in the project folder run:
   ```bash
   git remote add origin https://github.com/<your-username>/haladini.git
   git push -u origin main
   ```
   (You'll authenticate with your GitHub login / a personal access token.)

**Option B — GitHub CLI** (if `gh` is installed & you're logged in):
```bash
gh repo create haladini --private --source=. --remote=origin --push
```

> ✅ Confirm on GitHub that **`.env.local` is NOT in the repo** (only `.env.local.example` should be there).

---

## Step 2 — Connect Netlify

1. Log in to <https://app.netlify.com> → **Add new site → Import an existing project**.
2. Choose **GitHub**, authorise, and pick the `haladini` repo.
3. Netlify auto-detects Next.js from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs`
   Leave these as detected.
4. **Before the first deploy**, add the environment variables (next step). Then deploy.

---

## Step 3 — Environment variables (Netlify)

Site → **Site configuration → Environment variables** → add each (copy values
from your local `.env.local`):

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://haladini.in` (your final domain) |
| `NEXT_PUBLIC_SUPABASE_URL` | from `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | from `.env.local` (secret) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | leave blank until Razorpay is live |
| `RAZORPAY_KEY_SECRET` | leave blank until Razorpay is live |

Then **Deploy site** (or **Trigger deploy → Deploy site**). First build takes a few minutes.

---

## Step 4 — Verify the deploy

You'll get a temporary URL like `https://<random-name>.netlify.app`. Check:
- Homepage loads with styling, products show (reading from Supabase).
- `/shop`, a product page, `/account` (sign in works), `/admin` (redirects unless you're the admin).
- Place a **COD** test order → confirm it appears in **/admin/orders**.

---

## Step 5 — Connect your domain (`haladini.in`)

In Netlify: **Domain management → Add a domain** → enter `haladini.in`.

Then point DNS at Netlify. **Easiest (Netlify DNS):**
1. Netlify shows 4 **nameservers** (e.g. `dns1.p0X.nsone.net`…).
2. In **GoDaddy** (or Hostinger): your domain → **Nameservers → Change → Enter custom nameservers** → paste Netlify's 4 → Save.
3. Wait for propagation (minutes–hours). Netlify auto-issues a free **HTTPS/SSL** certificate.

**Alternative (keep GoDaddy/Hostinger DNS):** add an `A` record for `@` → Netlify's load-balancer IP `75.2.60.5`, and a `CNAME` for `www` → your `<site>.netlify.app`. Netlify then provisions SSL.

Set `haladini.in` as the **primary domain** in Netlify (redirect `www` → apex or vice-versa).

---

## Step 6 — Post-deploy configuration (important!)

1. **Supabase Auth URLs** — Supabase Dashboard → **Authentication → URL Configuration**:
   - **Site URL:** `https://haladini.in`
   - **Redirect URLs:** add `https://haladini.in/**`
   This makes email-confirmation links and Google OAuth redirect to production (not localhost).
2. **`NEXT_PUBLIC_SITE_URL`** in Netlify = `https://haladini.in` (for correct OG/SEO absolute URLs). Redeploy after changing env vars.
3. **Email confirmation:** decide on Auth → Providers → Email → "Confirm email". For a real store keep it **on** (and later add a custom SMTP, e.g. Resend, so confirmation emails are reliable).
4. **Razorpay (when live):** after KYC, add `NEXT_PUBLIC_RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` in Netlify env → redeploy → online payments activate.

---

## Future deploys

Every `git push` to `main` triggers an automatic Netlify rebuild + deploy. To
update: commit and push.

```bash
git add -A
git commit -m "your message"
git push
```

---

## Troubleshooting

- **Build fails on Netlify:** run `npm run build` locally first (stop `npm run dev` beforehand — they share `.next`). Fix any type errors, push again.
- **Auth redirects to localhost:** you missed Step 6.1 (Supabase URL Configuration).
- **Images don't load:** ensure remote hosts are allowed in `next.config.mjs` (`*.supabase.co` is already allowed for uploaded product photos).
- **500s on `/admin` or product pages:** check the env vars are all set in Netlify and the Supabase keys are correct.
