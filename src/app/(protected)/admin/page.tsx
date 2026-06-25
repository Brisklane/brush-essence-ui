"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { apiFetch } from "@/lib/api-client";

export default function AdminPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.roles.includes("Admin") ?? false;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/admin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !isAdmin) {
      return;
    }
    apiFetch("/api/admin/overview")
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as { message: string };
          setMessage(data.message);
        } else {
          setError("You do not have access to this area.");
        }
      })
      .catch(() => setError("Failed to reach the server."));
  }, [status, isAdmin]);

  if (status !== "authenticated" || !user) {
    return (
      <Container className="py-16">
        <p className="text-stone-600">Loading…</p>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container className="py-16">
        <h1 className="text-ink text-2xl font-semibold">Admin</h1>
        <p className="mt-4 text-red-700">
          403 — this area is restricted to administrators.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <h1 className="text-ink text-2xl font-semibold">Admin</h1>
      {error ? (
        <p className="mt-4 text-red-700">{error}</p>
      ) : (
        <p className="mt-4 text-stone-600">
          {message ?? "Loading admin data…"}
        </p>
      )}
    </Container>
  );
}
