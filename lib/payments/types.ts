/** Shared payment-layer contracts. Add a new provider by implementing a
 *  function with this shape and registering it in ./index.ts (e.g. Stripe). */
export interface PaymentContext {
  amount: number; // order total in ₹ (rupees)
  orderId: string; // our internal order id
  customer: { name: string; email: string; phone: string };
}

export interface PaymentResult {
  success: boolean;
  reference?: string; // gateway payment id, or "COD"
  error?: string;
}
