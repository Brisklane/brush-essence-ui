"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, buttonVariants, formatPrice, Spinner } from "@/components/ui";
import {
  approveQuote,
  declineQuote,
  getCustomRequest,
} from "@/lib/custom-requests-api";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { CustomRequest } from "@/types";

import { CustomRequestStatusBadge } from "./custom-request-status-badge";
import { CustomRequestTracking } from "./custom-request-tracking";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
    new Date(iso),
  );
}

export function RequestDetails({ requestId }: { requestId: string }) {
  const [request, setRequest] = useState<CustomRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCustomRequest(requestId)
      .then((data) => {
        if (!cancelled) setRequest(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load this request.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  async function respondToQuote(decision: "approve" | "decline") {
    setActing(true);
    setActionError(null);
    try {
      const updated =
        decision === "approve"
          ? await approveQuote(requestId)
          : await declineQuote(requestId);
      setRequest(updated);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setActing(false);
    }
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">{error}</p>
        <Link
          href="/custom-requests"
          className="text-brand-700 hover:text-brand-800 mt-4 inline-block text-sm"
        >
          ← Back to your requests
        </Link>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/custom-requests"
        className="text-muted hover:text-foreground text-sm"
      >
        ← Your custom requests
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {request.title}
          </h1>
          <p className="text-muted mt-1 text-sm">
            Submitted {formatDate(request.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CustomRequestStatusBadge status={request.status} />
          {request.isEditable ? (
            <Link
              href={`/custom-requests/${request.id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Edit
            </Link>
          ) : null}
        </div>
      </div>

      {/* Pending quote — needs the customer's decision */}
      {request.status === "Quoted" && request.quoteAmount != null ? (
        <section className="border-gold-300 bg-gold-50 dark:border-gold-500/30 dark:bg-gold-500/10 mt-6 rounded-xl border p-6">
          <h2 className="text-foreground text-lg font-semibold">
            Your quote is ready
          </h2>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {formatPrice(request.quoteAmount, request.currency)}
          </p>
          <p className="text-muted mt-1 text-sm">
            Approve to get your commission started, or decline if you&apos;d
            prefer not to go ahead.
          </p>
          {actionError ? (
            <p className="mt-3 text-sm text-red-600">{actionError}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => respondToQuote("approve")} disabled={acting}>
              {acting ? "Working…" : "Approve quote"}
            </Button>
            <Button
              variant="outline"
              onClick={() => respondToQuote("decline")}
              disabled={acting}
            >
              Decline
            </Button>
          </div>
        </section>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          <section className="border-border bg-surface rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">
              Status updates
            </h2>
            <div className="mt-5">
              <CustomRequestTracking request={request} />
            </div>
          </section>

          <section className="border-border bg-surface rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">
              Your brief
            </h2>
            <p className="text-muted mt-3 leading-relaxed whitespace-pre-line">
              {request.description}
            </p>

            {request.images.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-muted-2 text-xs font-semibold tracking-wide uppercase">
                  Reference images
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {request.images.map((image) => {
                    const src = resolveImageUrl(image.url);
                    return src ? (
                      <a
                        key={image.id}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="border-border bg-surface-2 size-24 overflow-hidden rounded-lg border"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- API-origin image; remote next/image config intentionally avoided. */}
                        <img
                          src={src}
                          alt={image.fileName ?? "Reference image"}
                          className="size-full object-cover"
                        />
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="border-border bg-surface h-fit space-y-3 rounded-xl border p-6 text-sm shadow-sm">
          <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
            Details
          </h2>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Preferred size</dt>
            <dd className="text-foreground text-right">
              {request.preferredSize ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Quote</dt>
            <dd className="text-foreground text-right">
              {request.quoteAmount != null
                ? formatPrice(request.quoteAmount, request.currency)
                : "—"}
            </dd>
          </div>
        </aside>
      </div>
    </div>
  );
}
