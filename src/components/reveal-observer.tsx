"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Memunculkan elemen [data-reveal] saat masuk layar (sekali saja).
 * Urutan stagger diatur lewat CSS var --i di tiap elemen.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const show = (el: Element) => el.classList.add("is-in");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );

    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Elemen yang dirender belakangan (data client) ikut dipantau.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
