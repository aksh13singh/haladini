import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { formatINR } from "@/lib/utils";

const badges = [
  {
    icon: Truck,
    title: "Free Shipping",
    text: `On all orders over ${formatINR(siteConfig.freeShippingThreshold)}`,
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    text: "Hassle-free 7-day returns",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    text: "Cards, UPI & Cash on Delivery",
  },
];

export function TrustBadges() {
  return (
    <section id="trust" className="bg-cream">
      <div className="container grid gap-10 py-14 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-flamingo-tint md:py-16">
        {badges.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex flex-col items-center px-4 text-center sm:px-6"
          >
            <Icon className="h-8 w-8 text-flamingo-deep" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-lg font-semibold text-wine">
              {title}
            </h3>
            <p className="mt-1 text-sm text-ink/65">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
