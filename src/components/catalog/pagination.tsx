"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Builds a compact list of page tokens with ellipses, e.g.
 * `1 … 4 5 [6] 7 8 … 20`. Always shows first/last and the current neighbourhood.
 */
function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  const arrow =
    "border-border text-foreground hover:bg-surface-2 inline-flex size-10 items-center justify-center rounded-md border text-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      <button
        type="button"
        aria-label="Previous page"
        className={arrow}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((token, i) =>
        token === "…" ? (
          <span key={`gap-${i}`} className="text-muted px-2">
            …
          </span>
        ) : (
          <button
            key={token}
            type="button"
            aria-current={token === page ? "page" : undefined}
            onClick={() => onPageChange(token)}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-md border text-sm font-medium transition-colors",
              token === page
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border text-foreground hover:bg-surface-2",
            )}
          >
            {token}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        className={arrow}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
