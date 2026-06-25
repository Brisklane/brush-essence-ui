"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonVariants, CheckIcon, Spinner } from "@/components/ui";
import { getOrder } from "@/lib/orders-api";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

import { OrderItems } from "./order-items";
import { OrderTotals } from "./order-totals";
import { ShippingAddressBlock } from "./shipping-address-block";

export function OrderConfirmation({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load your order.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (error) {
    return <p className="text-muted py-16 text-center">{error}</p>;
  }

  if (!order) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="bg-brand-600 mx-auto inline-flex size-14 items-center justify-center rounded-full text-2xl text-white">
          <CheckIcon />
        </span>
        <h1 className="font-display text-foreground mt-5 text-3xl font-semibold tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-muted mt-2">
          A confirmation has been sent to{" "}
          <span className="text-foreground">{order.customerEmail}</span>.
        </p>
        <p className="text-muted mt-1 text-sm">
          Order reference{" "}
          <span className="text-foreground font-semibold">
            {order.orderNumber}
          </span>
        </p>
      </div>

      <section className="border-border bg-surface mt-8 rounded-xl border p-6 shadow-sm">
        <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
          Order summary
        </h2>
        <div className="mt-2">
          <OrderItems items={order.items} currency={order.currency} />
        </div>
        <div className="border-border mt-4 border-t pt-4">
          <OrderTotals
            subtotal={order.subtotal}
            shippingCost={order.shippingCost}
            total={order.total}
            currency={order.currency}
          />
        </div>
      </section>

      <section className="border-border bg-surface mt-6 rounded-xl border p-6 shadow-sm">
        <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
          Shipping to
        </h2>
        <div className="mt-3">
          <ShippingAddressBlock address={order.shippingAddress} />
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={`/orders/${order.id}`} className={cn(buttonVariants({}))}>
          Track this order
        </Link>
        <Link
          href="/gallery"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
