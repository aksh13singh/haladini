import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="display-heading text-3xl">Add product</h1>
      <p className="mt-1 text-sm text-ink/55">
        Create a new product — it goes live on the store immediately.
      </p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
