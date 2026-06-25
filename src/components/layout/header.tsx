import Link from "next/link";

import { siteConfig } from "@/config/site";

import { AuthNav } from "./auth-nav";
import { Container } from "./container";

export function Header() {
  return (
    <header className="bg-canvas/80 sticky top-0 z-50 border-b border-stone-200 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-ink text-xl font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-8 sm:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-brand-700 text-sm font-medium text-stone-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <AuthNav />
        </div>
      </Container>
    </header>
  );
}
