import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { fetchCatalog } from "@/lib/storefront";

/**
 * Dynamic sitemap: static storefront routes plus a URL for every published
 * painting. Private/authenticated areas are intentionally excluded (see robots).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/gallery`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const page = await fetchCatalog({ pageSize: 100 });
    const paintingRoutes: MetadataRoute.Sitemap = page.items.map((painting) => ({
      url: `${base}/gallery/${painting.id}`,
      lastModified: painting.createdAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...paintingRoutes];
  } catch {
    // If the catalogue API is unavailable, still serve the static routes.
    return staticRoutes;
  }
}
