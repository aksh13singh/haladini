import Image from "next/image";

/** Per-category banner gradients (used when no photo is set). */
export const bannerGradients: Record<string, string> = {
  all: "linear-gradient(125deg,#FC8EAC 0%,#F76C9C 50%,#7A2E45 100%)",
  bedsheets: "linear-gradient(125deg,#FC8EAC 0%,#F76C9C 55%,#7A2E45 100%)",
  cushions: "linear-gradient(125deg,#F58BAC 0%,#9A4760 100%)",
  suits: "linear-gradient(125deg,#9A4760 0%,#7A2E45 100%)",
  shirts: "linear-gradient(125deg,#7A2E45 0%,#5F2335 100%)",
};

function FloralPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.07]"
    >
      <defs>
        <pattern
          id="cat-floral"
          width="148"
          height="148"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(6)"
        >
          <g transform="translate(74 74)" fill="currentColor">
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-22"
                rx="7"
                ry="17"
                transform={`rotate(${i * 45})`}
              />
            ))}
            <circle r="8" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cat-floral)" />
    </svg>
  );
}

function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.2] mix-blend-soft-light"
    >
      <filter id="cat-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cat-grain)" />
    </svg>
  );
}

interface CategoryBannerProps {
  /** Category slug — picks the gradient. */
  category?: string;
  eyebrow?: string;
  title: string;
  tagline?: string;
  /** Optional cover photo (e.g. /categories/cushions.jpg) — overrides the gradient. */
  image?: string;
}

export function CategoryBanner({
  category = "all",
  eyebrow = "The Collection",
  title,
  tagline,
  image,
}: CategoryBannerProps) {
  const gradient = bannerGradients[category] ?? bannerGradients.all;

  return (
    <section className="relative isolate flex min-h-[280px] items-center overflow-hidden md:min-h-[360px]">
      {/* Base — photo or animated gradient */}
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div
          className="cat-banner-bg absolute inset-0"
          style={{ backgroundImage: gradient }}
        />
      )}

      {/* Texture layers */}
      {!image && <FloralPattern />}
      <Grain />

      {/* Vignette + photo scrim */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 25%, transparent 42%, rgba(122,46,69,0.5) 100%)",
        }}
      />
      {image && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine/70 via-wine/15 to-transparent" />
      )}

      {/* Framed hairline */}
      <div className="pointer-events-none absolute inset-4 border border-white/15 md:inset-6" />

      {/* Content */}
      <div className="container relative py-16 text-center md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          {eyebrow}
        </p>
        <div className="mx-auto mt-4 h-px w-12 bg-[#E7C9A4]/80" />
        <h1 className="mt-5 text-balance font-display text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(122,46,69,0.5)] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {tagline && (
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            {tagline}
          </p>
        )}
      </div>
    </section>
  );
}
