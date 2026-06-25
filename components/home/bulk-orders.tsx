import { FileText, IndianRupee, Package, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { contact } from "@/lib/site-config";

const features = [
  { icon: IndianRupee, label: "Wholesale pricing" },
  { icon: Palette, label: "Custom block-prints" },
  { icon: Package, label: "Made to order" },
  { icon: FileText, label: "GST invoicing" },
];

function Motif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="24"
          rx="8.5"
          ry="20"
          fill="currentColor"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="9" fill="currentColor" />
    </svg>
  );
}

export function BulkOrders() {
  const enquireHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    "Bulk / Wholesale Order Enquiry"
  )}`;

  return (
    <section id="bulk" className="section scroll-mt-24 bg-canvas">
      <div className="container">
        <div
          className="relative overflow-hidden rounded-3xl px-6 py-12 shadow-soft sm:px-10 md:px-14 md:py-16"
          style={{
            backgroundImage:
              "linear-gradient(135deg,#FC8EAC 0%,#F76C9C 45%,#7A2E45 100%)",
          }}
        >
          <Motif className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-white/10" />
          <Motif className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 text-white/5" />

          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Bulk &amp; Wholesale
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-white sm:text-4xl md:text-[2.75rem]">
                Order in bulk,
                <br />
                made just for you.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/85">
                Outfitting a hotel, stocking a boutique, or planning a big
                celebration or corporate gift? We craft block-print bedsheets,
                cushions, suits &amp; shirts to order — at wholesale prices, with
                custom designs and GST invoicing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-wine shadow-lift hover:bg-flamingo-tint hover:text-wine"
                >
                  <a href={enquireHref}>Enquire Now</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/70 bg-white/5 text-white hover:border-white hover:bg-white hover:text-wine"
                >
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2.5 rounded-2xl bg-white/[0.12] p-4 ring-1 ring-white/15 backdrop-blur-sm sm:p-5"
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                  <span className="text-sm font-semibold text-white">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
