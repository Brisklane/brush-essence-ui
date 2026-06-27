import { cn } from "@/lib/utils";

/**
 * Formats a numeric amount using the browser's Intl currency formatter. The
 * store transacts in a single currency (PKR); callers may still pass a currency
 * (it always arrives as PKR from the API) but it defaults to the store currency.
 */
export function formatPrice(amount: number, currency = "PKR"): string {
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

/**
 * Shows a price, with the original struck through alongside the sale price when
 * a promotion applies (`discountedPrice` below `price`).
 */
export function PriceTag({
  price,
  discountedPrice,
  currency,
  className,
}: {
  price: number;
  discountedPrice?: number | null;
  currency?: string;
  className?: string;
}) {
  const onSale = discountedPrice != null && discountedPrice < price;

  if (!onSale) {
    return (
      <span className={cn("text-foreground inline-block font-semibold", className)}>
        {formatPrice(price, currency)}
      </span>
    );
  }

  return (
    <span className={cn("flex items-baseline gap-2", className)}>
      <span className="text-foreground font-semibold">
        {formatPrice(discountedPrice, currency)}
      </span>
      <span className="text-muted-2 text-sm font-normal line-through">
        {formatPrice(price, currency)}
      </span>
    </span>
  );
}
