"use client";

import { useEffect, useMemo, useState } from "react";

import { FormCheckbox, FormField, FormSelect } from "@/components/forms";
import { Button, Input } from "@/components/ui";
import {
  createPromotion,
  updatePromotion,
} from "@/lib/admin-api";
import { listCategories, listPaintings } from "@/lib/catalog-api";
import { cn } from "@/lib/utils";
import type {
  Category,
  DiscountType,
  Painting,
  Promotion,
  PromotionScope,
  SavePromotionPayload,
} from "@/types";

interface PromotionDialogProps {
  promotion: Promotion | null;
  onClose: () => void;
  onSaved: (promotion: Promotion) => void;
}

/** Formats an ISO timestamp for a `datetime-local` input (local time). */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toIso(input: string): string | null {
  return input ? new Date(input).toISOString() : null;
}

/** Create or edit a discount promotion. */
export function PromotionDialog({
  promotion,
  onClose,
  onSaved,
}: PromotionDialogProps) {
  const [name, setName] = useState(promotion?.name ?? "");
  const [discountType, setDiscountType] = useState<DiscountType>(
    promotion?.discountType ?? "Percentage",
  );
  const [value, setValue] = useState(promotion ? String(promotion.value) : "");
  const [scope, setScope] = useState<PromotionScope>(promotion?.scope ?? "All");
  const [categoryId, setCategoryId] = useState(promotion?.categoryId ?? "");
  const [paintingIds, setPaintingIds] = useState<string[]>(
    promotion?.paintingIds ?? [],
  );
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);
  const [startsAt, setStartsAt] = useState(toLocalInput(promotion?.startsAt ?? null));
  const [endsAt, setEndsAt] = useState(toLocalInput(promotion?.endsAt ?? null));

  const [categories, setCategories] = useState<Category[]>([]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [paintingSearch, setPaintingSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listCategories()
      .then((result) => {
        if (!cancelled) setCategories(result);
      })
      .catch(() => {});
    listPaintings({ pageSize: 200, isPublished: true })
      .then((result) => {
        if (!cancelled) setPaintings(result.items);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPaintings = useMemo(() => {
    const term = paintingSearch.trim().toLowerCase();
    return term
      ? paintings.filter((p) => p.title.toLowerCase().includes(term))
      : paintings;
  }, [paintings, paintingSearch]);

  function togglePainting(id: string) {
    setPaintingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function save() {
    const numeric = Number(value);
    if (!name.trim()) {
      setError("Give the promotion a name.");
      return;
    }
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError("Enter a discount value greater than 0.");
      return;
    }
    if (discountType === "Percentage" && numeric > 100) {
      setError("A percentage discount can't exceed 100.");
      return;
    }
    if (scope === "Category" && !categoryId) {
      setError("Choose a category for a category-wide promotion.");
      return;
    }
    if (scope === "Paintings" && paintingIds.length === 0) {
      setError("Select at least one painting.");
      return;
    }
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      setError("The end date must be after the start date.");
      return;
    }

    const payload: SavePromotionPayload = {
      name: name.trim(),
      discountType,
      value: numeric,
      scope,
      categoryId: scope === "Category" ? categoryId : null,
      paintingIds: scope === "Paintings" ? paintingIds : [],
      isActive,
      startsAt: toIso(startsAt),
      endsAt: toIso(endsAt),
    };

    setSaving(true);
    setError(null);
    try {
      const saved = promotion
        ? await updatePromotion(promotion.id, payload)
        : await createPromotion(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save the promotion.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4">
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="border-border bg-surface relative my-8 w-full max-w-lg rounded-xl border p-6 shadow-xl"
      >
        <h2 className="text-foreground text-lg font-semibold">
          {promotion ? "Edit promotion" : "New promotion"}
        </h2>

        <div className="mt-5 space-y-4">
          <FormField
            id="promo-name"
            label="Name"
            placeholder="e.g. Summer Sale"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              id="promo-type"
              label="Discount type"
              value={discountType}
              onChange={(event) =>
                setDiscountType(event.target.value as DiscountType)
              }
            >
              <option value="Percentage">Percentage (%)</option>
              <option value="FixedAmount">Fixed amount (PKR)</option>
            </FormSelect>
            <FormField
              id="promo-value"
              label={discountType === "Percentage" ? "Percent off" : "Amount off (PKR)"}
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>

          <FormSelect
            id="promo-scope"
            label="Applies to"
            value={scope}
            onChange={(event) => setScope(event.target.value as PromotionScope)}
          >
            <option value="All">All paintings</option>
            <option value="Category">A category</option>
            <option value="Paintings">Specific paintings</option>
          </FormSelect>

          {scope === "Category" ? (
            <FormSelect
              id="promo-category"
              label="Category"
              value={categoryId ?? ""}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">Select a category…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>
          ) : null}

          {scope === "Paintings" ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-foreground text-sm font-medium">
                Paintings ({paintingIds.length} selected)
              </span>
              <Input
                placeholder="Search paintings…"
                value={paintingSearch}
                onChange={(event) => setPaintingSearch(event.target.value)}
              />
              <div className="border-border max-h-48 overflow-y-auto rounded-lg border p-2">
                {filteredPaintings.length > 0 ? (
                  filteredPaintings.map((painting) => (
                    <label
                      key={painting.id}
                      className="text-foreground hover:bg-surface-2 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="accent-brand-600 h-4 w-4 rounded"
                        checked={paintingIds.includes(painting.id)}
                        onChange={() => togglePainting(painting.id)}
                      />
                      <span className="truncate">{painting.title}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-muted px-2 py-1.5 text-sm">
                    No paintings found.
                  </p>
                )}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="promo-starts"
              label="Starts (optional)"
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
            />
            <FormField
              id="promo-ends"
              label="Ends (optional)"
              type="datetime-local"
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
            />
          </div>

          <FormCheckbox
            id="promo-active"
            label="Active"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className={cn("mt-6 flex justify-end gap-3")}>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : promotion ? "Save changes" : "Create promotion"}
          </Button>
        </div>
      </div>
    </div>
  );
}
