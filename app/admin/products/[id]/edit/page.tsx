import { notFound } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  ProductForm,
  type ProductFormInitial,
} from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  const initial: ProductFormInitial = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description ?? "",
    price: data.price,
    compareAtPrice: data.compare_at_price ?? null,
    category: data.category,
    subcategory: data.subcategory ?? null,
    images: data.images ?? [],
    sizes: data.sizes ?? [],
    fabric: data.fabric ?? "",
    care: data.care ?? null,
    stock: data.stock ?? 0,
    isNew: data.is_new ?? false,
  };

  return (
    <div>
      <h1 className="display-heading text-3xl">Edit product</h1>
      <p className="mt-1 text-sm text-ink/55">{data.name}</p>
      <div className="mt-8">
        <ProductForm initial={initial} />
      </div>
    </div>
  );
}
