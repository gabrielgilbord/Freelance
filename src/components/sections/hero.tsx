import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroBench } from "@/components/hero/hero-bench";

const lines = ["Ingeniería digital", "a medida."];

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
                De la señal al sistema: software, IA, IoT e infraestructura, con un único interlocutor.
              </p>
              <p className="mt-8 hidden max-w-[36ch] text-lg leading-relaxed text-paper-muted sm:block">
                De la señal al sistema: plataformas SaaS, inteligencia artificial aplicada, IoT e infraestructura. Experiencia real desde el
                sensor hasta el producto en producción, con un único interlocutor de principio a fin.
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
