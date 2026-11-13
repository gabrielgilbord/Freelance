/**
 * Diagrama de sistema del hero: un producto real cruza capas (interfaz, lógica,
 * inteligencia, datos y mundo físico). Dibujado como un plano: trazos rectos,
 * rotulado en monoespaciada y cotas. Animación con CSS + SMIL, sin JavaScript.
 */
type Node = { id: string; x: number; y: number; label: string; meta: string; core?: boolean };

const W = 140;
const H = 46;

const nodes: Node[] = [
  { id: "app", x: 40, y: 40, label: "App móvil", meta: "iOS · Android" },
  { id: "web", x: 300, y: 40, label: "Plataforma web", meta: "SaaS · Panel" },
  { id: "api", x: 170, y: 200, label: "API / Backend", meta: "Lógica de negocio", core: true },
  { id: "db", x: 20, y: 330, label: "Datos", meta: "SQL · Series" },
  { id: "ai", x: 320, y: 330, label: "Modelo de IA", meta: "LLM · Agentes" },
  { id: "iot", x: 170, y: 470, label: "Dispositivo IoT", meta: "Sensores · Firmware" },
];

const edges = [
  { id: "e-app", d: "M110 86V140H240V200", tag: "HTTPS", tx: 118, ty: 128 },
  { id: "e-web", d: "M370 86V140H240", tag: "", tx: 0, ty: 0 },
  { id: "e-db", d: "M170 223H90V330", tag: "SQL", tx: 98, ty: 214 },
  { id: "e-ai", d: "M310 223H390V330", tag: "EVENTOS", tx: 318, ty: 214 },
  { id: "e-iot", d: "M240 470V246", tag: "MQTT", tx: 248, ty: 420 },
];

// Pulsos: viajan por las conexiones en el sentido real del dato
const pulses = [
  { path: "M240 470V246", dur: "2.6s", begin: "0s" },
  { path: "M310 223H390V330", dur: "2.4s", begin: "1.1s" },
  { path: "M240 200V140H110V86", dur: "2.8s", begin: "0.5s" },
  { path: "M240 200V140H370V86", dur: "2.8s", begin: "1.9s" },
  { path: "M170 223H90V330", dur: "2.4s", begin: "2.4s" },
];

export function SystemDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox="0 0 480 580" className="h-auto w-full overflow-visible" role="img" aria-labelledby="sysdiag-title sysdiag-desc">
        <title id="sysdiag-title">Diagrama de un sistema completo</title>
        <desc id="sysdiag-desc">
          Una API central conecta una app móvil, una plataforma web, una base de datos, un modelo de inteligencia artificial y un dispositivo IoT.
        </desc>

        {/* Conexiones */}
        <g fill="none" stroke="var(--color-line-strong)" strokeWidth="1.25">
          {edges.map((e, i) => (
            <path
              key={e.id}
              d={e.d}
              pathLength={1}
              className="draw-line"
              style={{ "--len": 1, "--draw-delay": `${700 + i * 140}ms` } as React.CSSProperties}
            />
          ))}
        </g>
        <g className="fade-in" style={{ "--fade-delay": "1400ms" } as React.CSSProperties}>
          {edges.filter((e) => e.tag).map((e) => (
            <text key={e.id} x={e.tx} y={e.ty} className="fill-paper-subtle font-mono" fontSize="10" letterSpacing="1">
              {e.tag}
            </text>
          ))}
        </g>

        {/* Nodos */}
        {nodes.map((n, i) => (
          <g key={n.id} className="fade-in" style={{ "--fade-delay": `${300 + i * 110}ms` } as React.CSSProperties}>
            <rect x={n.x} y={n.y} width={W} height={H} rx="2" fill="var(--color-ink-1)" stroke={n.core ? "var(--color-paper-subtle)" : "var(--color-line-strong)"} />
            <rect x={n.x - 3} y={n.y - 3} width="6" height="6" fill={n.core ? "var(--color-accent)" : "var(--color-ink)"} stroke={n.core ? "none" : "var(--color-paper-subtle)"} />
            <text x={n.x + 12} y={n.y + 20} className="fill-paper" fontSize="13" fontWeight="500">{n.label}</text>
            <text x={n.x + 12} y={n.y + 36} className="fill-paper-subtle font-mono" fontSize="9.5" letterSpacing="0.6">{n.meta.toUpperCase()}</text>
          </g>
        ))}

        {/* Pulsos de datos */}
        <g className="signal" aria-hidden="true">
          {pulses.map((p, i) => (
            <circle key={i} r="3" fill="var(--color-accent)">
              <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            </circle>
          ))}
        </g>

        {/* Cota general */}
        <g className="fade-in" style={{ "--fade-delay": "1600ms" } as React.CSSProperties}>
          <path d="M20 540V570M460 540V570" stroke="var(--color-line-strong)" strokeWidth="1.25" />
          <path d="M20 556H460" stroke="var(--color-paper-subtle)" strokeWidth="1" />
          <path d="M14 562L26 550M454 562L466 550" stroke="var(--color-accent)" strokeWidth="2" />
          <rect x="164" y="548" width="152" height="16" fill="var(--color-ink)" />
          <text x="240" y="560" textAnchor="middle" className="fill-paper-muted font-mono" fontSize="10" letterSpacing="1.2">
            UN SOLO RESPONSABLE
          </text>
        </g>
      </svg>
    </figure>
  );
}
