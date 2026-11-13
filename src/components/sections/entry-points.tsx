import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

const entries = [
  {
    n: "A",
    title: "Tienes una idea, pero no un plan",
    text: "Sabes qué problema quieres resolver, pero no qué construir, cuánto costará ni por dónde empezar.",
    then: "Definimos juntos la primera versión que tiene sentido construir y te doy un plan por fases.",
  },
  {
    n: "B",
    title: "Tu operación pierde tiempo o datos",
    text: "Procesos manuales, herramientas que no se hablan, información que llega tarde o con errores.",
    then: "Mido dónde está la fricción y propongo la automatización o el software que la elimina.",
  },
  {
    n: "C",
    title: "Tienes un sistema que hay que llevar más lejos",
    text: "Una aplicación que se ha quedado pequeña, un prototipo que hay que industrializar o un equipo que necesita refuerzo técnico.",
    then: "Reviso lo que hay, decido qué conservar y planteo cómo evolucionarlo sin parar el negocio.",
  },
];

export function EntryPoints() {
  return (
    <section aria-labelledby="entrada-title" className="border-t border-line py-24 sm:py-32">
      <Container>
        <SectionHeader
          id="entrada-title"
          index="02"
          eyebrow="Punto de partida"
          title="No necesitas llegar con un proyecto definido."
          intro="La mayoría de proyectos empiezan con una intuición o con un problema que molesta cada día. Convertirlo en una solución técnica concreta es parte del trabajo."
        />
        <ol className="mt-16 grid gap-6 lg:grid-cols-3">
          {entries.map((e, i) => (
            <Reveal as="li" key={e.n} delay={i * 90} className="flex flex-col rounded-sm border border-line bg-ink-1 p-6 sm:p-8">
              <span className="flex h-9 w-9 items-center justify-center border border-line-strong font-mono text-sm text-accent" aria-hidden="true">{e.n}</span>
              <h3 className="mt-8 text-xl font-medium text-paper">{e.title}</h3>
              <p className="mt-3 text-paper-muted">{e.text}</p>
              <div className="mt-auto pt-8">
                <div className="border-t border-dashed border-line-strong pt-5">
                  <p className="label mb-2">Qué hacemos</p>
                  <p className="text-paper">{e.then}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
