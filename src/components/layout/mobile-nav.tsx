"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { nav } from "@/content/site";
import { Close, Menu } from "@/components/ui/icons";

/**
 * Menú móvil. El panel se monta en <body> mediante un portal: la cabecera usa
 * backdrop-filter al hacer scroll, y eso convertiría al header en el contenedor de
 * cualquier hijo `fixed`, dejando el panel recortado y transparente.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();

  // Cierra el menú al navegar.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const items = [...nav, { label: "Contacto", href: "/contacto" }];

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="relative z-50 -m-2 flex h-11 w-11 items-center justify-center text-paper"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <Close /> : <Menu />}
      </button>

      {open &&
        createPortal(
          <div id={id} className="fixed inset-0 z-30 flex flex-col bg-ink px-4 pb-10 pt-[calc(var(--header-h)+2rem)] md:hidden">
            <nav aria-label="Móvil" className="flex-1">
              <ul className="border-t border-line">
                {items.map((item) => (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 text-3xl font-medium tracking-[-0.03em] text-paper active:text-accent"
                    >
                      {item.label}
                      <span className="h-2 w-2 rounded-full bg-line-strong" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-sm text-paper-subtle">Software, IA e IoT, de principio a fin.</p>
          </div>,
          document.body,
        )}
    </div>
  );
}
