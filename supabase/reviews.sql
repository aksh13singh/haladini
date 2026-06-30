-- ============================================================
-- Haladini — Product reviews (verified buyers only)
-- HOW TO RUN: Supabase Dashboard → SQL Editor → New query →
-- paste this whole file → Run.  Safe to re-run.
-- ============================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,                       -- matches products.id / cart item productId
  user_id uuid not null references auth.users on delete cascade,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)                    -- one review per buyer per product
);
alter table public.reviews enable row level security;

create index if not exists reviews_product_idx
  on public.reviews (product_id, created_at desc);

-- Has the signed-in user purchased this product? Looks through their orders'
-- items (JSON) for a matching productId. SECURITY DEFINER so it can read the
-- orders table, but it only ever checks the current user's own orders.
create or replace function public.has_purchased(p_product_id text)
returns boolean
language sql
security definer stable set search_path = public
as $$
  select exists (
    select 1 from public.orders o
    where o.user_id = auth.uid()
      and o.items @> jsonb_build_array(jsonb_build_object('productId', p_product_id))
  );
$$;

-- Anyone can read reviews.
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);

-- Only verified buyers can post — and only as themselves.
drop policy if exists "reviews_buyer_insert" on public.reviews;
create policy "reviews_buyer_insert" on public.reviews
  for insert with check (
    auth.uid() = user_id and public.has_purchased(product_id)
  );

-- Authors may edit / delete their own review.
drop policy if exists "reviews_owner_update" on public.reviews;
create policy "reviews_owner_update" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "reviews_owner_delete" on public.reviews;
create policy "reviews_owner_delete" on public.reviews
  for delete using (auth.uid() = user_id);
