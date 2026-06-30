import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { siteConfig } from "@/lib/site-config";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about Haladini orders, shipping, returns, products and payments.",
};

const faqGroups = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long will my order take to arrive?",
        a: "Orders are dispatched within 2–3 business days and typically arrive within 4–7 business days across India, depending on your location.",
      },
      {
        q: "Do you offer free shipping?",
        a: `Yes! We offer free shipping on all orders over ${formatINR(
          siteConfig.freeShippingThreshold
        )}. A small flat fee applies below that.`,
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship across India. For international or bulk enquiries, please reach out via our contact page and we'll be happy to help.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unused items in their original condition and packaging. Please see our Returns page for full details.",
      },
      {
        q: "How do I start a return or exchange?",
        a: "Email us at " +
          siteConfig.name.toLowerCase() +
          " support with your order number and we'll guide you through it.",
      },
    ],
  },
  {
    category: "Products & Care",
    items: [
      {
        q: "Are the colours and prints exactly as shown?",
        a: "Because every piece is hand block-printed, slight variations in colour and print placement are natural — they're the signature of the handmade, not a defect.",
      },
      {
        q: "How do I care for my block-print textiles?",
        a: "Gentle machine wash cold, separately for the first few washes, line-dry in shade, and warm iron on the reverse. Avoid bleach and harsh detergents.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept cards, UPI and net banking via Razorpay, as well as Cash on Delivery (COD) on eligible orders.",
      },
      {
        q: "Is Cash on Delivery available?",
        a: "Yes, COD is available across most pin codes in India. You'll see the option at checkout if it's available for your address.",
      },
    ],
  },
];

export default function FaqsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container section max-w-3xl">
      <header className="text-center">
        <p className="eyebrow">Help Centre</p>
        <h1 className="display-heading mt-2 text-4xl sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Everything you need to know about ordering, shipping, returns and care.
        </p>
      </header>

      <div className="mt-12 space-y-10">
        {faqGroups.map((group) => (
          <section key={group.category}>
            <h2 className="font-display text-xl font-semibold text-wine">
              {group.category}
            </h2>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-flamingo-tint bg-white px-5 py-4 shadow-card [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-wine">
                    {item.q}
                    <Plus className="h-5 w-5 shrink-0 text-flamingo-deep transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-cream p-8 text-center">
        <h2 className="font-display text-xl font-semibold text-wine">
          Still have a question?
        </h2>
        <p className="mt-2 text-sm text-ink/65">
          We&apos;re here to help — reach out and we&apos;ll get back to you
          within a business day.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-flamingo-deep hover:underline"
        >
          Contact us →
        </Link>
      </div>
      </div>
    </>
  );
}
