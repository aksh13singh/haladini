import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.next();
  return await updateSession(request);
}

export const config = {
  /*
   * Only the routes that read the session on the server.
   *
   * Running this everywhere meant each visit to a public page waited on a
   * Supabase auth round-trip before rendering, and the refreshed auth cookie
   * made the response uncacheable — so the storefront could never be served
   * from cache. Signed-in state on public pages is handled in the browser,
   * where supabase-js refreshes tokens by itself.
   */
  matcher: ["/account/:path*", "/admin/:path*", "/auth/:path*"],
};
