import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Haladini brings India's handblock-printing traditions into modern homes — handcrafted bedsheets, cushions, suits and shirts, made in Jaipur.",
};

const craftSteps = [
  {
    title: "Carved by hand",
    text: "Artisans hand-carve teak blocks with intricate floral and geometric motifs — each block a small work of art.",
  },
  {
    title: "Natural dyes",
    text: "Colours are mixed from natural, skin-friendly dyes, the way it has been done for generations.",
  },
  {
    title: "Block by block",
    text: "Every motif is stamped by hand, one careful impression at a time, so no two pieces are exactly alike.",
  },
  {
    title: "Finished with care",
    text: "Each piece is washed, sun-dried and finished in small batches before it reaches you.",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Truly handcrafted",
    text: "Made by skilled artisans, not machines — celebrating the beauty of the handmade.",
  },
  {
    icon: Leaf,
    title: "Natural fabrics",
    text: "Soft, breathable cottons and natural dyes that are gentle on you and the planet.",
  },
  {
    icon: MapPin,
    title: "Made in Jaipur",
    text: "Rooted in Rajasthan's living craft traditions, supporting local artisan families.",
  },
];

type LetterLine = { text: string; variant?: "lead" | "accent" };

const founderLetter: LetterLine[] = [
  { text: "Every city has a story.", variant: "lead" },
  {
    text: "Mine begins in the timeless lanes of Jaipur—India's Pink City—where every sunrise touches ancient forts, hand-carved havelis, vibrant bazaars, and the unmistakable rhythm of artisans whose hands have preserved centuries of craftsmanship.",
  },
  {
    text: "Growing up in Rajasthan, I wasn't surrounded by factories. I was surrounded by heritage.",
  },
  {
    text: "I watched colours being mixed by hand, wooden blocks carrying generations of artistry, and fabrics transforming into pieces that weren't simply made—they were created with patience, precision, and pride. Every print held a story. Every pattern carried a legacy.",
  },
  { text: "Yet as the years passed, I noticed something changing." },
  {
    text: "The world was moving faster. Handmade artistry was slowly being replaced by mass production. Traditional crafts that once represented Rajasthan were becoming difficult to find in their purest form. The beauty of authentic hand block printing deserved more than being remembered—it deserved to be lived with every day.",
  },
  { text: "That thought became the seed of HALADINI.", variant: "accent" },
  {
    text: "HALADINI was never created to simply sell bedsheets, dohars, cushions, or apparel. It was created to preserve a feeling.",
  },
  {
    text: "A feeling of waking up wrapped in craftsmanship instead of ordinary fabric.",
  },
  {
    text: "A feeling of bringing home something made by skilled hands rather than machines.",
  },
  {
    text: "A feeling of carrying a piece of Rajasthan into homes across the world.",
  },
  {
    text: "Being born into Rajput heritage has always filled me with admiration for the values passed down through generations—honour, resilience, attention to detail, and deep respect for tradition. Those values became the foundation of HALADINI. While our products are contemporary in their appeal, their soul remains rooted in the timeless artistry of Rajasthan.",
  },
  {
    text: "Every design begins with inspiration drawn from our land—its architecture, floral gardens, desert landscapes, royal courtyards, and centuries-old motifs. Skilled artisans then bring these ideas to life using the traditional hand block printing techniques that have been practiced for generations.",
  },
  { text: "No two impressions are ever perfectly identical.", variant: "accent" },
  { text: "That isn't a flaw.", variant: "accent" },
  {
    text: "It's the signature of something made by human hands.",
    variant: "accent",
  },
  {
    text: "In a world chasing perfection through machines, we celebrate the quiet beauty of authenticity.",
  },
  {
    text: "HALADINI is our promise that heritage doesn't belong only in museums or history books. It belongs in everyday life—in the spaces where families gather, where stories are shared, and where memories are made.",
  },
  {
    text: "When you choose HALADINI, you are not simply choosing home furnishings or clothing.",
  },
  {
    text: "You become a part of a story that began in Jaipur and continues wherever craftsmanship is appreciated.",
  },
  { text: "A story of tradition finding its place in modern homes." },
  { text: "A story of Rajasthan living beyond its borders." },
  {
    text: "And a story that, with every hand-printed creation, is still being written.",
  },
  { text: "Welcome to HALADINI.", variant: "accent" },
  { text: "Where heritage meets home.", variant: "accent" },
];

const founderQuote =
  "Crafted in the Pink City. Inspired by Rajput heritage. Handcrafted for homes that value timeless beauty.";

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

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="container py-16 text-center md:py-24">
          <p className="eyebrow">Our Story</p>
          <h1 className="display-heading mx-auto mt-3 max-w-3xl text-balance text-4xl sm:text-5xl md:text-6xl">
            Woven with heritage, made with heart.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-ink/70">
            Haladini is a love letter to India&apos;s handblock-printing
            traditions — reimagined for the way we live today.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container section grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card"
          style={{
            backgroundImage:
              "linear-gradient(150deg,#FFE9F0 0%,#FC8EAC 55%,#7A2E45 100%)",
          }}
        >
          <Motif className="absolute -right-10 -top-10 h-56 w-56 text-white/15" />
          <Motif className="absolute -bottom-12 -left-12 h-48 w-48 text-white/10" />
        </div>
        <div>
          <p className="eyebrow">Handcrafted living</p>
          <h2 className="display-heading mt-2 text-3xl sm:text-4xl">
            More than fabric
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/75">
            At <span className="font-semibold text-flamingo-deep">HALADINI</span>
            , we believe that textiles are more than fabric—they are stories
            woven through generations. Inspired by India&apos;s rich
            handblock-printing traditions, we create thoughtfully crafted pieces
            that bring heritage, comfort and elegance into modern homes.
          </p>
          <p className="mt-4 leading-relaxed text-ink/70">
            From restful bedsheets to breezy suits and shirts, every Haladini
            piece begins with a hand-carved block and ends in your home —
            carrying with it the warmth of the hands that made it.
          </p>
        </div>
      </section>

      {/* Founder's Corner */}
      <section className="bg-cream">
        <div className="container section">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="eyebrow">Founder&apos;s Corner</p>
              <h2 className="display-heading mx-auto mt-2 max-w-2xl text-3xl sm:text-4xl">
                A Letter from the Founder
              </h2>
            </div>

            <article className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card sm:p-8 lg:p-12">
              <Motif className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 text-flamingo-tint" />
              <Motif className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 text-cream" />

              <div className="relative mx-auto max-w-3xl space-y-5">
                {founderLetter.map((line, index) => (
                  <p
                    key={`${line.text}-${index}`}
                    className={
                      line.variant === "lead"
                        ? "font-display text-2xl font-semibold leading-snug text-wine sm:text-3xl"
                        : line.variant === "accent"
                          ? "font-display text-xl font-semibold leading-snug text-flamingo-deep sm:text-2xl"
                          : "text-base leading-8 text-ink/75 sm:text-lg"
                    }
                  >
                    {line.text}
                  </p>
                ))}

                <blockquote className="mt-10 border-l-4 border-flamingo-deep bg-cream px-5 py-5 font-display text-2xl font-semibold leading-snug text-wine sm:px-7 sm:text-3xl">
                  &ldquo;{founderQuote}&rdquo;
                </blockquote>

                <div className="pt-4 text-sm font-semibold uppercase tracking-[0.22em] text-flamingo-deep">
                  Haladini
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* The Craft */}
      <section id="craft" className="scroll-mt-24 bg-cream">
        <div className="container section">
          <div className="text-center">
            <p className="eyebrow">The Craft</p>
            <h2 className="display-heading mx-auto mt-2 max-w-2xl text-3xl sm:text-4xl">
              The art of hand block printing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink/70">
              A centuries-old craft, practised patiently by hand. Here&apos;s how
              every piece comes to life.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {craftSteps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl bg-white p-6 shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-flamingo-tint font-display text-lg font-semibold text-flamingo-deep">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-wine">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container section">
        <div className="grid gap-8 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="text-center sm:text-left">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-flamingo-tint text-flamingo-deep sm:mx-0">
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-wine">
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink/65">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stockists */}
      <section id="stockists" className="scroll-mt-24 bg-cream">
        <div className="container section text-center">
          <p className="eyebrow">Stockists &amp; Wholesale</p>
          <h2 className="display-heading mx-auto mt-2 max-w-2xl text-3xl sm:text-4xl">
            Stock Haladini in your store
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            We partner with boutiques, hotels and homestores across India and
            beyond. For wholesale pricing, custom block-prints and stockist
            enquiries, we&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Become a stockist</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#bulk">Bulk &amp; wholesale</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(120deg,#7A2E45 0%,#9A4760 60%,#F76C9C 100%)",
        }}
      >
        <Motif className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-white/10" />
        <div className="container section text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl">
            Bring a little heritage home.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-wine hover:bg-flamingo-tint hover:text-wine"
            >
              <Link href="/shop">Shop the collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/70 bg-white/5 text-white hover:border-white hover:bg-white hover:text-wine"
            >
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
