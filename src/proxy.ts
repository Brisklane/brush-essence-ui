import { NextRequest, NextResponse } from "next/server";

import { REFRESH_COOKIE } from "@/lib/auth/cookies";

/**
 * Route protection (Next.js 16 renamed `middleware` → `proxy`). This is a coarse
 * gate: it only checks for the presence of the refresh-token cookie and redirects
 * unauthenticated users to /login. Fine-grained authorization (roles, token
 * validity) is enforced by the API and the page components themselves.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_COOKIE);

  if (!hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// The storefront (home, gallery, product details) is public; only the user's
// account area and the admin dashboard require a session.
export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
