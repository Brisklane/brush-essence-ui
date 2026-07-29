"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";

const linkClass =
  "text-muted hover:text-foreground text-sm font-medium transition-colors";

export function AuthNav() {
  const { user, status, logout } = useAuth();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div
        className="bg-surface-2 h-9 w-20 animate-pulse rounded-md"
        aria-hidden
      />
    );
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (status === "authenticated" && user) {
    return (
      <div className="flex items-center gap-4">
        {user.roles.includes("Admin") ? (
          <Link href="/admin" className={linkClass}>
            Admin
          </Link>
        ) : null}
        <Link href="/custom-requests" className={linkClass}>
          Custom Painting
        </Link>
        <Link href="/orders" className={linkClass}>
          Orders
        </Link>
        <Link href="/account" className={linkClass}>
          Account
        </Link>
        <button type="button" onClick={handleLogout} className={linkClass}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className={linkClass}>
        Sign in
      </Link>
      <Link href="/register" className={buttonVariants({ size: "sm" })}>
        Sign up
      </Link>
    </div>
  );
}
