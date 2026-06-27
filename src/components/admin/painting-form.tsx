"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  FormCheckbox,
  FormField,
  FormSelect,
  FormTextarea,
} from "@/components/forms";
import { Button } from "@/components/ui";
import {
  createPainting,
  listCategories,
  listMediums,
  updatePainting,
  uploadPaintingImage,
} from "@/lib/catalog-api";
import { resolveImageUrl } from "@/lib/image";
import { cmToInches, inchesToCm } from "@/lib/units";
import { cn } from "@/lib/utils";
import {
  paintingFormSchema,
  type PaintingFormInput,
  type PaintingFormValues,
} from "@/lib/validations/painting";
import type { Category, Medium, Painting } from "@/types";

export function PaintingForm({ painting }: { painting?: Painting }) {
  const router = useRouter();
  const isEdit = Boolean(painting);

  const [categories, setCategories] = useState<Category[]>([]);
  const [mediums, setMediums] = useState<Medium[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(
    painting?.imageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaintingFormInput, unknown, PaintingFormValues>({
    resolver: zodResolver(paintingFormSchema),
    defaultValues: {
      title: painting?.title ?? "",
      description: painting?.description ?? "",
      price: painting?.price ?? 0,
      widthIn: painting?.widthCm
        ? Number(cmToInches(painting.widthCm).toFixed(2))
        : 0,
      heightIn: painting?.heightCm
        ? Number(cmToInches(painting.heightCm).toFixed(2))
        : 0,
      mediumId: painting?.mediumId ?? "",
      stockQuantity: painting?.stockQuantity ?? 1,
      categoryId: painting?.categoryId ?? "",
      isPublished: painting?.isPublished ?? false,
    },
  });

  // Live cm preview for the inches inputs (rounded for display).
  const widthIn = Number(useWatch({ control, name: "widthIn" })) || 0;
  const heightIn = Number(useWatch({ control, name: "heightIn" })) || 0;
  const cmPreview =
    widthIn > 0 && heightIn > 0
      ? `≈ ${Math.round(inchesToCm(widthIn))} × ${Math.round(inchesToCm(heightIn))} cm`
      : null;

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
    listMediums()
      .then(setMediums)
      .catch(() => setMediums([]));
  }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    setFormError(null);
    try {
      setImageUrl(await uploadPaintingImage(file));
    } catch (caught) {
      setFormError(
        caught instanceof Error ? caught.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void uploadFile(file);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  async function onSubmit(values: PaintingFormValues) {
    setFormError(null);
    const payload = {
      title: values.title,
      description: values.description?.trim() ? values.description : null,
      price: values.price,
      widthCm: inchesToCm(values.widthIn),
      heightCm: inchesToCm(values.heightIn),
      mediumId: values.mediumId ? values.mediumId : null,
      stockQuantity: values.stockQuantity,
      isPublished: values.isPublished,
      categoryId: values.categoryId ? values.categoryId : null,
      imageUrl,
    };

    try {
      if (isEdit && painting) {
        await updatePainting(painting.id, payload);
      } else {
        await createPainting(payload);
      }
      router.push("/admin/paintings");
      router.refresh();
    } catch (caught) {
      setFormError(
        caught instanceof Error
          ? caught.message
          : "Could not save the painting.",
      );
    }
  }

  const preview = resolveImageUrl(imageUrl);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl space-y-5"
      noValidate
    >
      {formError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <FormField
        id="title"
        label="Title"
        error={errors.title?.message}
        {...register("title")}
      />

      <FormTextarea
        id="description"
        label="Description"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <FormField
        id="price"
        label="Price (PKR)"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        error={errors.price?.message}
        {...register("price")}
      />

      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="widthIn"
            label="Width (inches)"
            type="number"
            min="0"
            step="0.1"
            error={errors.widthIn?.message}
            {...register("widthIn")}
          />
          <FormField
            id="heightIn"
            label="Height (inches)"
            type="number"
            min="0"
            step="0.1"
            error={errors.heightIn?.message}
            {...register("heightIn")}
          />
        </div>
        <p className="text-muted-2 mt-1.5 text-xs">
          Enter size in inches — {cmPreview ?? "centimetres are added automatically."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="mediumId"
          render={({ field }) => (
            <FormSelect
              id="mediumId"
              label="Medium"
              ref={field.ref}
              name={field.name}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            >
              <option value="">— None —</option>
              {mediums.map((medium) => (
                <option key={medium.id} value={medium.id}>
                  {medium.name}
                </option>
              ))}
            </FormSelect>
          )}
        />
        <FormField
          id="stockQuantity"
          label="Stock quantity"
          type="number"
          error={errors.stockQuantity?.message}
          {...register("stockQuantity")}
        />
      </div>

      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FormSelect
            id="categoryId"
            label="Category"
            ref={field.ref}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <option value="">— Uncategorized —</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FormSelect>
        )}
      />

      <div className="flex flex-col gap-2">
        <span className="text-foreground text-sm font-medium">Image</span>
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-5 text-center transition-colors",
            dragging
              ? "border-brand-400 bg-brand-50/60 dark:bg-brand-900/20"
              : "border-border hover:bg-surface-2/50",
          )}
        >
          {preview ? (
            <div className="relative h-40 w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="border-border h-40 w-40 rounded-lg border object-cover"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setImageUrl(null);
                }}
                className="absolute top-1 right-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-black/80"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="text-muted-2 flex h-40 w-40 items-center justify-center rounded-lg text-xs">
              No image
            </div>
          )}
          <p className="text-muted text-sm">
            {uploading ? (
              <span className="text-muted">Uploading…</span>
            ) : (
              <>
                <span className="text-brand-700 dark:text-gold-300 font-medium">
                  Click to upload
                </span>{" "}
                or drag &amp; drop · PNG, JPEG, WebP
              </>
            )}
          </p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <FormCheckbox
        id="isPublished"
        label="Published (visible in the catalogue)"
        {...register("isPublished")}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting
            ? "Saving…"
            : isEdit
              ? "Save changes"
              : "Create painting"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/paintings")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
