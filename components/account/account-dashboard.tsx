"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useWishlistStore } from "@/store/wishlist-store";
import { useOrderStore } from "@/store/order-store";

export function AccountDashboard({
  name,
  email,
  isAdmin,
  createdAt,
}: {
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
}) {
  const router = useRouter();
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const orderCount = useOrderStore((s) => s.orders.length);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.refresh();
  };

  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My Account</p>
          <h1 className="display-heading mt-2 text-3xl sm:text-4xl">
            Hi, {name.split(" ")[0]} 👋
          </h1>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          className="group mt-8 flex items-center gap-4 rounded-3xl bg-wine p-5 text-white shadow-soft transition-transform hover:-translate-y-0.5"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
            <LayoutDashboard className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold">
              Admin Dashboard
            </span>
            <span className="text-sm text-white/70">
              Manage products &amp; orders
            </span>
          </span>
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group flex items-center gap-4 rounded-3xl border border-flamingo-tint bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flamingo-tint text-flamingo-deep">
            <Package className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold text-wine">
              My Orders
            </span>
            <span className="text-sm text-ink/55">
              {orderCount === 0
                ? "No orders yet"
                : `${orderCount} order${orderCount === 1 ? "" : "s"}`}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-flamingo-deep transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/wishlist"
          className="group flex items-center gap-4 rounded-3xl border border-flamingo-tint bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flamingo-tint text-flamingo-deep">
            <Heart className="h-6 w-6" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold text-wine">
              Wishlist
            </span>
            <span className="text-sm text-ink/55">
              {wishlistCount === 0
                ? "Nothing saved yet"
                : `${wishlistCount} item${wishlistCount === 1 ? "" : "s"} saved`}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 text-flamingo-deep transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-8 rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card">
        <h2 className="font-display text-xl font-semibold text-wine">
          Profile details
        </h2>
        <dl className="mt-5 space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <dt className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-flamingo-tint text-flamingo-deep">
              <Mail className="h-4 w-4" />
            </dt>
            <dd>
              <span className="block text-xs uppercase tracking-wider text-ink/45">
                Email
              </span>
              <span className="font-medium text-wine">{email}</span>
            </dd>
          </div>
          {memberSince && (
            <div className="border-t border-flamingo-tint/70 pt-4 text-ink/55">
              Member since {memberSince}
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
