"use client";

import { Button } from "@/components/ui";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPage: (page: number) => void;
}

/** Compact Prev/Next pager shared by the admin management tables. */
export function AdminPagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onPage,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <Button
        size="sm"
        variant="outline"
        disabled={!hasPrevious}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </Button>
      <span className="text-muted text-sm">
        Page {page} of {totalPages}
      </span>
      <Button
        size="sm"
        variant="outline"
        disabled={!hasNext}
        onClick={() => onPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
