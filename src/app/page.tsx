import Link from "next/link";

import { ProductCard } from "@/components/catalog";
import { Container } from "@/components/layout";
import { buttonVariants } from "@/components/ui";
import { fetchCatalog } from "@/lib/storefront";
import { cn } from "@/lib/utils";
import type { Painting } from "@/types";

// Reflect new paintings without a redeploy.
export const dynamic = "force-dynamic";

async function safeCatalog(
  params: Parameters<typeof fetchCatalog>[0],
): Promise<Painting[]> {
  try {
    return (await fetchCatalog(params)).items;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    safeCatalog({ pageSize: 4, sort: "priceDesc" }),
    safeCatalog({ pageSize: 8, sort: "newest" }),
  ]);

  return (
    <div>
      <Hero />

      {featured.length > 0 ? (
        <Section
          eyebrow="Curated"
          title="Featured Paintings"
          description="A handpicked selection of signature pieces from the studio."
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} painting={p} />
            ))}
          </div>
        </Section>
      ) : null}

      {newArrivals.length > 0 ? (
        <Section
          eyebrow="Fresh off the easel"
          title="New Arrivals"
          description="The latest originals to join the collection."
          muted
        >
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} painting={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery" className={buttonVariants({ size: "lg" })}>
              View the full gallery
            </Link>
          </div>
        </Section>
      ) : null}

      {featured.length === 0 && newArrivals.length === 0 ? (
        <Container className="py-20 text-center">
          <h2 className="font-display text-foreground text-2xl font-semibold">
            The gallery is being hung
          </h2>
          <p className="text-muted mx-auto mt-2 max-w-md">
            New paintings are on their way. Please check back soon.
          </p>
        </Container>
      ) : null}

      <ArtistStory />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Dependency-free gallery-wall backdrop. */}
      <div className="from-brand-100 to-surface-2 dark:from-surface-2 dark:to-background absolute inset-0 bg-linear-to-br" />
      <div className="bg-gold-500/10 absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-brand-500/10 absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl" />

      <Container className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center sm:py-28">
        <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
          Original Oil Paintings
        </p>
        <h1 className="font-display text-foreground max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Discover Hand-Painted Masterpieces
        </h1>
        <p className="text-muted max-w-xl text-base sm:text-lg">
          Every canvas is an original, painted by hand and made to be lived with.
          Find the one that belongs on your wall.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/gallery" className={buttonVariants({ size: "lg" })}>
            Explore the Gallery
          </Link>
          <Link
            href="/gallery?sort=newest"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            See New Arrivals
          </Link>
        </div>
      </Container>
    </section>
  );
}

function Section({
  eyebrow,
  title,
  description,
  muted,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("py-16 sm:py-20", muted && "bg-surface-2/40")}>
      <Container>
        <div className="mb-10 text-center">
          <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="text-muted mx-auto mt-3 max-w-xl text-sm sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

function ArtistStory() {
  return (
    <section className="bg-surface-2/40 py-16 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
            The Artist&apos;s Story
          </p>
          <h2 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight">
            Painted by hand, made to last
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            Each piece in this collection is an original oil painting on canvas —
            no prints, no reproductions. From first sketch to final varnish, every
            work is created by hand, capturing light, texture and emotion that a
            screen can only hint at.
          </p>
          <div className="mt-6">
            <Link
              href="/gallery"
              className={buttonVariants({ variant: "gold" })}
            >
              Browse the collection
            </Link>
          </div>
        </div>
        <div className="border-border bg-surface relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-sm">
          <div className="from-brand-200/40 to-gold-500/20 absolute inset-0 bg-linear-to-br" />
          <div className="text-muted absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl">Brush Essence Studio</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
