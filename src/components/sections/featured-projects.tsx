import Link from "next/link";
import { projectRepository, statusLabel } from "@/lib/projects/repository";
import { projectDemos } from "@/components/demos";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import { ProjectCover } from "@/components/project/project-cover";

/**
 * Casos: cada uno es un sistema completo, con su ilustración isométrica y una demo
 * que muestra lo que hace. Composición alterna, no una rejilla de tarjetas.
 */
export async function FeaturedProjects() {
  const projects = await projectRepository.featured();
  const allConcepts = projects.every((p) => p.status === "concept");

  return (
    <section aria-labelledby="proyectos-title" className="border-t border-line py-24 sm:py-32">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="proyectos-title" className="text-display-m font-medium text-paper lg:col-span-7">
            Sistemas completos, explicados en marcha.
          </h2>
          <p className="max-w-[46ch] self-end text-lg leading-relaxed text-paper-muted lg:col-span-5">
            {allConcepts
              ? "Estos casos son conceptos técnicos, no trabajos para clientes. Las demos usan datos simulados para enseñar cómo funcionaría cada sistema."
              : "Una selección de proyectos con el problema de partida, la solución construida y lo que ha cambiado después."}
          </p>
        </div>

        <div className="mt-20 space-y-28 sm:space-y-36">
          {projects.map((p, i) => {
            const Demo = projectDemos[p.slug];
            const flip = i % 2 === 1;
            return (
              <article key={p.slug} aria-labelledby={`case-${p.slug}`} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className={`relative lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-md">
                    <ProjectCover project={p} />
                  </div>
                  {Demo && (
                    <div className={`relative z-10 -mt-16 sm:-mt-24 sm:w-[86%] ${flip ? "sm:mr-auto sm:-ml-4" : "sm:ml-auto sm:-mr-4"}`}>
                      <Demo className="shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]" />
                    </div>
                  )}
                </div>
                <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <Tag tone={p.status === "concept" ? "default" : "accent"}>{statusLabel[p.status]}</Tag>
                    <span className="text-sm text-paper-subtle">{p.sector}</span>
                  </div>
                  <h3 id={`case-${p.slug}`} className="mt-5 text-display-s font-medium text-paper">
                    {p.title}
                  </h3>
                  <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-paper-muted">{p.summary}</p>
                  <Link href={`/proyectos/${p.slug}`} className="link-underline mt-8 inline-block font-medium text-paper hover:text-accent">
                    Ver el caso: problema, arquitectura y criterios de éxito
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-24">
          <ButtonLink href="/proyectos" variant="secondary">
            Todos los proyectos
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
