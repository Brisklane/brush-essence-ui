import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { Input } from "@/components/ui";

interface FormFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
}

/** Labelled input with inline validation error, for the auth forms. */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, error, id, ...props }, ref) {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-ink text-sm font-medium">
          {label}
        </label>
        <Input
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error ? <span className="text-sm text-red-600">{error}</span> : null}
      </div>
    );
  },
);
