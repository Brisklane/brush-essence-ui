"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  buttonVariants,
  ChevronRightIcon,
  PlusIcon,
  Spinner,
} from "@/components/ui";
import { listCustomRequests } from "@/lib/custom-requests-api";
import { cn } from "@/lib/utils";
import type { CustomRequestSummary } from "@/types";

import { CustomRequestStatusBadge } from "./custom-request-status-badge";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function RequestHistory() {
  const [requests, setRequests] = useState<CustomRequestSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listCustomRequests()
      .then((data) => {
        if (!cancelled) setRequests(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load your requests.",
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

  if (requests === null) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="border-border bg-surface mx-auto max-w-md rounded-2xl border py-16 text-center">
        <h2 className="text-foreground text-lg font-semibold">
          No custom requests yet
        </h2>
        <p className="text-muted mx-auto mt-2 max-w-xs text-sm">
          Commission a one-of-a-kind painting made just for you.
        </p>
        <Link
          href="/custom-requests/new"
          className={cn(buttonVariants({ size: "lg" }), "mt-6")}
        >
          <PlusIcon /> Start a request
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <li key={request.id}>
          <Link
            href={`/custom-requests/${request.id}`}
            className="border-border bg-surface hover:border-brand-300 flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-colors sm:p-5"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-foreground truncate font-semibold">
                  {request.title}
                </span>
                <CustomRequestStatusBadge status={request.status} size="sm" />
              </div>
              <p className="text-muted mt-1 text-sm">
                {formatDate(request.createdAt)}
                {request.imageCount > 0
                  ? ` · ${request.imageCount} ${request.imageCount === 1 ? "image" : "images"}`
                  : ""}
              </p>
            </div>
            <ChevronRightIcon className="text-muted-2 text-lg" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
