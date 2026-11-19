"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const LINKS = [
  { href: "/panel", label: "El mes" },
  { href: "/panel/proyectos", label: "Proyectos" },
  { href: "/panel/facturas", label: "Facturas" },
  { href: "/panel/socios", label: "Socios" },
  { href: "/panel/fondos", label: "Fondos" },
  { href: "/panel/equipo", label: "Equipo" },
];

export function PanelNav() {
  const path = usePathname();
  const m = useSearchParams().get("m");
  const active = (href: string) => (href === "/panel" ? path === "/panel" : path.startsWith(href));
  const href = (h: string) => (m && h !== "/panel/proyectos" && h !== "/panel/equipo" && h !== "/panel/facturas" ? `${h}?m=${m}` : h);

  return (
    <>
      <nav aria-label="Panel" className="hidden md:block">
        <ul className="flex h-full items-stretch">
          {LINKS.map((l) => (
            <li key={l.href} className="flex">
              <Link
                href={href(l.href)}
                aria-current={active(l.href) ? "page" : undefined}
                className={`relative flex items-center px-4 text-[0.9375rem] transition-colors ${active(l.href) ? "text-paper" : "text-paper-subtle hover:text-paper"}`}
              >
                {l.label}
                {active(l.href) && <span className="absolute inset-x-4 -bottom-px h-[2px] bg-paper" aria-hidden />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={href(l.href)}
                aria-current={active(l.href) ? "page" : undefined}
                className={`relative flex h-14 items-center justify-center text-[0.72rem] sm:text-sm ${active(l.href) ? "text-paper" : "text-paper-subtle"}`}
              >
                {active(l.href) && <span className="absolute inset-x-5 top-0 h-[2px] bg-paper" aria-hidden />}
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
