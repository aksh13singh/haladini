import Link from "next/link";

import { Button } from "@/components/ui/button";
import { contact } from "@/lib/site-config";

/** Block-print floral motif, used as a soft watermark (same as category cards). */
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

/** Elegant "Coming Soon" treatment for a category that isn't live yet. */
export function ComingSoon({ categoryName }: { categoryName: string }) {
  const notifyHref = `${contact.emailHref}?subject=${encodeURIComponent(
    `Notify me when ${categoryName} launch`
  )}`;

  return (
    <section className="container section">
      <div className="relative overflow-hidden rounded-3xl border border-flamingo-tint bg-cream/70 px-6 py-16 text-center shadow-card sm:py-20">
        <Motif className="absolute -left-10 -top-10 h-40 w-40 rotate-12 text-flamingo/20" />
        <Motif className="absolute -bottom-12 -right-12 h-56 w-56 -rotate-6 text-flamingo/15" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-flamingo-tint px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-flamingo-deep">
            ✿ The artisans are at work
          </span>
          <h2 className="display-heading mt-5 text-4xl sm:text-5xl md:text-6xl">
            Coming Soon
          </h2>
          <div className="mx-auto mt-6 h-px w-14 bg-flamingo-deep/40" />
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink/70">
            Our hand block-printed {categoryName.toLowerCase()} are being
            crafted in Jaipur right now — soft cottons, breezy fits and
            signature Haladini prints. They&apos;ll be here very soon.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Shop what&apos;s live</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={notifyHref}>Notify me</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
