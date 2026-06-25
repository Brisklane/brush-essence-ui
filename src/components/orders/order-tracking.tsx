"use client";

import { CheckIcon } from "@/components/ui";
import {
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
} from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { OrderTracking as OrderTrackingData } from "@/types";

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/**
 * Visual progress tracker for an order. Follows the happy-path milestones
 * (Placed → Processing → Shipped → Delivered), marking each reached step from
 * the order's status history. Cancelled orders show a dedicated terminal state.
 */
export function OrderTracking({ tracking }: { tracking: OrderTrackingData }) {
  const reachedAt = new Map(
    tracking.history.map((event) => [event.status, event.occurredAt]),
  );

  if (tracking.status === "Cancelled") {
    const cancelledAt = reachedAt.get("Cancelled");
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
        <p className="font-medium text-red-700 dark:text-red-300">
          {ORDER_STATUS_LABELS.Cancelled}
        </p>
        <p className="mt-1 text-sm text-red-600/90 dark:text-red-300/80">
          {ORDER_STATUS_DESCRIPTIONS.Cancelled}
          {cancelledAt ? ` · ${formatWhen(cancelledAt)}` : ""}
        </p>
      </div>
    );
  }

  // The index of the current milestone on the happy path.
  const currentIndex = ORDER_PROGRESS_STEPS.indexOf(tracking.status);

  return (
    <ol className="space-y-0">
      {ORDER_PROGRESS_STEPS.map((step, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const when = reachedAt.get(step);
        const isLast = index === ORDER_PROGRESS_STEPS.length - 1;

        return (
          <li key={step} className="flex gap-4">
            {/* Marker + connector */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm",
                  reached
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-border text-muted-2",
                )}
              >
                {reached ? <CheckIcon /> : index + 1}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "my-1 w-px flex-1",
                    index < currentIndex ? "bg-brand-600" : "bg-border",
                  )}
                />
              ) : null}
            </div>

            {/* Label */}
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-medium",
                  reached ? "text-foreground" : "text-muted-2",
                  isCurrent && "text-brand-700 dark:text-gold-300",
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
              <p className="text-muted mt-0.5 text-sm">
                {ORDER_STATUS_DESCRIPTIONS[step]}
              </p>
              {when ? (
                <p className="text-muted-2 mt-0.5 text-xs">{formatWhen(when)}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
