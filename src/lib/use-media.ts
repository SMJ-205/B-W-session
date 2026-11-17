"use client";

import { useSyncExternalStore } from "react";

/** true jika media query cocok. Saat render server selalu `fallback`. */
export function useMedia(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** Layar ponsel (di bawah breakpoint md Tailwind). */
export const useIsPhone = () => useMedia("(max-width: 767px)");
