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
});

export type CustomRequestValues = z.infer<typeof customRequestSchema>;

/** Max reference images per request — matches the API's CustomRequestLimits. */
export const MAX_REFERENCE_IMAGES = 8;
