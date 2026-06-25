"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { CartIcon, CloseIcon, MenuIcon, SearchIcon, ThemeToggle } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { AuthNav } from "./auth-nav";
import { BrandMark } from "./brand-mark";
import { Container } from "./container";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="border-border bg-surface/85 sticky top-0 z-50 border-b backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-muted hover:text-foreground -ml-1 inline-flex size-9 items-center justify-center rounded-md text-xl md:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <BrandMark className="items-start" />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "hover:text-brand-700 dark:hover:text-gold-300 text-sm font-medium tracking-wide transition-colors",
                  active ? "text-foreground" : "text-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search the gallery"
            onClick={() => setSearchOpen((v) => !v)}
            className="text-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-full text-lg"
          >
            <SearchIcon />
          </button>
          <ThemeToggle />
          <CartButton />
          <div className="ml-1 hidden sm:block">
            <AuthNav />
          </div>
        </div>
      </Container>

      {searchOpen ? <HeaderSearch onClose={() => setSearchOpen(false)} /> : null}

      {mobileOpen ? (
        <div className="border-border bg-surface border-t md:hidden">
          {/* Any click inside (nav link, account action) dismisses the menu. */}
          <Container
            className="flex flex-col gap-1 py-4"
            onClick={() => setMobileOpen(false)}
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:bg-surface-2 rounded-md px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-border mt-2 border-t pt-3">
              <AuthNav />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

/** Cart entry point. The cart epic isn't built yet, so this is a stub. */
function CartButton() {
  return (
    <button
      type="button"
      title="Your cart (coming soon)"
      aria-label="Cart — coming soon"
      onClick={() => alert("Your cart is coming soon!")}
      className="text-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-full text-lg"
    >
      <CartIcon />
      <span className="bg-brand-600 absolute -top-0.5 -right-0.5 inline-flex size-4 items-center justify-center rounded-full text-[0.6rem] font-semibold text-white">
        0
      </span>
    </button>
  );
}

function HeaderSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    onClose();
    router.push(value ? `/gallery?search=${encodeURIComponent(value)}` : "/gallery");
  }

  return (
    <div className="border-border bg-surface border-t">
      <Container className="py-3">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <SearchIcon className="text-muted text-lg" />
          <input
            ref={inputRef}
            name="search"
            placeholder="Search paintings…"
            className="text-foreground placeholder:text-muted-2 h-10 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-foreground text-lg"
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </form>
      </Container>
    </div>
  );
}
