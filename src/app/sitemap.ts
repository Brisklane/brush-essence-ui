import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { fetchCatalog } from "@/lib/storefront";
import type { Painting } from "@/types";

// Safety cap so an unexpectedly huge catalogue can't spin forever.
const MAX_PAGES = 50;
const PAGE_SIZE = 100;

/** Fetches every published painting by walking the paged catalogue API. */
async function fetchAllPaintings(): Promise<Painting[]> {
  const all: Painting[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const result = await fetchCatalog({ page, pageSize: PAGE_SIZE });
    all.push(...result.items);
    if (!result.hasNext) break;
  }
  return all;
}

/**
 * Dynamic sitemap: public storefront routes plus a URL for every published
 * painting. Private/authenticated areas are intentionally excluded (see robots).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/gallery`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/support`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const paintings = await fetchAllPaintings();
    const paintingRoutes: MetadataRoute.Sitemap = paintings.map((painting) => ({
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
