import { env } from "@/lib/env";

/**
 * Resolves an API image path to an absolute URL. The API returns relative paths
 * like `/uploads/paintings/x.jpg`; absolute URLs are returned unchanged.
 */
export function resolveImageUrl(
  path: string | null | undefined,
): string | null {
  if (!path) {
    return null;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${env.NEXT_PUBLIC_API_BASE_URL}${path}`;
}
