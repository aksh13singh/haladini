"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Path to the real brand logo (the ornate "Haladini" lockup with the gold
 * peacock). Drop a transparent-background PNG here:
 *   public/haladini-logo.png
 * Until that file exists, the styled wordmark below is shown as a fallback.
 */
const LOGO_SRC = "/haladini-logo.png";

/**
 * Handblock-motif emblem — used as a small standalone mark (footer, mobile
 * menu, favicon). The full wordmark lives in <Logo />.
 */
export function HaladiniMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("h-7 w-7", className)}
    >
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M20 8c2.4 2.6 2.4 6.4 0 9 2.6-2.4 6.4-2.4 9 0-2.6 2.4-2.6 6.4 0 9-2.6-2.4-6.4-2.4-9 0 2.4-2.6 2.4-6.4 0-9-2.6 2.4-6.4 2.4-9 0 2.6-2.4 2.6-6.4 0-9 2.6 2.4 6.4 2.4 9 0Z"
        fill="currentColor"
      />
      <circle cx="20" cy="20" r="2.4" fill="#FFFFFF" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Tone of the fallback wordmark — defaults to wine; "light" for dark bg. */
  tone?: "wine" | "light" | "flamingo";
  withMark?: boolean;
  /** Eagerly load (use for the header logo, which is above the fold). */
  priority?: boolean;
  /** Height utility classes for the logo image lockup. */
  imageClassName?: string;
}

export function Logo({
  className,
  tone = "wine",
  withMark = true,
  priority = false,
  imageClassName = "h-11 w-auto sm:h-12 md:h-14",
}: LogoProps) {
  const [imgOk, setImgOk] = useState(true);

  const toneClass =
    tone === "light"
      ? "text-white"
      : tone === "flamingo"
        ? "text-flamingo-deep"
        : "text-wine";

  return (
    <Link
      href="/"
      aria-label="Haladini — home"
      className={cn("group inline-flex items-center", className)}
    >
      {imgOk ? (
        <Image
          src={LOGO_SRC}
          alt="Haladini"
          width={1100}
          height={360}
          priority={priority}
          onError={() => setImgOk(false)}
          className={cn("object-contain", imageClassName)}
        />
      ) : (
        <span
          className={cn(
            "inline-flex items-center gap-2 font-sans font-bold tracking-tight",
            toneClass
          )}
        >
          {withMark && (
            <HaladiniMark className="h-7 w-7 transition-transform duration-300 group-hover:rotate-45" />
          )}
          <span className="text-2xl leading-none md:text-[1.75rem]">
            Haladini
          </span>
        </span>
      )}
    </Link>
  );
}
