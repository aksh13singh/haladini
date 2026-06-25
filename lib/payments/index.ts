import type { PaymentMethod } from "@/lib/types";
import type { PaymentContext, PaymentResult } from "./types";
import { payWithCod } from "./cod";
import { payWithRazorpay, isRazorpayConfigured } from "./razorpay";

export type { PaymentContext, PaymentResult };
export { isRazorpayConfigured };

/**
 * Single entry point for taking a payment. Add a case (e.g. "stripe") to extend
 * — the checkout UI just calls processPayment and reacts to the result.
 */
export async function processPayment(
  method: PaymentMethod,
  ctx: PaymentContext
): Promise<PaymentResult> {
  switch (method) {
    case "razorpay":
      return payWithRazorpay(ctx);
    case "cod":
      return payWithCod(ctx);
    default:
      return { success: false, error: "Unsupported payment method." };
  }
}
