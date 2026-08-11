import { cache } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getReviewSummaries } from "@/lib/reviews-db";
import {
  sampleProducts,
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

/**
 * Columns a product *card* needs. Deliberately excludes description/fabric/care
 * — those are long text fields, and pulling them for all 76 products made the
 * catalogue query ~5x slower and the rendered page several hundred KB bigger.
 * The full row is fetched only on a product's own page.
 */
const CARD_COLUMNS =
  "id,name,slug,price,compare_at_price,category,subcategory,images,sizes,stock,is_new,created_at";

/**
 * All products from Supabase, or null if they can't be read.
 * Memoised per request, so a page that needs the catalogue several times
 * (product + related, grid + ratings) only queries once.
 */
const fetchAll = cache(async (): Promise<Product[] | null> => {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await publicClient()
      .from("products")
      .select(CARD_COLUMNS)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map(mapRow);
  } catch {
    return null;
  }
});

/**
 * The catalogue to render.
 *
 * If Supabase isn't configured at all (local dev with no keys) we fall back to
 * the bundled sample catalogue so the site still works. But if it IS configured
 * and unreachable, we return nothing rather than sample data — showing
 * placeholder products at placeholder prices to real shoppers is worse than
 * showing an honest "temporarily unavailable" notice.
 */
async function catalogue(): Promise<Product[]> {
  const all = await fetchAll();
  if (all) return all;
  return isSupabaseConfigured ? [] : sampleProducts;
}

/** True when the store is configured but the catalogue can't be loaded. */
export const isCatalogueUnavailable = cache(async (): Promise<boolean> => {
  if (!isSupabaseConfigured) return false;
  return (await fetchAll()) === null;
});

export async function getAllProducts(): Promise<Product[]> {
  return withRatings(await catalogue());
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const all = await catalogue();
  return withRatings(
    [...all]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, limit)
  );
}

export async function getProductsByCategory(
  category: CategorySlug
): Promise<Product[]> {
  const all = await catalogue();
  return withRatings(all.filter((p) => p.category === category));
}

/**
 * A single product, with its long-form fields. Queried directly by slug rather
 * than pulling the whole catalogue — a product page has no need for the other
 * 75 products' data.
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    if (!isSupabaseConfigured) {
      return sampleProducts.find((p) => p.slug === slug);
    }
    try {
      const { data, error } = await publicClient()
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error || !data) return undefined;
      return mapRow(data);
    } catch {
      return undefined;
    }
  }
);

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await catalogue();
  return withRatings(
    all
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit)
  );
}

export async function queryProducts(opts: ProductQuery): Promise<Product[]> {
  // Attach ratings before querying so "Top rated" sort has data to work with.
  const rated = await withRatings(await catalogue());
  return applyProductQuery(rated, opts);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return (await catalogue()).map((p) => p.slug);
}
