import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { Container } from "@/components/layout";
import { CheckoutView } from "@/components/orders";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your shipping details and place your order.",
};

export default function CheckoutPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Checkout
        </h1>
        <div className="mt-8">
          <RequireAuth>
            <CheckoutView />
          </RequireAuth>
        </div>
      </Container>
    </div>
  );
}
