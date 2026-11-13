import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/** Compromisos de trabajo (no métricas inventadas). */
const items = [
  { k: "Interlocución", v: "Hablas con quien diseña y construye, sin intermediarios." },
  { k: "Alcance", v: "Desde la idea hasta la puesta en producción y el mantenimiento." },
  { k: "Propiedad", v: "El código, los datos y los accesos son tuyos." },
  { k: "Respuesta", v: `Contesto a cada solicitud ${site.contact.responseTime}.` },
];

export function PromiseStrip() {
  return (
    <section aria-label="Cómo trabajo" className="border-y border-line">
      <Container>
        <ul className="grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal as="li" key={it.k} delay={i * 70} className="border-b border-line py-8 last:border-b-0 sm:px-6 sm:first:pl-0 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:[&:nth-child(-n+2)]:border-b-0">
              <p className="label text-accent">{it.k}</p>
              <p className="mt-3 text-paper">{it.v}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
