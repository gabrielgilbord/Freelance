import Link from "next/link";
import { principles } from "@/content/principles";
import { Container } from "@/components/ui/container";

/**
 * El estudio: una declaración junto a la pieza de firma (el calibre midiendo la pieza
 * naranja: la "cota" hecha objeto) y los principios como reglas, sin tarjetas.
 */
export function AboutTeaser() {
  return (
    <section aria-labelledby="estudio-title" className="border-t border-line py-16 sm:py-32">
      <Container>
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 id="estudio-title" className="text-display-m font-[450] text-paper">
              Un estudio de una sola persona. A propósito.
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-paper-muted sm:mt-8">
              COTA es mi estudio de ingeniería de software. Hablas directamente con quien diseña la arquitectura y escribe el código.
              <span className="hidden sm:inline">
                {" "}
                Mi ventaja es la amplitud técnica: puedo conectar una interfaz, un backend, un modelo de IA y un dispositivo físico, y entender
                cómo se afectan entre sí.
              </span>
            </p>
            <Link href="/sobre-mi" className="link-underline mt-6 inline-block font-medium text-paper hover:text-accent sm:mt-10">
              Conocer el estudio
            </Link>
          </div>
          <figure className="-mx-4 sm:mx-0 lg:col-span-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/art/caliper.svg"
              alt="Un calibre digital midiendo una pieza mecanizada naranja; la pantalla marca 60.00 milímetros."
              width={720}
              height={520}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </figure>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 border-t border-paper/80 sm:mt-12 lg:grid-cols-4 lg:gap-x-10">
          {principles.map((p) => (
            <div key={p.title} className="border-b border-line py-4 sm:py-6 lg:border-b-0">
              <dt className="font-medium leading-snug text-paper">{p.title}</dt>
              <dd className="mt-2 hidden text-paper-muted sm:block">{p.text}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
