import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailView } from "@/components/auth/verify-email-view";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* useSearchParams (token) requires a Suspense boundary. */}
      <Suspense fallback={null}>
        <VerifyEmailView />
      </Suspense>
    </div>
  );
}
