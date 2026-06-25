"use client";

import type { ReactNode } from "react";

import { formatPrice } from "@/components/ui";

interface CartSummaryProps {
  subtotal: number;
  currency: string;
  itemCount: number;
  /** Slot for page-specific actions (checkout button, etc.). */
  children?: ReactNode;
}

/**
 * Subtotal/total panel shared by the cart and (later) the checkout page.
 * Shipping and taxes aren't modelled yet, so the total equals the subtotal and
 * we say so explicitly rather than implying free shipping.
 */
export function CartSummary({
  subtotal,
  currency,
  itemCount,
  children,
}: CartSummaryProps) {
  return (
    <aside className="border-border bg-surface h-fit rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground text-lg font-semibold">Order summary</h2>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">
            Subtotal
            <span className="text-muted-2">
              {" "}
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </dt>
          <dd className="text-foreground font-medium tabular-nums">
            {formatPrice(subtotal, currency)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-muted-2">Calculated at checkout</dd>
        </div>
      </dl>

      <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-foreground font-semibold">Total</span>
        <span className="text-foreground text-lg font-semibold tabular-nums">
          {formatPrice(subtotal, currency)}
        </span>
      </div>

      {children ? <div className="mt-6">{children}</div> : null}
    </aside>
  );
}
