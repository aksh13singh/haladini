import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Haladini order.",
};

export default function CheckoutPage() {
  return (
    <div className="container section">
      <h1 className="display-heading text-3xl sm:text-4xl">Checkout</h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
