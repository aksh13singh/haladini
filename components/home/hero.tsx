import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroVideoBackground } from "@/components/home/hero-video-background";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden md:min-h-[88vh]">
      <HeroVideoBackground poster="/hero-poster.jpg" />

      <div className="container relative py-20 md:py-28">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white ring-1 ring-white/30 backdrop-blur-sm">
            ✿ Handcrafted in Jaipur
          </p>

          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.04] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(122,46,69,0.5)] sm:text-6xl lg:text-7xl">
            Block-print living,
            <br />
            <span className="text-flamingo-tint">made with love.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
            Boutique bedsheets, cushions, suits &amp; shirts — each piece
            hand-finished in soft, natural fabrics, made in Jaipur.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/70 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-wine"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <span className="animate-fade-up text-[0.7rem] font-medium uppercase tracking-[0.3em] text-white/70">
          Scroll
        </span>
      </div>
    </section>
  );
}
