"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Marco común de las demos: título, aviso de datos simulados y control de pausa
 * (WCAG 2.2.2: el contenido que se actualiza solo debe poder pausarse). La demo solo
 * corre si está en pantalla, no está pausada y el usuario no pide movimiento reducido.
 */
type DemoState = { running: boolean; reduced: boolean };
const Ctx = createContext<DemoState>({ running: false, reduced: false });
export const useDemo = () => useContext(Ctx);

/** Llama a `tick` cada `ms` mientras la demo está corriendo. */
export function useTicker(ms: number, tick: () => void) {
  const { running } = useDemo();
  const ref = useRef(tick);
  useEffect(() => {
    ref.current = tick;
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => ref.current(), ms);
    return () => window.clearInterval(id);
  }, [running, ms]);
}

export function DemoFrame({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.25 });
    if (root.current) io.observe(root.current);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const running = visible && !paused && !reduced;

  return (
    <div ref={root} className={`overflow-hidden rounded-md border border-line-strong bg-ink-1 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${running ? "bg-accent animate-pulse-dot" : "bg-line-strong"}`} aria-hidden="true" />
          <p className="truncate text-sm font-medium text-paper">{title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-[0.6875rem] text-paper-subtle">datos simulados</span>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="flex h-8 min-w-8 items-center justify-center rounded-xs border border-line-strong px-2 text-paper-muted transition-colors hover:border-paper/60 hover:text-paper"
            >
              <span className="sr-only">{paused ? "Reanudar demo" : "Pausar demo"}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
                {paused ? <path d="M3 1.5v9l7-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
              </svg>
            </button>
          )}
        </div>
      </div>
      <Ctx.Provider value={{ running, reduced }}>{children}</Ctx.Provider>
    </div>
  );
}
