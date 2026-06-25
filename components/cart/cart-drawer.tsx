"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Price } from "@/components/currency/price";
import { useCartStore } from "@/store/cart-store";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantity, removeItem, subtotal } =
    useCartStore();

  const total = subtotal();
  const remaining = siteConfig.freeShippingThreshold - total;
  const qualifies = remaining <= 0;
  const progress = Math.min(
    100,
    (total / siteConfig.freeShippingThreshold) * 100
  );

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-flamingo-tint px-6 py-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Bag
            <span className="text-sm font-normal text-muted-foreground">
              ({items.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-flamingo-tint">
              <ShoppingBag className="h-9 w-9 text-flamingo-deep" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-wine">
                Your bag is empty
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Handcrafted pieces are waiting to be discovered.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="bg-cream px-6 py-3">
              <p className="text-xs text-wine">
                {qualifies ? (
                  <span className="font-semibold">
                    🎉 You&apos;ve unlocked free shipping!
                  </span>
                ) : (
                  <>
                    Add{" "}
                    <span className="font-semibold">
                      <Price amount={remaining} />
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

            {/* Line items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-flamingo-tint">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-semibold text-ink hover:text-flamingo-deep"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Size: {item.size}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-flamingo-tint">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="grid h-8 w-8 place-items-center text-wine hover:text-flamingo-deep"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                            aria-label="Increase quantity"
                            className={cn(
                              "grid h-8 w-8 place-items-center text-wine hover:text-flamingo-deep",
                              item.quantity >= item.maxStock &&
                                "cursor-not-allowed opacity-40"
                            )}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-wine">
                          <Price amount={item.price * item.quantity} />
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer / checkout */}
            <div className="border-t border-flamingo-tint px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-semibold text-wine">
                  <Price amount={total} />
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Separator className="my-4" />
              <div className="grid gap-2">
                <Button asChild size="lg" onClick={() => setOpen(false)}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/cart">View full bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
