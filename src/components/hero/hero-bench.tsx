"use client";

import { useState, type ReactNode } from "react";
import spots from "@/content/hero-hotspots.json";

/**
 * El banco COTA: la ilustración isométrica del hero (generada con Anatomy Asset) con su
 * leyenda. Los rótulos nunca van dentro del dibujo: cada punto numerado del objeto se
 * corresponde con una entrada de la leyenda, y ambos se resaltan juntos.
 */
const parts = [
  { id: "modulo", n: "1", name: "Tu sistema", text: "La pieza que falta. La diseño, la construyo y la encajo en lo que ya tienes." },
  { id: "producto", n: "2", name: "Producto digital", text: "Webs, apps móviles, SaaS y paneles que la gente usa de verdad." },
  { id: "ia", n: "3", name: "Inteligencia artificial", text: "Modelos que leen, extraen y responden con tus datos, bajo control." },
  { id: "datos", n: "4", name: "Datos y arquitectura", text: "Bases de datos, APIs e infraestructura pensadas para crecer." },
  { id: "iot", n: "5", name: "IoT y hardware", text: "Sensores, firmware y dispositivos conectados a tu plataforma." },
] as const;

type PartId = (typeof parts)[number]["id"];

export function HeroBench({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<PartId | null>(null);

  return (
    <div className="relative">
      <div className="lg:grid lg:grid-cols-12 lg:items-start">
      <div className="relative z-10 lg:col-span-5 lg:pt-6 xl:pt-12">{children}</div>
      <figure className="relative mx-auto mt-6 w-full max-w-[64rem] lg:col-span-7 lg:-mt-6 lg:-ml-[24%] lg:-mr-[7%] lg:w-auto lg:max-w-none xl:-mt-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/art/hero.svg"
          width={1000}
          height={760}
          alt="Un banco de pruebas mecanizado con los módulos de un sistema real: cómputo de IA con ventilador, rack de datos, placa IoT con antena, módulo de interfaz con pantalla y, en naranja, un módulo flotando sobre su zócalo vacío."
          className="h-auto w-full select-none"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
        {parts.map((p) => {
          const pos = spots[p.id];
          const on = active === p.id;
          return (
            <button
              key={p.id}
              type="button"
              aria-label={`${p.n}. ${p.name}`}
              aria-describedby={`part-${p.id}`}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
              className="fade-in absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, "--fade-delay": "1300ms" } as React.CSSProperties}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[0.6875rem] transition-all duration-300 ${
                  on ? "scale-125 border-accent bg-accent text-accent-ink" : "border-paper/50 bg-ink/80 text-paper"
                }`}
              >
                {p.n}
              </span>
            </button>
          );
        })}
      </figure>
      </div>

      <ol className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-5">
        {parts.map((p) => {
          const on = active === p.id;
          return (
            <li
              key={p.id}
              id={`part-${p.id}`}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              className="grid grid-cols-[1.75rem_1fr] gap-x-2"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border font-mono text-[0.625rem] transition-colors duration-300 ${
                  on ? "border-accent bg-accent text-accent-ink" : "border-line-strong text-paper-muted"
                }`}
              >
                {p.n}
              </span>
              <div>
                <p className={`font-medium transition-colors duration-300 ${on ? "text-accent" : "text-paper"}`}>{p.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-paper-muted">{p.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
