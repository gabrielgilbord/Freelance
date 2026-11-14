import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";

type Props = { title?: string; text?: string };

/** El cierre: el único capítulo en naranja COTA. */
export function FinalCta({
  title = "Cuéntame qué quieres construir.",
  text = "Una idea, un problema o un sistema que se ha quedado corto. En una primera conversación sin compromiso vemos si tiene sentido trabajar juntos y cuál sería el primer paso.",
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="chapter-accent relative overflow-hidden py-16 sm:py-36">
      <Container className="relative">
        <h2 id="cta-title" className="max-w-[14ch] text-display-l font-[450]">
          {title}
        </h2>
        {/* la cota del cierre, en tinta sobre naranja */}
        <div className="mt-12 flex max-w-2xl items-center gap-3 font-mono text-sm" aria-hidden="true">
          <span>hoy</span>
          <span className="relative h-5 flex-1">
            <span className="absolute inset-y-0 left-0 w-px bg-accent-ink" />
            <span className="absolute inset-y-0 right-0 w-px bg-accent-ink" />
            <span className="absolute inset-x-0 top-1/2 h-px bg-accent-ink/70" />
            <span className="absolute left-0 top-1/2 h-3.5 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent-ink" />
            <span className="absolute right-0 top-1/2 h-3.5 w-[2px] translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent-ink" />
          </span>
          <span>tu sistema</span>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <p className="max-w-[52ch] text-lg leading-relaxed lg:col-span-6">{text}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:col-span-6 lg:justify-end">
            <Link
              href="/contacto"
              className="inline-flex h-14 items-center justify-center rounded-xs bg-accent-ink px-7 text-base font-medium text-accent transition-colors hover:bg-ink"
            >
              Hablemos de tu proyecto
            </Link>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="underline decoration-1 underline-offset-4 hover:no-underline">
                {site.contact.email}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
