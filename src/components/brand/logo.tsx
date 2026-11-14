/**
 * Logotipo de COTA v2 ("calibrado") como componente. Misma geometría que /brand/*.svg:
 * el isotipo es la "c" del wordmark (radio 18, trazo 8) cerrada por el trazo de cota a 45°.
 * Símbolo y letras comparten unidad, así que el grosor óptico es idéntico en cualquier tamaño.
 * Versión anterior: brand/archive/v1/logo.v1.tsx
 */
type Props = { className?: string; title?: string };

const a11y = (title: string) => (title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const });

const C_PATH = "M35.79 49.57A18 18 0 1 1 35.79 26.43";
const TICK = "M30 47L50 27";

function WordPaths() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="8">
      <path d={C_PATH} />
      <circle cx="70" cy="38" r="18" />
      <path d="M110 2V60M98 20H124" />
      <circle cx="153" cy="38" r="18" />
      <path d="M171 16V60" />
    </g>
  );
}

export function Isotipo({ className, title = "Cota" }: Props) {
  return (
    <svg viewBox="-4 12 62 52" className={className} {...a11y(title)}>
      <path d={C_PATH} stroke="currentColor" strokeWidth="8" fill="none" />
      <path d={TICK} stroke="var(--color-accent)" strokeWidth="8" fill="none" />
    </svg>
  );
}

export function Wordmark({ className, title = "Cota" }: Props) {
  return (
    <svg viewBox="-4 -2 183 66" className={className} {...a11y(title)}>
      <WordPaths />
    </svg>
  );
}

/** Lockup compacto: isotipo + wordmark en una sola geometría (cabecera y pie). */
export function LogoCompact({ className, title = "Cota" }: Props) {
  return (
    <svg viewBox="-4 -2 263 66" className={`h-6 w-auto ${className ?? ""}`} {...a11y(title)}>
      <path d={C_PATH} stroke="currentColor" strokeWidth="8" fill="none" />
      <path d={TICK} stroke="var(--color-accent)" strokeWidth="8" fill="none" />
      <g transform="translate(76 0)">
        <WordPaths />
      </g>
    </svg>
  );
}
