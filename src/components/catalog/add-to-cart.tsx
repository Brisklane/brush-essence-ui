"use client";

import { useState } from "react";

import { QuantityStepper } from "@/components/cart";
import { Button, CartIcon, CheckIcon, Spinner } from "@/components/ui";
import { useCart } from "@/hooks/use-cart";

/**
 * Add-to-cart control for the product page. Lets the customer pick a quantity
 * (bounded by stock) and pushes it to the cart, with inline success/error
 * feedback. Wired to the shared cart store, so the header badge updates too.
 */
export function AddToCart({
  paintingId,
  stockQuantity,
}: {
  paintingId: string;
  stockQuantity: number;
}) {
  const { addItem, pendingItems } = useCart();
  const soldOut = stockQuantity <= 0;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pending = pendingItems.has(paintingId);

  async function handleAdd() {
    setError(null);
    try {
      await addItem(paintingId, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add to cart.");
    }
  }

  return (
    <div className="space-y-4">
      {!soldOut ? (
        <div className="flex items-center gap-4">
          <span className="text-muted text-sm">Quantity</span>
          <QuantityStepper
            value={qty}
            max={stockQuantity}
            disabled={pending}
            onChange={setQty}
          />
          <span className="text-muted-2 text-xs">{stockQuantity} in stock</span>
        </div>
      ) : null}

      <Button
        size="lg"
        variant={soldOut ? "secondary" : "primary"}
        className="w-full sm:w-auto"
        disabled={soldOut || pending}
        onClick={handleAdd}
      >
        {pending ? (
          <Spinner className="size-5 border-white/40 border-t-white" />
        ) : added ? (
          <CheckIcon className="text-lg" />
        ) : (
          <CartIcon className="text-lg" />
        )}
        {soldOut
          ? "Sold out"
          : pending
            ? "Adding…"
            : added
              ? "Added to cart"
              : "Add to cart"}
      </Button>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
