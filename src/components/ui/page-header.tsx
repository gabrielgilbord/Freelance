import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./container";

type Crumb = { name: string; path: string };

export function PageHeader({ crumbs, title, intro, children, aside }: { crumbs: Crumb[]; eyebrow?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pt-[calc(var(--header-h)+5rem)] sm:pb-24">
      <Container className="relative">
        <nav aria-label="Ruta de navegación">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-paper-subtle">
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
        <div className={aside ? "grid items-center gap-10 lg:grid-cols-12" : ""}>
          <div className={aside ? "lg:col-span-7" : ""}>
            <h1 className="mt-10 max-w-[20ch] text-display-m font-[450] text-paper">
              <span className="line-mask"><span className="line-rise" style={{ "--rise-delay": "80ms" } as React.CSSProperties}>{title}</span></span>
            </h1>
            {intro && (
              <p className="fade-in mt-8 max-w-[60ch] text-lg leading-relaxed text-paper-muted sm:text-xl" style={{ "--fade-delay": "300ms" } as React.CSSProperties}>
                {intro}
              </p>
            )}
            {children}
          </div>
          {aside && <div className="fade-in lg:col-span-5" style={{ "--fade-delay": "250ms" } as React.CSSProperties}>{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
