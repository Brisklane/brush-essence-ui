import Link from "next/link";

import { formatPrice } from "@/components/ui";
import { resolveImageUrl } from "@/lib/image";
import type { OrderItem } from "@/types";

/** Read-only list of purchased lines, shared by the confirmation and details pages. */
export function OrderItems({
  items,
  currency,
}: {
  items: OrderItem[];
  currency: string;
}) {
  return (
    <ul className="divide-border divide-y">
      {items.map((item) => {
        const image = resolveImageUrl(item.imageUrl);
        const title = item.paintingId ? (
          <Link
            href={`/gallery/${item.paintingId}`}
            className="text-foreground hover:text-brand-700 dark:hover:text-gold-300 font-medium"
          >
            {item.title}
          </Link>
        ) : (
          <span className="text-foreground font-medium">{item.title}</span>
        );

        return (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <div className="border-border bg-surface-2 size-16 shrink-0 overflow-hidden rounded-lg border">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element -- API-origin image; remote next/image config intentionally avoided.
                <img
                  src={image}
                  alt={item.title}
                  className="size-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              {title}
              <p className="text-muted mt-1 text-sm">
                {formatPrice(item.unitPrice, currency)} × {item.quantity}
              </p>
            </div>

            <span className="text-foreground font-semibold tabular-nums">
              {formatPrice(item.lineTotal, currency)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
