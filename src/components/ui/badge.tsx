import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-muted",
        brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
        gold: "bg-gold-500/15 text-gold-600 dark:text-gold-300",
        success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        danger: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-1",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
