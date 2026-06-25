"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { categories } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PRICES = [
  { value: "all", label: "All prices" },
  { value: "under-1000", label: "Under ₹1,000" },
  { value: "1000-2500", label: "₹1,000 – ₹2,500" },
  { value: "over-2500", label: "Over ₹2,500" },
];

const categoryLinks = [
  { name: "All", slug: "all", href: "/shop" },
  ...categories.map((c) => ({ name: c.name, slug: c.slug, href: c.href })),
];

const selectClass =
  "h-10 rounded-full border border-flamingo-tint bg-white px-4 pr-8 text-sm font-medium text-wine transition-colors focus:border-flamingo-deep focus:outline-none";

interface ShopToolbarProps {
  activeCategory?: string;
  sort?: string;
  price?: string;
  q?: string;
  /** Show the top-level category pills (used on /shop; off on category pages). */
  showCategories?: boolean;
}

export function ShopToolbar({
  activeCategory = "all",
  sort = "newest",
  price = "all",
  q = "",
  showCategories = true,
}: ShopToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const buildHref = (next: { sort?: string; price?: string; q?: string }) => {
    const merged = { sort, price, q, ...next };
    const params = new URLSearchParams();
    if (merged.q) params.set("q", merged.q);
    if (merged.price && merged.price !== "all") params.set("price", merged.price);
    if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const go = (next: { sort?: string; price?: string; q?: string }) =>
    router.push(buildHref(next), { scroll: false });

  return (
    <div className="space-y-4">
      {/* Category pills */}
      {showCategories && (
        <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {categoryLinks.map((c) => (
            <Link
              key={c.slug}
              href={c.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                activeCategory === c.slug
                  ? "border-flamingo-deep bg-flamingo-deep text-white"
                  : "border-flamingo-tint bg-white text-wine hover:border-flamingo-deep"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Search + sort + price */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = new FormData(e.currentTarget).get("q");
            go({ q: String(value ?? "").trim() });
          }}
          className="relative w-full sm:max-w-xs"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search products…"
            aria-label="Search products"
            className="h-10 w-full rounded-full border border-flamingo-tint bg-white pl-10 pr-4 text-sm placeholder:text-ink/40 focus:border-flamingo-deep focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by price"
            value={price}
            onChange={(e) => go({ price: e.target.value })}
            className={selectClass}
          >
            {PRICES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => go({ sort: e.target.value })}
            className={selectClass}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
