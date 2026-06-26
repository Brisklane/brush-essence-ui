"use client";

import { useState } from "react";

import { FormField, FormTextarea } from "@/components/forms";
import { StarRating } from "@/components/reviews";
import { Button } from "@/components/ui";
import { updateReview } from "@/lib/admin-api";
import type { AdminReviewListItem } from "@/types";

interface ReviewEditDialogProps {
  review: AdminReviewListItem;
  onClose: () => void;
  onSaved: (review: AdminReviewListItem) => void;
}

/** Modal for an admin to edit a review's rating and text. */
export function ReviewEditDialog({
  review,
  onClose,
  onSaved,
}: ReviewEditDialogProps) {
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title ?? "");
  const [comment, setComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateReview(review.id, {
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
      });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save changes.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="border-border bg-surface relative w-full max-w-md rounded-xl border p-6 shadow-xl"
      >
        <h2 className="text-foreground text-lg font-semibold">Edit review</h2>
        <p className="text-muted mt-1 text-sm">{review.paintingTitle}</p>

        <div className="mt-4 space-y-4">
          <div>
            <span className="text-foreground text-sm font-medium">Rating</span>
            <div className="mt-1">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>
          <FormField
            id="edit-review-title"
            label="Title"
            value={title}
            maxLength={150}
            onChange={(event) => setTitle(event.target.value)}
          />
          <FormTextarea
            id="edit-review-comment"
            label="Comment"
            rows={4}
            value={comment}
            maxLength={2000}
            onChange={(event) => setComment(event.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
