"use client";

import { useEffect, useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/lib/types";

export function ProductBuyBox({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isWished = mounted && wished;

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  return (
    <div className="mt-7">
      {/* Size selector */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-wine">Size</span>
          <span className="text-sm text-ink/50">Selected: {size}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={cn(
                "min-w-[3.25rem] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                size === s
                  ? "border-flamingo-deep bg-flamingo-tint text-wine"
                  : "border-flamingo-tint text-ink/70 hover:border-flamingo-deep"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity + actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex h-12 items-center rounded-full border border-flamingo-tint">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="grid h-12 w-11 place-items-center text-wine disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            disabled={qty >= (product.stock || 99)}
            aria-label="Increase quantity"
            className="grid h-12 w-11 place-items-center text-wine disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          size="lg"
          disabled={!inStock}
          onClick={() => addItem(product, size, qty)}
          className="h-12 min-w-[12rem] flex-1"
        >
          <ShoppingBag className="h-4 w-4" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => toggleWish(product.id)}
          aria-pressed={isWished}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className="h-12 w-12 px-0"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isWished && "fill-flamingo-deep text-flamingo-deep"
            )}
          />
        </Button>
      </div>

      {/* Stock hint */}
      <p
        className={cn(
          "mt-4 text-sm",
          !inStock
            ? "text-destructive"
            : lowStock
              ? "text-flamingo-deep"
              : "text-ink/60"
        )}
      >
        {!inStock
          ? "Currently out of stock"
          : lowStock
            ? `Only ${product.stock} left — order soon`
            : "In stock · ready to ship"}
      </p>
    </div>
  );
}
