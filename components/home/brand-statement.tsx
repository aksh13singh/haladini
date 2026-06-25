import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Round "Handcrafted" rubber-stamp badge with circular text + floral motif. */
function HandcraftedStamp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <defs>
        <path
          id="stamp-text-path"
          d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0"
        />
      </defs>
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="#FFE9F0"
        stroke="#F76C9C"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
      <text
        fill="#7A2E45"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
        fontFamily="var(--font-poppins)"
      >
        <textPath href="#stamp-text-path" startOffset="0">
          HANDCRAFTED · WITH LOVE ·
        </textPath>
      </text>
      <g transform="translate(60 60)" fill="#F76C9C">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-15"
            rx="5"
            ry="12"
            transform={`rotate(${i * 45})`}
          />
        ))}
        <circle r="6" />
      </g>
    </svg>
  );
}

/** Heart-shaped "Made in Jaipur" sticker. */
function JaipurHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 96" aria-hidden="true" className={className}>
      <path
        d="M50 90 C50 90 6 62 6 31 C6 15 18 7 30 7 C40 7 47 14 50 21 C53 14 60 7 70 7 C82 7 94 15 94 31 C94 62 50 90 50 90 Z"
        fill="#F76C9C"
      />
      {["MADE", "IN", "JAIPUR"].map((line, i) => (
        <text
          key={line}
          x="50"
          y={36 + i * 15}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="800"
          fontFamily="var(--font-poppins)"
        >
          {line}
        </text>
      ))}
    </svg>
  );
}

export function BrandStatement() {
  return (
    <section id="brand-statement" className="section scroll-mt-24 bg-canvas">
      <div className="container border-t border-flamingo-tint pt-12 text-center md:pt-16">
        {/* Sticker badges */}
        <div className="mx-auto mb-9 flex w-fit items-start justify-center">
          <HandcraftedStamp className="h-24 w-24 -rotate-12 md:h-28 md:w-28" />
          <JaipurHeart className="-ml-4 mt-4 h-20 w-20 rotate-[10deg] md:h-24 md:w-24" />
        </div>

        <p className="mx-auto max-w-4xl text-balance font-display text-2xl font-medium leading-snug text-wine sm:text-3xl md:text-[2.5rem] md:leading-[1.2]">
          At <span className="text-flamingo-deep">HALADINI</span>, we believe
          that textiles are more than fabric—they are stories woven through
          generations. Inspired by India&apos;s rich handblock-printing
          traditions, we create thoughtfully crafted pieces that bring heritage,
          comfort and elegance into modern homes
        </p>

        <div className="mt-10">
          <Button asChild variant="outline" size="lg">
            <Link href="/about">More About Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
