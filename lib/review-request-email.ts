import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site-config";

/**
 * Base URL for links inside emails. Never falls back to a localhost value —
 * a dev/preview URL in a customer's inbox is a dead link.
 */
const EMAIL_SITE_URL = siteConfig.url.startsWith("https://")
  ? siteConfig.url
  : "https://haladini.in";

/**
 * SERVER ONLY. Asks a customer to review what they bought, once their order is
 * marked delivered.
 *
 * Only genuine buyers get this, and the review form itself is gated to verified
 * purchasers in the database — so every review that results is real.
 */
export async function sendReviewRequestEmail(
  orderId: string
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !orderId) return "skipped";

  const { data: order, error } = await createAdminClient()
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error || !order) return "skipped";

  const addr = (order.shipping_address ?? {}) as Record<string, string>;
  const to = String(addr.email ?? "").trim();
  if (!to) return "skipped";

  const esc = (v: unknown) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const firstName = esc(String(addr.fullName ?? "").split(" ")[0] || "there");
  const items: { name?: string; slug?: string; image?: string }[] = Array.isArray(
    order.items
  )
    ? order.items
    : [];

  // One row per distinct product, each linking straight to its reviews section.
  const seen = new Set<string>();
  const rows = items
    .filter((i) => i.slug && !seen.has(i.slug) && seen.add(i.slug))
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 0;width:64px;">
            ${
              i.image
                ? `<img src="${esc(i.image)}" width="56" height="70" alt="" style="border-radius:8px;object-fit:cover;display:block;" />`
                : ""
            }
          </td>
          <td style="padding:10px 12px;font-size:14px;color:#1F1A1C;">
            ${esc(i.name)}
          </td>
          <td style="padding:10px 0;text-align:right;">
            <a href="${EMAIL_SITE_URL}/product/${esc(i.slug)}#reviews"
               style="background:#F76C9C;color:#fff;text-decoration:none;padding:8px 16px;border-radius:999px;font-size:13px;white-space:nowrap;">
              Write a review
            </a>
          </td>
        </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1F1A1C;">
    <div style="background:#7A2E45;color:#fff;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
      <h2 style="margin:0;font-size:20px;">How's your Haladini piece, ${firstName}? 🌸</h2>
    </div>
    <div style="border:1px solid #FFE9F0;border-top:0;padding:22px 24px;border-radius:0 0 12px 12px;">
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#444;">
        We hope you're loving your order. Now that you've had a chance to see
        the fabric and prints up close, we'd be so grateful if you shared a few
        words — your review helps other shoppers, and it means a lot to the
        artisans who made it.
      </p>

      <table style="width:100%;border-collapse:collapse;">${rows}</table>

      <div style="margin:22px 0 0;background:#FFF7FA;border-radius:10px;padding:14px 16px;text-align:center;">
        <p style="margin:0;font-size:14px;color:#1F1A1C;">
          As a thank you, here's <strong style="color:#F76C9C;">${siteConfig.coupon.code}</strong>
          for <strong>₹100 off</strong> your next order.
        </p>
      </div>

      <p style="margin:20px 0 0;font-size:13px;color:#666;line-height:1.6;">
        Something not quite right? Just reply to this email — we'll make it good.
      </p>
      <p style="margin:14px 0 0;font-size:12px;color:#999;text-align:center;">
        Haladini · Handcrafted in Jaipur, with love ·
        <a href="${EMAIL_SITE_URL}" style="color:#F76C9C;text-decoration:none;">haladini.in</a>
      </p>
    </div>
  </div>`;

  const from =
    process.env.ORDER_NOTIFY_FROM || "Haladini <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: "info@haladini.in",
      subject: `How's your Haladini order, ${firstName}? 🌸`,
      html,
    }),
  });

  if (!res.ok) {
    console.error(
      "Review request email failed:",
      res.status,
      await res.text().catch(() => "")
    );
    return "failed";
  }
  return "sent";
}
