import type { Metadata } from "next";
import Link from "next/link";

import { RequireAuth } from "@/components/auth/require-auth";
import { RequestHistory } from "@/components/custom-requests";
import { Container } from "@/components/layout";
import { buttonVariants, PlusIcon } from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom requests",
  description: "Your custom painting requests and their progress.",
};

export default function CustomRequestsPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Custom requests
          </h1>
          <Link href="/custom-requests/new" className={cn(buttonVariants({}))}>
            <PlusIcon /> New request
          </Link>
        </div>
        <div className="mt-8">
          <RequireAuth>
            <RequestHistory />
          </RequireAuth>
        </div>
      </Container>
    </div>
  );
}
