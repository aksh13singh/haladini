"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useWishlistStore } from "@/store/wishlist-store";
import { sampleProducts } from "@/lib/sample-products";
import type { Product } from "@/lib/types";

export function WishlistScreen() {
  const mounted = useHasMounted();
  const ids = useWishlistStore((s) => s.ids);
  const clear = useWishlistStore((s) => s.clear);

  if (!mounted) {
    return (
      <>
        <h1 className="display-heading text-3xl sm:text-4xl">Wishlist</h1>
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      </>
    );
  }

  const products = ids
    .map((id) => sampleProducts.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Saved for later</p>
          <h1 className="display-heading mt-2 text-3xl sm:text-4xl">Wishlist</h1>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm text-ink/55 transition-colors hover:text-flamingo-deep"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-8">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-flamingo/40 bg-cream/60 px-6 py-20 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-flamingo-tint text-flamingo-deep">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold text-wine">
              Your wishlist is empty
            </h2>
            <p className="mt-1 max-w-sm text-sm text-ink/60">
              Tap the ♡ on any product to save it here for later.
            </p>
            <Button asChild className="mt-6">
              <Link href="/shop">Browse the collection</Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
