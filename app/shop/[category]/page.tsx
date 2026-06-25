import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories } from "@/lib/site-config";
import { queryProducts } from "@/lib/products-db";
import type { PriceKey, SortOption } from "@/lib/sample-products";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { SubcategoryChips } from "@/components/shop/subcategory-chips";
import { CategoryBanner } from "@/components/shop/category-banner";
import { EmptyState } from "@/components/shop/empty-state";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return {};
  return { title: cat.name, description: cat.blurb };
}

type SearchParams = { [key: string]: string | string[] | undefined };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: SearchParams;
}) {
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) notFound();

  const sort = (first(searchParams.sort) as SortOption) ?? "newest";
  const price = (first(searchParams.price) as PriceKey) ?? "all";
  const q = first(searchParams.q) ?? "";

  const products = await queryProducts({ category: cat.slug, q, sort, price });

  return (
    <>
      <CategoryBanner
        category={cat.slug}
        title={cat.name}
        tagline={cat.blurb}
        image={cat.image}
      />

      <div className="container section">
        {cat.subcategories?.length ? (
          <div className="mb-5">
            <SubcategoryChips category={cat} />
          </div>
        ) : null}

        <ShopToolbar
          activeCategory={cat.slug}
          sort={sort}
          price={price}
          q={q}
          showCategories={false}
        />

        <p className="mt-6 text-sm text-ink/50">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>

        <div className="mt-4">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState message="No products match your filters in this collection yet." />
          )}
        </div>
      </div>
    </>
  );
}
