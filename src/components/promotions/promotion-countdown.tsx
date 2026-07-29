"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout";
import { formatPrice } from "@/components/ui";
import { getActivePromotions } from "@/lib/promotions-api";
import type { ActivePromotion } from "@/types";

function discountLabel(promotion: ActivePromotion): string {
  return promotion.discountType === "Percentage"
    ? `${promotion.value}% off`
    : `${formatPrice(promotion.value)} off`;
}

function scopeLabel(promotion: ActivePromotion): string {
  switch (promotion.scope) {
    case "All":
      return "store-wide";
    case "Category":
      return "on selected pieces";
    case "Paintings":
      return "on selected pieces";
    default:
      return "";
  }
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function timeLeft(endsAtMs: number, nowMs: number): TimeLeft | null {
  const diff = endsAtMs - nowMs;
  if (diff <= 0) return null;
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function TimeChip({ value, unit }: { value: number; unit: string }) {
  return (
    <span className="rounded bg-white/10 px-1.5 py-1 font-mono text-sm tabular-nums">
      {pad(value)}
      <span className="text-gold-300/80 ml-0.5 text-[0.65em]">{unit}</span>
    </span>
  );
}

/**
 * Slim, self-hiding sale banner with a live countdown. Renders nothing until a
 * live promotion is loaded, so there's no layout shift or hydration mismatch.
 */
export function PromotionCountdown() {
  const [promotion, setPromotion] = useState<ActivePromotion | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Load the most urgent live promotion once on mount.
  useEffect(() => {
    let cancelled = false;
    getActivePromotions()
      .then((promotions) => {
        if (!cancelled && promotions.length > 0) {
          setPromotion(promotions[0]);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Tick once a second only while a promotion with an end date is showing.
  useEffect(() => {
    if (!promotion?.endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [promotion?.endsAt]);

  if (!promotion) return null;

  const remaining = promotion.endsAt
    ? timeLeft(new Date(promotion.endsAt).getTime(), now)
    : null;

  // The promotion just expired — hide rather than show a finished sale.
  if (promotion.endsAt && !remaining) return null;

  return (
    <div className="from-brand-950 to-brand-900 border-gold-500/30 border-b bg-linear-to-r text-white">
      <Container className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 text-center text-sm">
        <span className="flex flex-wrap items-center justify-center gap-x-1.5">
          <span className="text-gold-400" aria-hidden>
            ✦
          </span>
          <strong className="font-semibold">{promotion.name}</strong>
          <span className="text-white/80">is live —</span>
          <span className="text-gold-300 font-semibold">
            {discountLabel(promotion)}
          </span>
          <span className="text-white/60">{scopeLabel(promotion)}</span>
        </span>

        {remaining ? (
          <span className="flex items-center gap-1.5">
            <span className="text-white/70">Ends in</span>
            <TimeChip value={remaining.days} unit="d" />
            <TimeChip value={remaining.hours} unit="h" />
            <TimeChip value={remaining.minutes} unit="m" />
            <TimeChip value={remaining.seconds} unit="s" />
          </span>
        ) : null}

        <Link
          href="/gallery"
          className="bg-gold-500 hover:bg-gold-400 text-brand-950 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
        >
          Shop the sale
        </Link>
      </Container>
    </div>
  );
}
