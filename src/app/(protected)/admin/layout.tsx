"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Container } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const isAdmin = user?.roles.includes("Admin") ?? false;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/admin");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <Container className="py-16">
        <p className="text-muted">Loading…</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-16">
        <h1 className="text-foreground text-2xl font-semibold">Admin</h1>
        <p className="mt-4 text-red-700">
          403 — this area is restricted to administrators.
        </p>
      </Container>
    );
  }

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
