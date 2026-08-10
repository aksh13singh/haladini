"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Thumbnail for an item inside a past order.
 *
 * Order items store the image URL as it was at purchase time, so links can go
 * stale (a photo replaced, or storage moved). Rather than render a broken
 * image, fall back to a branded tile.
 */
export function OrderItemImage({
  src,
  alt,
  sizes = "56px",
  className,
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl bg-flamingo-tint",
        className
      )}
    >
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="grid h-full w-full place-items-center text-flamingo-deep/60">
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
