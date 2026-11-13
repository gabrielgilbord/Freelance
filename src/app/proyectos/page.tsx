import { projectRepository } from "@/lib/projects/repository";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/project/project-card";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata({
  title: "Proyectos y casos técnicos",
  description:
    "Casos de desarrollo de software, inteligencia artificial, IoT y automatización: problema, solución, arquitectura y criterios de éxito.",
  path: "/proyectos",
});

export default async function ProjectsPage() {
  const projects = await projectRepository.all();
  const hasConcepts = projects.some((p) => p.status === "concept");

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Inicio", path: "/" }, { name: "Proyectos", path: "/proyectos" }]}
        eyebrow="Proyectos"
        title="Problemas reales, sistemas completos."
        intro="Cada caso explica de qué problema parte, qué solución se plantea, cómo es su arquitectura y cómo se mide si funciona."
      />
      <section aria-label="Listado de proyectos" className="pb-24 sm:pb-32">
        <Container>
          {hasConcepts && (
            <div className="mb-14 flex max-w-3xl gap-4 rounded-sm border border-line bg-ink-1 p-5 sm:p-6">
              <span className="label mt-0.5 shrink-0 text-accent">Nota</span>
              <p className="text-paper-muted">
                Los casos marcados como <strong className="font-medium text-paper">Concepto · Demo técnica</strong> no son trabajos para clientes
                ni muestran resultados reales. Sirven para enseñar cómo abordo un tipo de problema. Los proyectos para clientes se publican
                aquí cuando hay autorización para hacerlo.
              </p>
            </div>
          )}
          <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 90}>
                <ProjectCard project={p} headingLevel="h2" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
      <FinalCta title="¿Tu proyecto podría ser el siguiente caso?" />
      <JsonLd data={breadcrumbLd([{ name: "Inicio", path: "/" }, { name: "Proyectos", path: "/proyectos" }])} />
    </>
  );
}
