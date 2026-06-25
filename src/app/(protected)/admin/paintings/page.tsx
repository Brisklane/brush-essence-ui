"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, buttonVariants, ConfirmDialog, Input } from "@/components/ui";
import { deletePainting, listPaintings } from "@/lib/catalog-api";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { PagedResult, Painting } from "@/types";

const PAGE_SIZE = 10;

export default function PaintingsListPage() {
  const [data, setData] = useState<PagedResult<Painting> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<Painting | null>(null);
  const [deleting, setDeleting] = useState(false);

  // State updates happen only in async callbacks, never synchronously in the effect.
  useEffect(() => {
    let cancelled = false;
    listPaintings({ page, pageSize: PAGE_SIZE, search: search || undefined })
      .then((result) => {
        if (!cancelled) {
          setError(null);
          setData(result);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Failed to load paintings.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, reloadKey]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setSearch(searchInput.trim());
  }

  function goToPage(next: number) {
    setLoading(true);
    setPage(next);
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await deletePainting(deleteTarget.id);
      setDeleteTarget(null);
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Failed to delete painting.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-foreground text-2xl font-semibold">Paintings</h1>
        <Link href="/admin/paintings/new" className={buttonVariants({})}>
          Add painting
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <Input
          placeholder="Search by title or description…"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((painting) => {
                const image = resolveImageUrl(painting.imageUrl);
                return (
                  <tr
                    key={painting.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-3">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={painting.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-surface-2" />
                      )}
                    </td>
                    <td className="text-foreground p-3 font-medium">
                      {painting.title}
                    </td>
                    <td className="p-3 text-muted">
                      {painting.categoryName ?? "—"}
                    </td>
                    <td className="p-3 text-muted">
                      {painting.currency} {painting.price.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          painting.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-surface-2 text-muted",
                        )}
                      >
                        {painting.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/paintings/${painting.id}/edit`}
                          className="text-brand-700 hover:text-brand-800 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(painting)}
                          className="font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  No paintings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {data.page} of {data.totalPages} · {data.totalCount} total
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.hasPrevious}
              onClick={() => goToPage(Math.max(1, page - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.hasNext}
              onClick={() => goToPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete painting?"
        description={
          deleteTarget
            ? `“${deleteTarget.title}” will be permanently removed. This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
