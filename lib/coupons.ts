import { siteConfig } from "@/lib/site-config";

export type CouponType = "flat" | "percent";

export interface Coupon {
  code: string;
  type: CouponType;
  /** ₹ amount for "flat" coupons, or the percentage for "percent" coupons. */
  value: number;
  /** Minimum cart subtotal (₹) required to use the code. */
  minSubtotal?: number;
  /** Cap on the discount (₹), useful for percentage coupons. */
  maxDiscount?: number;
  description: string;
}

/**
 * Available discount codes — add new ones here.
 * The first entry mirrors the sitewide "Get ₹100 off" promo tab
 * (siteConfig.coupon), so the code shown there works at checkout.
 */
export const COUPONS: Coupon[] = [
  {
    code: siteConfig.coupon.code, // "HELLO100"
    type: "flat",
    value: 100,
    minSubtotal: 0,
    description: "₹100 off your order",
  },
];

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code.toUpperCase() === normalized);
}

export type CouponOutcome =
  | { ok: true; code: string; discount: number; description: string }
  | { ok: false; error: string };

/** Validate a code against the current subtotal and return the ₹ discount. */
export function evaluateCoupon(code: string, subtotal: number): CouponOutcome {
  if (!code.trim()) return { ok: false, error: "Enter a coupon code." };

  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, error: "That code isn't valid." };

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      error: `Add ₹${coupon.minSubtotal.toLocaleString("en-IN")} of items to use this code.`,
    };
  }

  let discount =
    coupon.type === "flat"
      ? coupon.value
      : Math.round((subtotal * coupon.value) / 100);
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal); // never discount below ₹0

  return { ok: true, code: coupon.code, discount, description: coupon.description };
}
