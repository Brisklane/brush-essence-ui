import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { Input, Select, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

const labelClass = "text-foreground text-sm font-medium";
const errorClass = "text-sm text-red-600 dark:text-red-400";

interface FieldProps {
  label: string;
  error?: string;
}

/** Labelled text input with inline validation error. */
export const FormField = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & FieldProps
>(function FormField({ label, error, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className={errorClass}>{error}</span> : null}
    </div>
  );
});

/** Labelled textarea with inline validation error. */
export const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea"> & FieldProps
>(function FormTextarea({ label, error, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Textarea
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className={errorClass}>{error}</span> : null}
    </div>
  );
});

/** Labelled select with inline validation error. Pass <option>s as children. */
export const FormSelect = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select"> & FieldProps
>(function FormSelect({ label, error, id, children, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Select
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </Select>
      {error ? <span className={errorClass}>{error}</span> : null}
    </div>
  );
});

/** Inline checkbox with a label to its right. */
export const FormCheckbox = forwardRef<
  HTMLInputElement,
  Omit<ComponentPropsWithoutRef<"input">, "type"> & { label: string }
>(function FormCheckbox({ label, id, className, ...props }, ref) {
  return (
    <label
      htmlFor={id}
      className="text-foreground flex items-center gap-2 text-sm"
    >
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className={cn(
          "accent-brand-600 border-border h-4 w-4 rounded",
          className,
        )}
        {...props}
      />
      {label}
    </label>
  );
});
