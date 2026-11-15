import Link from "next/link";
import { projectRepository } from "@/lib/projects/repository";
import { workByGroup, groupInfo, infrastructure, showDrafts, type Work, type WorkGroup } from "@/content/work";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/tag";
import { ProjectCard } from "@/components/project/project-card";
import { WorkVisual, PendingNote } from "@/components/work/work-visual";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata({
  title: "Portfolio: productos, ingeniería e investigación",
  description:
    "Productos SaaS propios, investigación con sistemas embebidos, software industrial, IoT con LoRaWAN, inteligencia artificial e infraestructura cloud. Cada trabajo indica su contexto y la participación real.",
  path: "/proyectos",
});

const groups: WorkGroup[] = ["producto", "ingenieria", "ia"];

export default async function ProjectsPage() {
  const concepts = (await projectRepository.all()).filter((p) => p.status === "concept");

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Inicio", path: "/" }, { name: "Proyectos", path: "/proyectos" }]}
        title="Productos, ingeniería e investigación."
        intro="Qué se ha construido, en qué contexto y con qué papel. Las capturas son reales; los esquemas son conceptuales y están rotulados como tales."
      >
        <nav aria-label="Secciones del portfolio" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-paper-muted">
          {groups.map((g) => (
            <a key={g} href={`#${g}`} className="link-underline hover:text-paper">{groupInfo[g].title}</a>
          ))}
          <a href="#infraestructura" className="link-underline hover:text-paper">Infraestructura</a>
          <a href="#conceptos" className="link-underline hover:text-paper">Demos de concepto</a>
        </nav>
      </PageHeader>

      {groups.map((g) => (
        <section key={g} id={g} aria-labelledby={`${g}-title`} className="scroll-mt-24 border-t border-line py-14 sm:py-24">
          <Container>
            <div className="grid gap-4 lg:grid-cols-12">
              <h2 id={`${g}-title`} className="text-display-s font-[450] text-paper lg:col-span-6">{groupInfo[g].title}</h2>
              <p className="max-w-[52ch] self-end text-paper-muted lg:col-span-6">{groupInfo[g].intro}</p>
            </div>
            <div className={`mt-10 sm:mt-16 ${g === "producto" ? "space-y-16 sm:space-y-28" : "space-y-12 sm:space-y-20"}`}>
              {workByGroup(g).map((w, i) => (
                <WorkEntry key={w.slug} work={w} flip={g === "producto" && i % 2 === 1} />
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section id="infraestructura" aria-labelledby="infra-title" className="scroll-mt-24 border-t border-line bg-ink-1/40 py-14 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="infra-title" className="text-display-s font-[450] text-paper">{infrastructure.title}</h2>
            <p className="mt-5 max-w-[48ch] text-paper-muted">{infrastructure.text}</p>
            <div className="mt-6"><PendingNote items={infrastructure.pending} show={showDrafts} /></div>
          </div>
          <dl className="border-t border-paper/80 lg:col-span-7">
            {infrastructure.items.map((it) => (
              <div key={it.name} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:py-5">
                <dt className="font-medium text-paper">{it.name}</dt>
                <dd className="text-paper-muted">{it.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="conceptos" aria-labelledby="conceptos-title" className="scroll-mt-24 border-t border-line py-14 sm:py-24">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12">
            <h2 id="conceptos-title" className="text-display-s font-[450] text-paper lg:col-span-6">Demos de concepto</h2>
            <p className="max-w-[52ch] self-end text-paper-muted lg:col-span-6">
              Tres sistemas planteados como ejercicio técnico, con demos que usan datos simulados. No son trabajos para clientes ni muestran resultados reales.
            </p>
          </div>
          <ul className="mt-10 grid gap-x-8 gap-y-14 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {concepts.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 90}>
                <ProjectCard project={p} headingLevel="h3" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCta title="¿Tienes un sistema que construir?" />
      <JsonLd data={breadcrumbLd([{ name: "Inicio", path: "/" }, { name: "Proyectos", path: "/proyectos" }])} />
    </>
  );
}

function WorkEntry({ work: w, flip }: { work: Work; flip: boolean }) {
  const isProduct = w.group === "producto";
  return (
    <article aria-labelledby={`e-${w.slug}`} className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div className={`${isProduct ? "lg:col-span-7" : "lg:col-span-6"} ${flip ? "lg:order-2" : ""} ${isProduct ? "" : "lg:order-2"}`}>
        <WorkVisual work={w} />
      </div>
      <div className={`${isProduct ? "lg:col-span-5" : "lg:col-span-6"} ${flip ? "lg:order-1" : ""} ${isProduct ? "" : "lg:order-1"}`}>
        <div className="flex flex-wrap gap-2">
          <Tag tone={isProduct ? "accent" : "default"}>{w.setting}</Tag>
          <Tag>{w.role}</Tag>
          {w.status && <Tag>{w.status}</Tag>}
        </div>
        <h3 id={`e-${w.slug}`} className="mt-5 text-2xl font-medium leading-tight tracking-[-0.02em] text-paper sm:text-3xl">{w.name}</h3>
        <p className="mt-2 font-mono text-xs text-paper-subtle">{w.category}</p>
        <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-paper-muted">{w.lead}</p>
        {w.stack.length > 0 && (
          <p className="mt-4 font-mono text-xs leading-relaxed text-paper-subtle">{w.stack.join(" · ")}</p>
        )}
        <Link href={`/proyectos/${w.slug}`} className="link-underline mt-6 inline-block font-medium text-paper hover:text-accent">
          Ver la ficha completa
        </Link>
      </div>
    </article>
  );
}
