/**
 * La línea de cota: el elemento gráfico de la marca.
 * Dos líneas de referencia, la línea de medida y los trazos oblicuos que marcan
 * inicio y fin. Simboliza la promesa: de principio a fin.
 */
type CotaLineProps = {
  start?: string;
  end?: string;
  label?: string;
  className?: string;
  animate?: boolean;
};

export function CotaLine({ start, end, label, className = "", animate = false }: CotaLineProps) {
  return (
    <div className={`relative flex items-center gap-3 ${className}`} aria-hidden={!label && !start && !end}>
      {start && <span className="label shrink-0 text-paper-muted">{start}</span>}
      <div className="relative h-6 flex-1">
        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 24" aria-hidden="true">
          <line x1="0" y1="2" x2="0" y2="22" stroke="var(--color-line-strong)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="2" x2="100" y2="22" stroke="var(--color-line-strong)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line
            x1="0" y1="12" x2="100" y2="12"
            stroke="var(--color-paper-subtle)" strokeWidth="1"
            pathLength={1}
            className={animate ? "draw-line" : undefined}
            style={animate ? ({ "--len": 1, "--draw-delay": "500ms" } as React.CSSProperties) : undefined}
          />
        </svg>
        {/* Los trazos oblicuos se dibujan fuera del SVG estirado para conservar los 45° */}
        <span className="absolute left-0 top-1/2 h-3.5 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
        <span className="absolute right-0 top-1/2 h-3.5 w-[2px] translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
        {label && (
          <span className="label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-ink px-2 text-paper-muted sm:px-3">
            {label}
          </span>
        )}
      </div>
      {end && <span className="label shrink-0 text-paper-muted">{end}</span>}
    </div>
  );
}
