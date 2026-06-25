"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const exists = get().ids.includes(productId);
        set({
          ids: exists
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        });
      },
      has: (productId) => get().ids.includes(productId),
      clear: () => set({ ids: [] }),
      count: () => get().ids.length,
    }),
    { name: "haladini-wishlist" }
  )
);
