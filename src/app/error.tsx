"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout";
import { Button } from "@/components/ui";

/**
 * Segment-level error boundary. Catches runtime errors thrown while rendering a
 * route and offers a recovery action instead of a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced to the browser console; a real deployment would forward this to
    // an error-reporting service (e.g. Sentry) here.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-display text-foreground text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="text-muted mt-2 max-w-md">
        An unexpected error occurred. You can try again, or head back to the
        gallery.
      </p>
      {error.digest ? (
        <p className="text-muted-2 mt-2 text-xs">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </Container>
  );
}
