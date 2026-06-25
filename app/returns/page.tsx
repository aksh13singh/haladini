import type { Metadata } from "next";
import Link from "next/link";

import { contact } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description:
    "Haladini's easy 7-day returns and exchanges policy — how to return or exchange your handcrafted pieces.",
};

const sections = [
  {
    heading: "Easy 7-day returns",
    body: [
      "We want you to love your Haladini pieces. If something isn't quite right, you can return eligible items within 7 days of delivery for a refund or exchange.",
    ],
  },
  {
    heading: "What can be returned",
    body: [
      "To be eligible, items must be unused, unwashed and in their original condition with all tags and packaging intact.",
      "For hygiene reasons, certain items may not be eligible for return — this will be noted on the product page where applicable.",
    ],
  },
  {
    heading: "How to start a return or exchange",
    body: [
      `Email us at ${contact.email} (or message us on WhatsApp) with your order number and the reason for the return. We'll share the next steps and a return address.`,
    ],
  },
  {
    heading: "Refunds",
    body: [
      "Once we receive and inspect your returned item, we'll process your refund to the original payment method within 5–7 business days. For Cash on Delivery orders, we'll arrange a bank transfer or store credit.",
    ],
  },
  {
    heading: "Exchanges",
    body: [
      "Need a different size or print? Let us know and, subject to availability, we'll help you exchange your item. If the new item differs in price, we'll adjust the balance.",
    ],
  },
  {
    heading: "Damaged or wrong items",
    body: [
      "We check every order carefully, but if your item arrives damaged or you received the wrong product, please contact us within 48 hours of delivery with a photo, and we'll make it right at no cost to you.",
    ],
  },
  {
    heading: "Return shipping",
    body: [
      "For returns due to a damaged, defective or wrong item, we cover the return shipping. For change-of-mind returns, return shipping may be borne by the customer.",
    ],
  },
];

export default function ReturnsPage() {
  return (
    <div className="container section max-w-3xl">
      <header>
        <p className="eyebrow">Customer Care</p>
        <h1 className="display-heading mt-2 text-4xl sm:text-5xl">
          Returns &amp; Exchanges
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
          Need a hand with a return?
        </h2>
        <p className="mt-2 text-sm text-ink/65">
          Our team is happy to help — reach out and we&apos;ll sort it out.
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
