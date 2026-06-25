import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/layout";
import { OrderDetails } from "@/components/orders";

export const metadata: Metadata = {
  title: "Order details",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <RequireAuth>
          <OrderDetails orderId={id} />
        </RequireAuth>
      </Container>
    </div>
  );
}
