import type { Metadata } from "next";

import { contact, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Haladini collects, uses and protects your personal information when you shop with us.",
};

const sections = [
  {
    heading: "1. Introduction",
    body: [
      `At ${siteConfig.name}, your privacy matters to us. This Privacy Policy explains what information we collect when you visit our website or place an order, how we use it, and the choices you have. By using our site, you agree to this policy.`,
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Information you give us: your name, email address, mobile number, shipping and billing address, and order details when you create an account or place an order.",
      "Payment information: payments are processed securely by our payment partners (such as Razorpay). We do not store your full card or banking details on our servers.",
      "Information collected automatically: basic usage data such as your device, browser and pages visited, collected via cookies and similar technologies to help the site work and improve.",
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      "We use your information to process and deliver your orders, send order and delivery updates, respond to your enquiries, prevent fraud, and improve our products and website.",
      "With your consent, we may also send you marketing communications about new arrivals and offers. You can opt out at any time using the unsubscribe link or by contacting us.",
    ],
  },
  {
    heading: "4. Sharing your information",
    body: [
      "We share your information only as needed to run our business — for example with payment processors, courier and logistics partners, and trusted service providers who help us operate. We do not sell your personal information. We may also disclose information where required by law.",
    ],
  },
  {
    heading: "5. Cookies",
    body: [
      "We use cookies to remember your cart and preferences, keep you signed in, and understand how the site is used. You can control cookies through your browser settings, though some features may not work without them.",
    ],
  },
  {
    heading: "6. Data security & retention",
    body: [
      "We take reasonable measures to protect your information. We retain it only for as long as needed to fulfil orders, meet legal and accounting obligations, and resolve disputes.",
    ],
  },
  {
    heading: "7. Your rights",
    body: [
      "You have the right to access, correct or delete your personal information, and to opt out of marketing. To exercise these rights, please contact us and we'll be glad to help.",
    ],
  },
  {
    heading: "8. Children's privacy",
    body: [
      "Our website is not intended for children under 18, and we do not knowingly collect their personal information.",
    ],
  },
  {
    heading: "9. Changes & contact",
    body: [
      `We may update this policy from time to time; the latest version will always be posted here. If you have any questions about your privacy, contact us at ${contact.email}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container section max-w-3xl">
      <header>
        <p className="eyebrow">Legal</p>
        <h1 className="display-heading mt-2 text-4xl sm:text-5xl">
          Privacy Policy
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
        reviewed by a legal professional to ensure it meets your obligations.
      </p>
    </div>
  );
}
