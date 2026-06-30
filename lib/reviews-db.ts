import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Review } from "@/lib/types";

/**
 * Read-only review data. Reviews are public (RLS allows anyone to read), so we
 * use a plain anon client with no-store fetch. If Supabase isn't configured or
 * the reviews table doesn't exist yet, every call returns an empty list — so
 * product pages never break.
 */

let cached: ReturnType<typeof createSupabaseClient> | null = null;
function publicClient() {
  if (!cached) {
    cached = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { persistSession: false },
        global: {
          fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        },
      }
    );
  }
  return cached;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    authorName: row.author_name,
    rating: row.rating,
    title: row.title ?? null,
    body: row.body,
    createdAt: row.created_at,
  };
}

/** Public reviews for a product, newest first. Empty if none/unconfigured. */
export async function getProductReviews(productId: string): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await publicClient()
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(mapRow);
  } catch {
    return [];
  }
}
