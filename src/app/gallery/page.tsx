import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogView, ProductGridSkeleton } from "@/components/catalog";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse original, hand-painted oil paintings on canvas. Filter by category and price, sort, and find the piece that speaks to you.",
  // Filter/sort/search produce many query-string variants of this page; point
  // them all at the clean /gallery URL to avoid duplicate-content dilution.
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        <header className="mb-8 text-center">
          <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
            The Collection
          </p>
          <h1 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Art Gallery
          </h1>
          <p className="text-muted mx-auto mt-3 max-w-xl text-sm sm:text-base">
            Each painting is an original, hand-painted oil on canvas — one of a
            kind. Explore the collection and bring fine art home.
          </p>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <CatalogView />
        </Suspense>
      </Container>
    </div>
  );
}
