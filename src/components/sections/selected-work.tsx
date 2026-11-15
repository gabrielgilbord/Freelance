import Link from "next/link";
import { workByGroup, type Work } from "@/content/work";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import { ArrowUpRight } from "@/components/ui/icons";
import { ProductShot } from "@/components/work/product-shot";
import { SignalGlyph } from "@/components/work/system-diagram";

const glyphOf: Record<string, "ecg" | "sound" | "bars" | "message" | "chat"> = {
  ecg: "ecg",
  acoustic: "sound",
  industrial: "bars",
  automation: "message",
  chatbot: "chat",
};

/**
 * Trabajo seleccionado. Jerarquía clara: los dos productos propios mandan (capturas reales);
 * la ingeniería aplicada y la IA aportan profundidad en una lista editorial, sin tarjetas.
 */
export function SelectedWork() {
  const products = workByGroup("producto");
  const depth = [...workByGroup("ingenieria"), ...workByGroup("ia")];

  return (
    <section aria-labelledby="trabajo-title" className="border-t border-line py-16 sm:py-32">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="trabajo-title" className="text-display-m font-[450] text-paper lg:col-span-7">
            Experiencia construida, no prometida.
          </h2>
          <div className="self-end lg:col-span-5">
            <p className="max-w-[46ch] text-lg leading-relaxed text-paper-muted">
              Dos productos propios en marcha y experiencia de ingeniería en hardware, comunicaciones, industria e inteligencia artificial.
            </p>
            <Link href="/proyectos" className="link-underline mt-5 inline-block font-medium text-paper hover:text-accent">
              Ver el portfolio completo
            </Link>
          </div>
        </div>

        <div className="mt-10 space-y-14 sm:mt-20 sm:space-y-28">
          {products.map((w, i) => (
            <ProductFeature key={w.slug} work={w} flip={i % 2 === 1} />
          ))}
        </div>

        <div className="mt-16 sm:mt-28">
          <h3 className="text-xl font-medium text-paper sm:text-2xl">Ingeniería aplicada, investigación e IA</h3>
          <ul className="mt-6 border-t border-paper/80">
            {depth.map((w) => (
              <li key={w.slug} className="border-b border-line">
                <Link href={`/proyectos/${w.slug}`} className="group grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[4.5rem_1fr_15rem_1.5rem] sm:items-baseline sm:py-6">
                  <span className="hidden sm:block">{w.visual.kind === "diagram" && <SignalGlyph kind={glyphOf[w.visual.diagram] ?? "bars"} />}</span>
                  <span>
                    <span className="block text-lg font-medium leading-snug text-paper transition-colors group-hover:text-accent sm:text-xl">{w.name}</span>
                    <span className="mt-1 hidden max-w-[60ch] leading-snug text-paper-muted sm:block">{w.lead}</span>
                  </span>
                  <span className="font-mono text-xs leading-relaxed text-paper-subtle">
                    {w.setting}
                    {w.status ? ` · ${w.status}` : ""}
                  </span>
                  <ArrowUpRight size={18} className="hidden text-paper-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function ProductFeature({ work: w, flip }: { work: Work; flip: boolean }) {
  return (
    <article aria-labelledby={`w-${w.slug}`} className="grid items-center gap-6 sm:gap-10 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        {w.visual.kind === "capture" && (
          <ProductShot src={w.visual.src} alt={w.visual.alt} caption={w.visual.caption} host={w.links?.[0]?.label} width={w.visual.width} height={w.visual.height} />
        )}
      </div>
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="accent">{w.setting}</Tag>
          {w.status && <Tag>{w.status}</Tag>}
        </div>
        <h3 id={`w-${w.slug}`} className="mt-4 text-display-s font-[450] text-paper sm:mt-5">
          {w.name}
        </h3>
        <p className="mt-2 hidden font-mono text-xs text-paper-subtle sm:block">{w.category}</p>
        <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-paper-muted sm:mt-5">{w.lead}</p>
        <p className="mt-4 hidden max-w-[48ch] leading-relaxed text-paper-muted sm:block">{w.proves}</p>
        <Link href={`/proyectos/${w.slug}`} className="link-underline mt-6 inline-block font-medium text-paper hover:text-accent sm:mt-8">
          Ver la ficha de {w.name}
        </Link>
      </div>
    </article>
  );
}
