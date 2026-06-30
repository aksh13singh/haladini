import { cache } from "react";
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

export interface ReviewSummary {
  avg: number;
  count: number;
}

/**
 * Average rating + review count keyed by product id, for showing ratings on
 * product cards. Memoised per request (React cache) so a page that renders many
 * grids only hits the DB once. Empty if none/unconfigured.
 */
export const getReviewSummaries = cache(
  async (): Promise<Record<string, ReviewSummary>> => {
    if (!isSupabaseConfigured) return {};
    try {
      const { data, error } = await publicClient()
        .from("reviews")
        .select("product_id, rating");
      if (error || !data) return {};
      const acc: Record<string, { sum: number; count: number }> = {};
      for (const row of data as { product_id: string; rating: number }[]) {
        const k = row.product_id;
        (acc[k] ??= { sum: 0, count: 0 }).sum += row.rating;
        acc[k].count += 1;
      }
      const out: Record<string, ReviewSummary> = {};
      for (const k in acc) out[k] = { avg: acc[k].sum / acc[k].count, count: acc[k].count };
      return out;
    } catch {
      return {};
    }
  }
);

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
