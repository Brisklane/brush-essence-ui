import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Buttons distinguish every interaction state — rest, hover, active (pressed)
 * and focus — and render a clearly-different disabled state, so each style
 * communicates affordance on its own (see the "state uniqueness" principle).
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium tracking-wide",
    "transition-[background-color,box-shadow,border-color,transform] duration-150 ease-out",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[color:var(--background)] focus-visible:outline-none",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — solid gallery navy.
        primary:
          "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md active:bg-brand-800",
        // Gold — the accent call-to-action.
        gold: "bg-gold-500 text-brand-950 shadow-sm hover:bg-gold-400 hover:shadow-md active:bg-gold-600",
        // Secondary — quiet, filled.
        secondary:
          "bg-surface-2 text-foreground border-border border hover:bg-border active:bg-border/80",
        // Outline — bordered, fills softly on interaction.
        outline:
          "border-brand-600 text-brand-700 hover:bg-brand-50 active:bg-brand-100 border bg-transparent dark:border-brand-400 dark:text-brand-200 dark:hover:bg-brand-900/40 dark:active:bg-brand-900/60",
        // Ghost — text-only until hovered.
        ghost:
          "text-foreground hover:bg-surface-2 active:bg-border bg-transparent",
        // Danger — destructive actions.
        danger:
          "bg-danger-600 text-white shadow-sm hover:bg-danger-700 hover:shadow-md active:bg-danger-700",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
