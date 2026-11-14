import Link from "next/link";
import { principles } from "@/content/principles";
import { Container } from "@/components/ui/container";

/** El estudio: una declaración y los principios como reglas, sin tarjetas. */
export function AboutTeaser() {
  return (
    <section aria-labelledby="estudio-title" className="border-t border-line py-16 sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="estudio-title" className="text-display-m font-medium text-paper">
            Un estudio de una sola persona. A propósito.
          </h2>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-paper-muted">
            COTA es mi estudio de ingeniería de software. Trabajo con mentalidad de producto: me importa que lo que construyo se use,
            se mantenga y resuelva el problema por el que existe. Mi ventaja es la amplitud técnica: puedo conectar una interfaz, un
            backend, un modelo de IA y un dispositivo físico, y entender cómo se afectan entre sí.
          </p>
          <Link href="/sobre-mi" className="link-underline mt-10 inline-block font-medium text-paper hover:text-accent">
            Conocer el estudio
          </Link>
        </div>
        <dl className="self-end border-t border-paper/80 lg:col-span-5 lg:col-start-8">
          {principles.map((p) => (
            <div key={p.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="font-medium text-paper">{p.title}</dt>
              <dd className="text-paper-muted">{p.text}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
