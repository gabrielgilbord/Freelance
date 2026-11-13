import type { SVGProps } from "react";

/**
 * Iconografía propia: trazo de 1.5 px, terminaciones rectas, rejilla de 24 px.
 * Lenguaje de dibujo técnico, sin metáforas trilladas (bombillas, cerebros, robots).
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
  focusable: false,
});

export const ArrowRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M4 12h15M14 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Plus = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const Menu = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M3 8h18M3 16h18" /></svg>
);
export const Close = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>
);
export const Check = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);

/* Glifos de servicio */
const glyphs: Record<string, React.ReactNode> = {
  // Software: capas apiladas en proyección
  "desarrollo-software": <><path d="M3 8.5 12 4l9 4.5-9 4.5z" /><path d="m3 12.5 9 4.5 9-4.5" /><path d="m3 16.5 9 4.5 9-4.5" /></>,
  // IA: nodos conectados con un nodo central que decide
  "inteligencia-artificial": <><circle cx="12" cy="12" r="2.5" /><circle cx="4.5" cy="5" r="1.5" /><circle cx="19.5" cy="5" r="1.5" /><circle cx="4.5" cy="19" r="1.5" /><circle cx="19.5" cy="19" r="1.5" /><path d="m6 6.5 4.2 3.8M18 6.5l-4.2 3.8M6 17.5l4.2-3.8M18 17.5l-4.2-3.8" /></>,
  // IoT: un punto físico que emite
  "iot-sistemas-conectados": <><rect x="9.5" y="14" width="5" height="6" /><path d="M8 10.5a5.5 5.5 0 0 1 8 0M5.2 7.6a9.5 9.5 0 0 1 13.6 0" /></>,
  // Arquitectura: planta con cota
  "arquitectura-software": <><rect x="4" y="4" width="16" height="11" /><path d="M12 4v11M4 9.5h8" /><path d="M4 19h16M4 17.5v3M20 17.5v3" /></>,
  // Automatización: ciclo
  automatizacion: <><path d="M19 9a7.5 7.5 0 0 0-13.4-1.5M5 15a7.5 7.5 0 0 0 13.4 1.5" /><path d="M5.5 3.5v4h4M18.5 20.5v-4h-4" /></>,
  // Producto: de un punto a un volumen
  "producto-digital": <><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
};

export function ServiceGlyph({ slug, size = 28, ...p }: IconProps & { slug: string }) {
  return <svg {...base(size)} {...p}>{glyphs[slug]}</svg>;
}
