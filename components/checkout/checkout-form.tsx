"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHasMounted } from "@/lib/use-has-mounted";
import { useCartStore } from "@/store/cart-store";
import { useSupabaseUser } from "@/lib/supabase/use-user";
import { createClient } from "@/lib/supabase/client";
import { useOrderStore } from "@/store/order-store";
import { getCartTotals } from "@/lib/cart";
import { processPayment, isRazorpayConfigured } from "@/lib/payments";
import { cn, formatINR } from "@/lib/utils";
import { Price } from "@/components/currency/price";
import { useCurrency } from "@/components/currency/currency-provider";
import type { Order, PaymentMethod } from "@/lib/types";

const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);

const isPhone = (v: string) => /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-wine">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const mounted = useHasMounted();

  const items = useCartStore((s) => s.items);
  const subtotalFn = useCartStore((s) => s.subtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useSupabaseUser();
  const { currency } = useCurrency();
  const addOrder = useOrderStore((s) => s.addOrder);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [formError, setFormError] = useState("");

  // Prefill from the signed-in account.
  useEffect(() => {
    if (!user) return;
    setAddress((a) => ({
      ...a,
      fullName:
        a.fullName || (user.user_metadata?.full_name as string) || "",
      email: a.email || user.email || "",
    }));
  }, [user]);

  const set =
    (key: keyof typeof address) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((a) => ({ ...a, [key]: e.target.value }));

  if (!mounted) {
    return <div className="h-96 animate-pulse rounded-3xl bg-flamingo-tint/40" />;
  }

  if (placed) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-flamingo-deep" />
        <p className="text-ink/60">Order placed — taking you to confirmation…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-flamingo/40 bg-cream/60 px-6 py-20 text-center">
        <h2 className="font-display text-xl font-semibold text-wine">
          Your bag is empty
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Add a few pieces before heading to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse the collection</Link>
        </Button>
      </div>
    );
  }

  const totals = getCartTotals(subtotalFn());
  const razorpayReady = isRazorpayConfigured();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!address.fullName.trim()) e.fullName = "Please enter your name";
    if (!isPhone(address.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (!isEmail(address.email)) e.email = "Enter a valid email address";
    if (!address.line1.trim()) e.line1 = "Please enter your address";
    if (!address.city.trim()) e.city = "Required";
    if (!address.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = "6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setPlacing(true);
    const orderId = genId();
    const result = await processPayment(method, {
      amount: totals.total,
      orderId,
      customer: {
        name: address.fullName,
        email: address.email,
        phone: address.phone,
      },
    });

    if (!result.success) {
      setFormError(result.error ?? "Payment failed. Please try again.");
      setPlacing(false);
      return;
    }

    const order: Order = {
      id: orderId,
      userId: user?.id ?? null,
      items: [...items],
      total: totals.total,
      shippingAddress: { ...address },
      paymentMethod: method,
      status: method === "cod" ? "pending" : "paid",
      createdAt: new Date().toISOString(),
    };

    // Best-effort save to Supabase so it appears in the admin dashboard.
    try {
      await createClient()
        .from("orders")
        .insert({
          id: orderId,
          user_id: user?.id ?? null,
          items: order.items,
          total: order.total,
          shipping_address: order.shippingAddress,
          payment_method: order.paymentMethod,
          payment_ref: result.reference ?? null,
          status: order.status,
        });
    } catch {
      // ignore — the local order still drives the confirmation page
    }

    setPlaced(true);
    addOrder(order);
    clearCart();
    router.push(`/order/${orderId}`);
  };

  return (
    <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      {/* Left: address + payment */}
      <div className="space-y-8">
        <section>
          <h2 className="font-display text-xl font-semibold text-wine">
            Shipping address
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Full name" error={errors.fullName}>
                <Input value={address.fullName} onChange={set("fullName")} placeholder="Your name" />
              </Field>
            </div>
            <Field label="Mobile number" error={errors.phone}>
              <Input value={address.phone} onChange={set("phone")} placeholder="98xxxxxxxx" type="tel" />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input value={address.email} onChange={set("email")} placeholder="you@example.com" type="email" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address" error={errors.line1}>
                <Input value={address.line1} onChange={set("line1")} placeholder="House no., street, area" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Apartment, landmark (optional)">
                <Input value={address.line2} onChange={set("line2")} placeholder="Apartment, landmark" />
              </Field>
            </div>
            <Field label="City" error={errors.city}>
              <Input value={address.city} onChange={set("city")} placeholder="City" />
            </Field>
            <Field label="State" error={errors.state}>
              <Input value={address.state} onChange={set("state")} placeholder="State" />
            </Field>
            <Field label="Pincode" error={errors.pincode}>
              <Input value={address.pincode} onChange={set("pincode")} placeholder="302001" inputMode="numeric" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-wine">Payment</h2>
          <div className="mt-4 space-y-3">
            <PaymentOption
              selected={method === "cod"}
              onSelect={() => setMethod("cod")}
              title="Cash on Delivery"
              desc="Pay in cash when your order arrives."
              available
            />
            <PaymentOption
              selected={method === "razorpay"}
              onSelect={() => razorpayReady && setMethod("razorpay")}
              title="Pay Online · UPI / Cards / Netbanking"
              desc={
                razorpayReady
                  ? "Secure payment via Razorpay."
                  : "Add your Razorpay keys to .env.local to enable online payments."
              }
              available={razorpayReady}
            />
          </div>
        </section>

        {formError && <p className="text-sm text-destructive">{formError}</p>}
      </div>

      {/* Right: order summary */}
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <div className="rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-wine">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink/50">
                    {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium text-wine">
                  <Price amount={item.price * item.quantity} />
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 border-t border-flamingo-tint pt-4 text-sm">
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

          {currency !== "INR" && (
            <p className="mt-3 rounded-2xl bg-cream px-4 py-3 text-xs text-ink/65">
              Prices shown in {currency} are a guide. Orders are billed in Indian
              Rupees — you&apos;ll be charged{" "}
              <span className="font-semibold text-wine">
                {formatINR(totals.total)}
              </span>
              .
            </p>
          )}

          <Button type="submit" size="lg" disabled={placing} className="mt-6 w-full">
            {placing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {placing
              ? "Placing order…"
              : method === "cod"
                ? "Place Order"
                : `Pay ${formatINR(totals.total)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-ink/50">
            By placing your order you agree to our{" "}
            <Link href="/terms" className="underline hover:text-flamingo-deep">
              Terms
            </Link>
            .
          </p>
        </div>
      </div>
    </form>
  );
}

function PaymentOption({
  selected,
  onSelect,
  title,
  desc,
  available,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
  available: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!available}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-flamingo-deep bg-flamingo-tint/40"
          : "border-flamingo-tint hover:border-flamingo-deep",
        !available && "cursor-not-allowed opacity-60 hover:border-flamingo-tint"
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
          selected ? "border-flamingo-deep" : "border-flamingo-tint"
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-flamingo-deep" />}
      </span>
      <span>
        <span className="block text-sm font-semibold text-wine">{title}</span>
        <span className="block text-xs text-ink/55">{desc}</span>
      </span>
    </button>
  );
}
