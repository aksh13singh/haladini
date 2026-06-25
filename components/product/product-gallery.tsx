"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  isNew,
}: {
  images: string[];
  name: string;
  isNew?: boolean;
}) {
  const gallery = images.length > 0 ? images : ["/products/placeholder.jpg"];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  // Hover-magnify state
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const next = useCallback(
    () => setActive((i) => (i + 1) % gallery.length),
    [gallery.length]
  );
  const prev = useCallback(
    () => setActive((i) => (i - 1 + gallery.length) % gallery.length),
    [gallery.length]
  );

  // Keyboard nav + scroll-lock while the lightbox is open
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, prev]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image — hover to magnify, click to expand */}
      <div
        className="group relative aspect-[4/5] cursor-zoom-in select-none overflow-hidden rounded-3xl bg-flamingo-tint shadow-card"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onMove}
        onClick={() => setLightbox(true)}
      >
        <Image
          src={gallery[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{
            transformOrigin: origin,
            transform: zooming ? "scale(2.2)" : "scale(1)",
          }}
          className="object-cover transition-transform duration-200 ease-out"
        />
        {isNew && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-wine shadow-sm">
            New
          </span>
        )}
        <span className="pointer-events-none absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-wine opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" />
        </span>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "relative aspect-square w-20 overflow-hidden rounded-xl border-2 transition-colors",
                active === i
                  ? "border-flamingo-deep"
                  : "border-transparent hover:border-flamingo-tint"
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — photos`}
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            <div className="relative h-full w-full max-w-3xl">
              <Image
                src={gallery[active]}
                alt={`${name} — photo ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-4 flex justify-center gap-2.5">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={cn(
                    "relative h-14 w-14 overflow-hidden rounded-lg border-2 transition-colors",
                    active === i ? "border-white" : "border-white/30"
                  )}
                >
                  <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
