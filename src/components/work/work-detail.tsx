import Link from "next/link";
import { work as allWork, layerInfo, showDrafts, type Work } from "@/content/work";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { ArrowUpRight } from "@/components/ui/icons";
import { WorkVisual, PendingNote } from "./work-visual";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

/** Ficha editorial de un trabajo real: contexto, qué se construyó, tecnologías y qué demuestra. */
export function WorkDetail({ work: w }: { work: Work }) {
  const path = `/proyectos/${w.slug}`;
  const crumbs = [
    { name: "Inicio", path: "/" },
    { name: "Proyectos", path: "/proyectos" },
    { name: w.name, path },
  ];
  const idx = allWork.findIndex((x) => x.slug === w.slug);
  const next = allWork[(idx + 1) % allWork.length];
  const meta: { k: string; v: string }[] = [
    { k: "Categoría", v: w.category },
    { k: "Participación", v: w.role },
    { k: "Contexto", v: w.setting },
    ...(w.status ? [{ k: "Estado", v: w.status }] : []),
  ];

  return (
    <>
      <PageHeader crumbs={crumbs} title={w.name} intro={w.lead}>
        <div className="mt-8 flex flex-wrap gap-2">
          <Tag tone={w.group === "producto" ? "accent" : "default"}>{w.setting}</Tag>
          {w.status && <Tag>{w.status}</Tag>}
        </div>
        <dl className="mt-10 grid max-w-4xl gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="label">{m.k}</dt>
              <dd className="mt-1.5 text-paper">{m.v}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <Container>
        <div className={w.visual.kind === "diagram" ? "max-w-5xl" : ""}>
          <WorkVisual work={w} priority withSecond />
        </div>
      </Container>

      <section aria-labelledby="contexto" className="py-14 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="contexto" className="text-xl font-medium text-accent">Contexto y problema</h2>
            <p className="mt-5 text-lg leading-relaxed text-paper sm:text-xl">{w.context}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-xl font-medium text-accent">{w.group === "producto" ? "Qué he construido" : "En qué trabajé"}</h2>
            <ul className="mt-5 border-t border-line">
              {w.built.map((b) => (
                <li key={b} className="border-b border-line py-4 text-paper-muted">{b}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section aria-labelledby="demuestra" className="border-t border-line bg-ink-1/40 py-14 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 id="demuestra" className="text-display-s font-[450] text-paper">Qué demuestra.</h2>
          </div>
          <div className="space-y-8 lg:col-span-7">
            <p className="text-lg leading-relaxed text-paper sm:text-xl">{w.proves}</p>
            <dl className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <dt className="label">Capas</dt>
                <dd className="mt-2 space-y-1 text-paper-muted">
                  {w.layers.map((l) => (
                    <p key={l}>{layerInfo[l].name}</p>
                  ))}
                </dd>
              </div>
              {w.stack.length > 0 && (
                <div>
                  <dt className="label">Tecnologías verificadas</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {w.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            {w.links && w.links.length > 0 && (
              <p className="flex flex-wrap gap-6">
                {w.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 font-medium text-paper hover:text-accent">
                    {l.label}
                    <ArrowUpRight size={16} />
                  </a>
                ))}
              </p>
            )}
            <PendingNote items={w.pending} show={showDrafts} />
          </div>
        </Container>
      </section>

      {next && next.slug !== w.slug && (
        <section aria-label="Siguiente trabajo" className="border-t border-line">
          <Container>
            <Link href={`/proyectos/${next.slug}`} className="group flex flex-col gap-3 py-14 sm:flex-row sm:items-end sm:justify-between">
              <span>
                <span className="label">Siguiente</span>
                <span className="mt-3 block text-display-s font-[450] text-paper transition-colors group-hover:text-accent">{next.name}</span>
              </span>
              <span className="font-mono text-xs text-paper-subtle">{next.setting}</span>
            </Link>
          </Container>
        </section>
      )}

      <FinalCta />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
