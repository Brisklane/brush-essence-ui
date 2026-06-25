"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Container } from "@/components/layout";
import { buttonVariants } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user, status } = useAuth();
  const router = useRouter();

  // Belt-and-suspenders: proxy.ts already redirects when there's no session
  // cookie; this also covers a present-but-invalid cookie (failed refresh).
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated" || !user) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <p className="text-stone-600">Loading…</p>
      </Container>
    );
  }

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
        Welcome to {siteConfig.name}
      </h1>
      <p className="max-w-md text-stone-600">
        {user.fullName ? `Hi ${user.fullName}, ` : ""}you&apos;re signed in as{" "}
        {user.email}.
      </p>
      <Link href="/account" className={buttonVariants({})}>
        Go to your account
      </Link>
    </Container>
  );
}
