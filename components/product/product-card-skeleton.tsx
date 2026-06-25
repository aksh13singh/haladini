export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[4/5] animate-pulse rounded-2xl bg-flamingo-tint/60" />
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-flamingo-tint/60" />
      <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-flamingo-tint/60" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
