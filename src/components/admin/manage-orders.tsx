"use client";

import { useEffect, useState } from "react";

import { OrderStatusBadge } from "@/components/orders";
import { formatPrice, Input, Select, Spinner } from "@/components/ui";
import { listAdminOrders, updateOrderStatus } from "@/lib/admin-api";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TRANSITIONS,
} from "@/lib/order-status";
import type { AdminOrderListItem, OrderStatus, PagedResult } from "@/types";

import { AdminPagination } from "./admin-pagination";
import { StatusUpdater } from "./status-updater";

const STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function ManageOrders() {
  const [data, setData] = useState<PagedResult<AdminOrderListItem> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");

  // State is set in async callbacks (not synchronously in the effect body).
  // Stale rows stay visible while a filtered fetch is in flight.
  useEffect(() => {
    let cancelled = false;
    listAdminOrders({
      page,
      search: search.trim() || undefined,
      status: status || undefined,
    })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Couldn't load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, status]);

  function onApplyStatus(order: AdminOrderListItem) {
    return async (next: OrderStatus) => {
      const updated = await updateOrderStatus(order.id, next);
      setData((current) =>
        current
          ? {
              ...current,
              items: current.items.map((item) =>
                item.id === order.id ? { ...item, status: updated.status } : item,
              ),
            }
          : current,
      );
    };
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search order # or email…"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          className="max-w-xs"
        />
        <Select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as OrderStatus | "");
          }}
          className="max-w-48"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Update</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {loading && !data ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <Spinner className="mx-auto size-6" />
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((order) => (
                <tr key={order.id} className="hover:bg-surface-2/50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="text-muted px-4 py-3">{order.customerEmail}</td>
                  <td className="text-muted px-4 py-3">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <StatusUpdater
                        next={ORDER_STATUS_TRANSITIONS[order.status]}
                        labels={ORDER_STATUS_LABELS}
                        onApply={onApplyStatus(order)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-muted px-4 py-10 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data ? (
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          hasPrevious={data.hasPrevious}
          hasNext={data.hasNext}
          onPage={setPage}
        />
      ) : null}
    </div>
  );
}
