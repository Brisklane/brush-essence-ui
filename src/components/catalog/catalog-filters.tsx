"use client";

import { useEffect, useRef } from "react";

import { Input } from "@/components/ui";
import type { Category, Medium } from "@/types";

export interface PriceRange {
  min: string;
  max: string;
}

interface CatalogFiltersProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onToggleCategory: (id: string) => void;
  mediums: Medium[];
  selectedMediumIds: string[];
  onToggleMedium: (id: string) => void;
  price: PriceRange;
  onApplyPrice: (price: PriceRange) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const PRICE_DEBOUNCE_MS = 500;

/**
 * Category + medium checkboxes and an instant (debounced) price range. Fully
 * controlled by the parent CatalogView. Price inputs are uncontrolled (refs) so
 * committing a debounced value never steals focus mid-typing.
 */
export function CatalogFilters({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  mediums,
  selectedMediumIds,
  onToggleMedium,
  price,
  onApplyPrice,
  onClearAll,
  hasActiveFilters,
}: CatalogFiltersProps) {
  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Adopt external price changes (e.g. "Clear all") without overwriting a field
  // the user is actively editing. DOM writes only — no React state involved.
  useEffect(() => {
    const min = minRef.current;
    const max = maxRef.current;
    if (min && document.activeElement !== min && min.value !== price.min) {
      min.value = price.min;
    }
    if (max && document.activeElement !== max && max.value !== price.max) {
      max.value = price.max;
    }
  }, [price.min, price.max]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function schedulePriceApply() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onApplyPrice({
        min: (minRef.current?.value ?? "").trim(),
        max: (maxRef.current?.value ?? "").trim(),
      });
    }, PRICE_DEBOUNCE_MS);
  }

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

      <FilterCheckboxSection
        title="Category"
        items={categories}
        selectedIds={selectedCategoryIds}
        onToggle={onToggleCategory}
        emptyLabel="No categories yet."
      />

      <FilterCheckboxSection
        title="Medium"
        items={mediums}
        selectedIds={selectedMediumIds}
        onToggle={onToggleMedium}
        emptyLabel="No mediums yet."
      />

      <section>
        <h3 className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
          Price range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            ref={minRef}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price"
            defaultValue={price.min}
            onChange={schedulePriceApply}
          />
          <span className="text-muted-2">–</span>
          <Input
            ref={maxRef}
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price"
            defaultValue={price.max}
            onChange={schedulePriceApply}
          />
        </div>
      </section>
    </div>
  );
}

/** A titled list of checkboxes — shared by the Category and Medium sections. */
function FilterCheckboxSection({
  title,
  items,
  selectedIds,
  onToggle,
  emptyLabel,
}: {
  title: string;
  items: { id: string; name: string }[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  emptyLabel: string;
}) {
  return (
    <section>
      <h3 className="text-muted mb-3 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-muted-2 text-sm">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <label className="text-foreground flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                  className="accent-brand-600 size-4 rounded"
                />
                <span>{item.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
