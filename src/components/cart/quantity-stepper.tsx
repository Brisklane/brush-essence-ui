"use client";

import { MinusIcon, PlusIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  /** Lowest selectable quantity (1 in the cart; never below 1). */
  min?: number;
  /** Highest selectable quantity, typically the painting's stock. */
  max: number;
  disabled?: boolean;
  onChange: (next: number) => void;
  className?: string;
}

/**
 * Accessible −/+ quantity control shared by the product page and the cart. It
 * never emits a value outside [min, max], so callers can wire it straight to a
 * stock-validated action.
 */
export function QuantityStepper({
  value,
  min = 1,
  max,
  disabled = false,
  onChange,
  className,
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div
      className={cn(
        "border-border inline-flex items-center rounded-md border",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className="text-foreground hover:bg-surface-2 inline-flex size-10 items-center justify-center disabled:opacity-40"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
      >
        <MinusIcon />
      </button>
      <span
        aria-live="polite"
        className="text-foreground w-10 text-center text-sm font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="text-foreground hover:bg-surface-2 inline-flex size-10 items-center justify-center disabled:opacity-40"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
