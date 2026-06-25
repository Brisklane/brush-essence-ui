"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui";
import {
  getCustomRequest,
  updateCustomRequest,
  type CustomRequestPayload,
} from "@/lib/custom-requests-api";
import type { CustomRequest } from "@/types";

import { CustomRequestForm } from "./custom-request-form";

export function EditCustomRequestView({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [request, setRequest] = useState<CustomRequest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCustomRequest(requestId)
      .then((data) => {
        if (!cancelled) setRequest(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Couldn't load this request.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  async function handleSubmit(payload: CustomRequestPayload) {
    setSubmitting(true);
    setError(null);
    try {
      await updateCustomRequest(requestId, payload);
      router.replace(`/custom-requests/${requestId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "We couldn't save your changes.",
      );
      setSubmitting(false);
    }
  }

  if (loadError) {
    return <p className="text-muted py-16 text-center">{loadError}</p>;
  }

  if (!request) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!request.isEditable) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">
          This request is already being handled and can no longer be edited.
        </p>
        <Link
          href={`/custom-requests/${requestId}`}
          className="text-brand-700 hover:text-brand-800 mt-4 inline-block text-sm"
        >
          ← Back to request
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CustomRequestForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
        error={error}
        defaultValues={{
          title: request.title,
          description: request.description,
          preferredSize: request.preferredSize ?? undefined,
          budgetAmount:
            request.budgetAmount != null
              ? String(request.budgetAmount)
              : undefined,
          currency: request.currency,
        }}
        defaultImages={request.images.map((image) => ({
          url: image.url,
          fileName: image.fileName,
        }))}
      />
    </div>
  );
}
