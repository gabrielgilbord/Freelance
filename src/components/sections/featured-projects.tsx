import { projectRepository } from "@/lib/projects/repository";
import { ProjectCard } from "@/components/project/project-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export async function FeaturedProjects() {
  const projects = await projectRepository.featured();
  const allConcepts = projects.every((p) => p.status === "concept");

  return (
    <section aria-labelledby="proyectos-title" className="border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeader
          id="proyectos-title"
          index="05"
          eyebrow="Proyectos"
          title="Cómo se plantea un sistema completo."
          intro={
            allConcepts
              ? "Estos casos son conceptos técnicos, no trabajos para clientes: muestran cómo abordo problemas habituales, de la arquitectura a los criterios de éxito."
              : "Una selección de proyectos con el problema de partida, la solución construida y lo que ha cambiado después."
          }
        />
        <ul className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 90}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </ul>
        <div className="mt-14">
          <ButtonLink href="/proyectos" variant="secondary" arrow>Ver todos los proyectos</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
