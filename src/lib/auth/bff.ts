import "server-only";

import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env.server";

import {
  REFRESH_COOKIE,
  REFRESH_COOKIE_MAX_AGE,
  refreshCookieAttributes,
} from "./cookies";

/** Shape of the API's AuthResult (only the fields the BFF needs). */
interface AuthResult {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  user: unknown;
}

/** Calls the .NET API from the server (never exposed to the browser). */
export function callApi(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${serverEnv.API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Forwards an authentication response: stores the refresh token in an httpOnly
 * cookie and returns only the access token + user profile to the browser.
 */
export async function forwardAuthResult(
  apiResponse: Response,
): Promise<NextResponse> {
  const payload = await readJson(apiResponse);

  if (!apiResponse.ok) {
    return NextResponse.json(payload ?? { title: "Request failed." }, {
      status: apiResponse.status,
    });
  }

  const result = payload as AuthResult;
  const response = NextResponse.json({
    accessToken: result.accessToken,
    accessTokenExpiresAt: result.accessTokenExpiresAt,
    user: result.user,
  });

  response.cookies.set({
    name: REFRESH_COOKIE,
    value: result.refreshToken,
    maxAge: REFRESH_COOKIE_MAX_AGE,
    ...refreshCookieAttributes,
  });

  return response;
}

/** Clears the refresh-token cookie on the given response. */
export function clearRefreshCookie(response: NextResponse): void {
  response.cookies.set({
    name: REFRESH_COOKIE,
    value: "",
    maxAge: 0,
    ...refreshCookieAttributes,
  });
}

/** Passes an API response through unchanged (for endpoints with no cookie work). */
export async function proxyResponse(
  apiResponse: Response,
): Promise<NextResponse> {
  if (apiResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const payload = await readJson(apiResponse);
  return NextResponse.json(payload ?? {}, { status: apiResponse.status });
}
