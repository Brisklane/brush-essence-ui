"use client";

import { apiFetch } from "@/lib/api-client";
import { getCartToken } from "@/lib/cart-token";
import type { Cart } from "@/types";

import { CART_TOKEN_HEADER } from "./cart-constants";

/**
 * Cart endpoints. Every call carries the guest cart token; `apiFetch` adds the
 * bearer token when the user is signed in. The API resolves the owner from
 * whichever identity is present, so the same helpers serve guests and members.
 */

async function parseCart(response: Response): Promise<Cart> {
  if (!response.ok) {
    const problem = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    throw new Error(
      problem?.detail ?? problem?.title ?? `Request failed (${response.status}).`,
    );
  }
  return response.json() as Promise<Cart>;
}

function cartFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return apiFetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      [CART_TOKEN_HEADER]: getCartToken(),
      ...init.headers,
    },
  });
}

export async function getCart(): Promise<Cart> {
  return parseCart(await cartFetch("/api/cart"));
}

export async function addCartItem(
  paintingId: string,
  quantity = 1,
): Promise<Cart> {
  return parseCart(
    await cartFetch("/api/cart/items", {
      method: "POST",
      body: JSON.stringify({ paintingId, quantity }),
    }),
  );
}

export async function updateCartItem(
  paintingId: string,
  quantity: number,
): Promise<Cart> {
  return parseCart(
    await cartFetch(`/api/cart/items/${paintingId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  );
}

export async function removeCartItem(paintingId: string): Promise<Cart> {
  return parseCart(
    await cartFetch(`/api/cart/items/${paintingId}`, { method: "DELETE" }),
  );
}

export async function clearCart(): Promise<Cart> {
  return parseCart(await cartFetch("/api/cart", { method: "DELETE" }));
}
