import type { Work } from "@/content/work";
import { ProductShot } from "./product-shot";
import { SystemDiagram } from "./system-diagram";

const hostOf = (w: Work) => w.links?.[0]?.label;

/** La representación que corresponde a cada trabajo: captura real o esquema conceptual. */
export function WorkVisual({ work, priority = false, compact = false, withSecond = false }: { work: Work; priority?: boolean; compact?: boolean; withSecond?: boolean }) {
  const v = work.visual;
  if (v.kind === "diagram") {
    const diagram = <SystemDiagram diagram={v.diagram} caption={v.caption} compact={compact} />;
    if (!withSecond || !v.extra) return diagram;
    return (
      <div className="space-y-8">
        {diagram}
        <ProductShot src={v.extra.src} alt={v.extra.alt} caption={v.extra.caption} host={hostOf(work)} width={v.extra.width} height={v.extra.height} sizes="(min-width: 1440px) 1360px, 100vw" />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <ProductShot src={v.src} alt={v.alt} caption={v.caption} host={hostOf(work)} width={v.width} height={v.height} priority={priority} sizes={withSecond ? "(min-width: 1440px) 1360px, 100vw" : undefined} />
      {withSecond && v.second && <ProductShot src={v.second.src} alt={v.second.alt} caption={v.second.caption} sizes="(min-width: 1440px) 1360px, 100vw" />}
    </div>
  );
}

/** Aviso de borrador: lo que falta por confirmar. Nunca se muestra en producción. */
export function PendingNote({ items, show }: { items?: string[]; show: boolean }) {
  if (!show || !items?.length) return null;
  return (
    <aside className="rounded-sm border border-dashed border-accent/60 p-4 text-sm text-paper-muted">
      <p className="font-mono text-[0.6875rem] text-accent">Por confirmar antes de publicar · solo visible en preview</p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  );
}
