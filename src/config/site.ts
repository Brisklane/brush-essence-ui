/**
 * Static, app-wide site metadata. Centralizing this keeps titles, nav, and
 * SEO copy consistent and easy to update in one place.
 */
export const siteConfig = {
  name: "Brush Essence",
  tagline: "Hand-painted oil paintings on canvas",
  description:
    "Original, hand-painted oil paintings on canvas — each piece one of a kind. Browse the gallery and bring fine art home.",
  nav: [
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
