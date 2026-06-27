"use client";

import { useState } from "react";

import { Container } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { resendVerification } from "@/lib/account-api";

/**
 * Soft email-verification prompt shown to signed-in users who haven't confirmed
 * their email. Non-blocking: they can browse and buy; this just nudges + resends.
 */
export function EmailVerificationBanner() {
  const { user, status } = useAuth();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (
    status !== "authenticated" ||
    !user ||
    user.isEmailVerified ||
    dismissed
  ) {
    return null;
  }

  async function resend() {
    setSending(true);
    setError(null);
    try {
      await resendVerification();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-gold-300 bg-gold-50 dark:border-gold-500/30 dark:bg-gold-500/10 border-b">
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
        <span className="text-foreground">
          Please verify your email to secure your account.
        </span>

        {sent ? (
          <span className="font-medium text-green-700 dark:text-green-400">
            Verification email sent — check your inbox.
          </span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={sending}
            className="text-brand-700 hover:text-brand-800 dark:text-gold-300 font-medium underline underline-offset-2 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Resend email"}
          </button>
        )}

        {error ? <span className="text-red-600">{error}</span> : null}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-muted-2 hover:text-foreground ml-auto px-1 text-lg leading-none"
        >
          ×
        </button>
      </Container>
    </div>
  );
}
