import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="container section text-center">
        <h1 className="display-heading text-3xl">Admins only</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/60">
          This area is restricted to store administrators. If that&apos;s you,
          ask for the <code className="text-flamingo-deep">is_admin</code> flag
          to be enabled on your account.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      <div className="container py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[210px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-ink/40">
              Admin
            </p>
            <nav className="mt-3 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-wine transition-colors hover:bg-flamingo-tint"
                >
                  <Icon className="h-4 w-4 text-flamingo-deep" />
                  {label}
                </Link>
              ))}
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/55 transition-colors hover:bg-flamingo-tint"
              >
                <Store className="h-4 w-4" />
                View store
              </Link>
            </nav>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
