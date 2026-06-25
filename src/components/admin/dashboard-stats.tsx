"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  BarChart,
  StatCard,
  StatusBars,
  type BarChartPoint,
} from "@/components/admin/analytics";
import { CustomRequestStatusBadge } from "@/components/custom-requests";
import { OrderStatusBadge } from "@/components/orders";
import { Card, CardContent, CardTitle, formatPrice, Spinner } from "@/components/ui";
import { getDashboardSummary, getReport } from "@/lib/admin-api";
import { CUSTOM_REQUEST_STATUS_LABELS } from "@/lib/custom-request-status";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { DashboardSummary, Report } from "@/types";

type Metric = "revenue" | "orders" | "newUsers" | "newRequests";

const METRICS: { key: Metric; label: string }[] = [
  { key: "revenue", label: "Revenue" },
  { key: "orders", label: "Orders" },
  { key: "newUsers", label: "New users" },
  { key: "newRequests", label: "New requests" },
];

function formatDay(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function DashboardStats() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metric, setMetric] = useState<Metric>("revenue");

  useEffect(() => {
    let cancelled = false;
    Promise.all([getDashboardSummary(), getReport(30)])
      .then(([summaryData, reportData]) => {
        if (!cancelled) {
          setSummary(summaryData);
          setReport(reportData);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load the dashboard.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-muted py-12">{error}</p>;
  }

  if (!summary || !report) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  const chartData: BarChartPoint[] = report.points.map((point) => ({
    label: formatDay(point.date),
    value: point[metric],
  }));

  const formatMetric = (value: number) =>
    metric === "revenue" ? formatPrice(value, report.currency) : String(value);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(summary.totalRevenue, summary.currency)}
          hint="Excludes cancelled orders"
          accent="success"
        />
        <StatCard
          label="Orders"
          value={summary.totalOrders}
          hint={`${summary.pendingOrders} pending`}
          accent="brand"
        />
        <StatCard
          label="Customers"
          value={summary.totalUsers}
          hint={`${summary.newUsersLast30Days} new in 30 days`}
        />
        <StatCard
          label="Custom requests"
          value={summary.totalRequests}
          hint={`${summary.openRequests} open`}
          accent="gold"
        />
      </div>

      {/* Trend chart */}
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Last {report.days} days</CardTitle>
            <div className="flex flex-wrap gap-1">
              {METRICS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setMetric(option.key)}
                  className={
                    metric === option.key
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200 rounded-md px-3 py-1 text-sm font-medium"
                      : "text-muted hover:bg-surface-2 rounded-md px-3 py-1 text-sm font-medium"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <BarChart data={chartData} formatValue={formatMetric} />
          </div>
        </CardContent>
      </Card>

      {/* Breakdowns */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <CardTitle>Orders by status</CardTitle>
            <div className="mt-4">
              <StatusBars
                items={Object.entries(ORDER_STATUS_LABELS).map(
                  ([key, label]) => ({
                    label,
                    value: summary.ordersByStatus[key] ?? 0,
                  }),
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Requests by status</CardTitle>
            <div className="mt-4">
              <StatusBars
                items={Object.entries(CUSTOM_REQUEST_STATUS_LABELS).map(
                  ([key, label]) => ({
                    label,
                    value: summary.requestsByStatus[key] ?? 0,
                  }),
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <CardTitle>Recent orders</CardTitle>
              <Link href="/admin/orders" className="text-brand-700 hover:text-brand-800 text-sm">
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-border divide-y">
              {summary.recentOrders.length === 0 ? (
                <li className="text-muted-2 py-3 text-sm">No orders yet.</li>
              ) : (
                summary.recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {order.orderNumber}
                      </p>
                      <p className="text-muted-2 truncate text-xs">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} size="sm" />
                      <span className="text-foreground text-sm font-medium tabular-nums">
                        {formatPrice(order.total, order.currency)}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <CardTitle>Recent requests</CardTitle>
              <Link href="/admin/requests" className="text-brand-700 hover:text-brand-800 text-sm">
                View all
              </Link>
            </div>
            <ul className="mt-4 divide-border divide-y">
              {summary.recentRequests.length === 0 ? (
                <li className="text-muted-2 py-3 text-sm">No requests yet.</li>
              ) : (
                summary.recentRequests.map((request) => (
                  <li key={request.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {request.title}
                      </p>
                      <p className="text-muted-2 truncate text-xs">
                        {request.customerEmail}
                      </p>
                    </div>
                    <CustomRequestStatusBadge status={request.status} size="sm" />
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
