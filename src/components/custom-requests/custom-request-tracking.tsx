"use client";

import { CheckIcon } from "@/components/ui";
import {
  CUSTOM_REQUEST_PROGRESS_STEPS,
  CUSTOM_REQUEST_STATUS_DESCRIPTIONS,
  CUSTOM_REQUEST_STATUS_LABELS,
} from "@/lib/custom-request-status";
import { cn } from "@/lib/utils";
import type { CustomRequest } from "@/types";

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/**
 * Progress tracker for a custom request. Follows the happy-path milestones
 * (Submitted → Reviewed → In progress → Completed) and renders the artist's
 * note for each step. Declined requests show a dedicated terminal state.
 */
export function CustomRequestTracking({ request }: { request: CustomRequest }) {
  const lastEventFor = new Map(
    request.history.map((event) => [event.status, event]),
  );

  if (request.status === "Declined") {
    const declined = lastEventFor.get("Declined");
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
        <p className="font-medium text-red-700 dark:text-red-300">
          {CUSTOM_REQUEST_STATUS_LABELS.Declined}
        </p>
        <p className="mt-1 text-sm text-red-600/90 dark:text-red-300/80">
          {declined?.note ?? CUSTOM_REQUEST_STATUS_DESCRIPTIONS.Declined}
          {declined ? ` · ${formatWhen(declined.occurredAt)}` : ""}
        </p>
      </div>
    );
  }

  const currentIndex = CUSTOM_REQUEST_PROGRESS_STEPS.indexOf(request.status);

  return (
    <ol>
      {CUSTOM_REQUEST_PROGRESS_STEPS.map((step, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === CUSTOM_REQUEST_PROGRESS_STEPS.length - 1;
        const event = lastEventFor.get(step);

        return (
          <li key={step} className="flex gap-4">
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

            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-medium",
                  reached ? "text-foreground" : "text-muted-2",
                  isCurrent && "text-brand-700 dark:text-gold-300",
                )}
              >
                {CUSTOM_REQUEST_STATUS_LABELS[step]}
              </p>
              <p className="text-muted mt-0.5 text-sm">
                {event?.note ?? CUSTOM_REQUEST_STATUS_DESCRIPTIONS[step]}
              </p>
              {event ? (
                <p className="text-muted-2 mt-0.5 text-xs">
                  {formatWhen(event.occurredAt)}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
