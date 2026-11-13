"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { nav } from "@/content/site";
import { Close, Menu } from "@/components/ui/icons";

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

      <div
        id={id}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-ink px-4 pb-8 pt-[calc(var(--header-h)+2rem)]"
      >
        <nav aria-label="Móvil" className="flex-1">
          <ul className="border-t border-line">
            {items.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5 text-3xl font-medium text-paper"
                >
                  {item.label}
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="label">Software · IA · IoT — de principio a fin</p>
      </div>
    </div>
  );
}
