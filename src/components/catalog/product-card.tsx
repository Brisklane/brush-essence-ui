import Link from "next/link";

import { StarRating } from "@/components/reviews";
import { Badge, buttonVariants, PriceTag } from "@/components/ui";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import type { Painting } from "@/types";

/** A single catalogue tile: framed thumbnail, title, rating, price and CTA. */
export function ProductCard({ painting }: { painting: Painting }) {
  const href = `/gallery/${painting.id}`;
  const image = resolveImageUrl(painting.imageUrl);
  const soldOut = painting.stockQuantity <= 0;

  return (
    <article className="group border-border bg-surface flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={href}
        className="bg-surface-2 relative block aspect-4/5 overflow-hidden"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- API-origin image; next/image remote config intentionally avoided.
          <img
            src={image}
            alt={painting.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-2 flex h-full w-full items-center justify-center text-sm">
            No image
          </div>
        )}

        {/* Gold inner frame to evoke a hung, framed painting. */}
        <span className="ring-gold-500/20 group-hover:ring-gold-500/40 pointer-events-none absolute inset-0 rounded-none ring-1 ring-inset transition-colors" />

        {!soldOut &&
        painting.discountedPrice != null &&
        painting.discountedPrice < painting.price ? (
          <span className="absolute top-3 right-3">
            <Badge variant="danger" size="md">
              Sale
            </Badge>
          </span>
        ) : null}

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
        <h3 className="font-display text-foreground line-clamp-1 text-xl font-semibold tracking-normal">
          <Link
            href={href}
            className="transition-colors hover:text-brand-700 dark:hover:text-gold-300"
          >
            {painting.title}
          </Link>
        </h3>
        <p className="text-muted mt-0.5 line-clamp-1 text-sm">
          {painting.mediumName ?? "Oil on canvas"}
        </p>

        {painting.ratingCount > 0 ? (
          <div className="mt-2 flex items-center gap-1.5">
            <StarRating value={painting.averageRating} size="sm" />
            <span className="text-muted-2 text-xs">({painting.ratingCount})</span>
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-2">
          <PriceTag
            price={painting.price}
            discountedPrice={painting.discountedPrice}
            currency={painting.currency}
            className="text-lg"
          />
        </div>

        <Link
          href={href}
          className={cn(buttonVariants({ size: "sm" }), "mt-4 w-full")}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
