import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Emails the store owner when an order is placed. Called (fire-and-forget)
 * from the checkout after the order is saved to Supabase.
 *
 * Anti-abuse: the request only carries an order id — the email content is
 * built from the order row looked up in the database, so forged payloads
 * can't send fake order emails.
 *
 * Env:
 *   RESEND_API_KEY     — required; from resend.com (free tier)
 *   ORDER_NOTIFY_TO    — where alerts go   (default: info@haladini.in)
 *   ORDER_NOTIFY_FROM  — sender            (default: Resend's shared sender;
 *                        switch to orders@haladini.in after domain verification)
 */

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — checkout treats this as best-effort, so just say so.
    return NextResponse.json({ ok: false, error: "Email not configured." }, { status: 503 });
  }

  let orderId: string;
  try {
    const body = await req.json();
    orderId = String(body.orderId ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (!orderId) {
    return NextResponse.json({ ok: false, error: "Missing orderId." }, { status: 400 });
  }

  // Look the order up server-side — the DB row is the source of truth.
  const { data: order, error } = await createAdminClient()
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error || !order) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }

  const items: {
    name?: string;
    size?: string;
    quantity?: number;
    price?: number;
  }[] = Array.isArray(order.items) ? order.items : [];
  const addr = (order.shipping_address ?? {}) as Record<string, string>;
  const shortId = String(order.id).slice(0, 8).toUpperCase();
  const method =
    order.payment_method === "cod" ? "Cash on Delivery" : "Paid online (Razorpay)";

  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #FFE9F0;">${esc(i.name)}${
            i.size ? ` <span style="color:#888;">(${esc(i.size)})</span>` : ""
          }</td>
          <td style="padding:8px 12px;border-bottom:1px solid #FFE9F0;text-align:center;">×${esc(
            i.quantity ?? 1
          )}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #FFE9F0;text-align:right;">${inr(
            (i.price ?? 0) * (i.quantity ?? 1)
          )}</td>
        </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1F1A1C;">
    <div style="background:#7A2E45;color:#fff;padding:18px 24px;border-radius:12px 12px 0 0;">
      <h2 style="margin:0;font-size:18px;">🌸 New order on Haladini</h2>
    </div>
    <div style="border:1px solid #FFE9F0;border-top:0;padding:20px 24px;border-radius:0 0 12px 12px;">
      <p style="margin:0 0 4px;"><strong>Order #${esc(shortId)}</strong> · ${method}</p>
      <p style="margin:0 0 16px;color:#666;font-size:13px;">${new Date(
        order.created_at
      ).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
      <p style="text-align:right;font-size:16px;margin:14px 0 18px;"><strong>Total: ${inr(
        order.total
      )}</strong></p>
      <div style="background:#FFF7FA;border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.5;">
        <strong>Ship to</strong><br/>
        ${esc(addr.fullName)}<br/>
        ${esc(addr.line1)}${addr.line2 ? `, ${esc(addr.line2)}` : ""}<br/>
        ${esc(addr.city)}, ${esc(addr.state)} ${esc(addr.pincode)}<br/>
        📞 ${esc(addr.phone)} · ✉️ ${esc(addr.email)}
      </div>
      <p style="margin:18px 0 0;">
        <a href="https://haladini.in/admin/orders" style="background:#F76C9C;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-size:14px;">Open admin orders</a>
      </p>
    </div>
  </div>`;

  const to = process.env.ORDER_NOTIFY_TO || "info@haladini.in";
  const from = process.env.ORDER_NOTIFY_FROM || "Haladini Orders <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `🛍️ New order #${shortId} — ${inr(order.total)} (${method})`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    console.error("Order notification email failed:", res.status, err);
    return NextResponse.json({ ok: false, error: "Email send failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
