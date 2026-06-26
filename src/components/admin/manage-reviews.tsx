"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { StarRating } from "@/components/reviews";
import {
  Badge,
  Button,
  ConfirmDialog,
  Input,
  Select,
  Spinner,
  type BadgeProps,
} from "@/components/ui";
import {
  deleteReview,
  listAdminReviews,
  updateReviewStatus,
} from "@/lib/admin-api";
import type { AdminReviewListItem, PagedResult, ReviewStatus } from "@/types";

import { AdminPagination } from "./admin-pagination";
import { ReviewEditDialog } from "./review-edit-dialog";

const STATUSES: ReviewStatus[] = ["Pending", "Approved", "Rejected"];

function statusVariant(status: ReviewStatus): NonNullable<BadgeProps["variant"]> {
  return status === "Approved"
    ? "success"
    : status === "Rejected"
      ? "danger"
      : "neutral";
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function ManageReviews() {
  const [data, setData] = useState<PagedResult<AdminReviewListItem> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminReviewListItem | null>(null);
  const [deleting, setDeleting] = useState<AdminReviewListItem | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReviewStatus | "">("");

  // State is set in async callbacks (not synchronously in the effect body).
  useEffect(() => {
    let cancelled = false;
    listAdminReviews({
      page,
      search: search.trim() || undefined,
      status: status || undefined,
    })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Couldn't load reviews.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, status]);

  function replaceRow(updated: AdminReviewListItem) {
    setData((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item.id === updated.id ? updated : item,
            ),
          }
        : current,
    );
  }

  async function setStatusFor(review: AdminReviewListItem, next: ReviewStatus) {
    setBusyId(review.id);
    try {
      replaceRow(await updateReviewStatus(review.id, next));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      await deleteReview(deleting.id);
      setData((current) =>
        current
          ? {
              ...current,
              items: current.items.filter((item) => item.id !== deleting.id),
              totalCount: current.totalCount - 1,
            }
          : current,
      );
      setDeleting(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search painting, email or text…"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          className="max-w-xs"
        />
        <Select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as ReviewStatus | "");
          }}
          className="max-w-48"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Review</th>
              <th className="px-4 py-3 font-medium">Painting</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {loading && !data ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center">
                  <Spinner className="mx-auto size-6" />
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((review) => (
                <tr key={review.id} className="hover:bg-surface-2/50 align-top">
                  <td className="px-4 py-3">
                    <StarRating value={review.rating} size="sm" />
                    {review.title ? (
                      <p className="text-foreground mt-1 font-medium">
                        {review.title}
                      </p>
                    ) : null}
                    {review.comment ? (
                      <p className="text-muted mt-1 line-clamp-2 max-w-md text-xs">
                        {review.comment}
                      </p>
                    ) : null}
                    <p className="text-muted-2 mt-1 text-xs">
                      {review.customerEmail} · {formatDate(review.createdAt)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/gallery/${review.paintingId}`}
                      className="text-brand-700 hover:text-brand-800 text-sm"
                    >
                      {review.paintingTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(review.status)} size="sm">
                      {review.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      {review.status !== "Approved" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === review.id}
                          onClick={() => setStatusFor(review, "Approved")}
                        >
                          Approve
                        </Button>
                      ) : null}
                      {review.status !== "Rejected" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === review.id}
                          onClick={() => setStatusFor(review, "Rejected")}
                        >
                          Reject
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        disabled={busyId === review.id}
                        onClick={() => setDeleting(review)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-muted px-4 py-10 text-center">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data ? (
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          hasPrevious={data.hasPrevious}
          hasNext={data.hasNext}
          onPage={setPage}
        />
      ) : null}

      {editing ? (
        <ReviewEditDialog
          review={editing}
          onClose={() => setEditing(null)}
          onSaved={replaceRow}
        />
      ) : null}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this review?"
        description="The review will be permanently removed."
        confirmLabel="Delete"
        loading={busyId === deleting?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
