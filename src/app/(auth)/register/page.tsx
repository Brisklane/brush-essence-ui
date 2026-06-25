import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-ink text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-stone-600">
          Join to start collecting original art.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
