import { principles } from "@/content/principles";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function AboutTeaser() {
  return (
    <section aria-labelledby="estudio-title" className="border-t border-line py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal as="p" className="label flex items-center gap-3">
            <span className="text-accent">06</span>
            <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
            Detrás de Cota
          </Reveal>
          <Reveal as="h2" id="estudio-title" delay={60} className="mt-6 text-display-s font-medium text-paper">
            Un estudio de una sola persona. A propósito.
          </Reveal>
          <Reveal as="p" delay={120} className="mt-6 max-w-[48ch] text-lg leading-relaxed text-paper-muted">
            Cota es mi estudio de ingeniería de software. Trabajo con mentalidad de producto: me importa que lo que construyo se use,
            se mantenga y resuelva el problema por el que existe. Mi ventaja es la amplitud técnica: puedo conectar una interfaz,
            un backend, un modelo de IA y un dispositivo físico, y entender cómo se afectan entre sí.
          </Reveal>
          <Reveal delay={180} className="mt-10">
            <ButtonLink href="/sobre-mi" variant="text" arrow>Conocer el estudio</ButtonLink>
          </Reveal>
        </div>

        <ul className="grid gap-px self-start overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:col-span-7">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 70} className="bg-ink p-6 sm:p-8">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-lg font-medium text-paper">{p.title}</h3>
              <p className="mt-2 text-paper-muted">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
