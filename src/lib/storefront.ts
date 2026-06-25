import { env } from "@/lib/env";
import type { Category, PagedResult, Painting } from "@/types";

/**
 * Public storefront catalogue client. Unlike `catalog-api.ts` (admin, attaches
 * the bearer token), these helpers hit the public GET endpoints with a plain
 * fetch, so they run on the server (for SEO) and the client alike. The API
 * automatically restricts anonymous callers to published paintings.
 */

export const PAINTING_SORTS = [
  "newest",
  "oldest",
  "priceAsc",
  "priceDesc",
  "titleAsc",
  "titleDesc",
] as const;

export type PaintingSort = (typeof PAINTING_SORTS)[number];

export const SORT_LABELS: Record<PaintingSort, string> = {
  newest: "Newest arrivals",
  oldest: "Oldest first",
  priceAsc: "Price: low to high",
  priceDesc: "Price: high to low",
  titleAsc: "Title: A to Z",
  titleDesc: "Title: Z to A",
};

export function isPaintingSort(value: string | null): value is PaintingSort {
  return value != null && (PAINTING_SORTS as readonly string[]).includes(value);
}

export interface CatalogParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: PaintingSort;
}

function buildCatalogQuery(params: CatalogParams): string {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.minPrice != null) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) query.set("maxPrice", String(params.maxPrice));
  if (params.sort) query.set("sort", params.sort);
  for (const id of params.categoryIds ?? []) query.append("categoryIds", id);
  return query.toString();
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    // Always reflect the latest catalogue (admin edits, stock changes).
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Catalogue request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function fetchCatalog(
  params: CatalogParams = {},
): Promise<PagedResult<Painting>> {
  const qs = buildCatalogQuery(params);
  return getJson<PagedResult<Painting>>(
    `/api/paintings${qs ? `?${qs}` : ""}`,
  );
}

/** Returns a single painting, or `null` when it is missing/unpublished (404). */
export async function fetchPainting(id: string): Promise<Painting | null> {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}/api/paintings/${id}`,
    { cache: "no-store", headers: { Accept: "application/json" } },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Painting request failed (${response.status}).`);
  }
  return response.json() as Promise<Painting>;
}

export function fetchCategories(): Promise<Category[]> {
  return getJson<Category[]>("/api/categories");
}
