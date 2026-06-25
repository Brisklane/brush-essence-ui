"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PaintingForm } from "@/components/admin/painting-form";
import { getPainting } from "@/lib/catalog-api";
import type { Painting } from "@/types";

export default function EditPaintingPage() {
  const params = useParams<{ id: string }>();
  const [painting, setPainting] = useState<Painting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPainting(params.id)
      .then(setPainting)
      .catch((caught) =>
        setError(
          caught instanceof Error ? caught.message : "Failed to load painting.",
        ),
      );
  }, [params.id]);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Edit painting</h1>
      {error ? (
        <p className="mt-4 text-red-700">{error}</p>
      ) : !painting ? (
        <p className="mt-4 text-muted">Loading…</p>
      ) : (
        <div className="mt-6">
          <PaintingForm painting={painting} />
        </div>
      )}
    </div>
  );
}
