import { cn } from "@/lib/utils";
import type { Painting } from "@/types";

import { ProductCard } from "./product-card";

const GRID_CLASSES =
  "grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGrid({
  paintings,
  className,
}: {
  paintings: Painting[];
  className?: string;
}) {
  return (
    <div className={cn(GRID_CLASSES, className)}>
      {paintings.map((painting) => (
        <ProductCard key={painting.id} painting={painting} />
      ))}
    </div>
  );
}

/** Placeholder tiles shown while a page of results is loading. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID_CLASSES}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-surface overflow-hidden rounded-xl border"
        >
          <div className="bg-surface-2 aspect-[4/5] animate-pulse" />
          <div className="space-y-2 p-4">
            <div className="bg-surface-2 h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-surface-2 h-3 w-1/2 animate-pulse rounded" />
            <div className="bg-surface-2 h-5 w-1/3 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
