import Link from "next/link";

import type { Category } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Within-category navigation: "All <Category>" + each subcategory.
 * `active` is the current subcategory slug (undefined on the category page).
 */
export function SubcategoryChips({
  category,
  active,
}: {
  category: Category;
  active?: string;
}) {
  if (!category.subcategories?.length) return null;

  const chips: { name: string; slug?: string; href: string }[] = [
    { name: `All ${category.name}`, slug: undefined, href: category.href },
    ...category.subcategories.map((s) => ({
      name: s.name,
      slug: s.slug,
      href: `${category.href}/${s.slug}`,
    })),
  ];

  return (
    <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {chips.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            active === c.slug
              ? "border-flamingo-deep bg-flamingo-deep text-white"
              : "border-flamingo-tint bg-white text-wine hover:border-flamingo-deep"
          )}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
