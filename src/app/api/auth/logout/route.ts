import { NextRequest, NextResponse } from "next/server";

import { callApi, clearRefreshCookie } from "@/lib/auth/bff";
import { REFRESH_COOKIE } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      // Best-effort revocation server-side; the cookie is cleared regardless.
      await callApi("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignore: logging out locally must always succeed.
    }
  }

  const response = NextResponse.json({ success: true });
  clearRefreshCookie(response);
  return response;
}
