"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  subcategory: string | null;
  images: string[];
  sizes: string[];
  fabric: string;
  care: string | null;
  stock: number;
  isNew: boolean;
}

type ActionResult = { ok: true } | { error: string };

async function assertAdmin(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "You must be signed in.";
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) return "You don't have permission to do that.";
  return null;
}

function toRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    compare_at_price: input.compareAtPrice,
    category: input.category,
    subcategory: input.subcategory,
    images: input.images,
    sizes: input.sizes,
    fabric: input.fabric,
    care: input.care,
    stock: input.stock,
    is_new: input.isNew,
  };
}

function refresh() {
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function saveProduct(
  id: string | null,
  input: ProductInput
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const admin = createAdminClient();
  if (id) {
    const { error } = await admin.from("products").update(toRow(input)).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await admin.from("products").insert(toRow(input));
    if (error) return { error: error.message };
  }
  refresh();
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { ok: true };
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  const denied = await assertAdmin();
  if (denied) return { error: denied };

  const admin = createAdminClient();
  const { error } = await admin.from("orders").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  return { ok: true };
}
