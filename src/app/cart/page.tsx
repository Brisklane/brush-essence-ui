import type { Metadata } from "next";

import { CartView } from "@/components/cart";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the paintings in your cart before checking out.",
};

export default function CartPage() {
  return (
    <div className="py-8 sm:py-12">
      <Container>
        <h1 className="font-display text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          Your cart
        </h1>
        <div className="mt-8">
          <CartView />
        </div>
      </Container>
    </div>
  );
}
