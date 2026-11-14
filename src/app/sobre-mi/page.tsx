import { principles } from "@/content/principles";
import { layers } from "@/content/capabilities";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata({
  title: "Sobre mí",
  description:
    "Cota es un estudio de ingeniería de software de una sola persona: desarrollo de software, IA e IoT con mentalidad de producto y un único responsable de principio a fin.",
  path: "/sobre-mi",
});

const notFor = [
  "Necesitas una web corporativa sencilla a partir de una plantilla: hay opciones más económicas y adecuadas.",
  "Buscas un equipo grande a jornada completa durante años: una consultora con estructura encajará mejor.",
  "Quieres que alguien ejecute sin cuestionar: parte de mi trabajo es decirte qué no hace falta construir.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Inicio", path: "/" }, { name: "Sobre mí", path: "/sobre-mi" }]}
        eyebrow="Sobre mí"
        title="Ingeniería con visión completa del sistema."
        intro="Soy ingeniero de software y Cota es mi estudio. Diseño y construyo productos que combinan software, inteligencia artificial y dispositivos conectados, y me hago cargo de ellos de principio a fin."
      />

      <section aria-labelledby="enfoque" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="enfoque" className="text-display-s font-[450] text-paper">La versatilidad como especialidad.</h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-paper-muted lg:col-span-7 lg:col-start-6">
            <p>
              La mayoría de los problemas técnicos interesantes no viven en una sola capa. Un asistente de IA necesita datos bien
              modelados; un sensor no sirve de nada sin una plataforma que interprete lo que mide; una aplicación móvil depende de una
              API bien diseñada. Mi trabajo consiste en entender el sistema completo y en construir cada pieza para que encaje con las demás.
            </p>
            <p>
              Trabajo con mentalidad de producto: antes de escribir código quiero saber quién va a usar lo que construyo, qué problema
              le resuelve y cómo sabremos si funciona. Eso permite tomar mejores decisiones técnicas y, a menudo, construir menos y mejor.
            </p>
            <p>
              Al ser un estudio de una sola persona, hablas directamente con quien diseña la arquitectura y escribe el código.
              Cuando un proyecto necesita especialistas adicionales, lo planteo de forma transparente desde el principio.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="alcance" className="border-t border-line bg-ink-1/40 py-14 sm:py-28">
        <Container>
          <h2 id="alcance" className="max-w-[20ch] text-display-s font-[450] text-paper">Las capas que puedo cubrir en un mismo proyecto.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {layers.map((l, i) => (
              <Reveal as="li" key={l.key} delay={i * 60} className="bg-ink p-6">
                <h3 className="mt-6 font-medium text-paper">{l.name}</h3>
                <p className="mt-1 text-sm text-paper-subtle">{l.caption}</p>
                <p className="mt-4 text-sm text-paper-muted">{l.items.map((c) => c.name).join(" · ")}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="principios" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="principios" className="text-display-s font-[450] text-paper">Cómo trabajo.</h2>
          </div>
          <ul className="border-t border-paper/80 lg:col-span-8">
            {principles.map((p) => (
              <Reveal as="li" key={p.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-8">
                <h3 className="text-lg font-medium text-paper sm:text-xl">{p.title}</h3>
                <p className="max-w-[60ch] text-paper-muted">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="nombre" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="nombre" className="text-display-s font-[450] text-paper">¿Por qué Cota?</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-lg leading-relaxed text-paper-muted">
              En un plano técnico, una <em className="not-italic text-paper">cota</em> es la línea que indica una medida exacta: dónde empieza algo,
              dónde termina y cuánto mide. Sin cotas, un plano es un dibujo; con ellas, es algo que se puede construir.
            </p>
            <figure className="-mx-4 my-8 sm:mx-0">
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
            <p className="text-lg leading-relaxed text-paper-muted">
              Es la forma en que entiendo cada proyecto: medir bien antes de construir y hacerme cargo de todo el recorrido,
              del primer extremo al último.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="cuando-no" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="cuando-no" className="text-display-s font-[450] text-paper">Cuándo no soy la mejor opción.</h2>
          </div>
          <ul className="space-y-4 lg:col-span-8">
            {notFor.map((n) => (
              <li key={n} className="rounded-sm border border-line p-6 text-paper-muted">{n}</li>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCta />
      <JsonLd data={breadcrumbLd([{ name: "Inicio", path: "/" }, { name: "Sobre mí", path: "/sobre-mi" }])} />
    </>
  );
}
