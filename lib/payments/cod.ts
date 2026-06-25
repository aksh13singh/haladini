import type { PaymentContext, PaymentResult } from "./types";

/** Cash on Delivery — no gateway; the order is simply placed as pending. */
export async function payWithCod(
  _ctx: PaymentContext
): Promise<PaymentResult> {
  return { success: true, reference: "COD" };
}
