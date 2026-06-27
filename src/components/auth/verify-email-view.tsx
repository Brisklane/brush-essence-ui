"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { verifyEmail } from "@/lib/account-api";

type State = "verifying" | "success" | "error";

export function VerifyEmailView() {
  const params = useSearchParams();
  const token = params.get("token");
  const { refreshSession } = useAuth();

  const [state, setState] = useState<State>(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "" : "This verification link is missing its token.",
  );
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;

    verifyEmail(token)
      .then(() => {
        setState("success");
        // Refresh the cached profile so the "verify your email" banner clears.
        return refreshSession();
      })
      .catch((err: unknown) => {
        setState("error");
        setMessage(
          err instanceof Error
            ? err.message
            : "This verification link is invalid or has expired.",
        );
      });
  }, [token, refreshSession]);

  if (state === "verifying") {
    return (
      <div className="flex items-center gap-3 text-muted">
        <Spinner className="size-5" />
        <span>Verifying your email…</span>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Email verified
          </h1>
          <p className="text-muted mt-1 text-sm">
            Thanks — your email address is confirmed. Your account is all set.
          </p>
        </div>
        <Link href="/">
          <Button>Continue to Brush Essence</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">
          We couldn&apos;t verify your email
        </h1>
        <p className="text-muted mt-1 text-sm">{message}</p>
      </div>
      <p className="text-muted text-sm">
        Signed in? You can request a fresh link from the banner at the top of the
        page. Otherwise{" "}
        <Link href="/login" className="text-brand-700 hover:text-brand-800">
          sign in
        </Link>{" "}
        and try again.
      </p>
    </div>
  );
}
