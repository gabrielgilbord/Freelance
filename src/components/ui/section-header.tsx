import type { ReactNode } from "react";

type Props = { index?: string; eyebrow?: string; title: ReactNode; intro?: ReactNode; id?: string; className?: string };

/** Encabezado de sección: el título habla solo (sin antetítulos ni numeración decorativa). */
export function SectionHeader({ title, intro, id, className = "" }: Props) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 ${className}`}>
      <h2 id={id} className="text-display-m font-[450] text-paper lg:col-span-7">
        {title}
      </h2>
      {intro && <p className="max-w-[46ch] self-end text-lg leading-relaxed text-paper-muted lg:col-span-5">{intro}</p>}
    </div>
  );
}
