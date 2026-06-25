import { NextRequest, NextResponse } from "next/server";

import { callApi, clearRefreshCookie, forwardAuthResult } from "@/lib/auth/bff";
import { REFRESH_COOKIE } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ title: "Not authenticated." }, { status: 401 });
  }

  const apiResponse = await callApi("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!apiResponse.ok) {
    // Refresh token is invalid/expired/rotated — clear it so the client logs out.
    const response = NextResponse.json(
      { title: "Session expired." },
      { status: 401 },
    );
    clearRefreshCookie(response);
    return response;
  }

  return forwardAuthResult(apiResponse);
}
