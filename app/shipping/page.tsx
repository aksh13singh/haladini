import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "Haladini shipping and delivery information — free shipping, dispatch times, delivery estimates, tracking and COD.",
};

const sections = [
  {
    heading: "Where we ship",
    body: [
      "We currently ship across India. For international orders or bulk/wholesale shipping, please get in touch and we'll be glad to arrange it.",
    ],
  },
  {
    heading: "Shipping charges",
    body: [
      `Enjoy free shipping on all orders over ${formatINR(
        siteConfig.freeShippingThreshold
      )}. A small flat shipping fee applies to orders below this amount, shown at checkout.`,
    ],
  },
  {
    heading: "Processing & dispatch",
    body: [
      "Orders are processed and dispatched within 2–3 business days. You'll receive a confirmation once your order is on its way.",
    ],
  },
  {
    heading: "Delivery time",
    body: [
      "Once dispatched, orders typically arrive within 4–7 business days, depending on your location. Remote pin codes may take a little longer.",
    ],
  },
  {
    heading: "Order tracking",
    body: [
      "As soon as your order ships, we'll share tracking details by email or SMS so you can follow it to your doorstep.",
    ],
  },
  {
    heading: "Cash on Delivery",
    body: [
      "Cash on Delivery (COD) is available across most pin codes in India. If COD is available for your address, you'll see the option at checkout.",
    ],
  },
  {
    heading: "Delays",
    body: [
      "Delivery timelines are estimates and may occasionally be affected by factors outside our control — such as weather, festivals or courier delays. We'll always do our best to keep you updated.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <div className="container section max-w-3xl">
      <header>
        <p className="eyebrow">Customer Care</p>
        <h1 className="display-heading mt-2 text-4xl sm:text-5xl">
          Shipping &amp; Delivery
        </h1>
        <p className="mt-3 text-sm text-ink/50">Last updated: June 2026</p>
      </header>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-semibold text-wine">
              {s.heading}
            </h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-cream p-8 text-center">
        <h2 className="font-display text-xl font-semibold text-wine">
          Questions about your delivery?
        </h2>
        <p className="mt-2 text-sm text-ink/65">
          We&apos;re here to help track down your order anytime.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-flamingo-deep hover:underline"
        >
          Contact us →
        </Link>
      </div>
    </div>
  );
}
