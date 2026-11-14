import { Container } from "@/components/ui/container";
import { CotaLine } from "@/components/ui/cota-line";

const statement =
  "La mayoría de proyectos tecnológicos no fallan por el código. Fallan en las fronteras: entre quien diseña y quien programa, entre el software y el hardware, entre la idea y lo que de verdad se usa. Trabajo para que esas fronteras no existan.";

const startingPoints = [
  { title: "Una idea sin plan", text: "Sabes qué problema quieres resolver, pero no qué construir ni cuánto costará." },
  { title: "Un proceso que pierde tiempo", text: "Tareas manuales, herramientas que no se hablan, datos que llegan tarde." },
  { title: "Un sistema que se ha quedado corto", text: "Una aplicación que no escala o un prototipo que hay que industrializar." },
];

export function Manifesto() {
  return (
    <section aria-labelledby="manifiesto-title" className="pt-20 pb-14 sm:py-40">
      <Container>
        <h2 id="manifiesto-title" className="sr-only">
          Por qué COTA
        </h2>
        <p className="word-reveal max-w-[22ch] text-[clamp(1.625rem,1.1rem+3.2vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.03em] text-paper sm:max-w-[24ch]">
          {statement.split(" ").map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </p>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-8 lg:mt-28 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="max-w-[30ch] text-lg font-medium leading-snug text-paper sm:text-xl">
              No necesitas llegar con un proyecto definido. Puedes llegar con:
            </p>
            <CotaLine className="mt-8 hidden max-w-xs sm:flex" />
          </div>
          <ul className="border-y border-line sm:grid sm:grid-cols-3 sm:gap-px sm:overflow-hidden lg:col-span-8">
            {startingPoints.map((p) => (
              <li key={p.title} className="py-4 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line sm:px-6 sm:py-6 sm:first:pl-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-t-0">
                <p className="font-medium text-paper">{p.title}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-paper-muted sm:mt-2 sm:text-base sm:leading-normal">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
