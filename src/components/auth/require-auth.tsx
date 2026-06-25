"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { Container } from "@/components/layout";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";

/**
 * Client-side auth gate for protected pages. The `proxy` middleware already
 * blocks visitors without a session cookie; this is the fine-grained, in-app
 * guard that waits for the session to hydrate and redirects if it's invalid.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return (
      <Container className="flex justify-center py-24">
        <Spinner className="size-8" />
      </Container>
    );
  }

  return <>{children}</>;
}
