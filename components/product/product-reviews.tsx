"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, Loader2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/lib/supabase/use-user";
import type { Review } from "@/lib/types";

function StarRow({
  value,
  interactive,
  onChange,
  size = "h-5 w-5",
}: {
  value: number;
  interactive?: boolean;
  onChange?: (n: number) => void;
  size?: string;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Your rating" : `Rated ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const star = (
          <Star
            className={cn(
              size,
              filled ? "fill-flamingo-deep text-flamingo-deep" : "fill-none text-ink/25"
            )}
            aria-hidden="true"
          />
        );
        return interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-7 w-7",
                n <= value ? "fill-flamingo-deep text-flamingo-deep" : "fill-none text-ink/30"
              )}
            />
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}

const fieldCls =
  "w-full rounded-2xl border border-flamingo-tint bg-white px-4 py-3 text-sm focus:border-flamingo-deep focus:outline-none";

export function ProductReviews({
  productId,
  productName,
  reviews,
}: {
  productId: string;
  productName: string;
  reviews: Review[];
}) {
  const router = useRouter();
  const { user } = useSupabaseUser();
  const [purchased, setPurchased] = useState<boolean | null>(null);

  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const alreadyReviewed = !!user && reviews.some((r) => r.userId === user.id);

  // Prefill the display name from the signed-in account.
  useEffect(() => {
    if (!user) return;
    const fallback =
      (user.user_metadata?.full_name as string) ||
      (user.email ? user.email.split("@")[0] : "");
    setName((prev) => prev || fallback);
  }, [user]);

  // Check whether the signed-in user has purchased this product.
  useEffect(() => {
    let active = true;
    if (!user) {
      setPurchased(null);
      return;
    }
    (async () => {
      try {
        const { data, error } = await createClient().rpc("has_purchased", {
          p_product_id: productId,
        });
        if (active) setPurchased(error ? false : Boolean(data));
      } catch {
        if (active) setPurchased(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (rating < 1) return setError("Please pick a star rating.");
    if (!body.trim())
      return setError("Please write a few words about the product.");

    setSubmitting(true);
    const { error: insErr } = await createClient()
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user!.id,
        author_name: name.trim() || "Customer",
        rating,
        title: title.trim() || null,
        body: body.trim(),
      });
    setSubmitting(false);

    if (insErr) {
      setError(
        /duplicate|unique/i.test(insErr.message)
          ? "You've already reviewed this product."
          : "Couldn't submit your review. Please try again."
      );
      return;
    }
    setRating(0);
    setTitle("");
    setBody("");
    router.refresh();
  };

  return (
    <section id="reviews" className="mt-20 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-flamingo-tint pb-6">
        <div>
          <h2 className="display-heading text-2xl md:text-3xl">Reviews</h2>
          {count > 0 ? (
            <div className="mt-2 flex items-center gap-3">
              <StarRow value={avg} />
              <span className="text-sm text-ink/70">
                <span className="font-semibold text-wine">{avg.toFixed(1)}</span> ·{" "}
                {count} {count === 1 ? "review" : "reviews"}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink/55">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* Write a review */}
      <div className="mt-8">
        {!user ? (
          <div className="rounded-3xl border border-flamingo-tint bg-cream/60 p-6 text-center">
            <p className="text-sm text-ink/70">
              Purchased this? <span className="font-medium text-wine">Sign in</span> to
              share your review.
            </p>
            <Button asChild className="mt-4">
              <Link href="/account">Sign in</Link>
            </Button>
          </div>
        ) : alreadyReviewed ? (
          <div className="flex items-center gap-2 rounded-3xl border border-flamingo-tint bg-flamingo-tint/30 p-5 text-sm text-wine">
            <BadgeCheck className="h-5 w-5 text-flamingo-deep" />
            You&apos;ve reviewed this product — thank you!
          </div>
        ) : purchased === null ? (
          <div className="flex items-center gap-2 rounded-3xl border border-flamingo-tint bg-cream/50 p-5 text-sm text-ink/55">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking your orders…
          </div>
        ) : purchased ? (
          <form
            onSubmit={submit}
            className="rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card"
          >
            <h3 className="font-display text-lg font-semibold text-wine">
              Write a review
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-flamingo-deep">
              <BadgeCheck className="h-4 w-4" /> Verified buyer of {productName}
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <span className="mb-1.5 block text-sm font-medium text-wine">
                  Your rating
                </span>
                <StarRow value={rating} interactive onChange={setRating} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-wine">
                    Display name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-wine">
                    Title (optional)
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Loved it!"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-wine">
                  Your review
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className={cn(fieldCls, "resize-y")}
                  placeholder="What did you love about it? How's the quality, fit, fabric?"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Posting…" : "Post review"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-dashed border-flamingo/40 bg-cream/50 p-6 text-center text-sm text-ink/60">
            Only verified buyers can review this product. Once you&apos;ve ordered
            it, your review option appears here.
          </div>
        )}
      </div>

      {/* Reviews list */}
      {count > 0 && (
        <ul className="mt-10 space-y-6">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="border-b border-flamingo-tint/70 pb-6 last:border-0"
            >
              <div className="flex items-center justify-between gap-3">
                <StarRow value={r.rating} size="h-4 w-4" />
                <time className="text-xs text-ink/45">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              {r.title && (
                <p className="mt-2 font-semibold text-wine">{r.title}</p>
              )}
              <p className="mt-1 text-sm leading-relaxed text-ink/75">{r.body}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink/55">
                <span className="font-medium text-ink/70">{r.authorName}</span>
                <span className="inline-flex items-center gap-1 text-flamingo-deep">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified buyer
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
