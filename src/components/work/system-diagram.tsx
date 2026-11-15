import type { DiagramKey } from "@/content/work";

/**
 * Esquemas de sistema: el recorrido de un dato, de la señal a quien lo usa.
 * Son ilustraciones conceptuales (se rotulan siempre como tales), dibujadas en HTML
 * para que se lean igual de bien a 360 px que a 1920 px: en móvil la cadena es
 * vertical y en escritorio horizontal. Un solo punto naranja: la señal de origen.
 */

type Stage = { kicker: string; title: string };
type Link = { label?: string; both?: boolean };
type Spec = { glyph: Glyph; stages: Stage[]; links: Link[] };
type Glyph = "ecg" | "sound" | "bars" | "message" | "chat" | "field";

const specs: Record<DiagramKey, Spec> = {
  ecg: {
    glyph: "ecg",
    stages: [
      { kicker: "Señal", title: "Electrocardiograma" },
      { kicker: "Raspberry Pi · cliente", title: "Generación de claves" },
      { kicker: "Raspberry Pi · gateway", title: "Intercambio de datos" },
    ],
    links: [{ label: "captura" }, { label: "datos", both: true }],
  },
  industrial: {
    glyph: "bars",
    stages: [
      { kicker: "Planta", title: "Datos de producción" },
      { kicker: "Software", title: "Detección temprana de anomalías" },
      { kicker: "Grafana", title: "Visualización" },
      { kicker: "Equipo", title: "Supervisión del proceso" },
    ],
    links: [{}, {}, {}],
  },
  acoustic: {
    glyph: "sound",
    stages: [
      { kicker: "Entorno", title: "Nivel sonoro" },
      { kicker: "Arduino", title: "Nodo de medición" },
      { kicker: "Radio", title: "Red LoRaWAN" },
      { kicker: "Grafana", title: "Tiempo real" },
    ],
    links: [{}, { label: "LoRaWAN" }, {}],
  },
  automation: {
    glyph: "message",
    stages: [
      { kicker: "Entrada", title: "Mensaje o llamada" },
      { kicker: "Orquestación", title: "Flujos automatizados" },
      { kicker: "IA", title: "Agentes" },
      { kicker: "Negocio", title: "Servicios integrados" },
    ],
    links: [{}, { both: true }, {}],
  },
  chatbot: {
    glyph: "chat",
    stages: [
      { kicker: "Clientela", title: "Consultas" },
      { kicker: "Asistente", title: "Chatbot con IA" },
      { kicker: "Establecimiento", title: "Interacciones y tareas" },
    ],
    links: [{ both: true }, {}],
  },
  fieldops: {
    glyph: "field",
    stages: [
      { kicker: "Oficina", title: "Alta y asignación de la obra" },
      { kicker: "Móvil · sin conexión", title: "Checklist, fotos GPS, nº de serie y firmas" },
      { kicker: "Plataforma", title: "Sincronización por empresa" },
      { kicker: "Expediente", title: "Dossier PDF, datos CIE y pack de subvención" },
    ],
    links: [{}, { label: "sync" }, {}],
  },
  infra: {
    glyph: "bars",
    stages: [
      { kicker: "Cloud", title: "AWS · Oracle Cloud" },
      { kicker: "Automatización", title: "n8n autoalojado" },
      { kicker: "Producto", title: "Servicios propios" },
    ],
    links: [{}, {}],
  },
};

function SignalGlyph({ kind }: { kind: Glyph }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const };
  return (
    <svg viewBox="0 0 64 24" className="h-5 w-14 text-accent" aria-hidden="true">
      {kind === "ecg" && <path {...common} d="M0 14H18L22 10L25 14H29L32 2L36 22L39 14H46L49 11L52 14H64" />}
      {kind === "sound" && <path {...common} d="M2 12V12M10 8V16M18 4V20M26 9V15M34 2V22M42 7V17M50 10V14M58 5V19" />}
      {kind === "bars" && <path {...common} d="M4 22V14M14 22V10M24 22V16M34 22V6M44 22V12M54 22V3M0 23H64" />}
      {kind === "message" && <path {...common} d="M6 4H50V16H22L14 22V16H6Z M56 8L62 12L56 16" />}
      {kind === "field" && <path {...common} d="M4 18L20 6L36 18M10 14V22H30V14 M44 22V10L52 4L60 10V22Z M52 10V14" />}
      {kind === "chat" && <path {...common} d="M4 3H36V13H16L10 18V13H4Z M28 9H60V19H54V23L48 19H28Z" />}
    </svg>
  );
}

export function SystemDiagram({ diagram, caption, compact = false }: { diagram: DiagramKey; caption?: string; compact?: boolean }) {
  const spec = specs[diagram];
  const n = spec.stages.length;
  return (
    <figure className="rounded-md border border-line bg-ink-1/60 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <SignalGlyph kind={spec.glyph} />
        <span className="font-mono text-[0.6875rem] text-paper-subtle">Esquema conceptual</span>
      </div>
      <ol
        className={`mt-5 flex flex-col ${compact ? "" : "sm:mt-8"} ${compact ? "" : "md:grid md:items-stretch"}`}
        style={compact ? undefined : ({ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` } as React.CSSProperties)}
      >
        {spec.stages.map((s, i) => {
          const link = spec.links[i];
          return (
            <li key={s.title} className="relative flex flex-col md:flex-row">
              <div className={`flex-1 rounded-sm border px-3.5 py-3 ${i === 0 ? "border-accent/50" : "border-line-strong"} bg-ink`}>
                <p className="font-mono text-[0.6875rem] leading-tight text-paper-subtle">{s.kicker}</p>
                <p className="mt-1 text-[0.9375rem] font-medium leading-snug text-paper">{s.title}</p>
              </div>
              {i < n - 1 && link && (
                <div
                  aria-hidden="true"
                  className={`flex items-center gap-2 py-1.5 pl-4 ${compact ? "" : "md:w-14 md:shrink-0 md:flex-col md:justify-center md:gap-1 md:py-0 md:pl-0"}`}
                >
                  <span className={`block h-5 w-px bg-line-strong ${compact ? "" : "md:h-px md:w-full"}`} />
                  {(link.label || link.both) && (
                    <span className="font-mono text-[0.6875rem] leading-none text-paper-subtle">
                      {link.both ? "⇄" : ""}
                      {link.both && link.label ? " " : ""}
                      {link.label}
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {caption && <figcaption className="mt-5 text-sm text-paper-subtle">{caption}</figcaption>}
    </figure>
  );
}

export { SignalGlyph };
