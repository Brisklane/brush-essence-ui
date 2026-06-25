import { cn } from "@/lib/utils";

/** Formats a numeric amount using the browser's Intl currency formatter. */
export function formatPrice(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    // Fall back gracefully for an unknown/invalid ISO currency code.
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function Price({
  amount,
  currency,
  className,
}: {
  amount: number;
  currency?: string;
  className?: string;
}) {
  return (
    <span className={cn("text-foreground font-semibold", className)}>
      {formatPrice(amount, currency)}
    </span>
  );
}
