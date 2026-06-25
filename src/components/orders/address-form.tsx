"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/forms";
import { Button } from "@/components/ui";
import {
  shippingAddressSchema,
  type ShippingAddressValues,
} from "@/lib/validations/order";

interface AddressFormProps {
  onSubmit: (values: ShippingAddressValues) => void | Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<ShippingAddressValues>;
  error?: string | null;
}

/**
 * Shipping address form with client-side validation mirroring the API. Owns its
 * own form state and hands validated values to `onSubmit`; the submit button
 * lives here so the parent can stay a thin layout (e.g. the checkout page).
 */
export function AddressForm({
  onSubmit,
  submitting = false,
  submitLabel = "Place order",
  defaultValues,
  error,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <FormField
        id="fullName"
        label="Full name"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <FormField
        id="line1"
        label="Address line 1"
        autoComplete="address-line1"
        error={errors.line1?.message}
        {...register("line1")}
      />
      <FormField
        id="line2"
        label="Address line 2 (optional)"
        autoComplete="address-line2"
        error={errors.line2?.message}
        {...register("line2")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="city"
          label="City"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register("city")}
        />
        <FormField
          id="region"
          label="State / region (optional)"
          autoComplete="address-level1"
          error={errors.region?.message}
          {...register("region")}
        />
        <FormField
          id="postalCode"
          label="Postal code"
          autoComplete="postal-code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
        <FormField
          id="country"
          label="Country"
          autoComplete="country-name"
          error={errors.country?.message}
          {...register("country")}
        />
      </div>

      <FormField
        id="phone"
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Button type="submit" size="lg" disabled={submitting} className="mt-2">
        {submitting ? "Placing order…" : submitLabel}
      </Button>
    </form>
  );
}
