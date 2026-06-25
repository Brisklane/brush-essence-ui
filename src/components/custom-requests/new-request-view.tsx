"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  createCustomRequest,
  type CustomRequestPayload,
} from "@/lib/custom-requests-api";

import { CustomRequestForm } from "./custom-request-form";

export function NewCustomRequestView() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(payload: CustomRequestPayload) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createCustomRequest(payload);
      router.replace(`/custom-requests/${created.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't submit your request.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CustomRequestForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Submit request"
        error={error}
      />
    </div>
  );
}
