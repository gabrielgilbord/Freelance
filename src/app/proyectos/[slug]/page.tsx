import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectRepository, statusLabel } from "@/lib/projects/repository";
import { projects as allProjects } from "@/content/projects";
import { getService } from "@/content/services";
import { absoluteUrl } from "@/content/site";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { ProjectCover } from "@/components/project/project-cover";
import { projectDemos } from "@/components/demos";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await projectRepository.bySlug(slug);
  if (!p) return {};
  const prefix = p.status === "concept" ? "Concepto: " : "";
  return pageMetadata({ title: `${prefix}${p.title}`, description: p.summary, path: `/proyectos/${p.slug}` });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await projectRepository.bySlug(slug);
  if (!project) notFound();

  const all = await projectRepository.all();
  const idx = all.findIndex((p) => p.slug === project.slug);
  const next = all[(idx + 1) % all.length];
  const path = `/proyectos/${project.slug}`;
  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Proyectos", path: "/proyectos" },
    { name: project.title, path },
  ];
  const isConcept = project.status === "concept";
  const Demo = projectDemos[project.slug];

  return (
    <>
      <PageHeader crumbs={crumbs} title={project.title} intro={project.summary}>
        <div className="mt-8">
          <Tag tone={isConcept ? "default" : "accent"}>{statusLabel[project.status]}</Tag>
        </div>
        <dl className="mt-12 grid max-w-4xl gap-6 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <dt className="label">Sector</dt>
            <dd className="mt-2 text-paper">{project.sector}</dd>
          </div>
          <div>
            <dt className="label">Servicios</dt>
            <dd className="mt-2 flex flex-col gap-1">
              {project.services.map((s) => {
                const svc = getService(s);
                return svc ? <Link key={s} href={`/servicios/${s}`} className="link-underline w-fit text-paper">{svc.title}</Link> : null;
              })}
            </dd>
          </div>
          <div>
            <dt className="label">{isConcept ? "Tipo" : "Año"}</dt>
            <dd className="mt-2 text-paper">{isConcept ? "Demo técnica, sin cliente" : project.year ?? "—"}</dd>
          </div>
        </dl>
      </PageHeader>

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProjectCover project={project} priority />
          </div>
          {Demo && (
            <div className="lg:col-span-5">
              <h2 className="mb-4 text-xl font-medium text-paper">Así funcionaría</h2>
              <Demo />
              {isConcept && (
                <p className="mt-3 text-sm text-paper-subtle">
                  Demostración con datos simulados. No representa un sistema de un cliente real.
                </p>
              )}
            </div>
          )}
        </div>
      </Container>

      <section aria-labelledby="problema" className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="problema" className="text-xl font-medium text-accent">El problema</h2>
            <p className="mt-6 text-xl leading-relaxed text-paper">{project.problem}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-xl font-medium text-accent">La solución</h2>
            <p className="mt-6 text-lg leading-relaxed text-paper-muted">{project.solution}</p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="arquitectura" className="border-t border-line bg-ink-1/40 py-20 sm:py-28">
        <Container>
          <h2 id="arquitectura" className=" text-display-s font-medium text-paper">Cómo está construido.</h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:gap-0">
            {project.architecture.map((layer, i) => (
              <Reveal as="li" key={layer.name} delay={i * 80} className="relative lg:pr-8">
                <p className="label">{String(i + 1).padStart(2, "0")} · {layer.name}</p>
                <ul className="mt-4 space-y-2">
                  {layer.parts.map((part, j) => (
                    <li key={part} className="relative rounded-xs border border-line-strong bg-ink px-4 py-3 text-sm text-paper">
                      <span aria-hidden="true" className={`absolute -left-[3px] -top-[3px] h-1.5 w-1.5 ${j === 0 ? "bg-accent" : "bg-line-strong"}`} />
                      {part}
                    </li>
                  ))}
                </ul>
                {i < project.architecture.length - 1 && (
                  <ArrowRight aria-hidden="true" size={18} className="absolute right-1.5 top-[2.85rem] hidden text-paper-subtle lg:block" />
                )}
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span className="label mr-2">Tecnologías</span>
            {project.stack.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        </Container>
      </section>

      <section aria-labelledby="resultados" className="border-t border-line py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="resultados" className=" text-display-s font-medium text-paper">
              {project.results?.length ? "Lo que ha cambiado." : "Cómo se mediría."}
            </h2>
            {!project.results?.length && (
              <p className="mt-4 text-paper-muted">
                Al tratarse de un concepto no hay resultados reales que mostrar. Estos son los indicadores que se acordarían para validar la solución.
              </p>
            )}
          </div>
          <div className="lg:col-span-8">
            {project.results?.length ? (
              <dl className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
                {project.results.map((r) => (
                  <div key={r.metric} className="bg-ink p-6 sm:p-8">
                    <dt className="label">{r.metric}</dt>
                    <dd className="mt-3 text-display-s font-medium text-paper">{r.value}</dd>
                    {r.note && <dd className="mt-2 text-sm text-paper-subtle">{r.note}</dd>}
                  </div>
                ))}
              </dl>
            ) : (
              <ol className="border-t border-line">
                {project.successCriteria?.map((c, i) => (
                  <li key={c} className="flex gap-6 border-b border-line py-5 text-lg text-paper">
                    <span className="font-mono text-sm text-paper-subtle">{String(i + 1).padStart(2, "0")}</span>
                    {c}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Container>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section aria-labelledby="galeria" className="border-t border-line py-20 sm:py-28">
          <Container>
            <h2 id="galeria" className="text-display-s font-medium text-paper">Galería</h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {project.gallery.map((g, i) => (
                <li key={g.src} className={i === 0 ? "md:col-span-2" : ""}>
                  <figure>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-line">
                      <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                    {g.caption && <figcaption className="mt-3 text-sm text-paper-subtle">{g.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {next && next.slug !== project.slug && (
        <section aria-label="Siguiente proyecto" className="border-t border-line">
          <Container>
            <Link href={`/proyectos/${next.slug}`} className="group flex flex-col gap-3 py-14 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label">Siguiente caso</p>
                <p className="mt-3 text-display-s font-medium text-paper transition-colors group-hover:text-accent">{next.title}</p>
              </div>
              <ArrowRight size={32} className="text-paper-subtle transition-transform duration-500 group-hover:translate-x-2 group-hover:text-accent" />
            </Link>
          </Container>
        </section>
      )}

      <FinalCta title="¿Tienes un problema parecido?" />
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary,
            url: absoluteUrl(path),
            genre: statusLabel[project.status],
            keywords: project.stack.join(", "),
          },
        ]}
      />
    </>
  );
}
