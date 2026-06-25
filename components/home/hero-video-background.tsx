"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoBackgroundProps {
  /** MP4 file in /public. Drop your clip at public/hero-video.mp4. */
  src?: string;
  /** Optional WebM (smaller; served first where supported). */
  webm?: string;
  /** Optional poster image (first frame) shown before the video paints. */
  poster?: string;
}

/**
 * Full-bleed hero background. Layers, back to front:
 *   1. an animated flamingo "aurora" gradient (fallback if no assets exist),
 *   2. the autoplaying muted video (its poster bridges until frames are ready),
 *   3. wine overlays for text legibility.
 * Visitors who prefer reduced motion get the still poster instead of the video.
 */
export function HeroVideoBackground({
  src = "/hero-video.mp4",
  webm,
  poster,
}: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!reducedMotion) videoRef.current?.play().catch(() => {});
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* 1. Animated brand gradient — base layer / no-asset fallback. */}
      <div className="hero-aurora absolute inset-0" />

      {/* 2. Video, or a still poster for reduced-motion visitors. */}
      {reducedMotion ? (
        poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* 3. Legibility overlays — keep the left (text) side readable. */}
      <div className="absolute inset-0 bg-gradient-to-br from-wine/55 via-wine/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-wine/45 via-transparent to-transparent" />
    </div>
  );
}
