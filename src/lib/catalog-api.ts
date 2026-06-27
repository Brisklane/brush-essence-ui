"use client";

import { apiFetch } from "@/lib/api-client";
import type { Category, Medium, PagedResult, Painting } from "@/types";

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

async function expectOk(response: Response): Promise<void> {
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
}

const jsonHeaders = { "Content-Type": "application/json" };

// ----- Paintings -----

export interface PaintingListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string | null;
  isPublished?: boolean;
}

export interface PaintingPayload {
  title: string;
  description?: string | null;
  price: number;
  widthCm: number;
  heightCm: number;
  mediumId?: string | null;
  imageUrl?: string | null;
  stockQuantity: number;
  isPublished: boolean;
  categoryId?: string | null;
}

export async function listPaintings(
  params: PaintingListParams = {},
): Promise<PagedResult<Painting>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.isPublished !== undefined)
    query.set("isPublished", String(params.isPublished));

  return parse(await apiFetch(`/api/paintings?${query.toString()}`));
}

export async function getPainting(id: string): Promise<Painting> {
  return parse(await apiFetch(`/api/paintings/${id}`));
}

export async function createPainting(
  payload: PaintingPayload,
): Promise<Painting> {
  return parse(
    await apiFetch("/api/paintings", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function updatePainting(
  id: string,
  payload: PaintingPayload,
): Promise<Painting> {
  return parse(
    await apiFetch(`/api/paintings/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function deletePainting(id: string): Promise<void> {
  await expectOk(await apiFetch(`/api/paintings/${id}`, { method: "DELETE" }));
}

export async function uploadPaintingImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  // Note: no Content-Type header — the browser sets the multipart boundary.
  const data = await parse<{ url: string }>(
    await apiFetch("/api/uploads/paintings", {
      method: "POST",
      body: formData,
    }),
  );
  return data.url;
}

// ----- Categories -----

export interface CategoryPayload {
  name: string;
  description?: string | null;
}

export async function listCategories(): Promise<Category[]> {
  return parse(await apiFetch("/api/categories"));
}

export async function createCategory(
  payload: CategoryPayload,
): Promise<Category> {
  return parse(
    await apiFetch("/api/categories", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteCategory(id: string): Promise<void> {
  await expectOk(await apiFetch(`/api/categories/${id}`, { method: "DELETE" }));
}

// ----- Mediums -----

export interface MediumPayload {
  name: string;
}

export async function listMediums(): Promise<Medium[]> {
  return parse(await apiFetch("/api/mediums"));
}

export async function createMedium(payload: MediumPayload): Promise<Medium> {
  return parse(
    await apiFetch("/api/mediums", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteMedium(id: string): Promise<void> {
  await expectOk(await apiFetch(`/api/mediums/${id}`, { method: "DELETE" }));
}
