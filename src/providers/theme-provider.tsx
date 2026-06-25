"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "brush-essence-theme";

/**
 * Inline script that applies the persisted (or system) theme *before* the page
 * paints, preventing a flash of the wrong theme. Rendered into <head> from the
 * root layout. The `<html>` class it sets is the single source of truth that
 * `useTheme` reads back via `useSyncExternalStore`.
 */
export const themeInitScript = `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',s?s==='dark':m);}catch(e){}})();`;

// External store backed by the DOM. Components subscribe and re-render when the
// theme changes; this avoids setState-in-effect synchronisation entirely.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function setTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage failures (private mode, quota); the theme still applies.
  }
  listeners.forEach((listener) => listener());
}

/** No context needed — the DOM class is the source of truth. Kept so the root
 * layout has a single place to mount theme concerns. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  return useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme],
  );
}
