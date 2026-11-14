"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Service } from "@/content/services";

/**
 * Catálogo de servicios: un índice tipográfico y, a su lado, la ilustración isométrica del
 * servicio activo. En escritorio funciona como pestañas (teclado incluido); en móvil cada
 * servicio se muestra completo, uno tras otro.
 */
type Item = Pick<Service, "slug" | "title" | "discipline" | "pitch" | "deliverables">;

export function ServiceCatalog({ services }: { services: Item[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const current = services[active]!;

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = services.length;
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(next);
      document.getElementById(`${base}-tab-${next}`)?.focus();
    }
  };

  return (
    <>
      {/* Escritorio: índice + panel */}
      <div className="hidden gap-12 lg:grid lg:grid-cols-12">
        <div role="tablist" aria-label="Servicios" aria-orientation="vertical" className="lg:col-span-5">
          {services.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.slug}
                id={`${base}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`${base}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={`group flex w-full items-baseline gap-5 border-t border-line py-5 text-left transition-colors duration-300 last:border-b ${
                  on ? "text-paper" : "text-paper-subtle hover:text-paper-muted"
                }`}
              >
                <span className={`h-2 w-2 shrink-0 translate-y-[-0.2em] rounded-full transition-colors duration-300 ${on ? "bg-accent" : "bg-line-strong"}`} aria-hidden="true" />
                <span className="text-[clamp(1.5rem,1rem+1.2vw,2.25rem)] font-medium leading-tight tracking-[-0.03em]">{s.title}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${active}`}
          className="relative lg:col-span-7"
        >
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <div key={current.slug} className="fade-in rounded-md border border-line bg-ink-1/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/art/services/${current.slug}.svg`} alt="" width={480} height={400} className="mx-auto h-auto w-full max-w-[34rem]" />
              <div className="grid gap-6 border-t border-line p-8 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-xl leading-snug text-paper">{current.pitch}</p>
                  <ul className="mt-5 space-y-1.5 text-paper-muted">
                    {current.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex gap-3">
                        <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={`/servicios/${current.slug}`} className="inline-flex h-11 items-center rounded-xs border border-line-strong px-4 text-sm font-medium text-paper transition-colors hover:border-paper/70">
                  Ver {current.title.toLowerCase()}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Móvil y tablet: lista completa */}
      <ul className="grid gap-10 sm:grid-cols-2 lg:hidden">
        {services.map((s) => (
          <li key={s.slug} className="border-t border-line pt-6">
            <Link href={`/servicios/${s.slug}`} className="group block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/art/services/${s.slug}.svg`} alt="" width={480} height={400} loading="lazy" className="h-auto w-full" />
              <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-paper group-hover:text-accent">{s.title}</h3>
              <p className="mt-2 text-paper-muted">{s.pitch}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
