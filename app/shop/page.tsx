import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { CategoryBanner } from "@/components/shop/category-banner";
import { EmptyState } from "@/components/shop/empty-state";
import { queryProducts } from "@/lib/products-db";
import type { PriceKey, SortOption } from "@/lib/sample-products";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Shop handcrafted block-print bedsheets, cushions, suits and shirts — made in Jaipur.",
};

type SearchParams = { [key: string]: string | string[] | undefined };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sort = (first(searchParams.sort) as SortOption) ?? "newest";
  const price = (first(searchParams.price) as PriceKey) ?? "all";
  const q = first(searchParams.q) ?? "";

  const products = await queryProducts({ q, sort, price });

  return (
    <>
      <CategoryBanner
        category="all"
        title="Shop All"
        tagline="Handcrafted block-print home & fashion, made in Jaipur."
      />

      <div className="container section">
        <ShopToolbar activeCategory="all" sort={sort} price={price} q={q} />

        <p className="mt-6 text-sm text-ink/50">
          {products.length} {products.length === 1 ? "product" : "products"}
          {q ? ` for “${q}”` : ""}
        </p>

        <div className="mt-4">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              message="We couldn't find anything matching your filters. Try a different search or browse everything."
              action={
                <Button asChild variant="outline">
                  <Link href="/shop">Clear filters</Link>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
