"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Order } from "@/lib/types";

/**
 * Local order history (demo). Checkout (Task 5) will call addOrder; the account
 * "My Orders" page reads from here. Later this is backed by Supabase orders.
 */
interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clear: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      clear: () => set({ orders: [] }),
    }),
    { name: "haladini-orders" }
  )
);
