import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroBench } from "@/components/hero/hero-bench";

const lines = ["Ingeniería de software,", "de la idea al sistema", "en producción."];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[calc(var(--header-h)+2rem)] pb-16 sm:pt-[calc(var(--header-h)+3rem)] lg:pb-24">
      <Container className="relative">
        <HeroBench>
          <h1 id="hero-title" className="text-[clamp(2.5rem,1.1rem+3.4vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.04em] text-paper">
            {lines.map((line, i) => (
              <span key={line} className="line-mask">
                <span className="line-rise" style={{ "--rise-delay": `${80 + i * 110}ms` } as React.CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <div className="fade-in" style={{ "--fade-delay": "550ms" } as React.CSSProperties}>
            <p className="mt-8 max-w-[36ch] text-lg leading-relaxed text-paper-muted">
              Diseño y desarrollo aplicaciones web y móviles, plataformas SaaS, inteligencia artificial aplicada y sistemas IoT. Un solo
              responsable para todo el recorrido: entender el problema, diseñar la arquitectura, construirla y ponerla en marcha.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contacto">Hablemos de tu proyecto</ButtonLink>
              <ButtonLink href="#servicios" variant="secondary">
                Explorar servicios
              </ButtonLink>
            </div>
          </div>
        </HeroBench>
      </Container>
    </section>
  );
}
