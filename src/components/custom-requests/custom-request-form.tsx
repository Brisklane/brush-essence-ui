"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormField, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui";
import type { CustomRequestPayload } from "@/lib/custom-requests-api";
import {
  customRequestSchema,
  type CustomRequestValues,
} from "@/lib/validations/custom-request";

import { ImageUpload, type UploadedImage } from "./image-upload";

interface CustomRequestFormProps {
  onSubmit: (payload: CustomRequestPayload) => void | Promise<void>;
  submitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<CustomRequestValues>;
  defaultImages?: UploadedImage[];
  error?: string | null;
}

/**
 * Form for creating or editing a custom painting request. Text fields are
 * validated with the shared zod schema (mirroring the API); reference images are
 * uploaded as they're chosen and submitted as URLs alongside the request.
 */
export function CustomRequestForm({
  onSubmit,
  submitting = false,
  submitLabel = "Submit request",
  defaultValues,
  defaultImages = [],
  error,
}: CustomRequestFormProps) {
  const [images, setImages] = useState<UploadedImage[]>(defaultImages);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomRequestValues>({
    resolver: zodResolver(customRequestSchema),
    defaultValues,
  });

  function submit(values: CustomRequestValues) {
    return onSubmit({
      title: values.title,
      description: values.description,
      preferredSize: values.preferredSize?.trim() || null,
      images: images.map((image) => ({
        url: image.url,
        fileName: image.fileName,
      })),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <FormField
        id="title"
        label="Title"
        placeholder="e.g. Sunset over the harbour"
        error={errors.title?.message}
        {...register("title")}
      />

      <FormTextarea
        id="description"
        label="Describe your vision"
        rows={6}
        placeholder="Subject, mood, colours, where it'll hang, any reference notes…"
        error={errors.description?.message}
        {...register("description")}
      />

      <FormField
        id="preferredSize"
        label="Preferred size (optional)"
        placeholder="e.g. 60 × 90 cm, landscape"
        error={errors.preferredSize?.message}
        {...register("preferredSize")}
      />

      <div>
        <span className="text-foreground text-sm font-medium">
          Reference images (optional)
        </span>
        <p className="text-muted mt-1 mb-3 text-sm">
          Share photos or inspiration to help guide the piece.
        </p>
        <ImageUpload
          value={images}
          onChange={setImages}
          disabled={submitting}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="mt-1">
        {submitting ? "Submitting…" : submitLabel}
      </Button>
    </form>
  );
}
