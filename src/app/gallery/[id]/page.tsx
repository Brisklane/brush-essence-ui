import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart, ProductCard } from "@/components/catalog";
import { Container } from "@/components/layout";
import { ReviewsSection, StarRating } from "@/components/reviews";
import { Badge, PriceTag } from "@/components/ui";
import { env } from "@/lib/env";
import { resolveImageUrl } from "@/lib/image";
import { fetchCatalog, fetchPainting } from "@/lib/storefront";
import { formatDimensions } from "@/lib/units";
import type { Painting } from "@/types";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const painting = await fetchPainting(id);
  if (!painting) {
    return { title: "Painting not found" };
  }
  const image = resolveImageUrl(painting.imageUrl);
  return {
    title: painting.title,
    description:
      painting.description ??
      `${painting.title} — an original hand-painted oil on canvas.`,
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

async function getRelated(painting: Painting): Promise<Painting[]> {
  if (!painting.categoryId) return [];
  try {
    const page = await fetchCatalog({
      categoryIds: [painting.categoryId],
      pageSize: 5,
    });
    return page.items.filter((p) => p.id !== painting.id).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function PaintingPage({ params }: PageProps) {
  const { id } = await params;
  const painting = await fetchPainting(id);

  if (!painting) {
    notFound();
  }

  const image = resolveImageUrl(painting.imageUrl);
  const soldOut = painting.stockQuantity <= 0;
  const related = await getRelated(painting);

  // Product structured data (schema.org) for rich search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: painting.title,
    description:
      painting.description ??
      `${painting.title} — an original hand-painted oil on canvas.`,
    image: image ? [image] : undefined,
    category: painting.categoryName ?? undefined,
    offers: {
      "@type": "Offer",
      price: painting.discountedPrice ?? painting.price,
      priceCurrency: painting.currency,
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `${env.NEXT_PUBLIC_SITE_URL}/gallery/${painting.id}`,
    },
    aggregateRating:
      painting.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: painting.averageRating,
            reviewCount: painting.ratingCount,
          }
        : undefined,
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        {/* Breadcrumb */}
        <nav className="text-muted mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span aria-hidden>/</span>
          <Link href="/gallery" className="hover:text-foreground">
            Gallery
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground line-clamp-1">{painting.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-border bg-surface-2 flex items-center justify-center overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-8">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element -- API-origin image; next/image remote config intentionally avoided.
                <img
                  src={image}
                  alt={painting.title}
                  decoding="async"
                  fetchPriority="high"
                  className="max-h-[32rem] w-full rounded-md object-contain shadow-lg"
                />
              ) : (
                <div className="text-muted-2 flex aspect-[4/5] w-full items-center justify-center text-sm">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {painting.categoryName ? (
                <Badge variant="gold" size="md">
                  {painting.categoryName}
                </Badge>
              ) : null}
              <Badge variant={soldOut ? "danger" : "success"} size="md">
                {soldOut ? "Sold" : "Available"}
              </Badge>
            </div>

            <h1 className="font-display text-foreground mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {painting.title}
            </h1>

            {painting.ratingCount > 0 ? (
              <div className="mt-3 flex items-center gap-2">
                <StarRating value={painting.averageRating} size="sm" />
                <span className="text-muted text-sm">
                  {painting.averageRating.toFixed(1)} · {painting.ratingCount}{" "}
                  {painting.ratingCount === 1 ? "review" : "reviews"}
                </span>
              </div>
            ) : null}

            <PriceTag
              price={painting.price}
              discountedPrice={painting.discountedPrice}
              currency={painting.currency}
              className="mt-3 text-2xl"
            />

            <div className="border-border my-6 border-t" />

            {painting.description ? (
              <p className="text-muted leading-relaxed whitespace-pre-line">
                {painting.description}
              </p>
            ) : (
              <p className="text-muted-2 italic">No description provided.</p>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Spec label="Medium" value={painting.mediumName ?? "Oil on canvas"} />
              <Spec
                label="Dimensions"
                value={formatDimensions(painting.widthCm, painting.heightCm)}
              />
              <Spec
                label="Availability"
                value={soldOut ? "Sold out" : `${painting.stockQuantity} in stock`}
              />
            </dl>

            <div className="mt-8">
              <AddToCart
                paintingId={painting.id}
                stockQuantity={painting.stockQuantity}
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection paintingId={painting.id} />

        {/* Related */}
        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-foreground mb-6 text-2xl font-semibold">
              You may also like
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} painting={p} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border rounded-lg border p-3">
      <dt className="text-muted-2 text-xs tracking-wide uppercase">{label}</dt>
      <dd className="text-foreground mt-1 font-medium">{value}</dd>
    </div>
  );
}
