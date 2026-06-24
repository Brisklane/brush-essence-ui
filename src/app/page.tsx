import Link from "next/link";

import { Container } from "@/components/layout";
import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { siteConfig } from "@/config/site";

// Placeholder data — replace with a fetch from the API (`/api/paintings`)
// once the catalogue endpoints are wired up.
const featuredPlaceholders = [
  { id: 1, title: "Untitled Study I", medium: "Oil on canvas · 40 × 60 cm" },
  { id: 2, title: "Untitled Study II", medium: "Oil on canvas · 50 × 70 cm" },
  { id: 3, title: "Untitled Study III", medium: "Oil on canvas · 30 × 40 cm" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="from-brand-50 to-canvas border-b border-stone-200 bg-linear-to-b">
        <Container className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
          <span className="bg-brand-100 text-brand-700 rounded-full px-4 py-1 text-sm font-medium">
            {siteConfig.tagline}
          </span>
          <h1 className="text-ink max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Original oil paintings, made by hand
          </h1>
          <p className="max-w-2xl text-lg text-stone-600">
            {siteConfig.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/gallery" className={buttonVariants({ size: "lg" })}>
              Browse the gallery
            </Link>
            <Link
              href="/about"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Our story
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured paintings */}
      <section className="py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-ink text-3xl font-semibold tracking-tight">
                Featured pieces
              </h2>
              <p className="mt-2 text-stone-600">
                A selection from the latest collection.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-brand-700 hover:text-brand-800 hidden text-sm font-medium sm:block"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlaceholders.map((piece) => (
              <Card key={piece.id}>
                {/* Image placeholder — swap for next/image once assets exist. */}
                <div className="aspect-4/5 w-full bg-linear-to-br from-stone-200 to-stone-300" />
                <CardContent>
                  <CardTitle>{piece.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {piece.medium}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* About block */}
      <section className="border-y border-stone-200 bg-white py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="from-brand-100 to-brand-300 aspect-video w-full rounded-xl bg-linear-to-br" />
          <div className="flex flex-col gap-4">
            <h2 className="text-ink text-3xl font-semibold tracking-tight">
              Every canvas tells a story
            </h2>
            <p className="text-stone-600">
              Each painting is created by hand, one brushstroke at a time. No
              prints, no reproductions — just original artwork ready to find a
              home on your wall.
            </p>
            <div>
              <Link
                href="/about"
                className={buttonVariants({ variant: "secondary" })}
              >
                Learn more
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to action */}
      <section className="py-20">
        <Container className="bg-ink flex flex-col items-center gap-6 rounded-2xl px-8 py-16 text-center">
          <h2 className="text-canvas max-w-2xl text-3xl font-semibold tracking-tight">
            Looking for something specific?
          </h2>
          <p className="max-w-xl text-stone-300">
            Commissions are welcome. Get in touch to discuss a custom piece for
            your space.
          </p>
          <Link href="/contact" className={buttonVariants({ size: "lg" })}>
            Start a commission
          </Link>
        </Container>
      </section>
    </>
  );
}
