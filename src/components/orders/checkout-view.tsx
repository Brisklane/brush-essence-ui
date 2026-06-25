"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CartSummary } from "@/components/cart";
import {
  buttonVariants,
  CartIcon,
  formatPrice,
  Spinner,
} from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { createOrder } from "@/lib/orders-api";
import type { ShippingAddressValues } from "@/lib/validations/order";

import { AddressForm } from "./address-form";

export function CheckoutView() {
  const { user } = useAuth();
  const { cart, status, itemCount, refresh } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
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
          Add something you love before checking out.
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

  async function placeOrder(address: ShippingAddressValues) {
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder({ shippingAddress: address });
      // The order consumed the cart server-side; reflect that locally.
      await refresh();
      router.replace(`/orders/${order.id}/confirmation`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't place your order.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section>
        <h2 className="text-foreground text-lg font-semibold">
          Shipping address
        </h2>
        <p className="text-muted mt-1 text-sm">
          Where should we send your {itemCount === 1 ? "piece" : "pieces"}?
        </p>
        <div className="mt-5">
          <AddressForm
            onSubmit={placeOrder}
            submitting={submitting}
            submitLabel={`Place order · ${formatPrice(cart.subtotal, cart.currency)}`}
            defaultValues={{ fullName: user?.fullName ?? undefined }}
            error={error}
          />
        </div>
      </section>

      <CartSummary
        subtotal={cart.subtotal}
        currency={cart.currency}
        itemCount={itemCount}
      >
        <Link
          href="/cart"
          className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
        >
          Edit cart
        </Link>
      </CartSummary>
    </div>
  );
}
