import type { Metadata } from "next";

import { OrdersScreen } from "@/components/account/orders-screen";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your Haladini orders.",
};

export default function OrdersPage() {
  return (
    <div className="container section">
      <OrdersScreen />
    </div>
  );
}
