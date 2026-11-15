import Link from "next/link";
import { services } from "@/content/services";
import { engagementModels } from "@/content/engagement";
import { Container } from "@/components/ui/container";
import { ArrowUpRight } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Process } from "@/components/sections/process";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata({
  title: "Servicios de desarrollo de software, IA e IoT",
  description:
    "Desarrollo de software a medida, inteligencia artificial aplicada, IoT, arquitectura de software, automatización de procesos y desarrollo de productos digitales.",
  path: "/servicios",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Inicio", path: "/" }, { name: "Servicios", path: "/servicios" }]}
        eyebrow="Servicios"
        title="Lo que podemos construir para tu negocio."
        intro="Seis líneas de trabajo que rara vez van por separado. Un sistema real combina interfaz, lógica, datos, inteligencia y, a veces, hardware. Elige por dónde empieza tu problema; del resto nos ocupamos nosotros."
      />

      <section aria-label="Líneas de servicio" className="pb-24 sm:pb-32">
        <Container>
          <ol className="border-t border-line">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 40} className="border-b border-line">
                <Link href={`/servicios/${s.slug}`} className="group grid grid-cols-[4.75rem_1fr_auto] items-center gap-4 py-4 transition-colors md:grid-cols-12 md:items-start md:gap-8 md:py-12">
                  <div className="relative aspect-square overflow-hidden rounded-sm border border-line bg-ink-1 md:col-span-3 md:aspect-auto md:overflow-visible md:rounded-none md:border-0 md:bg-transparent">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/art/services/${s.slug}.svg`}
                      alt=""
                      width={480}
                      height={400}
                      loading="lazy"
                      className="absolute left-1/2 top-1/2 h-auto w-[150%] max-w-none -translate-x-1/2 -translate-y-[46%] md:static md:w-full md:max-w-[18rem] md:translate-x-0 md:translate-y-0 md:transition-transform md:duration-700 md:ease-out-quint md:group-hover:-translate-y-1"
                    />
                  </div>
                  <div className="min-w-0 md:col-span-4">
                    <h2 className="text-[1.0625rem] font-medium leading-snug md:mt-1 md:text-2xl md:leading-tight lg:text-3xl text-paper transition-colors duration-300 group-hover:text-accent">{s.title}</h2>
                    <p className="mt-1 line-clamp-2 max-w-[48ch] text-sm text-paper-muted md:mt-3 md:line-clamp-none md:text-base">{s.pitch}</p>
                  </div>
                  <ul className="hidden space-y-2 self-center text-paper-muted md:col-span-4 md:block">
                    {s.problems.slice(0, 3).map((p) => (
                      <li key={p} className="flex gap-3 text-[0.9375rem]">
                        <span className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center md:col-span-1 md:justify-end md:self-center">
                    <ArrowUpRight size={18} className="text-paper-subtle transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="modelos-title" className="border-t border-line py-16 sm:py-32">
        <Container>
          <SectionHeader
            id="modelos-title"
            eyebrow="Formas de colaborar"
            title="Cuatro maneras de empezar a trabajar juntos."
            intro="El modelo se adapta a la madurez de tu proyecto. Si no sabes cuál encaja, lo vemos en la primera conversación."
          />
          <ul className="mt-16 grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2">
            {engagementModels.map((m, i) => (
              <Reveal as="li" key={m.name} delay={(i % 2) * 80} className="bg-ink p-6 sm:p-10">
                <p className="text-sm text-paper-subtle">{m.for}</p>
                <h3 className="mt-4 text-2xl font-medium text-paper">{m.name}</h3>
                <p className="mt-3 max-w-[52ch] text-paper-muted">{m.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <Process />
      <FinalCta />
      <JsonLd data={breadcrumbLd([{ name: "Inicio", path: "/" }, { name: "Servicios", path: "/servicios" }])} />
    </>
  );
}
