import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/checkout/order-confirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Haladini order confirmation.",
};

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="container section">
      <OrderConfirmation id={params.id} />
    </div>
  );
}
