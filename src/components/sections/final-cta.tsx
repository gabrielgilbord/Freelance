import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CotaLine } from "@/components/ui/cota-line";
import { Reveal } from "@/components/ui/reveal";

type Props = { title?: string; text?: string };

export function FinalCta({
  title = "Cuéntame qué quieres construir.",
  text = "Una idea, un problema o un sistema que se ha quedado corto. En una primera conversación sin compromiso vemos si tiene sentido trabajar juntos y cuál sería el primer paso.",
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line py-24 sm:py-36">
      <div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden="true" />
      <Container className="relative">
        <Reveal as="p" className="label text-accent">Siguiente paso</Reveal>
        <Reveal as="h2" id="cta-title" delay={60} className="mt-6 max-w-[16ch] text-display-m font-medium text-paper">
          {title}
        </Reveal>
        <Reveal delay={120}>
          <CotaLine className="mt-10 max-w-2xl" start="Hoy" end="Tu sistema" label="Primera conversación" />
        </Reveal>
        <Reveal as="p" delay={160} className="mt-10 max-w-[56ch] text-lg leading-relaxed text-paper-muted">
          {text}
        </Reveal>
        <Reveal delay={200} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <ButtonLink href="/contacto" arrow>Hablemos de tu proyecto</ButtonLink>
          {site.contact.email && (
            <a href={`mailto:${site.contact.email}`} className="link-underline text-paper-muted hover:text-paper">
              o escribe a {site.contact.email}
            </a>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
