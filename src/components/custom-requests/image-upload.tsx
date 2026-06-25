"use client";

import { useRef, useState } from "react";

import { CloseIcon, PlusIcon, Spinner } from "@/components/ui";
import { resolveImageUrl } from "@/lib/image";
import { uploadReferenceImage } from "@/lib/custom-requests-api";
import { MAX_REFERENCE_IMAGES } from "@/lib/validations/custom-request";

export interface UploadedImage {
  url: string;
  fileName: string | null;
}

interface ImageUploadProps {
  value: UploadedImage[];
  onChange: (next: UploadedImage[]) => void;
  max?: number;
  disabled?: boolean;
}

/**
 * Reference-image uploader for custom requests. Uploads each chosen file to the
 * API immediately and tracks the returned URLs; the parent form submits those
 * URLs with the request. Enforces the same per-request limit as the API.
 */
export function ImageUpload({
  value,
  onChange,
  max = MAX_REFERENCE_IMAGES,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = value.length >= max;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remaining = max - value.length;
    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);
    setError(null);

    try {
      const uploaded: UploadedImage[] = [];
      for (const file of selected) {
        const url = await uploadReferenceImage(file);
        uploaded.push({ url, fileName: file.name });
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't upload that image.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((image) => {
          const src = resolveImageUrl(image.url);
          return (
            <div
              key={image.url}
              className="border-border bg-surface-2 relative size-24 overflow-hidden rounded-lg border"
            >
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element -- API-origin image; remote next/image config intentionally avoided.
                <img
                  src={src}
                  alt={image.fileName ?? "Reference image"}
                  className="size-full object-cover"
                />
              ) : null}
              {!disabled ? (
                <button
                  type="button"
                  aria-label={`Remove ${image.fileName ?? "image"}`}
                  onClick={() =>
                    onChange(value.filter((i) => i.url !== image.url))
                  }
                  className="absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </div>
          );
        })}

        {!disabled && !atLimit ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="border-border text-muted hover:border-brand-400 hover:text-foreground flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs disabled:opacity-50"
          >
            {uploading ? (
              <Spinner className="size-5" />
            ) : (
              <>
                <PlusIcon className="text-lg" />
                Add image
              </>
            )}
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <p className="text-muted-2 mt-2 text-xs">
        JPEG, PNG or WebP · up to {max} images.
      </p>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
