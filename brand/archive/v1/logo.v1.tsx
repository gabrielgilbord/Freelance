/**
 * Logotipo de Cota como componente (misma geometría que /brand/*.svg).
 * Hereda color con currentColor; el trazo oblicuo usa el acento.
 */
type Props = { className?: string; title?: string };

export function Isotipo({ className, title = "Cota" }: Props) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}>
      <path d="M33.2 33.2A13 13 0 1 1 33.2 14.8" stroke="currentColor" strokeWidth="5.5" fill="none" />
      <path d="M31 29L43 17" stroke="var(--color-accent)" strokeWidth="5.5" fill="none" />
    </svg>
  );
}

export function Wordmark({ className, title = "Cota" }: Props) {
  return (
    <svg viewBox="0 0 175 62" className={className} role="img" aria-label={title}>
      <g fill="none" stroke="currentColor" strokeWidth="8">
        <path d="M35.79 49.57A18 18 0 1 1 35.79 26.43" />
        <circle cx="70" cy="38" r="18" />
        <path d="M110 2V60M98 20H124" />
        <circle cx="153" cy="38" r="18" />
        <path d="M171 16V60" />
      </g>
    </svg>
  );
}

/** Versión compacta: isotipo + wordmark (cabecera y pie). */
export function LogoCompact({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Isotipo className="h-7 w-7" title="" />
      <Wordmark className="h-[1.15rem] w-auto" title="Cota" />
    </span>
  );
}
