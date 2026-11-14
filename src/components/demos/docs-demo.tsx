"use client";

import { useState } from "react";
import { DemoFrame, useDemo, useTicker } from "./demo-frame";

/**
 * Demo de asistente documental (datos simulados): se escribe la pregunta, se buscan
 * fragmentos y aparece una respuesta en la que cada afirmación cita su fuente.
 */
const QUESTION = "¿Qué par de apriete lleva la brida del compresor C-200?";
const ANSWER = [
  { text: "El par de apriete es de 45 N·m, aplicado en secuencia cruzada en dos pasadas", cite: 1 },
  { text: ". Si la junta se ha desmontado, debe sustituirse antes del montaje", cite: 2 },
  { text: ".", cite: 0 },
];
const SOURCES = [
  { n: 1, doc: "Manual de mantenimiento C-200", where: "pág. 42" },
  { n: 2, doc: "Procedimiento PR-07, juntas y bridas", where: "apartado 3.1" },
];

// Fases por tick: escribir (len) → buscar (6) → responder (palabras) → pausa (10)
const typeSteps = QUESTION.length;
const searchSteps = 6;
const answerWords = ANSWER.map((a) => a.text).join("").split(" ").length;
const holdSteps = 14;
const TOTAL = typeSteps + searchSteps + answerWords + holdSteps;

function revealParts(visibleWords: number) {
  const out: { text: string; cite: number; complete: boolean }[] = [];
  let left = visibleWords;
  for (const a of ANSWER) {
    const words = a.text.split(" ");
    const take = Math.min(words.length, left);
    left -= take;
    out.push({ cite: a.cite, text: words.slice(0, take).join(" "), complete: take === words.length });
  }
  return out;
}

export function DocsDemo({ className }: { className?: string }) {
  return (
    <DemoFrame title="Asistente técnico" className={className}>
      <Docs />
    </DemoFrame>
  );
}

function Docs() {
  const { reduced } = useDemo();
  const [t, setT] = useState(reduced ? TOTAL - 1 : 8);
  useTicker(70, () => setT((v) => (v + 1) % TOTAL));
  const now = reduced ? TOTAL - 1 : t;

  const typed = QUESTION.slice(0, Math.min(now, typeSteps));
  const searching = now >= typeSteps && now < typeSteps + searchSteps;
  const shownWords = Math.max(0, now - typeSteps - searchSteps);
  const done = shownWords >= answerWords;

  // Reparte las palabras visibles entre los tramos de la respuesta
  const parts = revealParts(shownWords);

  return (
    <div className="p-5">
      <div className="flex min-h-12 items-center gap-3 rounded-xs border border-line-strong bg-ink px-4 py-3">
        <span className="font-mono text-xs text-paper-subtle">P</span>
        <p className="text-paper">
          {typed}
          {now < typeSteps && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-accent" aria-hidden="true" />}
        </p>
      </div>

      <div className="mt-4 min-h-[9.5rem] rounded-xs border border-line px-4 py-4" aria-live="polite">
        {now < typeSteps ? (
          <p className="text-sm text-paper-subtle">Escribe una pregunta sobre la documentación técnica.</p>
        ) : searching ? (
          <p className="font-mono text-sm text-paper-muted">Buscando en manuales y procedimientos…</p>
        ) : (
          <>
            <p className="leading-relaxed text-paper">
              {parts.map((p, i) => (
                <span key={i}>
                  {p.text}
                  {p.cite > 0 && p.complete && (
                    <sup className="mx-0.5 rounded-xs bg-accent/15 px-1 font-mono text-[0.6875rem] text-accent">[{p.cite}]</sup>
                  )}
                </span>
              ))}
            </p>
            {done && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm">
                {SOURCES.map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span className="font-mono text-accent">[{s.n}]</span>
                    <span className="text-paper-muted">
                      {s.doc} <span className="text-paper-subtle">· {s.where}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
