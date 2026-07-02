"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // drawer controls
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;

  // mutations
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;

  // derived
  totalItems: () => number;
  subtotal: () => number;
}

const lineId = (productId: string, size: string) => `${productId}:${size}`;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),

      addItem: (product, size, quantity = 1) => {
        // Never allow out-of-stock products into the bag.
        if ((product.stock ?? 0) <= 0) return;
        const id = lineId(product.id, size);
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          const nextQty = Math.min(
            existing.quantity + quantity,
            existing.maxStock
          );
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: nextQty } : i
            ),
            isOpen: true,
          });
          return;
        }

        const newItem: CartItem = {
          id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images[0],
          size,
          quantity: Math.min(quantity, product.stock || quantity),
          maxStock: product.stock || 99,
        };
        set({ items: [...get().items, newItem], isOpen: true });
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.id !== id) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(quantity, i.maxStock) }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "haladini-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
