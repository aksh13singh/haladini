-- ============================================================
-- Haladini — Supabase schema
-- HOW TO RUN: Supabase Dashboard → SQL Editor → New query →
-- paste this whole file → Run.  Safe to re-run.
-- ============================================================

-- ---------- PROFILES (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- auto-create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer stable set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price integer not null,            -- ₹ in whole rupees
  compare_at_price integer,
  category text not null,
  subcategory text,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  fabric text,
  care text,
  stock integer not null default 0,
  is_new boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  items jsonb not null,
  total integer not null,
  shipping_address jsonb not null,
  payment_method text not null,
  payment_ref text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;

drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- ---------- STORAGE: product images ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_insert" on storage.objects;
create policy "product_images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================
-- AFTER you create your own account in the app (or Supabase
-- Auth), make yourself an admin by running (with your email):
--
--   update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================
