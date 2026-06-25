"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  buttonVariants,
  ChevronRightIcon,
  formatPrice,
  Spinner,
} from "@/components/ui";
import { listOrders } from "@/lib/orders-api";
import { cn } from "@/lib/utils";
import type { OrderSummary } from "@/types";

import { OrderStatusBadge } from "./order-status-badge";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function OrderHistory() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listOrders()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load your orders.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-muted py-12 text-center">{error}</p>;
  }

  if (orders === null) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border-border bg-surface mx-auto max-w-md rounded-2xl border py-16 text-center">
        <h2 className="text-foreground text-lg font-semibold">No orders yet</h2>
        <p className="text-muted mx-auto mt-2 max-w-xs text-sm">
          When you place an order, it&apos;ll show up here.
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
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.id}`}
            className="border-border bg-surface hover:border-brand-300 flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-foreground font-semibold">
                  {order.orderNumber}
                </span>
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
              <p className="text-muted mt-1 text-sm">
                {formatDate(order.createdAt)} · {order.itemCount}{" "}
                {order.itemCount === 1 ? "item" : "items"}
              </p>
            </div>

            <span className="text-foreground font-semibold tabular-nums">
              {formatPrice(order.total, order.currency)}
            </span>
            <ChevronRightIcon className="text-muted-2 text-lg" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
