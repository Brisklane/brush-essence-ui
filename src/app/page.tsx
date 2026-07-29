import Link from "next/link";

import { ProductCard } from "@/components/catalog";
import { Container } from "@/components/layout";
import { PromotionCountdown } from "@/components/promotions/promotion-countdown";
import { buttonVariants } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";
import { fetchCatalog } from "@/lib/storefront";
import { cn } from "@/lib/utils";
import type { Painting } from "@/types";

// Organization + WebSite structured data: powers the brand knowledge panel and
// the sitelinks search box in Google. The Product/AggregateRating schema lives
// on each painting page.
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${env.NEXT_PUBLIC_SITE_URL}/#organization`,
      name: siteConfig.name,
      url: env.NEXT_PUBLIC_SITE_URL,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${env.NEXT_PUBLIC_SITE_URL}/#website`,
      name: siteConfig.name,
      url: env.NEXT_PUBLIC_SITE_URL,
      publisher: { "@id": `${env.NEXT_PUBLIC_SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${env.NEXT_PUBLIC_SITE_URL}/gallery?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
      />
      <PromotionCountdown />
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

      <Container className="relative flex min-h-[55vh] flex-col items-center justify-center gap-5 py-16 text-center sm:min-h-[60vh] sm:gap-6 sm:py-24 md:py-32">
        <p className="text-gold-600 dark:text-gold-400 flex items-center gap-3 text-[0.65rem] font-semibold tracking-[0.25em] uppercase sm:text-xs sm:tracking-[0.3em]">
          <span className="bg-gold-500/60 hidden h-px w-8 sm:block" />
          Original Oil Paintings
          <span className="bg-gold-500/60 hidden h-px w-8 sm:block" />
        </p>
        <h1 className="font-display text-foreground max-w-4xl text-4xl leading-[1.08] font-semibold sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl">
          Discover Hand-Painted Masterpieces
        </h1>
        <p className="text-muted max-w-xl text-base sm:text-lg">
          Every canvas is an original, painted by hand and made to be lived
          with. Find the one that belongs on your wall.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/gallery"
            className={buttonVariants({ variant: "gold", size: "lg" })}
          >
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

const STUDIO_PROMISES = [
  {
    title: "100% Hand-Painted",
    text: "Original oils on canvas — never prints or reproductions.",
  },
  {
    title: "Made to Last",
    text: "Hand-varnished, gallery-quality finish built to age beautifully.",
  },
  {
    title: "Ready to Hang",
    text: "Carefully packed and shipped, arriving prepared for your wall.",
  },
];

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
            Each piece in this collection is an original oil painting on canvas
            — no prints, no reproductions. From first sketch to final varnish,
            every work is created by hand, capturing light, texture and emotion
            that a screen can only hint at.
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

        <div className="border-border bg-surface rounded-2xl border p-6 shadow-sm sm:p-8">
          <ul className="divide-border divide-y">
            {STUDIO_PROMISES.map((promise) => (
              <li
                key={promise.title}
                className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span
                  className="bg-gold-500/10 text-gold-600 dark:text-gold-400 mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-lg"
                  aria-hidden
                >
                  ✦
                </span>
                <div>
                  <p className="font-display text-foreground text-lg font-semibold">
                    {promise.title}
                  </p>
                  <p className="text-muted mt-0.5 text-sm leading-relaxed">
                    {promise.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
