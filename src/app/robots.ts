import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

/** Robots policy: index the public storefront, keep private areas out of search. */
export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/cart",
        "/checkout",
        "/orders",
        "/custom-requests",
        "/login",
        "/register",
        "/reset-password",
        "/forgot-password",
        "/verify-email",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
