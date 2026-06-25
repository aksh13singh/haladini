import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Edit copy / links / collections here. Drop a photo at the `image` path
 *  (e.g. /banners/sleep-in-style.jpg) to replace the gradient with a photo. */
type Banner = {
  eyebrow: string;
  title: string;
  subhead: string;
  cta: string;
  href: string;
  gradient: string;
  image?: string;
};

const banners: Banner[] = [
  {
    eyebrow: "The Bedroom",
    title: "Sleep in Style",
    subhead: "Block-print cotton bedsheets for beautiful, restful nights.",
    cta: "Shop Bedsheets",
    href: "/shop/bedsheets",
    gradient: "linear-gradient(150deg,#FC8EAC 0%,#F76C9C 55%,#9A4760 100%)",
  },
  {
    eyebrow: "Suits & Shirts",
    title: "Wear the Craft",
    subhead: "Breezy block-print suits & shirts, made for every day.",
    cta: "Shop Apparel",
    href: "/shop/suits",
    gradient: "linear-gradient(150deg,#7A2E45 0%,#5F2335 100%)",
  },
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

export function EditorialBanners() {
  return (
    <section id="editorial" className="grid grid-cols-1 md:grid-cols-2">
      {banners.map((banner) => (
        <Link
          key={banner.title}
          href={banner.href}
          className="group relative flex min-h-[440px] flex-col justify-end overflow-hidden md:min-h-[560px]"
          style={{ backgroundImage: banner.image ? undefined : banner.gradient }}
        >
          {banner.image && (
            <Image
              src={banner.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}

          <Motif className="absolute -right-12 -top-12 h-72 w-72 text-white/10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" />

          <div className="absolute inset-0 bg-gradient-to-t from-wine/75 via-wine/15 to-transparent" />

          <div className="relative max-w-md p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              {banner.eyebrow}
            </p>
            <h3 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
              {banner.title}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 md:text-base">
              {banner.subhead}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-white group-hover:text-wine">
              {banner.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
