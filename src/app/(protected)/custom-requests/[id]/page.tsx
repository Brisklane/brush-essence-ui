import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { RequestDetails } from "@/components/custom-requests";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Request details",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function CustomRequestDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <RequireAuth>
          <RequestDetails requestId={id} />
        </RequireAuth>
      </Container>
    </div>
  );
}
