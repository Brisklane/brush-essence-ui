import { z } from "zod";

// `coerce` converts the string values from number inputs; empty inputs become 0
// (and then fail `positive()` with a friendly message).
export const paintingFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().max(4000).optional(),
  price: z.coerce.number().positive("Price must be greater than 0."),
  currency: z.string().trim().length(3, "Use a 3-letter currency code."),
  widthCm: z.coerce.number().positive("Width must be greater than 0."),
  heightCm: z.coerce.number().positive("Height must be greater than 0."),
  medium: z.string().max(100).optional(),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative."),
  categoryId: z.string().optional(),
  isPublished: z.boolean(),
});

// Input is what the form fields hold (coerced number fields accept strings);
// Values is the parsed output passed to onSubmit.
export type PaintingFormInput = z.input<typeof paintingFormSchema>;
export type PaintingFormValues = z.output<typeof paintingFormSchema>;
