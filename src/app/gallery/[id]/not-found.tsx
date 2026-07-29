import Link from "next/link";

import { Container } from "@/components/layout";
import { buttonVariants } from "@/components/ui";

export default function PaintingNotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
        404
      </p>
      <h1 className="font-display text-foreground text-3xl font-semibold">
        Painting not found
      </h1>
      <p className="text-muted max-w-md">
        This piece may have been sold or is no longer available. Explore the
        rest of the collection instead.
      </p>
      <Link href="/gallery" className={buttonVariants({})}>
        Back to gallery
      </Link>
    </Container>
  );
}
