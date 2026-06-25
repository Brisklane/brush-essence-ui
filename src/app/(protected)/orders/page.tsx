import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/layout";
import { OrderHistory } from "@/components/orders";

export const metadata: Metadata = {
  title: "Your orders",
  description: "Review your past orders and track their progress.",
};

export default function OrdersPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Your orders
        </h1>
        <div className="mt-8">
          <RequireAuth>
            <OrderHistory />
          </RequireAuth>
        </div>
      </Container>
    </div>
  );
}
