import { layers } from "@/content/capabilities";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Capabilities() {
  return (
    <section aria-labelledby="capacidades-title" className="relative border-t border-line bg-ink-1/40 py-24 sm:py-32">
      <Container>
        <SectionHeader
          id="capacidades-title"
          index="03"
          eyebrow="Capacidades"
          title="Del sensor a la pantalla, sin cambiar de interlocutor."
          intro="Un producto digital atraviesa varias capas. Cuando cada una la resuelve un proveedor distinto, los problemas aparecen en las fronteras. Yo trabajo todas las capas y me ocupo de que encajen."
        />

        <div className="mt-16 flex gap-4 sm:gap-8">
          {/* Cota vertical: una misma persona cubre todo el stack */}
          <div className="relative hidden w-8 shrink-0 sm:block" aria-hidden="true">
            <span className="absolute left-1/2 top-0 h-px w-6 -translate-x-1/2 bg-line-strong" />
            <span className="absolute bottom-0 left-1/2 h-px w-6 -translate-x-1/2 bg-line-strong" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-paper-subtle/60" />
            <span className="absolute left-1/2 top-0 h-3.5 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
            <span className="absolute bottom-0 left-1/2 h-3.5 w-[2px] -translate-x-1/2 translate-y-1/2 rotate-45 bg-accent" />
            <span className="label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap bg-[#0f100f] px-3 text-paper-muted">
              Un mismo responsable
            </span>
          </div>

          <ol className="flex-1 divide-y divide-line border-y border-line">
            {layers.map((layer, i) => (
              <Reveal as="li" key={layer.key} delay={i * 60} className="group grid gap-6 py-8 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4">
                  <p className="label">Capa {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-xl font-medium text-paper transition-colors duration-300 group-hover:text-accent">{layer.name}</h3>
                  <p className="mt-1 text-sm text-paper-subtle">{layer.caption}</p>
                </div>
                <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:auto-cols-fr sm:grid-flow-col md:col-span-8">
                  {layer.items.map((c) => (
                    <li key={c.name} className="bg-ink p-5 transition-colors duration-300 hover:bg-ink-2">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium text-paper">{c.name}</span>
                        <span className="label text-right">{c.label}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-paper-muted">{c.text}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
