import { formatPrice } from "@/components/ui";

/** Subtotal / shipping / total breakdown shared by confirmation and details. */
export function OrderTotals({
  subtotal,
  shippingCost,
  total,
  currency,
}: {
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="text-foreground tabular-nums">
          {formatPrice(subtotal, currency)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className="text-foreground tabular-nums">
          {shippingCost > 0 ? formatPrice(shippingCost, currency) : "Free"}
        </dd>
      </div>
      <div className="border-border flex justify-between border-t pt-2">
        <dt className="text-foreground font-semibold">Total</dt>
        <dd className="text-foreground text-base font-semibold tabular-nums">
          {formatPrice(total, currency)}
        </dd>
      </div>
    </dl>
  );
}
