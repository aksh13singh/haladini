import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

export function EmptyState({
  title = "No products found",
  message = "Try adjusting your filters or search.",
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-flamingo/40 bg-cream/60 px-6 py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-flamingo-tint text-flamingo-deep">
        <PackageSearch className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-wine">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink/60">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
