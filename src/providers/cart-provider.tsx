"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/cart-api";
import { useAuth } from "@/hooks/use-auth";
import type { Cart } from "@/types";

export type CartStatus = "loading" | "ready" | "error";

export interface CartContextValue {
  cart: Cart | null;
  status: CartStatus;
  /** Total units across all lines — drives the header badge. */
  itemCount: number;
  /** True while any mutation is in flight. */
  isMutating: boolean;
  /** Painting ids with a mutation currently in flight (for row-level UI). */
  pendingItems: ReadonlySet<string>;
  addItem: (paintingId: string, quantity?: number) => Promise<void>;
  updateQuantity: (paintingId: string, quantity: number) => Promise<void>;
  removeItem: (paintingId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status: authStatus } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [status, setStatus] = useState<CartStatus>("loading");
  const [pendingItems, setPendingItems] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      setCart(await getCart());
      setStatus("ready");
    } catch {
      // The cart is non-critical chrome; never block the page on its failure.
      setStatus("error");
    }
  }, []);

  // Load once the auth state has settled, and reload whenever it flips
  // (sign-in merges the guest cart server-side; sign-out reveals the guest cart).
  // State is set in async callbacks (not synchronously in the effect body).
  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    let cancelled = false;
    getCart()
      .then((next) => {
        if (!cancelled) {
          setCart(next);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  // Tracks the painting a mutation targets so we can flag just that row.
  const withPending = useCallback(
    async (key: string, action: () => Promise<Cart>) => {
      setPendingItems((prev) => new Set(prev).add(key));
      try {
        setCart(await action());
        setStatus("ready");
      } finally {
        setPendingItems((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [],
  );

  const addItem = useCallback(
    (paintingId: string, quantity = 1) =>
      withPending(paintingId, () => addCartItem(paintingId, quantity)),
    [withPending],
  );

  const updateQuantity = useCallback(
    (paintingId: string, quantity: number) =>
      withPending(paintingId, () => updateCartItem(paintingId, quantity)),
    [withPending],
  );

  const removeItem = useCallback(
    (paintingId: string) =>
      withPending(paintingId, () => removeCartItem(paintingId)),
    [withPending],
  );

  // A whole-cart op; key it on a sentinel so `isMutating` reflects it too.
  const clearKey = useRef("__clear__").current;
  const clear = useCallback(
    () => withPending(clearKey, () => clearCart()),
    [withPending, clearKey],
  );

  const value: CartContextValue = {
    cart,
    status,
    itemCount: cart?.totalQuantity ?? 0,
    isMutating: pendingItems.size > 0,
    pendingItems,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refresh,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
