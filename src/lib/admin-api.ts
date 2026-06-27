"use client";

import { apiFetch } from "@/lib/api-client";
import type {
  AdminCustomRequestListItem,
  AdminOrderListItem,
  AdminReviewListItem,
  AdminUser,
  CustomRequest,
  CustomRequestStatus,
  DashboardSummary,
  Order,
  OrderStatus,
  PagedResult,
  Promotion,
  Report,
  ReviewStatus,
  SavePromotionPayload,
} from "@/types";

/** Admin dashboard API. All endpoints require the Admin role (enforced server-side). */

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

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

// ----- Dashboard & reports -----

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return parse(await apiFetch("/api/admin/dashboard/summary"));
}

export async function getReport(days = 30): Promise<Report> {
  return parse(await apiFetch(`/api/admin/reports?days=${days}`));
}

// ----- Users -----

export interface AdminUserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

export async function listUsers(
  params: AdminUserListParams = {},
): Promise<PagedResult<AdminUser>> {
  const query = buildQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    role: params.role,
    isActive: params.isActive === undefined ? undefined : String(params.isActive),
  });
  return parse(await apiFetch(`/api/admin/users${query}`));
}

export async function updateUser(
  id: string,
  payload: { isActive: boolean; roles: string[] },
): Promise<AdminUser> {
  return parse(
    await apiFetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

// ----- Orders -----

export interface AdminOrderListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus;
}

export async function listAdminOrders(
  params: AdminOrderListParams = {},
): Promise<PagedResult<AdminOrderListItem>> {
  return parse(await apiFetch(`/api/admin/orders${buildQuery({ ...params })}`));
}

export async function getAdminOrder(id: string): Promise<Order> {
  return parse(await apiFetch(`/api/admin/orders/${id}`));
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
): Promise<Order> {
  return parse(
    await apiFetch(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify({ status, note: note ?? null }),
    }),
  );
}

// ----- Custom requests -----

export interface AdminRequestListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: CustomRequestStatus;
}

export async function listAdminRequests(
  params: AdminRequestListParams = {},
): Promise<PagedResult<AdminCustomRequestListItem>> {
  return parse(
    await apiFetch(`/api/admin/custom-requests${buildQuery({ ...params })}`),
  );
}

export async function getAdminRequest(id: string): Promise<CustomRequest> {
  return parse(await apiFetch(`/api/admin/custom-requests/${id}`));
}

export async function updateRequestStatus(
  id: string,
  status: CustomRequestStatus,
  note?: string,
): Promise<CustomRequest> {
  return parse(
    await apiFetch(`/api/admin/custom-requests/${id}/status`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify({ status, note: note ?? null }),
    }),
  );
}

/** Admin: send the customer a price quote (moves the request to Quoted). */
export async function setRequestQuote(
  id: string,
  amount: number,
  note?: string,
): Promise<CustomRequest> {
  return parse(
    await apiFetch(`/api/admin/custom-requests/${id}/quote`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify({ amount, note: note ?? null }),
    }),
  );
}

// ----- Reviews -----

export interface AdminReviewListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ReviewStatus;
}

export async function listAdminReviews(
  params: AdminReviewListParams = {},
): Promise<PagedResult<AdminReviewListItem>> {
  return parse(await apiFetch(`/api/admin/reviews${buildQuery({ ...params })}`));
}

export async function updateReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<AdminReviewListItem> {
  return parse(
    await apiFetch(`/api/admin/reviews/${id}/status`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify({ status }),
    }),
  );
}

export async function updateReview(
  id: string,
  payload: { rating: number; title?: string | null; comment?: string | null },
): Promise<AdminReviewListItem> {
  return parse(
    await apiFetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteReview(id: string): Promise<void> {
  const response = await apiFetch(`/api/admin/reviews/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }
}

// ----- Promotions / discounts -----

export async function listPromotions(): Promise<Promotion[]> {
  return parse(await apiFetch("/api/admin/promotions"));
}

export async function createPromotion(
  payload: SavePromotionPayload,
): Promise<Promotion> {
  return parse(
    await apiFetch("/api/admin/promotions", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function updatePromotion(
  id: string,
  payload: SavePromotionPayload,
): Promise<Promotion> {
  return parse(
    await apiFetch(`/api/admin/promotions/${id}`, {
      method: "PUT",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function deletePromotion(id: string): Promise<void> {
  const response = await apiFetch(`/api/admin/promotions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }
}
