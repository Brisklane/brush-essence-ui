"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77 6.2 20.84l1.11-6.46-4.7-4.58 6.49-.94L12 2.5z" />
    </svg>
  );
}

const sizeClass = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
} as const;

interface StarRatingProps {
  /** Current rating (supports fractions in display mode). */
  value: number;
  /** When provided, renders an interactive 1–5 input. */
  onChange?: (value: number) => void;
  size?: keyof typeof sizeClass;
  className?: string;
  /** Accessible label for the input group. */
  label?: string;
}

/**
 * Reusable star rating. Read-only by default (supports fractional fill for
 * average ratings); pass `onChange` to turn it into a 1–5 picker.
 */
export function StarRating({
  value,
  onChange,
  size = "md",
  className,
  label = "Rating",
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  // ----- Interactive input -----
  if (onChange) {
    const active = hover ?? value;
    return (
      <div
        role="radiogroup"
        aria-label={label}
        className={cn("inline-flex items-center gap-1", sizeClass[size], className)}
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onClick={() => onChange(star)}
            className={cn(
              "transition-colors",
              star <= active ? "text-gold-500" : "text-muted-2 hover:text-gold-400",
            )}
          >
            <Star />
          </button>
        ))}
      </div>
    );
  }

  // ----- Read-only display (fractional) -----
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      className={cn("relative inline-flex", sizeClass[size], className)}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      <span className="text-muted-2 inline-flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} />
        ))}
      </span>
      <span
        className="text-gold-500 absolute inset-0 inline-flex overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} />
        ))}
      </span>
    </span>
  );
}
