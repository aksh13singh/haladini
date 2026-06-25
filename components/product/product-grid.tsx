import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
