"use client";

import { apiFetch } from "@/lib/api-client";
import type { ShippingAddressValues } from "@/lib/validations/order";
import type { Order, OrderSummary, OrderTracking } from "@/types";

/**
 * Order endpoints. All require authentication; `apiFetch` attaches the bearer
 * token (and silently refreshes it on a 401).
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

export interface CreateOrderPayload {
  shippingAddress: ShippingAddressValues;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return parse(
    await apiFetch("/api/orders", {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  );
}

export async function listOrders(): Promise<OrderSummary[]> {
  return parse(await apiFetch("/api/orders"));
}

export async function getOrder(id: string): Promise<Order> {
  return parse(await apiFetch(`/api/orders/${id}`));
}

export async function getOrderTracking(id: string): Promise<OrderTracking> {
  return parse(await apiFetch(`/api/orders/${id}/tracking`));
}
