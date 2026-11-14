"use client";

import { useState } from "react";
import { DemoFrame, useDemo, useTicker } from "./demo-frame";

/**
 * Demo de telemetría (datos simulados): temperatura de una cámara a −18 °C. Cada ciclo
 * la puerta se queda abierta, la temperatura sube, cruza el umbral, salta la alerta y,
 * al cerrarse la puerta, se recupera.
 */
const N = 48;
const SETPOINT = -18;
const THRESHOLD = -15;
const CYCLE = 90; // pasos por ciclo

// Escenario determinista: misma serie en servidor y cliente.
function tempAt(t: number) {
  const c = ((t % CYCLE) + CYCLE) % CYCLE;
  const noise = Math.sin(t * 1.7) * 0.18 + Math.sin(t * 0.53) * 0.12;
  let excursion = 0;
  if (c >= 30 && c < 52) excursion = Math.min(1, (c - 30) / 14) * 6.4; // puerta abierta: sube
  else if (c >= 52 && c < 76) excursion = 6.4 * Math.exp(-(c - 52) / 6); // puerta cerrada: recupera
  return SETPOINT + 0.2 + noise + excursion;
}
const doorOpenAt = (t: number) => {
  const c = ((t % CYCLE) + CYCLE) % CYCLE;
  return c >= 30 && c < 52;
};

const W = 320;
const H = 132;
const Y0 = -20;
const Y1 = -10;
const y = (v: number) => H - ((v - Y0) / (Y1 - Y0)) * H;

export function ColdRoomDemo({ className }: { className?: string }) {
  return (
    <DemoFrame title="Cámara 2 · congelados" className={className}>
      <ColdRoom />
    </DemoFrame>
  );
}

function ColdRoom() {
  const { reduced } = useDemo();
  // Con movimiento reducido se muestra el instante más explicativo: la alerta.
  const [t, setT] = useState(reduced ? 50 : 20);
  useTicker(450, () => setT((v) => v + 1));

  const now = reduced ? 50 : t;
  const series = Array.from({ length: N }, (_, i) => tempAt(now - N + 1 + i));
  const current = series[N - 1]!;
  const alert = series.some((v, i) => i > N - 26 && v > THRESHOLD);
  const open = doorOpenAt(now);
  const pts = series.map((v, i) => `${((i / (N - 1)) * W).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-row gap-6 sm:flex-col sm:gap-4">
        <div>
          <p className="text-xs text-paper-subtle">Temperatura</p>
          <p className={`font-mono text-4xl tabular-nums tracking-[-0.04em] transition-colors ${current > THRESHOLD ? "text-accent" : "text-paper"}`}>
            {current.toFixed(1)}
            <span className="text-lg text-paper-subtle"> °C</span>
          </p>
        </div>
        <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm">
          <dt className="text-paper-subtle">Consigna</dt>
          <dd className="font-mono text-paper">{SETPOINT} °C</dd>
          <dt className="text-paper-subtle">Umbral</dt>
          <dd className="font-mono text-paper">{THRESHOLD} °C</dd>
          <dt className="text-paper-subtle">Puerta</dt>
          <dd className={`font-mono ${open ? "text-accent" : "text-paper"}`}>{open ? "abierta" : "cerrada"}</dd>
        </dl>
      </div>
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Gráfica de temperatura de los últimos minutos. Lectura actual ${current.toFixed(1)} grados.`}>
          {[-20, -18, -15, -12, -10].map((v) => (
            <g key={v}>
              <line x1="0" x2={W} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeWidth="1" strokeDasharray={v === THRESHOLD ? "0" : "2 4"} />
            </g>
          ))}
          <line x1="0" x2={W} y1={y(THRESHOLD)} y2={y(THRESHOLD)} stroke="var(--color-accent)" strokeOpacity="0.55" strokeWidth="1" />
          <polyline points={pts} fill="none" stroke="var(--color-paper)" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx={W} cy={y(current)} r="3.5" fill={current > THRESHOLD ? "var(--color-accent)" : "var(--color-paper)"} />
        </svg>
        <div
          className={`mt-3 flex items-center gap-3 rounded-xs border px-3 py-2 text-sm transition-colors ${
            alert ? "border-accent/60 bg-accent/10 text-paper" : "border-line text-paper-muted"
          }`}
          aria-live="polite"
        >
          <span className={`h-2 w-2 shrink-0 rounded-full ${alert ? "bg-accent" : "bg-ok"}`} aria-hidden="true" />
          {alert ? "Umbral superado: aviso enviado al responsable de mantenimiento." : "Todo en rango. Registro guardado para auditoría."}
        </div>
      </div>
    </div>
  );
}
