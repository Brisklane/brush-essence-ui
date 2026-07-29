import Link from "next/link";

import { Container } from "@/components/layout";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <Container className="flex min-h-[55vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
        404
      </p>
      <h1 className="font-display text-foreground text-3xl font-semibold sm:text-4xl">
        This page can&apos;t be found
      </h1>
      <p className="text-muted max-w-md">
        The page you&apos;re looking for may have moved or never existed.
        Let&apos;s get you back to the art.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/gallery" className={cn(buttonVariants({}))}>
          Browse the gallery
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </Container>
  );
}
