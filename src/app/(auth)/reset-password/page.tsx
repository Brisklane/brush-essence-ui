import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink text-2xl font-semibold">
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Enter and confirm your new password.
        </p>
      </div>
      {/* useSearchParams (token) requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
