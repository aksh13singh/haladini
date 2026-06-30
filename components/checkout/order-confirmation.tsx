"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useOrderStore } from "@/store/order-store";
import { formatINR } from "@/lib/utils";

export function OrderConfirmation({ id }: { id: string }) {
  const mounted = useHasMounted();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === id));

  if (!mounted) {
    return <div className="mx-auto h-80 max-w-2xl animate-pulse rounded-3xl bg-flamingo-tint/40" />;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-flamingo-tint bg-white p-8 text-center shadow-card">
        <h1 className="display-heading text-2xl">Order not found</h1>
        <p className="mt-2 text-ink/60">
          We couldn&apos;t find this order on this device.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/account/orders">My orders</Link>
          </Button>
          <Button asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const firstName = order.shippingAddress.fullName.split(" ")[0];
  const addr = order.shippingAddress;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-flamingo-tint text-flamingo-deep">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="display-heading mt-5 text-3xl sm:text-4xl">
          Thank you, {firstName}!
        </h1>
        <p className="mt-2 text-ink/65">
          Your order is confirmed. We&apos;ve emailed your receipt and will be in
          touch when it ships.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-flamingo-tint/70 pb-4">
          <div>
            <p className="font-semibold text-wine">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-ink/50">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <span className="rounded-full bg-flamingo-tint px-3 py-1 text-xs font-semibold text-flamingo-deep">
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Payment received"}
          </span>
        </div>

        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink/50">
                  {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium text-wine">
                {formatINR(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {order.coupon && order.coupon.discount > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-flamingo-deep">
            <span>Discount ({order.coupon.code})</span>
            <span className="font-medium">−{formatINR(order.coupon.discount)}</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-flamingo-tint/70 pt-4">
          <span className="text-sm text-ink/55">Total</span>
          <span className="font-display text-lg font-semibold text-wine">
            {formatINR(order.total)}
          </span>
        </div>

        <div className="mt-5 rounded-2xl bg-cream p-4 text-sm">
          <p className="font-semibold text-wine">Shipping to</p>
          <p className="mt-1 text-ink/70">
            {addr.fullName}
            <br />
            {addr.line1}
            {addr.line2 ? `, ${addr.line2}` : ""}
            <br />
            {addr.city}, {addr.state} {addr.pincode}
            <br />
            {addr.phone}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/account/orders">View my orders</Link>
        </Button>
        <Button asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
