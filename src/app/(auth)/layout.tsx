import type { ReactNode } from "react";

import { BrandMark, Container } from "@/components/layout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Subtle gallery-wall backdrop to match the storefront. */}
      <div className="from-brand-100 to-surface-2 dark:from-surface-2 dark:to-background absolute inset-0 -z-10 bg-linear-to-br" />
      <Container className="flex min-h-[80vh] flex-col items-center justify-center py-16">
        <BrandMark className="mb-8" />
        <div className="border-border bg-surface w-full max-w-md rounded-2xl border p-8 shadow-lg">
          {children}
        </div>
      </Container>
    </div>
  );
}
