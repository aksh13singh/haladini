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
  const params: { category: string; subcategory: string }[] = [];
  for (const c of categories) {
    for (const s of c.subcategories ?? []) {
      params.push({ category: c.slug, subcategory: s.slug });
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { category: string; subcategory: string };
}): Metadata {
  const cat = categories.find((c) => c.slug === params.category);
  const sub = cat?.subcategories?.find((s) => s.slug === params.subcategory);
  if (!cat || !sub) return {};
  return {
    title: `${sub.name} ${cat.name}`,
    description: sub.blurb ?? cat.blurb,
  };
}

type SearchParams = { [key: string]: string | string[] | undefined };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const dynamic = "force-dynamic";

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: { category: string; subcategory: string };
  searchParams: SearchParams;
}) {
  const cat = categories.find((c) => c.slug === params.category);
  const sub = cat?.subcategories?.find((s) => s.slug === params.subcategory);
  if (!cat || !sub) notFound();

  const sort = (first(searchParams.sort) as SortOption) ?? "newest";
  const price = (first(searchParams.price) as PriceKey) ?? "all";
  const q = first(searchParams.q) ?? "";

  const products = await queryProducts({
    category: cat.slug,
    subcategory: sub.slug,
    q,
    sort,
    price,
  });

  return (
    <>
      <CategoryBanner
        category={cat.slug}
        eyebrow={cat.name}
        title={sub.name}
        tagline={sub.blurb ?? cat.blurb}
        image={cat.image}
      />

      <div className="container section">
        <div className="mb-5">
          <SubcategoryChips category={cat} active={sub.slug} />
        </div>

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
