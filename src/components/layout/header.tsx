"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  ThemeToggle,
} from "@/components/ui";
import { siteConfig } from "@/config/site";
import { useCart } from "@/hooks/use-cart";
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
      <Container className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="text-muted hover:text-foreground -ml-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-xl md:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <BrandMark className="min-w-0 items-start" />
        </div>

        <nav className="hidden items-center gap-9 md:flex">
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
                  "after:bg-gold-500 hover:text-foreground relative text-xs font-medium tracking-[0.15em] uppercase transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:transition-all after:duration-300",
                  active
                    ? "text-foreground after:w-full"
                    : "text-muted after:w-0 hover:after:w-full",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
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

      {searchOpen ? (
        <HeaderSearch onClose={() => setSearchOpen(false)} />
      ) : null}

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

/** Cart entry point: links to the cart page with a live item-count badge. */
function CartButton() {
  const { itemCount } = useCart();
  const label =
    itemCount > 0
      ? `Your cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
      : "Your cart";

  return (
    <Link
      href="/cart"
      title="Your cart"
      aria-label={label}
      className="text-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-full text-lg"
    >
      <CartIcon />
      {itemCount > 0 ? (
        <span className="bg-brand-600 absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[0.6rem] font-semibold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
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
    router.push(
      value ? `/gallery?search=${encodeURIComponent(value)}` : "/gallery",
    );
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
