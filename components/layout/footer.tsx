"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";
import {
  contact,
  footerLinks,
  siteConfig,
} from "@/lib/site-config";

function PaymentIcons() {
  const methods = ["Visa", "Mastercard", "UPI", "Razorpay", "COD"];
  return (
    <div className="flex flex-wrap gap-2">
      {methods.map((m) => (
        <span
          key={m}
          className="rounded-md bg-white/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white/80"
        >
          {m}
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="bg-wine text-white/85">
      <div className="container py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo tone="light" imageClassName="w-[180px] h-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              {siteConfig.description}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-flamingo"
                >
                  <Phone className="h-4 w-4 shrink-0 text-flamingo" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-flamingo"
                >
                  <Mail className="h-4 w-4 shrink-0 text-flamingo" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flamingo" />
                {contact.address}
              </li>
            </ul>
          </div>

          {/* About links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white">
              About
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.about.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-flamingo"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerLinks.support.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-flamingo"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-base font-semibold text-white">
              Stay in Touch
            </h3>
            <p className="mt-4 text-sm text-white/70">
              Sign up for new arrivals, styling notes &amp; a little ₹100 welcome
              treat.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-flamingo"
              />
              <Button type="submit" variant="default" className="shrink-0">
                Subscribe
              </Button>
            </form>
            {done && (
              <p className="mt-2 text-xs text-flamingo">
                Thanks for subscribing — check your inbox! 💌
              </p>
            )}

            <div className="mt-6">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/50">
                We accept
              </p>
              <PaymentIcons />
            </div>

            <div className="mt-6 flex gap-3">
              {[
                { icon: Instagram, href: contact.instagram, label: "Instagram" },
                { icon: Facebook, href: contact.facebook, label: "Facebook" },
                { icon: MessageCircle, href: contact.whatsapp, label: "WhatsApp" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-flamingo hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Haladini. Handcrafted in Jaipur, India.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-flamingo">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-flamingo">
              Privacy
            </Link>
            <Link href="/shipping" className="hover:text-flamingo">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
