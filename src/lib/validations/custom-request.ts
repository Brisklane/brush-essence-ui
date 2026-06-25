import { z } from "zod";

// Mirrors the API's CreateCustomRequestRequestValidator (FluentValidation).
export const customRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give your request a short title.")
    .max(200, "Title is too long."),
  description: z
    .string()
    .trim()
    .min(1, "Please describe what you'd like.")
    .max(4000, "Description is too long."),
  preferredSize: z
    .string()
    .trim()
    .max(200, "Preferred size is too long.")
    .optional(),
  // Kept as a string (raw input) and parsed on submit; this keeps the form's
  // input and output types aligned for react-hook-form.
  budgetAmount: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value || (Number(value) > 0 && Number(value) <= 10_000_000),
      "Enter a budget greater than 0.",
    ),
  currency: z.string().trim().length(3, "Use a 3-letter currency code."),
});

export type CustomRequestValues = z.infer<typeof customRequestSchema>;

/** Max reference images per request — matches the API's CustomRequestLimits. */
export const MAX_REFERENCE_IMAGES = 8;
