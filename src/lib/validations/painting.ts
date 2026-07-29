import { z } from "zod";

// `coerce` converts the string values from number inputs; empty inputs become 0
// (and then fail `positive()` with a friendly message).
export const paintingFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().max(4000).optional(),
  price: z.coerce
    .number()
    .positive("Price must be greater than 0.")
    .refine(
      (n) => Number.isInteger(n),
      "Price must be a whole number (no decimals).",
    ),
  // Dimensions are entered in inches; cm is derived automatically on submit.
  widthIn: z.coerce.number().positive("Width must be greater than 0."),
  heightIn: z.coerce.number().positive("Height must be greater than 0."),
  mediumId: z.string().optional(),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative."),
  categoryId: z.string().optional(),
  isPublished: z.boolean(),
});

// Input is what the form fields hold (coerced number fields accept strings);
// Values is the parsed output passed to onSubmit.
export type PaintingFormInput = z.input<typeof paintingFormSchema>;
export type PaintingFormValues = z.output<typeof paintingFormSchema>;
