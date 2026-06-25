"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Button,
  CloseIcon,
  SearchIcon,
  SlidersIcon,
  Spinner,
} from "@/components/ui";
import {
  fetchCatalog,
  fetchCategories,
  isPaintingSort,
  type PaintingSort,
} from "@/lib/storefront";
import type { Category, PagedResult, Painting } from "@/types";

import { CatalogFilters, type PriceRange } from "./catalog-filters";
import { Pagination } from "./pagination";
import { ProductGrid, ProductGridSkeleton } from "./product-grid";
import { SortSelect } from "./sort-select";

const PAGE_SIZE = 12;

interface CatalogState {
  search: string;
  categoryIds: string[];
  min: string;
  max: string;
  sort: PaintingSort;
  page: number;
}

function parseState(params: URLSearchParams): CatalogState {
  const sort = params.get("sort");
  const categories = params.get("categories");
  return {
    search: params.get("search") ?? "",
    categoryIds: categories ? categories.split(",").filter(Boolean) : [],
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
    sort: isPaintingSort(sort) ? sort : "newest",
    page: Math.max(1, Number(params.get("page")) || 1),
  };
}

function toQueryString(state: CatalogState): string {
  const params = new URLSearchParams();
  if (state.search) params.set("search", state.search);
  if (state.categoryIds.length)
    params.set("categories", state.categoryIds.join(","));
  if (state.min) params.set("min", state.min);
  if (state.max) params.set("max", state.max);
  if (state.sort !== "newest") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  return params.toString();
}

export function CatalogView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseState(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<PagedResult<Painting> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Categories rarely change — load them once for the filter list.
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Re-fetch the catalogue whenever the effective query changes. State updates
  // live inside the async closure (not the effect body) to stay out of the
  // synchronous render path.
  const queryKey = toQueryString(state);
  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCatalog({
          page: state.page,
          pageSize: PAGE_SIZE,
          search: state.search || undefined,
          categoryIds: state.categoryIds.length ? state.categoryIds : undefined,
          minPrice: state.min ? Number(state.min) : undefined,
          maxPrice: state.max ? Number(state.max) : undefined,
          sort: state.sort,
        });
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) {
          setError("We couldn't load the gallery. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- queryKey captures every effective input.
  }, [queryKey]);

  const commit = useCallback(
    (next: Partial<CatalogState>, { resetPage = true } = {}) => {
      const merged: CatalogState = {
        ...state,
        ...next,
        page: next.page ?? (resetPage ? 1 : state.page),
      };
      const qs = toQueryString(merged);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [state, pathname, router],
  );

  const toggleCategory = (id: string) =>
    commit({
      categoryIds: state.categoryIds.includes(id)
        ? state.categoryIds.filter((c) => c !== id)
        : [...state.categoryIds, id],
    });

  const applyPrice = (price: PriceRange) =>
    commit({ min: price.min.trim(), max: price.max.trim() });

  const clearAll = () => router.replace(pathname, { scroll: false });

  const changePage = (page: number) => {
    commit({ page }, { resetPage: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    !!state.search ||
    state.categoryIds.length > 0 ||
    !!state.min ||
    !!state.max;

  const filters = (
    <CatalogFilters
      // Re-seed the price draft when the committed range changes externally.
      key={`${state.min}|${state.max}`}
      categories={categories}
      selectedCategoryIds={state.categoryIds}
      onToggleCategory={toggleCategory}
      price={{ min: state.min, max: state.max }}
      onApplyPrice={applyPrice}
      onClearAll={clearAll}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="border-border bg-surface sticky top-24 rounded-xl border p-6">
          {filters}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="border-border bg-surface mb-6 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox
            key={state.search}
            initial={state.search}
            onSearch={(value) => commit({ search: value })}
          />

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <SlidersIcon className="text-base" />
              Filters
              {hasActiveFilters ? (
                <span className="bg-brand-600 size-2 rounded-full" />
              ) : null}
            </Button>
            <SortSelect value={state.sort} onChange={(sort) => commit({ sort })} />
          </div>
        </div>

        {/* Result summary */}
        <div className="text-muted mb-4 flex items-center gap-2 text-sm">
          {loading ? (
            <Spinner className="size-4" />
          ) : result ? (
            <span>
              {result.totalCount}{" "}
              {result.totalCount === 1 ? "painting" : "paintings"}
              {state.search ? ` for “${state.search}”` : ""}
            </span>
          ) : null}
        </div>

        {/* Results */}
        {error ? (
          <div className="border-border text-muted rounded-xl border border-dashed p-12 text-center">
            {error}
          </div>
        ) : loading && !result ? (
          <ProductGridSkeleton count={PAGE_SIZE} />
        ) : result && result.items.length > 0 ? (
          <div className={loading ? "opacity-60 transition-opacity" : undefined}>
            <ProductGrid paintings={result.items} />
          </div>
        ) : (
          <div className="border-border rounded-xl border border-dashed p-12 text-center">
            <p className="text-foreground font-medium">No paintings found</p>
            <p className="text-muted mt-1 text-sm">
              Try adjusting your search or filters.
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={clearAll}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        )}

        {result ? (
          <div className="mt-10">
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              onPageChange={changePage}
            />
          </div>
        ) : null}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="bg-surface absolute inset-y-0 left-0 w-80 max-w-[85vw] overflow-y-auto p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-foreground font-semibold">Filters</span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                className="text-muted hover:text-foreground text-xl"
              >
                <CloseIcon />
              </button>
            </div>
            {filters}
            <Button className="mt-8 w-full" onClick={() => setDrawerOpen(false)}>
              Show results
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Uncontrolled search field. Remounting (via `key={search}` in the parent)
 * re-seeds it when the URL changes externally, so it needs no effect-based
 * synchronisation. Commits on submit (Enter) and on blur.
 */
function SearchBox({
  initial,
  onSearch,
}: {
  initial: string;
  onSearch: (value: string) => void;
}) {
  return (
    <form
      className="relative flex-1 sm:max-w-xs"
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem(
          "search",
        ) as HTMLInputElement;
        onSearch(input.value.trim());
      }}
    >
      <SearchIcon className="text-muted-2 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base" />
      <input
        name="search"
        type="search"
        defaultValue={initial}
        placeholder="Search paintings…"
        aria-label="Search paintings"
        onBlur={(e) => {
          const value = e.target.value.trim();
          if (value !== initial) onSearch(value);
        }}
        className="text-foreground border-border bg-background placeholder:text-muted-2 focus-visible:ring-ring h-10 w-full rounded-md border pr-3 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none"
      />
    </form>
  );
}
