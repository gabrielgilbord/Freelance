import { principles } from "@/content/principles";
import Link from "next/link";
import { layerInfo, layerOrder, workByLayer } from "@/content/work";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata({
  title: "Sobre mí",
  description:
    "COTA es un estudio de ingeniería de una sola persona, con experiencia en investigación con sistemas embebidos, software industrial, IoT, productos SaaS propios, inteligencia artificial e infraestructura cloud.",
  path: "/sobre-mi",
});

const trajectory = [
  { setting: "Investigación universitaria", title: "Sistemas embebidos y señales ECG", text: "Un sistema de intercambio de datos entre dos Raspberry Pi, con generación de claves a partir de señales de electrocardiograma.", href: "/proyectos/ecg-raspberry-pi" },
  { setting: "Trabajo de Fin de Grado", title: "Monitorización acústica con LoRaWAN", text: "Un nodo de medición basado en Arduino que envía datos por LoRaWAN y los muestra en tiempo real en Grafana.", href: "/proyectos/monitorizacion-acustica-lorawan" },
  { setting: "Experiencia profesional", title: "Software para fábricas", text: "Detección temprana de anomalías y visualización de datos de producción con Grafana, en entornos industriales.", href: "/proyectos/software-industrial" },
  { setting: "Productos propios", title: "Syncbiosis y PlanIt", text: "Un SaaS de gestión para escuelas de música, danza e idiomas, en producción, y una plataforma de descubrimiento local en fase de lanzamiento.", href: "/proyectos#producto" },
  { setting: "Línea propia y en equipo", title: "IA, automatización e infraestructura", text: "Agentes, automatización de llamadas y mensajes, n8n autoalojado y servicios en AWS y Oracle Cloud. Y un asistente con IA para salones, en desarrollo con amigos.", href: "/proyectos#ia" },
];

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
        title="De la señal al sistema."
        intro="Soy ingeniero y COTA es mi estudio. He trabajado en la parte física y de comunicaciones de los sistemas y en el software, las plataformas y la infraestructura que los sostienen. Hoy aplico todo eso a proyectos a medida y a mis propios productos."
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

      <section aria-labelledby="trayectoria" className="border-t border-line py-14 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="trayectoria" className="text-display-s font-[450] text-paper">De dónde viene la experiencia.</h2>
            <p className="mt-5 max-w-[40ch] text-paper-muted">Cada etapa en su contexto: nada de lo hecho para terceros se presenta como trabajo de COTA.</p>
          </div>
          <ol className="border-t border-paper/80 lg:col-span-8">
            {trajectory.map((s) => (
              <li key={s.title} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[13rem_1fr] sm:gap-8 sm:py-7">
                <p className="font-mono text-xs leading-relaxed text-paper-subtle sm:pt-1.5">{s.setting}</p>
                <div>
                  <h3 className="text-lg font-medium text-paper sm:text-xl">{s.title}</h3>
                  <p className="mt-2 max-w-[60ch] text-paper-muted">{s.text}</p>
                  {s.href && (
                    <Link href={s.href} className="link-underline mt-3 inline-block text-sm font-medium text-paper hover:text-accent">
                      Ver la ficha
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="alcance" className="border-t border-line bg-ink-1/40 py-14 sm:py-28">
        <Container>
          <h2 id="alcance" className="max-w-[20ch] text-display-s font-[450] text-paper">Seis capas, un mismo responsable.</h2>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {layerOrder.map((key, i) => (
              <Reveal as="li" key={key} delay={i * 60} className="bg-ink p-6">
                <p className="font-mono text-xs text-paper-subtle">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-medium text-paper">{layerInfo[key].name}</h3>
                <p className="mt-2 text-sm text-paper-muted">{layerInfo[key].text}</p>
                <p className="mt-4 text-sm text-paper-subtle">{workByLayer(key).map((w) => w.name).join(" · ") || "AWS · Oracle Cloud · n8n"}</p>
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
            <h2 id="nombre" className="text-display-s font-[450] text-paper">Toda idea necesita una cota.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-lg leading-relaxed text-paper-muted">
              Una <em className="not-italic text-paper">cota</em> es una medida exacta: lo que separa un dibujo de algo que se puede fabricar.
              También es una altura, la coordenada que eleva un punto sobre su plano de referencia, y en matemáticas, el límite que un
              valor no supera.
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
              Así entiendo cada proyecto: acotar el alcance antes de escribir código, llevar la idea hasta un sistema en producción y
              diseñarlo dentro de sus límites de coste, rendimiento y plazo.
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
