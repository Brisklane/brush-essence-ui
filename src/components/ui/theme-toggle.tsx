"use client";

import { useTheme } from "@/providers/theme-provider";

import { MoonIcon, SunIcon } from "./icons";

/**
 * Light/dark switch. The theme is read from the DOM via an external store, so
 * the server render ("light") and first client render agree and no mount guard
 * is needed.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={
        "text-muted hover:text-foreground hover:border-border focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-lg transition-colors focus-visible:ring-2 focus-visible:outline-none " +
        (className ?? "")
      }
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
