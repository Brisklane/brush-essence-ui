"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  ConfirmDialog,
  formatPrice,
  Spinner,
} from "@/components/ui";
import { deletePromotion, listPromotions } from "@/lib/admin-api";
import type { Promotion } from "@/types";

import { PromotionDialog } from "./promotion-dialog";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

function discountLabel(promotion: Promotion): string {
  return promotion.discountType === "Percentage"
    ? `${promotion.value}% off`
    : `${formatPrice(promotion.value, "PKR")} off`;
}

function scopeLabel(promotion: Promotion): string {
  switch (promotion.scope) {
    case "All":
      return "All paintings";
    case "Category":
      return promotion.categoryName ?? "Category";
    case "Paintings":
      return `${promotion.paintingIds.length} painting${promotion.paintingIds.length === 1 ? "" : "s"}`;
    default:
      return "";
  }
}

function windowLabel(promotion: Promotion): string {
  const start = promotion.startsAt ? formatDate(promotion.startsAt) : null;
  const end = promotion.endsAt ? formatDate(promotion.endsAt) : null;
  if (start && end) return `${start} – ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return "Always";
}

export function ManagePromotions() {
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listPromotions()
      .then((result) => {
        if (!cancelled) {
          setPromotions(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Couldn't load promotions.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function upsert(saved: Promotion) {
    setPromotions((current) => {
      const list = current ?? [];
      return list.some((p) => p.id === saved.id)
        ? list.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...list];
    });
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deletePromotion(deleting.id);
      setPromotions((current) =>
        (current ?? []).filter((p) => p.id !== deleting.id),
      );
      setDeleting(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>New promotion</Button>
      </div>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-176 text-sm">
          <thead className="bg-surface-2 text-muted text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Promotion</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Applies to</th>
              <th className="px-4 py-3 font-medium">Window</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {promotions === null ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <Spinner className="mx-auto size-6" />
                </td>
              </tr>
            ) : promotions.length > 0 ? (
              promotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-surface-2/50">
                  <td className="text-foreground px-4 py-3 font-medium">
                    {promotion.name}
                  </td>
                  <td className="px-4 py-3">{discountLabel(promotion)}</td>
                  <td className="text-muted px-4 py-3">{scopeLabel(promotion)}</td>
                  <td className="text-muted px-4 py-3">{windowLabel(promotion)}</td>
                  <td className="px-4 py-3">
                    {promotion.isLive ? (
                      <Badge variant="success" size="sm">
                        Live
                      </Badge>
                    ) : promotion.isActive ? (
                      <Badge variant="neutral" size="sm">
                        Scheduled
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(promotion)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => setDeleting(promotion)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-muted px-4 py-10 text-center">
                  No promotions yet. Create one to start a sale.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {creating ? (
        <PromotionDialog
          promotion={null}
          onClose={() => setCreating(false)}
          onSaved={upsert}
        />
      ) : null}

      {editing ? (
        <PromotionDialog
          promotion={editing}
          onClose={() => setEditing(null)}
          onSaved={upsert}
        />
      ) : null}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this promotion?"
        description="The discount will stop applying immediately."
        confirmLabel="Delete"
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
