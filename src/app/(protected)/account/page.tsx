"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Link from "next/link";

import { Container } from "@/components/layout";
import { Button, buttonVariants } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const { user, status, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/account");
    }
  }, [status, router]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (status !== "authenticated" || !user) {
    return (
      <Container className="py-16">
        <p className="text-muted">Loading…</p>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-foreground text-2xl font-semibold">Your account</h1>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Email</dt>
            <dd className="text-foreground">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Name</dt>
            <dd className="text-foreground">{user.fullName ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Roles</dt>
            <dd className="text-foreground">{user.roles.join(", ") || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Email verified</dt>
            <dd className="text-foreground">{user.isEmailVerified ? "Yes" : "No"}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/orders" className={cn(buttonVariants({}))}>
            View your orders
          </Link>
          <Link
            href="/custom-requests"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Custom requests
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </Container>
  );
}
