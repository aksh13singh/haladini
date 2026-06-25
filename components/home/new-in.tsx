import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getNewArrivals } from "@/lib/products-db";
import { ProductCard } from "@/components/product/product-card";

export async function NewIn() {
  const products = await getNewArrivals(8);

  return (
    <section id="new-in" className="section scroll-mt-28 bg-cream">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 className="display-heading mt-2 text-3xl sm:text-4xl lg:text-5xl">
              New In
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-flamingo-deep transition-colors hover:text-wine sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Snap-scroll row on mobile → grid on desktop */}
        <div className="scrollbar-hide mt-8 grid auto-cols-[62%] grid-flow-col gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:auto-cols-[40%] md:grid-flow-row md:grid-cols-3 md:gap-6 md:overflow-visible lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-1 text-sm font-semibold text-flamingo-deep"
          >
            View all new arrivals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
