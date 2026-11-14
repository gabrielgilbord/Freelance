import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroBench } from "@/components/hero/hero-bench";

const lines = ["Ingeniería de software,", "de la idea al sistema", "en producción."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(var(--header-h)+1.25rem)] pb-12 sm:pt-[calc(var(--header-h)+3rem)] lg:pb-24">
      <Container className="relative">
        <HeroBench
          title={
            <h1 id="hero-title" className="text-[clamp(2.375rem,1.1rem+3.4vw,4.75rem)] font-[450] leading-[0.95] tracking-[-0.045em] text-paper">
              {lines.map((line, i) => (
                <span key={line} className="line-mask">
                  <span className="line-rise" style={{ "--rise-delay": `${80 + i * 110}ms` } as React.CSSProperties}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          }
          body={
            <div className="fade-in" style={{ "--fade-delay": "550ms" } as React.CSSProperties}>
              {/* Móvil: la promesa en una frase. Escritorio: el alcance completo. */}
              <p className="mt-2 max-w-[34ch] text-[1.0625rem] leading-relaxed text-paper-muted sm:hidden">
                Software, IA e IoT a medida, con un único responsable de la idea a producción.
              </p>
              <p className="mt-8 hidden max-w-[36ch] text-lg leading-relaxed text-paper-muted sm:block">
                Diseño y desarrollo aplicaciones web y móviles, plataformas SaaS, inteligencia artificial aplicada y sistemas IoT. Un solo
                responsable para todo el recorrido: entender el problema, diseñar la arquitectura, construirla y ponerla en marcha.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <ButtonLink href="/contacto">Hablemos de tu proyecto</ButtonLink>
                <span className="hidden sm:contents">
                  <ButtonLink href="#servicios" variant="secondary">
                    Explorar servicios
                  </ButtonLink>
                </span>
              </div>
            </div>
          }
        />
      </Container>
    </section>
  );
}
