import { createAdminClient } from "@/lib/supabase/admin";

/**
 * SERVER ONLY. Sends the branded "registration successful" welcome email to a
 * newly signed-up user, exactly once.
 *
 * Guards:
 *  - the user is looked up server-side by id (so the endpoint can't be used to
 *    spam arbitrary addresses),
 *  - a `welcomed` flag in user_metadata makes it idempotent across the two
 *    trigger points (email/password signup form + OAuth callback),
 *  - users created more than a day ago are skipped.
 */
export async function sendWelcomeEmail(
  userId: string
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !userId) return "skipped";

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  const user = data?.user;
  if (error || !user?.email) return "skipped";
  if (user.user_metadata?.welcomed) return "skipped";
  if (Date.now() - +new Date(user.created_at) > 24 * 60 * 60 * 1000)
    return "skipped";

  const esc = (v: unknown) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const firstName = esc(
    String(user.user_metadata?.full_name ?? "").split(" ")[0] || "there"
  );

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1F1A1C;">
    <div style="background:#7A2E45;color:#fff;padding:26px 24px;border-radius:12px 12px 0 0;text-align:center;">
      <h2 style="margin:0;font-size:22px;">Welcome to Haladini, ${firstName}! 🌸</h2>
      <p style="margin:8px 0 0;font-size:13px;color:#FFD9E4;">Your account has been created successfully</p>
    </div>
    <div style="border:1px solid #FFE9F0;border-top:0;padding:24px;border-radius:0 0 12px 12px;">
      <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#444;">
        Thank you for joining Haladini — handcrafted block-print bedsheets,
        dohars, cushions, suits &amp; shirts, made in Jaipur with love.
      </p>
      <ul style="margin:0 0 18px;padding-left:18px;font-size:14px;line-height:1.8;color:#444;">
        <li>Shop the collections and save favourites to your wishlist</li>
        <li>Track your orders anytime in <strong>My Account</strong></li>
        <li>Use code <strong style="color:#F76C9C;">HELLO100</strong> for ₹100 off your first order</li>
      </ul>
      <p style="text-align:center;margin:22px 0;">
        <a href="https://haladini.in/shop" style="background:#F76C9C;color:#fff;text-decoration:none;padding:12px 26px;border-radius:999px;font-size:14px;font-weight:bold;">Start shopping</a>
      </p>
      <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
        Questions? Just reply to this email or write to
        <a href="mailto:info@haladini.in" style="color:#F76C9C;">info@haladini.in</a>.
      </p>
      <p style="margin:16px 0 0;font-size:12px;color:#999;text-align:center;">
        Haladini · Handcrafted in Jaipur, with love · <a href="https://haladini.in" style="color:#F76C9C;text-decoration:none;">haladini.in</a>
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
      to: [user.email],
      reply_to: "info@haladini.in",
      subject: "Welcome to Haladini — your account is ready 🌸",
      html,
    }),
  });

  if (!res.ok) {
    console.error("Welcome email failed:", res.status, await res.text().catch(() => ""));
    return "failed";
  }

  // Mark as welcomed so neither trigger point can send it again.
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: { ...user.user_metadata, welcomed: true },
  });
  return "sent";
}
