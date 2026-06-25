import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { getPostBySlug, journalPosts } from "@/lib/journal";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function JournalPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article>
      {/* Cover */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: post.gradient }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-wine/40 to-transparent" />
        <div className="container relative py-16 text-center md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
            {post.category}
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-white/80">
            {fmtDate(post.date)} · {post.readTime}
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="container section max-w-2xl">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1 text-sm text-ink/55 transition-colors hover:text-flamingo-deep"
        >
          <ChevronLeft className="h-4 w-4" />
          All journal entries
        </Link>

        <div className="mt-8 space-y-6">
          {post.content.map((block, i) => (
            <div key={i}>
              {block.heading && (
                <h2 className="font-display text-2xl font-semibold text-wine">
                  {block.heading}
                </h2>
              )}
              <p className="mt-2 text-lg leading-relaxed text-ink/75">
                {block.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-cream p-6 text-center">
          <p className="font-display text-xl text-wine">
            Bring a little heritage home.
          </p>
          <Link
            href="/shop"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-flamingo-deep hover:underline"
          >
            Shop the collection →
          </Link>
        </div>
      </div>
    </article>
  );
}
