import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { NewIn } from "@/components/home/new-in";
import { EditorialBanners } from "@/components/home/editorial-banners";
import { BrandStatement } from "@/components/home/brand-statement";
import { BulkOrders } from "@/components/home/bulk-orders";
import { TrustBadges } from "@/components/home/trust-badges";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Haladini | Handcrafted Jaipur Home & Fashion",
  description:
    "Shop Haladini for handcrafted Jaipur block-print bedsheets, dohars, cushions, suits and shirts made with Indian textile heritage.",
  alternates: {
    canonical: siteConfig.url,
  },
};

// Read fresh product data (New In) from Supabase on each request.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Scrolling marquee */}
      <div className="overflow-hidden bg-flamingo py-3 text-white">
        <div className="pause-on-hover flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="mx-6 text-sm font-semibold uppercase tracking-[0.25em]"
            >
              Handcrafted with love · Haladini ✿
            </span>
          ))}
        </div>
      </div>

      <Reveal>
        <ShopByCategory />
      </Reveal>

      <Reveal>
        <NewIn />
      </Reveal>

      <Reveal>
        <EditorialBanners />
      </Reveal>

      <Reveal>
        <BrandStatement />
      </Reveal>

      <Reveal>
        <BulkOrders />
      </Reveal>

      <Reveal>
        <TrustBadges />
      </Reveal>
    </>
  );
}
