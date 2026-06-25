"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/currency/price";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useCartStore } from "@/store/cart-store";
import { getCartTotals } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function CartContent() {
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotalFn = useCartStore((s) => s.subtotal);

  if (!mounted) {
    return <div className="h-72 animate-pulse rounded-3xl bg-flamingo-tint/40" />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-flamingo/40 bg-cream/60 px-6 py-20 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-flamingo-tint text-flamingo-deep">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold text-wine">
          Your bag is empty
        </h2>
        <p className="mt-1 max-w-sm text-sm text-ink/60">
          Handcrafted pieces are waiting to be discovered.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Start shopping</Link>
        </Button>
      </div>
    );
  }

  const totals = getCartTotals(subtotalFn());
  const progress = Math.min(
    100,
    (totals.subtotal / (totals.subtotal + totals.freeShippingRemaining || 1)) * 100
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
      {/* Items */}
      <ul className="divide-y divide-flamingo-tint">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5 first:pt-0">
            <Link
              href={`/product/${item.slug}`}
              className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-medium text-ink transition-colors hover:text-flamingo-deep"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-ink/40 transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-0.5 text-xs text-ink/50">Size: {item.size}</p>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-flamingo-tint">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="grid h-9 w-9 place-items-center text-wine hover:text-flamingo-deep"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    aria-label="Increase quantity"
                    className={cn(
                      "grid h-9 w-9 place-items-center text-wine hover:text-flamingo-deep",
                      item.quantity >= item.maxStock &&
                        "cursor-not-allowed opacity-40"
                    )}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-semibold text-wine">
                  <Price amount={item.price * item.quantity} />
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <div className="rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-wine">
            Order summary
          </h2>

          {/* Free shipping progress */}
          <div className="mt-4 rounded-2xl bg-cream p-3">
            <p className="text-xs text-wine">
              {totals.qualifiesFreeShipping ? (
                <span className="font-semibold">
                  🎉 You&apos;ve unlocked free shipping!
                </span>
              ) : (
                <>
                  Add{" "}
                  <span className="font-semibold">
                    <Price amount={totals.freeShippingRemaining} />
                  </span>{" "}
                  more for free shipping
                </>
              )}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-flamingo-tint">
              <div
                className="h-full rounded-full bg-flamingo-deep transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-medium text-ink">
                <Price amount={totals.subtotal} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd className="font-medium text-ink">
                {totals.shipping === 0 ? "Free" : <Price amount={totals.shipping} />}
              </dd>
            </div>
            <div className="flex justify-between border-t border-flamingo-tint pt-3 text-base">
              <dt className="font-semibold text-wine">Total</dt>
              <dd className="font-display text-lg font-semibold text-wine">
                <Price amount={totals.total} />
              </dd>
            </div>
          </dl>

          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
