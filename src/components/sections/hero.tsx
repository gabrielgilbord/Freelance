import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CotaLine } from "@/components/ui/cota-line";
import { SystemDiagram } from "./system-diagram";

const lines = ["Ingeniería de software,", "de la idea al sistema", "en producción."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(var(--header-h)+3rem)] pb-20 sm:pt-[calc(var(--header-h)+5rem)] lg:pb-28">
      {/* Retícula de plano que se desvanece hacia abajo */}
      <div className="grid-paper pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" aria-hidden="true" />

      <Container className="relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="label fade-in flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-accent">●</span>
            <span>Estudio de ingeniería de software</span>
            <span className="text-line-strong" aria-hidden="true">/</span>
            <span>Software · IA · IoT</span>
          </p>

          <h1 id="hero-title" className="mt-8 text-display-l font-medium text-paper">
            {lines.map((line, i) => (
              <span key={line} className="line-mask">
                <span className="line-rise" style={{ "--rise-delay": `${120 + i * 110}ms` } as React.CSSProperties}>
                  {i === lines.length - 1 ? <span className="text-paper-muted">{line}</span> : line}
                </span>
              </span>
            ))}
          </h1>

          <CotaLine className="mt-10 max-w-xl" start="Idea" end="Producción" label="De principio a fin" animate />

          <p className="fade-in mt-10 max-w-[56ch] text-lg leading-relaxed text-paper-muted sm:text-xl" style={{ "--fade-delay": "600ms" } as React.CSSProperties}>
            Diseño y desarrollo aplicaciones web y móviles, plataformas SaaS, inteligencia artificial aplicada y sistemas IoT.
            Me encargo del proyecto completo: entender el problema, definir la solución, diseñar la arquitectura,
            construirla y ponerla en marcha.
          </p>

          <div className="fade-in mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4" style={{ "--fade-delay": "750ms" } as React.CSSProperties}>
            <ButtonLink href="/contacto" arrow>Hablemos de tu proyecto</ButtonLink>
            <ButtonLink href="#servicios" variant="secondary">Explorar servicios</ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <SystemDiagram className="mx-auto max-w-[30rem]" />
        </div>
      </Container>
    </section>
  );
}
