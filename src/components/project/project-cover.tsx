import type { Project } from "@/lib/projects/types";

/**
 * Portada generada a partir de la arquitectura del proyecto: un plano de capas.
 * Evita usar capturas falsas en proyectos conceptuales y mantiene coherencia visual.
 */
export function ProjectCover({ project, className = "" }: { project: Project; className?: string }) {
  if (project.cover) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.cover.src} alt={project.cover.alt} className={`h-full w-full object-cover ${className}`} />;
  }

  const layers = project.architecture;
  const colW = 600 / layers.length;

  return (
    <svg viewBox="0 0 600 340" className={`h-full w-full ${className}`} role="img" aria-label={`Esquema de arquitectura: ${layers.map((l) => l.name).join(", ")}`}>
      <rect width="600" height="340" fill="var(--color-ink-1)" />
      <g stroke="var(--color-line)" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="340" />)}
        {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 50 + 20} x2="600" y2={i * 50 + 20} />)}
      </g>
      {layers.map((l, i) => {
        const x = i * colW + 18;
        const w = colW - 36;
        return (
          <g key={l.name}>
            <text x={x} y="56" className="fill-paper-subtle font-mono" fontSize="10" letterSpacing="1">{String(i + 1).padStart(2, "0")} · {l.name.toUpperCase()}</text>
            {l.parts.map((p, j) => (
              <g key={p}>
                <rect x={x} y={76 + j * 54} width={w} height="40" rx="2" fill="var(--color-ink)" stroke={i === 1 && j === 0 ? "var(--color-paper-subtle)" : "var(--color-line-strong)"} />
                <rect x={x - 2.5} y={76 + j * 54 - 2.5} width="5" height="5" fill={j === 0 ? "var(--color-accent)" : "var(--color-line-strong)"} />
                <text x={x + 9} y={100 + j * 54} className="fill-paper-muted" fontSize="9.5">
                  {p.length > 21 ? `${p.slice(0, 20)}…` : p}
                </text>
              </g>
            ))}
            {i < layers.length - 1 && (
              <path d={`M${x + w} 96H${x + w + 36}`} stroke="var(--color-paper-subtle)" strokeWidth="1" />
            )}
          </g>
        );
      })}
      <path d="M18 300V320M582 300V320" stroke="var(--color-line-strong)" />
      <path d="M18 310H582" stroke="var(--color-paper-subtle)" />
      <path d="M13 315L23 305M577 315L587 305" stroke="var(--color-accent)" strokeWidth="2" />
    </svg>
  );
}
