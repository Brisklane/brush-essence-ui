import Link from "next/link";

import { Badge, buttonVariants, formatPrice } from "@/components/ui";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Painting } from "@/types";

/** A single catalogue tile: framed thumbnail, title, category and price. */
export function ProductCard({ painting }: { painting: Painting }) {
  const href = `/gallery/${painting.id}`;
  const image = resolveImageUrl(painting.imageUrl);
  const soldOut = painting.stockQuantity <= 0;

  return (
    <article className="group border-border bg-surface flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={href}
        className="bg-surface-2 relative block aspect-[4/5] overflow-hidden"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- API-origin image; next/image remote config intentionally avoided.
          <img
            src={image}
            alt={painting.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-2 flex h-full w-full items-center justify-center text-sm">
            No image
          </div>
        )}
        {soldOut ? (
          <span className="absolute top-3 left-3">
            <Badge variant="danger" size="md">
              Sold
            </Badge>
          </span>
        ) : painting.categoryName ? (
          <span className="absolute top-3 left-3">
            <Badge variant="gold" size="md">
              {painting.categoryName}
            </Badge>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-foreground line-clamp-1 text-lg font-semibold">
          <Link href={href} className="hover:text-brand-700 dark:hover:text-gold-300">
            {painting.title}
          </Link>
        </h3>
        <p className="text-muted mt-0.5 line-clamp-1 text-sm">
          {painting.medium ?? "Oil on canvas"}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-foreground text-lg font-semibold">
            {formatPrice(painting.price, painting.currency)}
          </span>
          <Link
            href={href}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
