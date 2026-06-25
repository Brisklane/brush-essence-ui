import * as React from "react";

import { cn } from "@/lib/utils";

import { fieldClasses } from "./input";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(fieldClasses, "h-11 cursor-pointer pr-9", className)}
        {...props}
      >
        {children}
      </select>
    );
  },
);
