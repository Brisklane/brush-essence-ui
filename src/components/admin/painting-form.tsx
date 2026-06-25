"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

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
  updatePainting,
  uploadPaintingImage,
} from "@/lib/catalog-api";
import { resolveImageUrl } from "@/lib/image";
import {
  paintingFormSchema,
  type PaintingFormInput,
  type PaintingFormValues,
} from "@/lib/validations/painting";
import type { Category, Painting } from "@/types";

export function PaintingForm({ painting }: { painting?: Painting }) {
  const router = useRouter();
  const isEdit = Boolean(painting);

  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(
    painting?.imageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaintingFormInput, unknown, PaintingFormValues>({
    resolver: zodResolver(paintingFormSchema),
    defaultValues: {
      title: painting?.title ?? "",
      description: painting?.description ?? "",
      price: painting?.price ?? 0,
      currency: painting?.currency ?? "USD",
      widthCm: painting?.widthCm ?? 0,
      heightCm: painting?.heightCm ?? 0,
      medium: painting?.medium ?? "",
      stockQuantity: painting?.stockQuantity ?? 1,
      categoryId: painting?.categoryId ?? "",
      isPublished: painting?.isPublished ?? false,
    },
  });

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
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

  async function onSubmit(values: PaintingFormValues) {
    setFormError(null);
    const payload = {
      title: values.title,
      description: values.description?.trim() ? values.description : null,
      price: values.price,
      currency: values.currency.toUpperCase(),
      widthCm: values.widthCm,
      heightCm: values.heightCm,
      medium: values.medium?.trim() ? values.medium : null,
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="price"
          label="Price"
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register("price")}
        />
        <FormField
          id="currency"
          label="Currency"
          error={errors.currency?.message}
          {...register("currency")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="widthCm"
          label="Width (cm)"
          type="number"
          step="0.1"
          error={errors.widthCm?.message}
          {...register("widthCm")}
        />
        <FormField
          id="heightCm"
          label="Height (cm)"
          type="number"
          step="0.1"
          error={errors.heightCm?.message}
          {...register("heightCm")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="medium"
          label="Medium"
          error={errors.medium?.message}
          {...register("medium")}
        />
        <FormField
          id="stockQuantity"
          label="Stock quantity"
          type="number"
          error={errors.stockQuantity?.message}
          {...register("stockQuantity")}
        />
      </div>

      <FormSelect id="categoryId" label="Category" {...register("categoryId")}>
        <option value="">— Uncategorized —</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </FormSelect>

      <div className="flex flex-col gap-2">
        <span className="text-ink text-sm font-medium">Image</span>
        {preview ? (
          <div className="relative h-40 w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-40 rounded-lg border border-stone-200 object-cover"
            />
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="absolute top-1 right-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-black/80"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-lg border border-dashed border-stone-300 text-xs text-stone-400">
            No image
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="text-sm"
        />
        {uploading ? (
          <span className="text-sm text-stone-500">Uploading…</span>
        ) : null}
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
