import type { Metadata } from "next";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";
import { contact } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Haladini — questions, orders, bulk & wholesale, or stockist enquiries. Based in Jaipur, India.",
};

const details = [
  { icon: Phone, label: "Call us", value: contact.phone, href: contact.phoneHref },
  { icon: Mail, label: "Email us", value: contact.email, href: contact.emailHref },
  { icon: MapPin, label: "Visit the studio", value: contact.address },
  { icon: Clock, label: "Studio hours", value: "Mon–Sat · 10am – 7pm IST" },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="container py-14 text-center md:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="display-heading mt-3 text-4xl sm:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Questions about a product, your order, or a bulk enquiry? We&apos;d
            love to help — reach out and we&apos;ll get back to you within a
            business day.
          </p>
        </div>
      </section>

      <section className="container section grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Details */}
        <div>
          <h2 className="display-heading text-2xl">Reach us directly</h2>
          <ul className="mt-6 space-y-5">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-flamingo-tint text-flamingo-deep">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="font-medium text-wine transition-colors hover:text-flamingo-deep"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium text-wine">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button asChild size="lg" variant="wine">
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
              Follow along
            </p>
            <div className="mt-3 flex gap-3">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full bg-flamingo-tint text-wine transition-colors hover:bg-flamingo-deep hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-full bg-flamingo-tint text-wine transition-colors hover:bg-flamingo-deep hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card sm:p-8">
          <h2 className="display-heading text-2xl">Send us a message</h2>
          <p className="mt-1 text-sm text-ink/60">
            Fill in the form and we&apos;ll be in touch shortly.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
