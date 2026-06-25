import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { categories } from "@/lib/site-config";
import { CategoryCard } from "@/components/home/category-card";

export function ShopByCategory() {
  return (
    <section id="shop-by-category" className="section scroll-mt-28">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Explore the collections</p>
            <h2 className="display-heading mt-2 text-3xl sm:text-4xl lg:text-5xl">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-flamingo-deep transition-colors hover:text-wine sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Snap-scroll row on mobile → 4-col grid on desktop */}
        <div className="scrollbar-hide mt-8 grid auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:auto-cols-[44%] md:grid-flow-row md:grid-cols-4 md:gap-5 md:overflow-visible">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
