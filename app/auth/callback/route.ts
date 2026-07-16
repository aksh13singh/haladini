import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/welcome-email";

export const dynamic = "force-dynamic";

/**
 * OAuth / email-link landing point. Supabase redirects here with a `?code=`
 * (PKCE) after Google sign-in or email confirmation; we exchange it for a
 * session cookie server-side, then continue to `next`. If there's no code
 * (e.g. legacy hash-fragment links), we still forward — the browser client
 * on the destination page picks the session out of the URL itself.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = searchParams.get("next") ?? "/account";
  // Only allow same-site paths — never redirect off-domain.
  const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//")
    ? nextPath
    : "/account";

  if (code) {
    const { data } = await createClient().auth.exchangeCodeForSession(code);
    // Welcome email for first-time sign-ups (Google or email confirmation);
    // idempotent, so repeat visits never re-send.
    if (data?.user?.id) {
      try {
        await sendWelcomeEmail(data.user.id);
      } catch (err) {
        console.error("Welcome email (callback) failed:", err);
      }
    }
  }
  return NextResponse.redirect(`${origin}${safeNext}`);
}
