import { siteConfig } from "@/lib/site-config";

/** Flat shipping fee applied below the free-shipping threshold. */
export const SHIPPING_FEE = 99;

export interface CartTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  qualifiesFreeShipping: boolean;
}

export function getCartTotals(subtotal: number, discount = 0): CartTotals {
  const qualifiesFreeShipping = subtotal >= siteConfig.freeShippingThreshold;
  const shipping = subtotal === 0 || qualifiesFreeShipping ? 0 : SHIPPING_FEE;
  const appliedDiscount = Math.max(0, Math.min(discount, subtotal));
  return {
    subtotal,
    discount: appliedDiscount,
    shipping,
    total: subtotal - appliedDiscount + shipping,
    freeShippingRemaining: Math.max(
      0,
      siteConfig.freeShippingThreshold - subtotal
    ),
    qualifiesFreeShipping,
  };
}
