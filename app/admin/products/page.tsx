import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatINR } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminProductsPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as any[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display-heading text-3xl">Products</h1>
          <p className="mt-1 text-sm text-ink/55">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-flamingo/40 bg-white px-6 py-16 text-center">
          <p className="text-ink/60">No products yet.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/products/new">Add your first product</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-flamingo-tint overflow-hidden rounded-3xl border border-flamingo-tint bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                {p.images?.[0] && (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{p.name}</p>
                <p className="mt-0.5 text-xs capitalize text-ink/50">
                  {p.category}
                  {p.subcategory ? ` · ${p.subcategory.replace(/-/g, " ")}` : ""}
                  {" · "}
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </p>
              </div>
              <span className="hidden font-semibold text-wine sm:block">
                {formatINR(p.price)}
              </span>
              <div className="flex items-center gap-1">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  aria-label={`Edit ${p.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteProductButton id={p.id} name={p.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
