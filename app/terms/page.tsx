import type { Metadata } from "next";

import { contact, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using the Haladini website and ordering our products.",
};

const sections = [
  {
    heading: "1. Introduction",
    body: [
      `Welcome to ${siteConfig.name}. These Terms of Service ("Terms") govern your use of our website and the purchase of products from us. By accessing our site or placing an order, you agree to these Terms.`,
    ],
  },
  {
    heading: "2. Products & pricing",
    body: [
      "Our products are handcrafted and hand block-printed. Because each piece is made by hand, slight variations in colour, print and finish are natural and are not considered defects.",
      "All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to update prices and product availability at any time.",
    ],
  },
  {
    heading: "3. Orders & payment",
    body: [
      "When you place an order, you make an offer to purchase. We may accept or decline any order at our discretion (for example, if an item is out of stock). Payment is processed securely via our payment partners, and Cash on Delivery may be available on eligible orders.",
    ],
  },
  {
    heading: "4. Shipping & delivery",
    body: [
      "We aim to dispatch orders within 2–3 business days. Delivery timelines are estimates and may vary due to factors outside our control. Risk of loss passes to you upon delivery.",
    ],
  },
  {
    heading: "5. Returns & refunds",
    body: [
      "We accept returns within 7 days of delivery for unused items in their original condition and packaging. Please refer to our Returns and Shipping pages for full details. Refunds are processed to the original payment method within a reasonable time after we receive the returned item.",
    ],
  },
  {
    heading: "6. Intellectual property",
    body: [
      `All content on this website — including designs, prints, photographs, text and the ${siteConfig.name} name and logo — is our property or used with permission, and may not be reproduced without our written consent.`,
    ],
  },
  {
    heading: "7. Acceptable use",
    body: [
      "You agree to use our website lawfully and not to misuse it, attempt to gain unauthorised access, or interfere with its operation.",
    ],
  },
  {
    heading: "8. Limitation of liability",
    body: [
      "To the fullest extent permitted by law, our liability for any claim arising from your use of the site or our products is limited to the amount you paid for the relevant order.",
    ],
  },
  {
    heading: "9. Governing law",
    body: [
      "These Terms are governed by the laws of India, and any disputes will be subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan.",
    ],
  },
  {
    heading: "10. Changes & contact",
    body: [
      `We may update these Terms from time to time; the latest version will always be posted here. For any questions, contact us at ${contact.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container section max-w-3xl">
      <header>
        <p className="eyebrow">Legal</p>
        <h1 className="display-heading mt-2 text-4xl sm:text-5xl">
          Terms of Service
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

      <p className="mt-12 rounded-2xl bg-cream p-5 text-sm text-ink/55">
        Note: This is a general template provided for convenience. Please have it
        reviewed by a legal professional before relying on it for your business.
      </p>
    </div>
  );
}
