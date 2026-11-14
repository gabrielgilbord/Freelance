"use client";

import { useState } from "react";
import { Check } from "@/components/ui/icons";
import { DemoFrame, useDemo, useTicker } from "./demo-frame";

/**
 * Demo de automatización (datos simulados): un pedido en PDF llega por email, se extraen
 * los campos con su confianza, el dudoso pasa por revisión humana y se registra en el ERP.
 */
const FIELDS = [
  { k: "Cliente", v: "Suministros Norte (demo)", conf: 0.99 },
  { k: "Referencia", v: "TOR-M8-INOX", conf: 0.97 },
  { k: "Cantidad", v: "1.200 uds.", conf: 0.71 },
  { k: "Entrega", v: "28/11/2026", conf: 0.95 },
];
const STAGES = ["Recibido", "Extraído", "Revisado", "En el ERP"] as const;
// Línea de tiempo en ticks
const T_FIELDS = 3; // primer campo
const T_REVIEW = T_FIELDS + FIELDS.length * 2 + 2;
const T_ERP = T_REVIEW + 6;
const TOTAL = T_ERP + 10;

export function OrdersDemo({ className }: { className?: string }) {
  return (
    <DemoFrame title="Entrada de pedidos" className={className}>
      <Orders />
    </DemoFrame>
  );
}

function Orders() {
  const { reduced } = useDemo();
  const [t, setT] = useState(reduced ? TOTAL - 1 : 4);
  useTicker(420, () => setT((v) => (v + 1) % TOTAL));
  const now = reduced ? TOTAL - 1 : t;

  const shown = Math.max(0, Math.min(FIELDS.length, Math.floor((now - T_FIELDS) / 2) + 1));
  const reviewed = now >= T_REVIEW;
  const inErp = now >= T_ERP;
  const stage = inErp ? 3 : reviewed ? 2 : shown > 0 ? 1 : 0;

  return (
    <div className="p-5">
      <ol className="grid grid-cols-4 gap-2" aria-label="Estado del pedido">
        {STAGES.map((s, i) => (
          <li key={s} aria-current={i === stage ? "step" : undefined}>
            <span className={`block h-1 rounded-full transition-colors duration-500 ${i <= stage ? "bg-accent" : "bg-line-strong"}`} />
            <span className={`mt-2 block text-xs transition-colors ${i <= stage ? "text-paper" : "text-paper-subtle"}`}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 grid gap-4 sm:grid-cols-[7.5rem_1fr]">
        {/* el documento recibido */}
        <div className="relative hidden aspect-[3/4] rounded-xs border border-line-strong bg-paper/[0.03] p-3 sm:block" aria-hidden="true">
          <p className="truncate font-mono text-[0.625rem] text-paper-subtle">pedido_0412.pdf</p>
          <div className="mt-3 space-y-1.5">
            {[80, 60, 90, 45, 70, 55, 85].map((w, i) => (
              <span key={i} className={`block h-1 rounded-full ${shown > 0 && i % 2 === 0 && i / 2 < shown ? "bg-accent/70" : "bg-line-strong"}`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <caption className="sr-only">Campos extraídos del pedido</caption>
          <tbody>
            {FIELDS.map((f, i) => {
              const visible = i < shown;
              const low = f.conf < 0.8;
              return (
                <tr key={f.k} className={`border-b border-line transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-25"}`}>
                  <th scope="row" className="py-2 pr-3 text-left font-normal text-paper-subtle">{f.k}</th>
                  <td className="py-2 pr-3 text-paper">{visible ? f.v : "—"}</td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {visible &&
                      (low && !reviewed ? (
                        <span className="rounded-xs bg-accent/15 px-1.5 py-0.5 text-accent">{f.conf.toFixed(2)} revisar</span>
                      ) : low && reviewed ? (
                        <span className="inline-flex items-center gap-1 text-paper">
                          <Check size={12} /> confirmado
                        </span>
                      ) : (
                        <span className="text-paper-muted">{f.conf.toFixed(2)}</span>
                      ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        className={`mt-4 rounded-xs border px-3 py-2 text-sm transition-colors ${inErp ? "border-accent/60 bg-accent/10 text-paper" : "border-line text-paper-muted"}`}
        aria-live="polite"
      >
        {inErp
          ? "Registrado en el ERP como pedido PV-0412. Confirmación enviada al cliente."
          : reviewed
            ? "Cantidad confirmada por una persona en un clic. Registrando…"
            : shown >= 3
              ? "Un campo por debajo del umbral de confianza: pasa a revisión humana."
              : "Leyendo el PDF adjunto al email…"}
      </p>
    </div>
  );
}
