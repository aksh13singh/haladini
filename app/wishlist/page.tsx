import type { Metadata } from "next";

import { WishlistScreen } from "@/components/wishlist/wishlist-screen";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Haladini pieces.",
};

export default function WishlistPage() {
  return (
    <div className="container section">
      <WishlistScreen />
    </div>
  );
}
