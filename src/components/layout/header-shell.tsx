"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Cabecera sticky que gana fondo y borde solo cuando la página ha hecho scroll. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-line bg-ink/80 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      {children}
    </header>
  );
}
