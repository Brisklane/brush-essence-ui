"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CustomRequestStatusBadge } from "@/components/custom-requests";
import { Input, Select, Spinner } from "@/components/ui";
import { listAdminRequests, updateRequestStatus } from "@/lib/admin-api";
import {
  CUSTOM_REQUEST_STATUS_LABELS,
  CUSTOM_REQUEST_STATUS_TRANSITIONS,
} from "@/lib/custom-request-status";
import type {
  AdminCustomRequestListItem,
  CustomRequestStatus,
  PagedResult,
} from "@/types";

import { AdminPagination } from "./admin-pagination";
import { StatusUpdater } from "./status-updater";

const STATUSES = Object.keys(
  CUSTOM_REQUEST_STATUS_LABELS,
) as CustomRequestStatus[];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function ManageRequests() {
  const [data, setData] = useState<PagedResult<AdminCustomRequestListItem> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomRequestStatus | "">("");

  // State is set in async callbacks (not synchronously in the effect body).
  useEffect(() => {
    let cancelled = false;
    listAdminRequests({
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
          setError(err instanceof Error ? err.message : "Couldn't load requests.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, status]);

  function onApplyStatus(request: AdminCustomRequestListItem) {
    return async (next: CustomRequestStatus) => {
      const updated = await updateRequestStatus(request.id, next);
      setData((current) =>
        current
          ? {
              ...current,
              items: current.items.map((item) =>
                item.id === request.id
                  ? { ...item, status: updated.status }
                  : item,
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
          placeholder="Search title or email…"
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
            setStatus(event.target.value as CustomRequestStatus | "");
          }}
          className="max-w-48"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {CUSTOM_REQUEST_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Request</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Update</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {loading && !data ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <Spinner className="mx-auto size-6" />
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((request) => (
                <tr key={request.id} className="hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/custom-requests/${request.id}`}
                      className="text-foreground hover:text-brand-700 dark:hover:text-gold-300 font-medium"
                    >
                      {request.title}
                    </Link>
                    {request.imageCount > 0 ? (
                      <span className="text-muted-2 ml-2 text-xs">
                        {request.imageCount} img
                      </span>
                    ) : null}
                  </td>
                  <td className="text-muted px-4 py-3">
                    {request.customerEmail}
                  </td>
                  <td className="text-muted px-4 py-3">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <CustomRequestStatusBadge status={request.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <StatusUpdater
                        next={CUSTOM_REQUEST_STATUS_TRANSITIONS[request.status]}
                        labels={CUSTOM_REQUEST_STATUS_LABELS}
                        onApply={onApplyStatus(request)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-muted px-4 py-10 text-center">
                  No requests found.
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
