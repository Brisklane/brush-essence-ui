import * as React from "react";

import { cn } from "@/lib/utils";

import { fieldClasses } from "./input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(fieldClasses, "min-h-24", className)}
        {...props}
      />
    );
  },
);
