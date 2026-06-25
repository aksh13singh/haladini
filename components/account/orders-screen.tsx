"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSupabaseUser } from "@/lib/supabase/use-user";
import { useOrderStore } from "@/store/order-store";
import { formatINR, cn } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-flamingo-tint text-flamingo-deep",
  processing: "bg-flamingo-tint text-flamingo-deep",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export function OrdersScreen() {
  const { user, loading } = useSupabaseUser();
  const orders = useOrderStore((s) => s.orders);

  if (loading) {
    return <div className="mx-auto h-64 max-w-3xl animate-pulse rounded-3xl bg-flamingo-tint/40" />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-flamingo-tint bg-white p-8 text-center shadow-card">
        <h1 className="display-heading text-2xl">My Orders</h1>
        <p className="mt-2 text-ink/60">Please sign in to view your orders.</p>
        <Button asChild className="mt-6">
          <Link href="/account">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-ink/55 transition-colors hover:text-flamingo-deep"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to account
      </Link>
      <h1 className="display-heading mt-3 text-3xl sm:text-4xl">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-flamingo/40 bg-cream/60 px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-flamingo-tint text-flamingo-deep">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold text-wine">
            No orders yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-ink/60">
            When you place an order, it&apos;ll show up here so you can track it.
          </p>
          <Button asChild className="mt-6">
            <Link href="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-flamingo-tint bg-white p-5 shadow-card sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-flamingo-tint/70 pb-4">
                <div>
                  <p className="font-semibold text-wine">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-ink/50">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · "}
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Prepaid"}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                    statusStyle[order.status] ?? "bg-flamingo-tint text-wine"
                  )}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-flamingo-tint">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {item.name}
                      </p>
                      <p className="text-xs text-ink/50">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-wine">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-flamingo-tint/70 pt-4">
                <span className="text-sm text-ink/55">Total</span>
                <span className="font-semibold text-wine">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
