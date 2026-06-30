import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";

import { categories } from "@/lib/site-config";
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db";
import { getProductReviews } from "@/lib/reviews-db";
import { formatINR } from "@/lib/utils";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductReviews } from "@/components/product/product-reviews";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images, title: product.name },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const related = await getRelatedProducts(product, 4);
  const reviews = await getProductReviews(product.id);
  const onSale =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;
  const savings = onSale ? product.compareAtPrice! - product.price : 0;
  const reviewCount = reviews.length;
  const reviewAvg = reviewCount
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
    : 0;

  return (
    <div className="container section">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-ink/50"
      >
        <Link href="/" className="hover:text-flamingo-deep">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-flamingo-deep">
          Shop
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={category.href} className="hover:text-flamingo-deep">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink/70">{product.name}</span>
      </nav>

      {/* Main */}
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images}
          name={product.name}
          isNew={product.isNew}
        />

        <div>
          {category && (
            <Link href={category.href} className="eyebrow hover:underline">
              {category.name}
            </Link>
          )}
          <h1 className="display-heading mt-2 text-3xl md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-semibold text-wine">
              {formatINR(product.price)}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-ink/45 line-through">
                  {formatINR(product.compareAtPrice!)}
                </span>
                <span className="rounded-full bg-flamingo-tint px-2.5 py-1 text-xs font-semibold text-flamingo-deep">
                  Save {formatINR(savings)}
                </span>
              </>
            )}
          </div>

          {reviewCount > 0 && (
            <a
              href="#reviews"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink/65 transition-colors hover:text-flamingo-deep"
            >
              <Star className="h-4 w-4 fill-flamingo-deep text-flamingo-deep" />
              <span className="font-semibold text-wine">
                {reviewAvg.toFixed(1)}
              </span>
              <span>
                · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </a>
          )}

          <p className="mt-5 leading-relaxed text-ink/70">
            {product.description}
          </p>

          <ProductBuyBox product={product} />

          <Separator className="my-8 bg-flamingo-tint" />

          {/* Details */}
          <dl className="space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 font-semibold text-wine">Fabric</dt>
              <dd className="text-ink/70">{product.fabric}</dd>
            </div>
            {product.care && (
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 font-semibold text-wine">Care</dt>
                <dd className="text-ink/70">{product.care}</dd>
              </div>
            )}
            <div className="flex gap-3">
              <dt className="w-28 shrink-0 font-semibold text-wine">Made in</dt>
              <dd className="text-ink/70">Jaipur, India · hand block-printed</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews
        productId={product.id}
        productName={product.name}
        reviews={reviews}
      />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="display-heading text-2xl md:text-3xl">
            You may also like
          </h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
