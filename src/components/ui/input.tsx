import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Shared field styling used by Input, Select and Textarea. */
export const fieldClasses =
  "text-foreground border-border bg-surface focus-visible:ring-ring placeholder:text-muted-2 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(fieldClasses, "h-11", className)}
        {...props}
      />
    );
  },
);
