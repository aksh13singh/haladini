import Link from "next/link";

import { Button } from "@/components/ui/button";
import { contact } from "@/lib/site-config";

/** Block-print floral motif, used as a soft watermark. */
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

/**
 * Shown when the catalogue can't be loaded, in place of the product grid.
 * Deliberately honest — better a graceful "back shortly" than listing
 * placeholder products a customer can't actually buy.
 */
export function CatalogueUnavailable() {
  return (
    <section className="container section">
      <div className="relative overflow-hidden rounded-3xl border border-flamingo-tint bg-cream/70 px-6 py-16 text-center shadow-card sm:py-20">
        <Motif className="absolute -left-10 -top-10 h-40 w-40 rotate-12 text-flamingo/20" />
        <Motif className="absolute -bottom-12 -right-12 h-56 w-56 -rotate-6 text-flamingo/15" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-flamingo-tint px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-flamingo-deep">
            ✿ Just a moment
          </span>
          <h2 className="display-heading mt-5 text-3xl sm:text-4xl md:text-5xl">
            Our collection is being updated
          </h2>
          <div className="mx-auto mt-6 h-px w-14 bg-flamingo-deep/40" />
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink/70">
            We&apos;re giving the shop a little care and it will be back very
            shortly. Thank you for your patience — in the meantime, we&apos;d
            love to hear from you.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                See our latest on Instagram
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={contact.emailHref}>Email us</a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-ink/55">
            Or read{" "}
            <Link href="/about" className="underline hover:text-flamingo-deep">
              our story
            </Link>{" "}
            while you wait.
          </p>
        </div>
      </div>
    </section>
  );
}
