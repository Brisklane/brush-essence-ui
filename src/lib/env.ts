import { z } from "zod";

/**
 * Centralized, type-safe environment configuration.
 *
 * Only `NEXT_PUBLIC_*` variables are available in the browser, so those are
 * the only ones validated here. Server-only secrets should be added to a
 * separate server schema that is never imported by client components.
 *
 * Validation runs once at module load; a misconfigured environment fails
 * fast with a clear message instead of producing `undefined` bugs at runtime.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .describe("Base URL of the BrushEssence backend API."),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("http://localhost:3000")
    .describe("Public URL of this site, used for metadata/SEO."),
});

// Next.js inlines `process.env.NEXT_PUBLIC_*` at build time, so they must be
// referenced statically (not via a dynamic key) to be replaced correctly.
const parsed = clientSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid environment variables. See logs above.");
}

export const env = parsed.data;
