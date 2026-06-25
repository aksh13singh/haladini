import { createAdminClient } from "@/lib/supabase/admin";
import { formatINR } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const dynamic = "force-dynamic";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function AdminOrdersPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as any[];

  return (
    <div>
      <h1 className="display-heading text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-ink/55">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-flamingo/40 bg-white px-6 py-16 text-center text-ink/60">
          No orders yet. They&apos;ll appear here as customers check out.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => {
            const addr = o.shipping_address ?? {};
            const items = (o.items ?? []) as any[];
            return (
              <div
                key={o.id}
                className="rounded-3xl border border-flamingo-tint bg-white p-5 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-wine">
                      #{String(o.id).slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-ink/50">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {o.payment_method === "cod" ? "COD" : "Prepaid"}
                    </p>
                  </div>
                  <OrderStatusSelect id={o.id} status={o.status} />
                </div>

                <div className="mt-3 border-t border-flamingo-tint/70 pt-3 text-sm">
                  <p className="text-ink/70">
                    <span className="font-medium text-wine">
                      {addr.fullName ?? "—"}
                    </span>
                    {addr.phone ? ` · ${addr.phone}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {[addr.line1, addr.city, addr.state, addr.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="mt-2 text-xs text-ink/55">
                    {items.length} item{items.length === 1 ? "" : "s"}:{" "}
                    {items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-flamingo-tint/70 pt-3">
                  <span className="text-sm text-ink/55">Total</span>
                  <span className="font-semibold text-wine">
                    {formatINR(o.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
