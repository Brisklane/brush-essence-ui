"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import {
  getMyReview,
  getReviewSummary,
  listReviews,
} from "@/lib/reviews-api";
import { cn } from "@/lib/utils";
import type { PagedResult, Review, ReviewSummary } from "@/types";

import { ReviewForm } from "./review-form";
import { ReviewsList } from "./reviews-list";
import { StarRating } from "./star-rating";

const STATUS_NOTE: Record<Review["status"], string> = {
  Pending: "Your review is awaiting moderation and will appear once approved.",
  Approved: "Your review is published. Thank you!",
  Rejected: "Your review wasn't approved for publication.",
};

export function ReviewsSection({ paintingId }: { paintingId: string }) {
  const { status: authStatus } = useAuth();
  const pathname = usePathname();

  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [page, setPage] = useState<PagedResult<Review> | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Load the summary + first page once.
  useEffect(() => {
    let cancelled = false;
    getReviewSummary(paintingId)
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [paintingId]);

  useEffect(() => {
    let cancelled = false;
    listReviews(paintingId, pageNumber)
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [paintingId, pageNumber]);

  // Load the caller's own review once authenticated.
  useEffect(() => {
    if (authStatus !== "authenticated") {
      return;
    }
    let cancelled = false;
    getMyReview(paintingId)
      .then((data) => {
        if (!cancelled) setMyReview(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [paintingId, authStatus]);

  return (
    <section className="mt-16">
      <h2 className="font-display text-foreground text-2xl font-semibold">
        Reviews
      </h2>

      {/* Summary */}
      <div className="mt-5 grid gap-8 sm:grid-cols-[16rem_1fr]">
        <div className="border-border bg-surface rounded-xl border p-5">
          {summary && summary.count > 0 ? (
            <>
              <div className="flex items-end gap-3">
                <span className="text-foreground text-4xl font-semibold">
                  {summary.average.toFixed(1)}
                </span>
                <span className="text-muted-2 pb-1 text-sm">out of 5</span>
              </div>
              <StarRating value={summary.average} className="mt-1" />
              <p className="text-muted mt-1 text-sm">
                {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </p>

              <ul className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.distribution[String(star)] ?? 0;
                  const pct =
                    summary.count > 0 ? (count / summary.count) * 100 : 0;
                  return (
                    <li key={star} className="flex items-center gap-2 text-xs">
                      <span className="text-muted w-6">{star}★</span>
                      <span className="bg-surface-2 h-1.5 flex-1 overflow-hidden rounded-full">
                        <span
                          className="bg-gold-500 block h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="text-muted-2 w-6 text-right">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p className="text-muted text-sm">No reviews yet.</p>
          )}
        </div>

        {/* Write-a-review / status */}
        <div>
          {authStatus === "loading" ? (
            <Spinner className="size-5" />
          ) : authStatus !== "authenticated" ? (
            <div className="border-border rounded-xl border border-dashed p-5">
              <p className="text-muted text-sm">
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="text-brand-700 hover:text-brand-800 font-medium"
                >
                  Sign in
                </Link>{" "}
                to share your thoughts on this piece.
              </p>
            </div>
          ) : myReview ? (
            <div className="border-border bg-surface rounded-xl border p-5">
              <div className="flex items-center justify-between gap-3">
                <StarRating value={myReview.rating} />
                <span className="text-muted-2 text-xs">Your review</span>
              </div>
              {myReview.title ? (
                <p className="text-foreground mt-2 font-medium">
                  {myReview.title}
                </p>
              ) : null}
              {myReview.comment ? (
                <p className="text-muted mt-1 text-sm whitespace-pre-line">
                  {myReview.comment}
                </p>
              ) : null}
              <p className="text-muted-2 mt-3 text-xs">
                {STATUS_NOTE[myReview.status]}
              </p>
            </div>
          ) : (
            <ReviewForm paintingId={paintingId} onSubmitted={setMyReview} />
          )}
        </div>
      </div>

      {/* List */}
      <div className="mt-8">
        {page && page.items.length > 0 ? (
          <>
            <ReviewsList reviews={page.items} />
            {page.totalPages > 1 ? (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!page.hasPrevious}
                  onClick={() => setPageNumber((n) => n - 1)}
                >
                  Previous
                </Button>
                <span className="text-muted text-sm">
                  Page {page.page} of {page.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!page.hasNext}
                  onClick={() => setPageNumber((n) => n + 1)}
                >
                  Next
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <p className={cn("text-muted text-sm", page ? "" : "hidden")}>
            Be the first to review this painting.
          </p>
        )}
      </div>
    </section>
  );
}
