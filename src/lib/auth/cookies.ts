/** Name of the httpOnly cookie holding the refresh token. */
export const REFRESH_COOKIE = "refresh_token";

/**
 * Cookie lifetime, matched to the API's refresh-token lifetime
 * (Jwt:RefreshTokenDays = 7). Keep in sync if the backend value changes.
 */
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Shared cookie attributes. Path is "/" (not just /api/auth) so the cookie is
 * also sent on navigations — `proxy.ts` checks its presence to gate routes.
 */
export const refreshCookieAttributes = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
