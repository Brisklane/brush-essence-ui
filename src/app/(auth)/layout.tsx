import type { ReactNode } from "react";

import { Container } from "@/components/layout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </Container>
  );
}
