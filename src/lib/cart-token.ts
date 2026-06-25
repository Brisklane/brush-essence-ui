"use client";

/**
 * Opaque guest cart token. The backend keys a guest's cart by this value (sent
 * on the `X-Cart-Token` header), so it must survive reloads — hence localStorage.
 * Signed-in users are keyed by their account instead, but we keep sending the
 * token so the API can merge a guest cart into their account on first access.
 */
const STORAGE_KEY = "be_cart_token";

/** Returns the stored token, generating and persisting one on first use. */
export function getCartToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let token = window.localStorage.getItem(STORAGE_KEY);
  if (!token) {
    token = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, token);
  }
  return token;
}
