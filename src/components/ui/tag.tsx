import type { ReactNode } from "react";

/** Etiqueta de estado: texto normal, sin mayúsculas ni espaciado ancho; un punto marca el tono. */
export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" }) {
  const t = tone === "accent" ? "border-accent/50 text-paper" : "border-line-strong text-paper-muted";
  const dot = tone === "accent" ? "bg-accent" : "bg-paper-subtle";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 whitespace-nowrap text-xs leading-none ${t}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}
