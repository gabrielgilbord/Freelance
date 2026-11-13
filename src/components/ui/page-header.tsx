import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./container";

type Crumb = { name: string; path: string };

export function PageHeader({ crumbs, eyebrow, title, intro, children }: { crumbs: Crumb[]; eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pt-[calc(var(--header-h)+5rem)] sm:pb-24">
      <div className="grid-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden="true" />
      <Container className="relative">
        <nav aria-label="Ruta de navegación">
          <ol className="label flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-line-strong">/</span>}
                {i < crumbs.length - 1 ? (
                  <Link href={c.path} className="hover:text-paper">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="text-paper-muted">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="label fade-in mt-10 text-accent">{eyebrow}</p>
        <h1 className="mt-5 max-w-[20ch] text-display-m font-medium text-paper">
          <span className="line-mask"><span className="line-rise" style={{ "--rise-delay": "80ms" } as React.CSSProperties}>{title}</span></span>
        </h1>
        {intro && (
          <p className="fade-in mt-8 max-w-[60ch] text-lg leading-relaxed text-paper-muted sm:text-xl" style={{ "--fade-delay": "300ms" } as React.CSSProperties}>
            {intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
