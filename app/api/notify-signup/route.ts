import { NextResponse } from "next/server";

import { sendWelcomeEmail } from "@/lib/welcome-email";

export const runtime = "nodejs";

/**
 * Sends the welcome email after signup. Fired (fire-and-forget) from the
 * signup form; the OAuth callback calls sendWelcomeEmail directly. Safe to
 * call repeatedly — sendWelcomeEmail is idempotent per user.
 */
export async function POST(req: Request) {
  let userId = "";
  try {
    const body = await req.json();
    userId = String(body.userId ?? "");
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!userId) return NextResponse.json({ ok: false }, { status: 400 });

  const result = await sendWelcomeEmail(userId);
  return NextResponse.json({ ok: result !== "failed", result });
}
