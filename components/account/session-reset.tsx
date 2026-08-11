"use client";

import { useEffect } from "react";

import { useSupabaseUser } from "@/lib/supabase/use-user";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useOrderStore } from "@/store/order-store";

const OWNER_KEY = "haladini-session-owner";

/**
 * Cart, wishlist and order history are stored per browser, not per account.
 * On a shared device that means one person could inherit another's basket —
 * and their order history with it.
 *
 * This watches who's signed in and wipes that local state when the account
 * changes. A guest who adds items and then signs in keeps their basket (the
 * usual shopping flow); only a genuine change of person clears it.
 */
export function SessionReset() {
  const { user, loading } = useSupabaseUser();
  const clearCart = useCartStore((s) => s.clearCart);
  const clearWishlist = useWishlistStore((s) => s.clear);
  const clearOrders = useOrderStore((s) => s.clear);

  useEffect(() => {
    if (loading || typeof window === "undefined") return;

    const current = user?.id ?? null;
    const previous = window.localStorage.getItem(OWNER_KEY);

    // Only a switch between two different signed-in accounts clears things.
    // (guest -> signed in keeps the basket; signing out clears it explicitly.)
    if (previous && current && previous !== current) {
      clearCart();
      clearWishlist();
      clearOrders();
    }

    if (current) window.localStorage.setItem(OWNER_KEY, current);
    else window.localStorage.removeItem(OWNER_KEY);
  }, [user, loading, clearCart, clearWishlist, clearOrders]);

  return null;
}
