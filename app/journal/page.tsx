import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { journalPosts } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Stories from the Haladini studio — the craft of hand block printing, styling notes, and care guides.",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function JournalPage() {
  return (
    <div className="container section">
      <header className="text-center">
        <p className="eyebrow">The Journal</p>
        <h1 className="display-heading mt-2 text-4xl sm:text-5xl">
          Stories from the studio
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Notes on the craft, styling inspiration, and how to care for your
          handcrafted pieces.
        </p>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {journalPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-flamingo-tint bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <div
              className="relative aspect-[3/2] overflow-hidden"
              style={{ backgroundImage: post.gradient }}
            >
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-wine">
                {post.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs text-ink/45">
                {fmtDate(post.date)} · {post.readTime}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-wine transition-colors group-hover:text-flamingo-deep">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-flamingo-deep">
                Read more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
