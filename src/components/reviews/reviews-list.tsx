import type { Review } from "@/types";

import { StarRating } from "./star-rating";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

/** Read-only list of approved reviews. */
export function ReviewsList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="divide-border divide-y">
      {reviews.map((review) => (
        <li key={review.id} className="py-5">
          <div className="flex items-center justify-between gap-3">
            <StarRating value={review.rating} size="sm" />
            <span className="text-muted-2 text-xs">
              {formatDate(review.createdAt)}
            </span>
          </div>
          {review.title ? (
            <p className="text-foreground mt-2 font-medium">{review.title}</p>
          ) : null}
          {review.comment ? (
            <p className="text-muted mt-1 text-sm leading-relaxed whitespace-pre-line">
              {review.comment}
            </p>
          ) : null}
          <p className="text-muted-2 mt-2 text-xs">— {review.authorName}</p>
        </li>
      ))}
    </ul>
  );
}
