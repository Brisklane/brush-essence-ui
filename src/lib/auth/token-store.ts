/**
 * In-memory holder for the short-lived JWT access token. Kept out of
 * localStorage/cookies so it is never readable by injected scripts; it is
 * restored on load via a silent refresh (the httpOnly refresh cookie).
 */
let accessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (value: string | null): void => {
    accessToken = value;
  },
  clear: (): void => {
    accessToken = null;
  },
};
