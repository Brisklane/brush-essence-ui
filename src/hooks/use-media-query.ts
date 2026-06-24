"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query and re-render when it changes.
 * Uses `useSyncExternalStore` (the idiomatic way to read from an external,
 * mutable source) so it stays correct under concurrent rendering and SSR.
 *
 * Example: `const isDesktop = useMediaQuery("(min-width: 1024px)")`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // Media queries never match during server rendering; default to false.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
