import { siteConfig } from "@/lib/site-config";

/** Flat shipping fee applied below the free-shipping threshold. */
export const SHIPPING_FEE = 99;

export interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
  qualifiesFreeShipping: boolean;
}

export function getCartTotals(subtotal: number): CartTotals {
  const qualifiesFreeShipping = subtotal >= siteConfig.freeShippingThreshold;
  const shipping = subtotal === 0 || qualifiesFreeShipping ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShippingRemaining: Math.max(
      0,
      siteConfig.freeShippingThreshold - subtotal
    ),
    qualifiesFreeShipping,
  };
}
