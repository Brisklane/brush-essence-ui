import "server-only";

import { z } from "zod";

/**
 * Server-only environment configuration. Imported exclusively by server code
 * (route handlers / the auth BFF); the `server-only` import makes it a build
 * error to pull this into a client component.
 */
const serverSchema = z.object({
  // Base URL of the .NET API, used by the auth route handlers to reach the backend.
  API_BASE_URL: z.url().default("http://localhost:5150"),
});

const parsed = serverSchema.safeParse({
  API_BASE_URL: process.env.API_BASE_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid server environment variables:",
    z.treeifyError(parsed.error),
  );
  throw new Error("Invalid server environment variables. See logs above.");
}

export const serverEnv = parsed.data;
