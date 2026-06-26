"use client";

import { useState } from "react";

import { FormField, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui";
import { createReview } from "@/lib/reviews-api";
import type { Review } from "@/types";

import { StarRating } from "./star-rating";

export function ReviewForm({
  paintingId,
  onSubmitted,
}: {
  paintingId: string;
  onSubmitted: (review: Review) => void;
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const review = await createReview(paintingId, {
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
      });
      onSubmitted(review);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't submit your review.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-5"
    >
      <h3 className="text-foreground font-semibold">Write a review</h3>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <div>
        <span className="text-foreground text-sm font-medium">Your rating</span>
        <div className="mt-1">
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>
      </div>

      <FormField
        id="review-title"
        label="Title (optional)"
        value={title}
        maxLength={150}
        onChange={(event) => setTitle(event.target.value)}
      />
      <FormTextarea
        id="review-comment"
        label="Review (optional)"
        rows={4}
        value={comment}
        maxLength={2000}
        placeholder="What did you think of this piece?"
        onChange={(event) => setComment(event.target.value)}
      />

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Submitting…" : "Submit review"}
      </Button>
      <p className="text-muted-2 text-xs">
        Reviews are checked before they appear publicly.
      </p>
    </form>
  );
}
