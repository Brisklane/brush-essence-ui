"use client";

import { apiFetch } from "@/lib/api-client";

/** Email-verification endpoints. `apiFetch` attaches the bearer token when present. */

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    throw new Error(
      problem?.detail ?? problem?.title ?? `Request failed (${response.status}).`,
    );
  }
}

/** Confirms an email address from the token in a verification link (anonymous). */
export async function verifyEmail(token: string): Promise<void> {
  await ensureOk(
    await apiFetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }),
  );
}

/** Re-sends the verification email to the signed-in user. */
export async function resendVerification(): Promise<void> {
  await ensureOk(
    await apiFetch("/api/auth/resend-verification", { method: "POST" }),
  );
}
