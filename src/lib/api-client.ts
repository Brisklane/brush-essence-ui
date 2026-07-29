"use client";

import { env } from "@/lib/env";

import { tokenStore } from "./auth/token-store";

async function tryRefresh(): Promise<string | null> {
  const response = await fetch("/api/auth/refresh", { method: "POST" });
  if (!response.ok) {
    tokenStore.clear();
    return null;
  }

  const data = (await response.json()) as { accessToken: string };
  tokenStore.set(data.accessToken);
  return data.accessToken;
}

/**
 * Calls a protected API endpoint with the in-memory access token attached as a
 * Bearer header. On a 401 it transparently refreshes once and retries.
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = path.startsWith("http")
    ? path
    : `${env.NEXT_PUBLIC_API_BASE_URL}${path}`;

  const send = (token: string | null) =>
    fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  try {
    let response = await send(tokenStore.get());

    if (response.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        response = await send(refreshed);
      }
    }

    return response;
  } catch {
    // fetch() rejects (throws) only on network-level failures — the server is
    // unreachable, connection refused, or the request was blocked. It never
    // throws for HTTP error statuses (those come back as a Response). Turn the
    // browser's opaque "Failed to fetch" into an actionable message.
    throw new Error(
      "Unable to reach the server. Please make sure the API is running.",
    );
  }
}
