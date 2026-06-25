/**
 * Static, app-wide site metadata. Centralizing this keeps titles, nav, and
 * SEO copy consistent and easy to update in one place.
 */
export const siteConfig = {
  name: "Brush Essence",
  tagline: "Hand-painted oil paintings on canvas",
  description:
    "Original, hand-painted oil paintings on canvas — each piece one of a kind. Browse the gallery and bring fine art home.",
  /** Primary storefront navigation (kept to routes that actually exist). */
  nav: [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
