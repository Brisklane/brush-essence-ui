"use client";

import { useState } from "react";

import { Button, CartIcon } from "@/components/ui";

/**
 * Add-to-cart control. The Cart epic isn't built yet, so the action is a
 * deliberate stub — the quantity stepper and disabled/sold-out states are real
 * so wiring up a cart later is a drop-in change.
 */
export function AddToCart({ stockQuantity }: { stockQuantity: number }) {
  const soldOut = stockQuantity <= 0;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    // TODO(cart-epic): push to the cart store instead of this placeholder.
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="space-y-4">
      {!soldOut ? (
        <div className="flex items-center gap-4">
          <span className="text-muted text-sm">Quantity</span>
          <div className="border-border inline-flex items-center rounded-md border">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="text-foreground hover:bg-surface-2 size-10 text-lg disabled:opacity-40"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
            >
              −
            </button>
            <span className="text-foreground w-10 text-center text-sm font-medium">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="text-foreground hover:bg-surface-2 size-10 text-lg disabled:opacity-40"
              onClick={() => setQty((q) => Math.min(stockQuantity, q + 1))}
              disabled={qty >= stockQuantity}
            >
              +
            </button>
          </div>
          <span className="text-muted-2 text-xs">
            {stockQuantity} in stock
          </span>
        </div>
      ) : null}

      <Button
        size="lg"
        variant={soldOut ? "secondary" : "primary"}
        className="w-full sm:w-auto"
        disabled={soldOut}
        onClick={handleAdd}
      >
        <CartIcon className="text-lg" />
        {soldOut ? "Sold out" : added ? "Added — cart coming soon!" : "Add to cart"}
      </Button>

      {!soldOut ? (
        <p className="text-muted-2 text-xs">
          Checkout isn&apos;t live yet — this is a preview of the gallery.
        </p>
      ) : null}
    </div>
  );
}
