import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getReviewSummaries } from "@/lib/reviews-db";
import {
  sampleProducts,
  getNewArrivals as sampleNewArrivals,
  getProductsByCategory as sampleByCategory,
  getProductBySlug as sampleBySlug,
  getRelatedProducts as sampleRelated,
  applyProductQuery,
  type ProductQuery,
} from "@/lib/sample-products";
import type { CategorySlug, Product } from "@/lib/types";

/**
 * Read-only product data. Products are public (RLS allows anyone to read), so
 * we use a plain anon client that works in any server context (pages,
 * generateStaticParams, build). If Supabase isn't configured or has no
 * products yet, every function falls back to the bundled sample catalogue —
 * so the storefront always shows something.
 */

let cached: ReturnType<typeof createSupabaseClient> | null = null;
function publicClient() {
  if (!cached) {
    cached = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false },
        // Never let Next cache product reads — admin changes must show at once.
        global: {
          fetch: (input, init) =>
            fetch(input, { ...init, cache: "no-store" }),
        },
      }
    );
  }
  return cached;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: row.price,
    compareAtPrice: row.compare_at_price ?? null,
    category: row.category,
    subcategory: row.subcategory ?? undefined,
    images: row.images ?? [],
    sizes: row.sizes ?? [],
    fabric: row.fabric ?? "",
    care: row.care ?? undefined,
    stock: row.stock ?? 0,
    isNew: row.is_new ?? false,
    createdAt: row.created_at,
  };
}

/** Attach review summary (avg rating + count) to each product for card display. */
async function withRatings(products: Product[]): Promise<Product[]> {
  const summaries = await getReviewSummaries();
  if (!Object.keys(summaries).length) return products;
  return products.map((p) => {
    const s = summaries[p.id];
    return s ? { ...p, ratingAvg: s.avg, ratingCount: s.count } : p;
  });
}

/** All products from Supabase, or null to fall back to the sample catalogue. */
async function fetchAll(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await publicClient()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map(mapRow);
  } catch {
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  return withRatings((await fetchAll()) ?? sampleProducts);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const all = await fetchAll();
  if (!all) return sampleNewArrivals(limit);
  return withRatings(
    [...all]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, limit)
  );
}

export async function getProductsByCategory(
  category: CategorySlug
): Promise<Product[]> {
  const all = await fetchAll();
  if (!all) return sampleByCategory(category);
  return withRatings(all.filter((p) => p.category === category));
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const all = await fetchAll();
  if (!all) return sampleBySlug(slug);
  return all.find((p) => p.slug === slug);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await fetchAll();
  if (!all) return sampleRelated(product, limit);
  return withRatings(
    all
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit)
  );
}

export async function queryProducts(opts: ProductQuery): Promise<Product[]> {
  const all = await fetchAll();
  return withRatings(applyProductQuery(all ?? sampleProducts, opts));
}

export async function getAllProductSlugs(): Promise<string[]> {
  const all = await fetchAll();
  return (all ?? sampleProducts).map((p) => p.slug);
}
