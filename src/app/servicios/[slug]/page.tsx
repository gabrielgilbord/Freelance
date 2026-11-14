import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { projectRepository } from "@/lib/projects/repository";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowUpRight, Check, Plus } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { ProjectCard } from "@/components/project/project-card";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd, faqLd, serviceLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seo.title, description: s.seo.description, path: `/servicios/${s.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = (await projectRepository.all()).filter((p) => p.services.includes(service.slug)).slice(0, 2);
  const others = services.filter((s) => s.slug !== service.slug);
  const path = `/servicios/${service.slug}`;
  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/servicios" },
    { name: service.title, path },
  ];

  return (
    <>
      <PageHeader
        crumbs={crumbs}
        title={service.title}
        intro={service.intro}
        aside={
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/art/services/${service.slug}.svg`} alt="" width={480} height={400} fetchPriority="high" className="mx-auto h-auto w-full max-w-[32rem]" />
        }
      >
        <div className="fade-in mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" style={{ "--fade-delay": "450ms" } as React.CSSProperties}>
          <ButtonLink href={`/contacto?servicio=${service.slug}`} arrow>Hablemos de tu proyecto</ButtonLink>
          <ButtonLink href="#como-trabajo" variant="secondary">Cómo trabajo</ButtonLink>
        </div>
      </PageHeader>

      {/* Problemas */}
      <section aria-labelledby="problemas" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="problemas" className="text-display-s font-[450] text-paper">¿Te suena alguna de estas situaciones?</h2>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:col-span-8">
            {service.problems.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 60} className="bg-ink p-6 sm:p-8">
                <span className="block h-px w-6 bg-accent" aria-hidden="true" />
                <p className="mt-5 text-lg text-paper">{p}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Qué construyo + qué obtienes */}
      <section aria-labelledby="entregables" className="border-t border-line bg-ink-1/40 py-14 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="entregables" className="text-display-s font-[450] text-paper">Soluciones, no horas de programación.</h2>
            <ul className="mt-10 border-t border-line">
              {service.deliverables.map((d) => (
                <li key={d} className="flex gap-4 border-b border-line py-4 text-paper">
                  <Plus size={18} className="mt-0.5 shrink-0 text-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="text-xl font-medium text-paper">Qué obtiene tu negocio</h3>
            <ul className="mt-6 space-y-4">
              {service.outcomes.map((o, i) => (
                <Reveal as="li" key={o.title} delay={i * 80} className="rounded-sm border border-line bg-ink p-6 sm:p-8">
                  <h3 className="flex items-center gap-3 text-xl font-medium text-paper">
                    <Check size={20} className="text-accent" />
                    {o.title}
                  </h3>
                  <p className="mt-2 text-paper-muted">{o.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Cómo se desarrolla */}
      <section id="como-trabajo" aria-labelledby="como-title" className="border-t border-line py-14 sm:py-28">
        <Container>
          <h2 id="como-title" className="max-w-[22ch] text-display-s font-[450] text-paper">Paso a paso, con entregas que puedes ver.</h2>
          <ol className="rail -mx-4 mt-8 px-4 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-px md:overflow-hidden md:rounded-sm md:border md:border-line md:bg-line md:px-0 lg:grid-cols-4">
            {service.steps.map((st, i) => (
              <Reveal as="li" key={st.title} delay={i * 70} className="relative w-[76%] rounded-md border border-line bg-ink p-5 md:w-auto md:rounded-none md:border-0 md:p-8">
                <span className="font-mono text-sm text-paper-subtle">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-medium text-paper md:mt-8">{st.title}</h3>
                <p className="mt-2 text-paper-muted">{st.text}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="label mr-2">Tecnología habitual</span>
            {service.stack.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
          <p className="mt-3 text-sm text-paper-subtle">La tecnología se elige en función del problema; esta lista es orientativa.</p>
        </Container>
      </section>

      {/* Casos relacionados */}
      {related.length > 0 && (
        <section aria-labelledby="casos-title" className="border-t border-line py-14 sm:py-28">
          <Container>
            <h2 id="casos-title" className="text-display-s font-[450] text-paper">Así se plantea en la práctica.</h2>
            <ul className="rail -mx-4 mt-8 px-4 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-12 md:px-0">
              {related.map((p) => <li key={p.slug} className="w-[84%] md:w-auto"><ProjectCard project={p} /></li>)}
            </ul>
          </Container>
        </section>
      )}

      {/* FAQ con divulgación progresiva nativa */}
      <section aria-labelledby="faq-title" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="text-display-s font-[450] text-paper">Antes de empezar.</h2>
          </div>
          <div className="border-t border-line lg:col-span-8">
            {service.faq.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium text-paper [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus size={20} className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-[62ch] pb-6 text-paper-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Otros servicios */}
      <section aria-labelledby="otros-title" className="border-t border-line py-20">
        <Container>
          <h2 id="otros-title" className="text-xl font-medium text-paper">Otros servicios</h2>
          <ul className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug} className="border-t border-line">
                <Link href={`/servicios/${o.slug}`} className="group flex items-start justify-between gap-3 py-4 text-paper-muted hover:text-paper">
                  {o.title}
                  <ArrowUpRight size={16} className="mt-1 shrink-0 transition-colors group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCta title="¿Encaja con lo que necesitas?" />
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          serviceLd({ title: service.title, description: service.seo.description, path }),
          faqLd(service.faq),
        ]}
      />
    </>
  );
}
