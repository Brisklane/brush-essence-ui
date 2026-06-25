"use client";

import Link from "next/link";
import { useState } from "react";

import { ConfirmDialog, formatPrice, Spinner, TrashIcon } from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { resolveImageUrl } from "@/lib/image";
import type { CartItem } from "@/types";

import { QuantityStepper } from "./quantity-stepper";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem, pendingItems } = useCart();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pending = pendingItems.has(item.paintingId);
  const image = resolveImageUrl(item.imageUrl);

  async function changeQuantity(next: number) {
    if (next === item.quantity) return;
    setError(null);
    try {
      await updateQuantity(item.paintingId, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update quantity.");
    }
  }

  async function confirmRemove() {
    try {
      await removeItem(item.paintingId);
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <li className="border-border flex gap-4 border-b py-5 last:border-b-0">
      <Link
        href={`/gallery/${item.paintingId}`}
        className="border-border bg-surface-2 relative size-24 shrink-0 overflow-hidden rounded-lg border"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- API-origin image; remote next/image config intentionally avoided.
          <img
            src={image}
            alt={item.title}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-muted-2 flex size-full items-center justify-center text-xs">
            No image
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/gallery/${item.paintingId}`}
              className="text-foreground hover:text-brand-700 dark:hover:text-gold-300 line-clamp-2 font-medium"
            >
              {item.title}
            </Link>
            <p className="text-muted mt-1 text-sm">
              {formatPrice(item.unitPrice, item.currency)} each
            </p>
          </div>

          <button
            type="button"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => setConfirmOpen(true)}
            disabled={pending}
            className="text-muted hover:text-red-600 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-lg disabled:opacity-40"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex items-center gap-3">
            <QuantityStepper
              value={item.quantity}
              max={item.stockQuantity}
              disabled={pending}
              onChange={changeQuantity}
            />
            {pending ? <Spinner className="size-4" /> : null}
          </div>
          <span className="text-foreground font-semibold tabular-nums">
            {formatPrice(item.lineTotal, item.currency)}
          </span>
        </div>

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        {item.quantity >= item.stockQuantity ? (
          <p className="text-muted-2 mt-2 text-xs">
            Max available ({item.stockQuantity} in stock).
          </p>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove from cart?"
        description={`"${item.title}" will be removed from your cart.`}
        confirmLabel="Remove"
        loading={pending}
        onConfirm={confirmRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  );
}
