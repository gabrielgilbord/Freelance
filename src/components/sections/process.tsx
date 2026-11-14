"use client";

import { useEffect, useRef, useState } from "react";
import { workProcess } from "@/content/process";
import { Container } from "@/components/ui/container";

/**
 * Proceso: una secuencia real, así que aquí sí hay números. Un contador grande y fijo
 * sigue al paso que está en pantalla; la cota vertical se rellena hasta ese paso.
 */
export function Process({ id = "proceso" }: { id?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const total = workProcess.length;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <h2 id={`${id}-title`} className="text-display-m font-medium text-paper">
              Seis fases. Ninguna sorpresa.
            </h2>
            <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-paper-muted">
              Sabes en todo momento qué se está haciendo, por qué y qué recibes al terminar cada fase.
            </p>
            <div className="mt-12 hidden items-end gap-4 lg:flex" aria-hidden="true">
              <span className="font-mono text-[9rem] leading-[0.8] tracking-[-0.06em] text-paper tabular-nums">{pad(active + 1)}</span>
              <span className="pb-2 font-mono text-paper-subtle">/ {pad(total)}</span>
            </div>
            <p className="mt-4 hidden text-xl font-medium text-accent lg:block" aria-live="polite">
              {workProcess[active]?.title}
            </p>
          </div>
        </div>

        <ol className="relative lg:col-span-6 lg:col-start-7">
          <span className="absolute bottom-0 left-[0.3125rem] top-2 w-px bg-line-strong" aria-hidden="true" />
          <span
            className="absolute left-[0.3125rem] top-2 w-px bg-accent transition-[height] duration-700 ease-out-quint"
            style={{ height: `${((active + 0.5) / total) * 100}%` }}
            aria-hidden="true"
          />
          {workProcess.map((step, i) => (
            <li
              key={step.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="relative grid grid-cols-[1.75rem_1fr] gap-4 pb-16 last:pb-0 sm:gap-6"
            >
              <span
                className={`relative z-10 mt-2 h-[0.6875rem] w-[0.6875rem] rounded-full border transition-colors duration-500 ${
                  i <= active ? "border-accent bg-accent" : "border-line-strong bg-ink"
                }`}
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-sm text-paper-subtle">
                  {pad(i + 1)} {step.name}
                </p>
                <h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-paper sm:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-[54ch] text-paper-muted">{step.text}</p>
                <p className="mt-5 text-sm text-paper">
                  <span className="text-paper-subtle">Recibes: </span>
                  {step.output}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
