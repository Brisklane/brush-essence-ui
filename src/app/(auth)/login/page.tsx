import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-stone-600">Sign in to your account.</p>
      </div>
      {/* useSearchParams (redirect) requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
