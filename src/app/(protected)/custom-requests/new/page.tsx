import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { NewCustomRequestView } from "@/components/custom-requests";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "New custom request",
  description: "Commission a one-of-a-kind painting made just for you.",
};

export default function NewCustomRequestPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Commission a custom painting
          </h1>
          <p className="text-muted mt-2">
            Tell us what you have in mind and the artist will be in touch.
          </p>
        </div>
        <div className="mt-8">
          <RequireAuth>
            <NewCustomRequestView />
          </RequireAuth>
        </div>
      </Container>
    </div>
  );
}
