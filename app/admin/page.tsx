import Link from "next/link";
import { Package, Plus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const admin = createAdminClient();
  const [products, orders] = await Promise.all([
    admin.from("products").select("*", { count: "exact", head: true }),
    admin.from("orders").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Products", value: products.count ?? 0, href: "/admin/products", icon: Package },
    { label: "Orders", value: orders.count ?? 0, href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="display-heading text-3xl">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-3xl border border-flamingo-tint bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-flamingo-tint text-flamingo-deep">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-wine">
              {value}
            </p>
            <p className="text-sm text-ink/55">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
