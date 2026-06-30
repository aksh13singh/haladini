"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { cn, formatINR } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/blur";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/lib/types";

const SIZES = "(max-width: 640px) 62vw, (max-width: 1024px) 40vw, 25vw";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isWished = mounted && wished;

  const onSale =
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  const hasSecond = product.images.length > 1;
  const quickAdd = () => addItem(product, product.sizes[0], 1);

  return (
    <motion.div
      className="group flex snap-start flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index, 7) * 0.05,
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-flamingo-tint shadow-card">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={SIZES}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-[1.05]",
              hasSecond && "group-hover:opacity-0"
            )}
          />
          {hasSecond && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes={SIZES}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
            />
          )}
        </Link>

        {(product.isNew || onSale) && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider shadow-sm",
              product.isNew
                ? "bg-white/95 text-wine"
                : "bg-flamingo-deep text-white"
            )}
          >
            {product.isNew ? "New" : "Sale"}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWish(product.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWished}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-wine backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isWished && "fill-flamingo-deep text-flamingo-deep"
            )}
          />
        </button>

        <button
          type="button"
          onClick={quickAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-wine px-3.5 py-2 text-xs font-semibold text-white shadow-soft transition-all duration-300 hover:bg-flamingo-deep sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="mt-3 px-0.5">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-1 font-medium text-ink transition-colors hover:text-flamingo-deep"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-semibold text-wine">
            {formatINR(product.price)}
          </span>
          {onSale && (
            <span className="text-sm text-ink/45 line-through">
              {formatINR(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {product.ratingCount ? (
          <div className="mt-1 flex items-center gap-1 text-xs text-ink/60">
            <Star className="h-3.5 w-3.5 fill-flamingo-deep text-flamingo-deep" />
            <span className="font-medium text-wine">
              {product.ratingAvg!.toFixed(1)}
            </span>
            <span>({product.ratingCount})</span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
