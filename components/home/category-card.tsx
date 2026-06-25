import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/lib/site-config";

/** Distinct-but-cohesive flamingo→wine gradients per category. */
const cardGradient: Record<string, string> = {
  bedsheets: "linear-gradient(155deg,#FFE9F0 0%,#FC8EAC 100%)",
  cushions: "linear-gradient(155deg,#FC8EAC 0%,#9A4760 100%)",
  suits: "linear-gradient(155deg,#F76C9C 0%,#7A2E45 100%)",
  shirts: "linear-gradient(155deg,#9A4760 0%,#5F2335 100%)",
};

/** Block-print style floral motif used as a soft watermark. */
function CategoryMotif({ className }: { className?: string }) {
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

export function CategoryCard({ category }: { category: Category }) {
  const gradient = cardGradient[category.slug] ?? cardGradient.bedsheets;

  return (
    <Link
      href={category.href}
      aria-label={`Shop ${category.name}`}
      className="group relative flex aspect-[4/5] snap-start flex-col justify-end overflow-hidden rounded-3xl shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
      style={{ backgroundImage: category.image ? undefined : gradient }}
    >
      {category.image ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      ) : (
        <CategoryMotif className="absolute -right-7 -top-7 h-44 w-44 text-white/15 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
      )}

      {/* Legibility overlay for the bottom-left label */}
      <div className="absolute inset-0 bg-gradient-to-t from-wine/75 via-wine/10 to-transparent" />

      <div className="relative p-5 md:p-6">
        <h3 className="font-display text-2xl font-semibold text-white md:text-[1.7rem]">
          {category.name}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/85">
          Shop the edit
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
