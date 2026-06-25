import type { Metadata } from "next";

import { CartContent } from "@/components/cart/cart-content";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review the handcrafted pieces in your Haladini bag.",
};

export default function CartPage() {
  return (
    <div className="container section">
      <h1 className="display-heading text-3xl sm:text-4xl">Your Bag</h1>
      <div className="mt-8">
        <CartContent />
      </div>
    </div>
  );
}
