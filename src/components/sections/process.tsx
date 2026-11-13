import { workProcess } from "@/content/process";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function Process({ index = "04" }: { index?: string }) {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="border-t border-line py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <Reveal as="p" className="label flex items-center gap-3">
              <span className="text-accent">{index}</span>
              <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
              Proceso
            </Reveal>
            <Reveal as="h2" id="proceso-title" delay={60} className="mt-6 text-display-s font-medium text-paper">
              Seis fases. Ninguna sorpresa.
            </Reveal>
            <Reveal as="p" delay={120} className="mt-6 max-w-[42ch] text-lg leading-relaxed text-paper-muted">
              Un proceso pensado para que sepas en todo momento qué se está haciendo, por qué y qué recibes al terminar cada fase.
            </Reveal>
          </div>
        </div>

        <ol className="relative lg:col-span-8">
          {/* Línea de cota vertical que recorre todo el proceso */}
          <span className="absolute bottom-6 left-[1.1875rem] top-6 w-px bg-line-strong sm:left-[1.4375rem]" aria-hidden="true" />
          {workProcess.map((step, i) => (
            <Reveal as="li" key={step.key} className="relative grid grid-cols-[2.5rem_1fr] gap-5 pb-12 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-8">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center border border-line-strong bg-ink font-mono text-sm text-paper sm:h-12 sm:w-12">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-1 sm:pt-2">
                <p className="label text-accent">{step.name}</p>
                <h3 className="mt-2 text-2xl font-medium text-paper">{step.title}</h3>
                <p className="mt-3 max-w-[58ch] text-paper-muted">{step.text}</p>
                <p className="mt-5 inline-flex items-center gap-3 rounded-xs border border-line px-3 py-2 text-sm text-paper">
                  <span className="label">Entregable</span>
                  {step.output}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
