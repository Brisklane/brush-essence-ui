"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Button,
  buttonVariants,
  CartIcon,
  ConfirmDialog,
  Spinner,
} from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

import { CartItemRow } from "./cart-item-row";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const { cart, status, itemCount, clear, isMutating, refresh } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">We couldn&apos;t load your cart.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void refresh()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="border-border bg-surface mx-auto max-w-md rounded-2xl border py-16 text-center">
        <CartIcon className="text-muted-2 mx-auto text-4xl" />
        <h2 className="text-foreground mt-4 text-lg font-semibold">
          Your cart is empty
        </h2>
        <p className="text-muted mx-auto mt-2 max-w-xs text-sm">
          Browse the gallery and add a piece you love — it&apos;ll wait for you
          here.
        </p>
        <Link
          href="/gallery"
          className={cn(buttonVariants({ size: "lg" }), "mt-6")}
        >
          Explore the gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section>
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            disabled={isMutating}
            className="text-muted text-sm font-medium hover:text-red-600 disabled:opacity-40"
          >
            Clear cart
          </button>
        </div>

        <ul className="mt-2">
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <CartSummary
        subtotal={cart.subtotal}
        currency={cart.currency}
        itemCount={itemCount}
      >
        <Link
          href="/checkout"
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Proceed to checkout
        </Link>
        <Link
          href="/gallery"
          className={cn(buttonVariants({ variant: "ghost" }), "mt-2 w-full")}
        >
          Continue shopping
        </Link>
      </CartSummary>

      <ConfirmDialog
        open={confirmClear}
        title="Clear your cart?"
        description="Every item will be removed. This can't be undone."
        confirmLabel="Clear cart"
        loading={isMutating}
        onConfirm={async () => {
          await clear();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
