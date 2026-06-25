import { z } from "zod";

// Mirrors the API's ShippingAddressInputValidator (FluentValidation).
export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(200, "Name is too long."),
  line1: z
    .string()
    .trim()
    .min(1, "Address line 1 is required.")
    .max(200, "Address is too long."),
  line2: z.string().trim().max(200, "Address is too long.").optional(),
  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(120, "City is too long."),
  region: z.string().trim().max(120, "Region is too long.").optional(),
  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required.")
    .max(20, "Postal code is too long."),
  country: z
    .string()
    .trim()
    .min(1, "Country is required.")
    .max(100, "Country is too long."),
  phone: z.string().trim().max(40, "Phone number is too long.").optional(),
});

export type ShippingAddressValues = z.infer<typeof shippingAddressSchema>;
