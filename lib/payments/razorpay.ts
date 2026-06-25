import type { PaymentContext, PaymentResult } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

/** Whether the public Razorpay key is present (gates the online-payment option). */
export const isRazorpayConfigured = () => Boolean(RAZORPAY_KEY_ID);

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function payWithRazorpay(
  ctx: PaymentContext
): Promise<PaymentResult> {
  if (!isRazorpayConfigured())
    return { success: false, error: "Online payment isn't configured yet." };

  const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!ok) return { success: false, error: "Couldn't load the payment gateway." };

  // 1. Create the order on the server (uses the secret key).
  const res = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: ctx.amount, receipt: ctx.orderId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.error ?? "Couldn't start the payment." };
  }
  const order = await res.json();

  // 2. Open Razorpay Checkout and verify the result server-side.
  return new Promise<PaymentResult>((resolve) => {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Haladini",
      description: `Order ${ctx.orderId}`,
      order_id: order.id,
      prefill: {
        name: ctx.customer.name,
        email: ctx.customer.email,
        contact: ctx.customer.phone,
      },
      theme: { color: "#F76C9C" },
      handler: async (response: any) => {
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const verify = await verifyRes.json().catch(() => ({ ok: false }));
        resolve(
          verify.ok
            ? { success: true, reference: response.razorpay_payment_id }
            : { success: false, error: "Payment verification failed." }
        );
      },
      modal: {
        ondismiss: () =>
          resolve({ success: false, error: "Payment was cancelled." }),
      },
    });
    rzp.open();
  });
}
