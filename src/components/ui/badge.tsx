import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium tracking-wide ring-1 ring-inset",
  {
    variants: {
      variant: {
        neutral: "bg-surface-2 text-muted ring-border",
        brand:
          "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-800",
        gold: "bg-gold-100 text-gold-700 ring-gold-300/60 dark:bg-gold-500/15 dark:text-gold-300 dark:ring-gold-500/30",
        success:
          "bg-success-50 text-success-700 ring-success-300/60 dark:bg-success-500/15 dark:text-success-300 dark:ring-success-500/30",
        warning:
          "bg-warning-50 text-warning-700 ring-warning-300/60 dark:bg-warning-500/15 dark:text-warning-300 dark:ring-warning-500/30",
        danger:
          "bg-danger-50 text-danger-700 ring-danger-300/60 dark:bg-danger-500/15 dark:text-danger-300 dark:ring-danger-500/30",
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
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
