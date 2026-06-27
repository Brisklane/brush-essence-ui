import type { Metadata } from "next";

import { Container } from "@/components/layout";
import { SupportForm } from "@/components/support/support-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Need help with an order, a commission or your account? Get in touch and the team will be glad to help.",
};

export default function SupportPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.3em] uppercase">
            We&apos;re here to help
          </p>
          <h1 className="font-display text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Support
          </h1>
          <p className="text-muted mt-3">
            Having an issue with an order, a custom commission, or your account?
            Send us a message and we&apos;ll get back to you as soon as we can.
          </p>

          <div className="border-border bg-surface mt-8 rounded-2xl border p-6 shadow-sm sm:p-8">
            <SupportForm />
          </div>

          <p className="text-muted mt-6 text-sm">
            Prefer to email directly? Reach us at{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-brand-700 dark:text-gold-300 font-medium hover:underline"
            >
              {siteConfig.supportEmail}
            </a>
            .
          </p>
        </div>
      </Container>
    </div>
  );
}
