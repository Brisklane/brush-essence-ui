"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import {
  passwordRequirements,
  registerSchema,
  type RegisterValues,
} from "@/lib/validations/auth";

import { FormField, PasswordField } from "@/components/forms";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const confirmValue = useWatch({ control, name: "confirmPassword" }) ?? "";

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        fullName: values.fullName?.trim() || undefined,
      });
      router.replace("/");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
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
        id="fullName"
        label="Full name (optional)"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <div>
        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          {...register("password")}
        />
        <ul className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
          {passwordRequirements.map((requirement) => {
            const met = requirement.test(passwordValue);
            return (
              <li
                key={requirement.label}
                className={
                  met ? "text-green-600 dark:text-green-400" : "text-muted"
                }
              >
                <span aria-hidden>{met ? "✓" : "○"}</span> {requirement.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {confirmValue.length > 0 ? (
          passwordValue === confirmValue ? (
            <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">
              Passwords match
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              Passwords do not match
            </p>
          )
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-muted text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200 font-medium"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
