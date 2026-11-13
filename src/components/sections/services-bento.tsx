import Link from "next/link";
import { services } from "@/content/services";
import { Container } from "@/components/ui/container";
import { ArrowUpRight, ServiceGlyph } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

// Composición asimétrica en 12 columnas: ritmo editorial, no una rejilla uniforme
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

export function ServicesBento() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="py-24 sm:py-32">
      <Container>
        <SectionHeader
          id="servicios-title"
          index="01"
          eyebrow="Servicios"
          title="Seis disciplinas. Un mismo criterio técnico."
          intro="Cada proyecto combina varias de estas áreas. Lo importante no es la tecnología, sino que todas las piezas encajen y resuelvan el problema de tu negocio."
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2 lg:grid-cols-12">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 2) * 80} className={`bg-ink ${spans[i]}`}>
              <Link
                href={`/servicios/${s.slug}`}
                className="group relative flex h-full min-h-[22rem] flex-col p-6 transition-colors duration-500 hover:bg-ink-1 sm:p-8 lg:p-10"
              >
                {/* Cota que se traza al pasar el ratón: la microinteracción de la marca */}
                <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-quint group-hover:scale-x-100 sm:inset-x-8 lg:inset-x-10" />

                <div className="flex items-start justify-between">
                  <ServiceGlyph slug={s.slug} className="text-paper-muted transition-colors duration-500 group-hover:text-accent" />
                  <span className="label">{s.index} / {s.discipline}</span>
                </div>

                <h3 className="mt-auto pt-12 text-2xl font-medium text-paper sm:text-[1.75rem]">{s.title}</h3>
                <p className="mt-3 max-w-[46ch] text-paper-muted">{s.pitch}</p>

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-paper-subtle">
                  {s.deliverables.slice(0, 3).map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <span className="h-px w-2.5 bg-line-strong" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>

                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-paper">
                  Ver servicio
                  <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
