import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";

export default function ShopLoading() {
  return (
    <div className="container section">
      <header className="text-center">
        <p className="eyebrow">The collection</p>
        <h1 className="display-heading mt-2 text-4xl md:text-5xl">Shop All</h1>
      </header>
      <div className="mx-auto mt-10 h-10 w-full max-w-md animate-pulse rounded-full bg-flamingo-tint/60" />
      <div className="mt-10">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
