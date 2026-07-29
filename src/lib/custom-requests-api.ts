"use client";

import { apiFetch } from "@/lib/api-client";
import type { CustomRequest, CustomRequestSummary } from "@/types";

/**
 * Custom painting request endpoints. All require authentication; `apiFetch`
 * attaches the bearer token (and refreshes it on a 401).
 */

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    throw new Error(
      problem?.detail ??
        problem?.title ??
        `Request failed (${response.status}).`,
    );
  }
  return response.json() as Promise<T>;
}

const jsonHeaders = { "Content-Type": "application/json" };

export interface CustomRequestImagePayload {
  url: string;
  fileName?: string | null;
}

export interface CustomRequestPayload {
  title: string;
  description: string;
  preferredSize?: string | null;
  images: CustomRequestImagePayload[];
}

export async function createCustomRequest(
  payload: CustomRequestPayload,
): Promise<CustomRequest> {
  return parse(
    await apiFetch("/api/custom-requests", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateCustomRequest(
  id: string,
  payload: CustomRequestPayload,
): Promise<CustomRequest> {
  return parse(
    await apiFetch(`/api/custom-requests/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function listCustomRequests(): Promise<CustomRequestSummary[]> {
  return parse(await apiFetch("/api/custom-requests"));
}

export async function getCustomRequest(id: string): Promise<CustomRequest> {
  return parse(await apiFetch(`/api/custom-requests/${id}`));
}

/** Customer accepts the artist's quote (moves the request to In progress). */
export async function approveQuote(id: string): Promise<CustomRequest> {
  return parse(
    await apiFetch(`/api/custom-requests/${id}/approve-quote`, {
      method: "POST",
    }),
  );
}

/** Customer declines the artist's quote. */
export async function declineQuote(id: string): Promise<CustomRequest> {
  return parse(
    await apiFetch(`/api/custom-requests/${id}/decline-quote`, {
      method: "POST",
    }),
  );
}

/** Uploads a reference image and returns its stored public URL. */
export async function uploadReferenceImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  // No Content-Type header — the browser sets the multipart boundary.
  const data = await parse<{ url: string }>(
    await apiFetch("/api/uploads/custom-requests", {
      method: "POST",
      body: formData,
    }),
  );
  return data.url;
}
