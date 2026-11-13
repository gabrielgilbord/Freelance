import type { ReactNode } from "react";

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" }) {
  const t = tone === "accent" ? "border-accent/50 text-accent" : "border-line-strong text-paper-muted";
  return <span className={`inline-flex items-center rounded-xs border px-2 py-1 font-mono text-micro uppercase tracking-[0.06em] ${t}`}>{children}</span>;
}
