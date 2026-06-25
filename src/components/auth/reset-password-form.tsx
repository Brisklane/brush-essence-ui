"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth";

import { FormField } from "./form-field";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formError, setFormError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordValues) {
    setFormError(null);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: values.password }),
    });

    if (response.ok) {
      setSucceeded(true);
      return;
    }

    const data = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    setFormError(data?.detail ?? "This reset link is invalid or has expired.");
  }

  if (!token) {
    return (
      <p className="text-sm text-red-700">
        This password reset link is missing its token. Please request a new one
        from{" "}
        <Link
          href="/forgot-password"
          className="text-brand-700 hover:text-brand-800"
        >
          Forgot password
        </Link>
        .
      </p>
    );
  }

  if (succeeded) {
    return (
      <div className="flex flex-col gap-4 text-sm text-stone-600">
        <p>
          Your password has been reset. You can now sign in with your new
          password.
        </p>
        <Link href="/login" className="text-brand-700 hover:text-brand-800">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {formError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <FormField
        id="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <FormField
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}
