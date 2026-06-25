"use client";

import { useState } from "react";

import { Button, Input } from "@/components/ui";
import type { Category } from "@/types";

export interface PriceRange {
  min: string;
  max: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onToggleCategory: (id: string) => void;
  price: PriceRange;
  onApplyPrice: (price: PriceRange) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

/** Category checkboxes + price-range inputs. Used in the sidebar and the
 * mobile filter drawer. Fully controlled by the parent CatalogView. */
export function CatalogFilters({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  price,
  onApplyPrice,
  onClearAll,
  hasActiveFilters,
}: CatalogFiltersProps) {
  // Local draft so users can type a range and commit it on "Apply". The parent
  // remounts this component (via `key`) when the committed price changes
  // externally, which re-seeds the draft — no effect synchronisation needed.
  const [draft, setDraft] = useState<PriceRange>(price);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase">
          Filters
        </h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearAll}
            className="text-brand-700 dark:text-gold-300 text-xs font-medium hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <section>
        <h3 className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
          Category
        </h3>
        {categories.length === 0 ? (
          <p className="text-muted-2 text-sm">No categories yet.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <label className="text-foreground flex cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => onToggleCategory(category.id)}
                    className="accent-brand-600 size-4 rounded"
                  />
                  <span>{category.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
          Price range
        </h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onApplyPrice(draft);
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Min"
              aria-label="Minimum price"
              value={draft.min}
              onChange={(e) => setDraft((d) => ({ ...d, min: e.target.value }))}
            />
            <span className="text-muted-2">–</span>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Max"
              aria-label="Maximum price"
              value={draft.max}
              onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value }))}
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Apply price
          </Button>
        </form>
      </section>
    </div>
  );
}
