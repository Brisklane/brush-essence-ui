"use client";

import { apiFetch } from "@/lib/api-client";
import type { ActivePromotion } from "@/types";

/** Public storefront promotions. Anonymous — no auth required. */
export async function getActivePromotions(): Promise<ActivePromotion[]> {
  const response = await apiFetch("/api/promotions/active");
  if (!response.ok) {
    return [];
  }
  return response.json() as Promise<ActivePromotion[]>;
}
