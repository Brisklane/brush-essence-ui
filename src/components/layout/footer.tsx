import { siteConfig } from "@/config/site";

import { Container } from "./container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="text-sm text-stone-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p className="text-sm text-stone-500">{siteConfig.tagline}</p>
      </Container>
    </footer>
  );
}
