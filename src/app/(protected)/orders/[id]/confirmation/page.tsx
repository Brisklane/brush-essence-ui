import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/layout";
import { OrderConfirmation } from "@/components/orders";

export const metadata: Metadata = {
  title: "Order confirmed",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <RequireAuth>
          <OrderConfirmation orderId={id} />
        </RequireAuth>
      </Container>
    </div>
  );
}
