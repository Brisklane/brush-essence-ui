"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui";
import { getOrder, getOrderTracking } from "@/lib/orders-api";
import type { Order, OrderTracking as OrderTrackingData } from "@/types";

import { OrderItems } from "./order-items";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderTotals } from "./order-totals";
import { OrderTracking } from "./order-tracking";
import { ShippingAddressBlock } from "./shipping-address-block";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
    new Date(iso),
  );
}

export function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getOrder(orderId), getOrderTracking(orderId)])
      .then(([orderData, trackingData]) => {
        if (!cancelled) {
          setOrder(orderData);
          setTracking(trackingData);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load this order.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">{error}</p>
        <Link
          href="/orders"
          className="text-brand-700 hover:text-brand-800 mt-4 inline-block text-sm"
        >
          ← Back to your orders
        </Link>
      </div>
    );
  }

  if (!order || !tracking) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/orders"
        className="text-muted hover:text-foreground text-sm"
      >
        ← Your orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {order.orderNumber}
          </h1>
          <p className="text-muted mt-1 text-sm">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <section className="border-border bg-surface rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">Tracking</h2>
            <div className="mt-5">
              <OrderTracking tracking={tracking} />
            </div>
          </section>

          <section className="border-border bg-surface rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">Items</h2>
            <div className="mt-2">
              <OrderItems items={order.items} currency={order.currency} />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border-border bg-surface rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              Summary
            </h2>
            <div className="mt-4">
              <OrderTotals
                subtotal={order.subtotal}
                shippingCost={order.shippingCost}
                total={order.total}
                currency={order.currency}
              />
            </div>
          </section>

          <section className="border-border bg-surface rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              Shipping to
            </h2>
            <div className="mt-3">
              <ShippingAddressBlock address={order.shippingAddress} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
