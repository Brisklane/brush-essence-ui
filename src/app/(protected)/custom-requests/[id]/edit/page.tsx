import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { EditCustomRequestView } from "@/components/custom-requests";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Edit custom request",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCustomRequestPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Edit your request
          </h1>
        </div>
        <div className="mt-8">
          <RequireAuth>
            <EditCustomRequestView requestId={id} />
          </RequireAuth>
        </div>
      </Container>
    </div>
  );
}
