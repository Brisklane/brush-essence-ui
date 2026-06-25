"use client";

import { ChevronDownIcon } from "@/components/ui";
import {
  PAINTING_SORTS,
  SORT_LABELS,
  type PaintingSort,
} from "@/lib/storefront";

export function SortSelect({
  value,
  onChange,
}: {
  value: PaintingSort;
  onChange: (sort: PaintingSort) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted hidden sm:inline">Sort</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as PaintingSort)}
          className="text-foreground border-border bg-surface focus-visible:ring-ring h-10 cursor-pointer appearance-none rounded-md border pr-9 pl-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {PAINTING_SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {SORT_LABELS[sort]}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-base" />
      </div>
    </label>
  );
}
