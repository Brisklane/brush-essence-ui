import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Small secondary line under the value (e.g. "12 pending"). */
  hint?: ReactNode;
  /** Accent colour for the value, e.g. revenue vs. counts. */
  accent?: "default" | "brand" | "gold" | "success" | "danger";
}

const accentClass: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "text-foreground",
  brand: "text-brand-700 dark:text-brand-300",
  gold: "text-gold-600 dark:text-gold-300",
  success: "text-emerald-600 dark:text-emerald-400",
  danger: "text-red-600 dark:text-red-400",
};

/** Reusable dashboard stat card: a labelled headline metric with an optional hint. */
export function StatCard({
  label,
  value,
  hint,
  accent = "default",
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="text-muted text-xs font-medium tracking-wide uppercase">
          {label}
        </p>
        <p
          className={cn(
            "mt-2 text-2xl font-semibold tabular-nums",
            accentClass[accent],
          )}
        >
          {value}
        </p>
        {hint ? <p className="text-muted-2 mt-1 text-xs">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
