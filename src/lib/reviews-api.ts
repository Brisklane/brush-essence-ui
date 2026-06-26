"use client";

import { apiFetch } from "@/lib/api-client";
import type { PagedResult, Review, ReviewSummary } from "@/types";

/**
 * Review endpoints. Listing and the summary are public; submitting and reading
 * your own review require auth (`apiFetch` attaches the bearer token when set).
 */

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    throw new Error(
      problem?.detail ?? problem?.title ?? `Request failed (${response.status}).`,
    );
  }
  return response.json() as Promise<T>;
}

const jsonHeaders = { "Content-Type": "application/json" };

export interface ReviewPayload {
  rating: number;
  title?: string | null;
  comment?: string | null;
}

export async function listReviews(
  paintingId: string,
  page = 1,
): Promise<PagedResult<Review>> {
  return parse(
    await apiFetch(`/api/paintings/${paintingId}/reviews?page=${page}`),
  );
}

export async function getReviewSummary(
  paintingId: string,
): Promise<ReviewSummary> {
  return parse(await apiFetch(`/api/paintings/${paintingId}/reviews/summary`));
}

/** The current user's own review for a painting, or null when none/unauthenticated. */
export async function getMyReview(paintingId: string): Promise<Review | null> {
  const response = await apiFetch(`/api/paintings/${paintingId}/reviews/mine`);
  if (response.status === 204 || response.status === 401) {
    return null;
  }
  return parse(response);
}

export async function createReview(
  paintingId: string,
  payload: ReviewPayload,
): Promise<Review> {
  return parse(
    await apiFetch(`/api/paintings/${paintingId}/reviews`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}
