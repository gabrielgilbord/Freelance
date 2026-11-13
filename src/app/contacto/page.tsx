import { site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { pageMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata({
  title: "Contacto y presupuesto",
  description: "Cuéntame tu proyecto de software, inteligencia artificial, IoT o automatización y recibe una primera propuesta sin compromiso.",
  path: "/contacto",
});

// Preselección del tipo de proyecto cuando se llega desde un servicio
const serviceToType: Record<string, string> = {
  "desarrollo-software": "software",
  "inteligencia-artificial": "ai",
  "iot-sistemas-conectados": "iot",
  "arquitectura-software": "architecture",
  automatizacion: "automation",
  "producto-digital": "product",
};

const next = [
  { t: "Leo tu mensaje", d: `Respondo ${site.contact.responseTime}, con preguntas concretas si hace falta.` },
  { t: "Primera conversación", d: "Una llamada de unos 30 minutos para entender el problema y el contexto." },
  { t: "Propuesta", d: "Recibes un planteamiento con alcance, fases y estimación. Sin letra pequeña." },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ servicio?: string }> }) {
  const { servicio } = await searchParams;
  const defaultType = (servicio && serviceToType[servicio]) || "";

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Inicio", path: "/" }, { name: "Contacto", path: "/contacto" }]}
        eyebrow="Contacto"
        title="Hablemos de tu proyecto."
        intro="Cuéntame qué quieres construir o qué problema quieres resolver. No necesitas una especificación: con unas líneas es suficiente para empezar."
      />
      <section aria-label="Formulario de contacto" className="pb-24 sm:pb-32">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm defaultProjectType={defaultType} />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="que-pasa">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 id="que-pasa" className="label text-accent">Qué pasa después</h2>
              <ol className="mt-6 border-t border-line">
                {next.map((n, i) => (
                  <li key={n.t} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-5">
                    <span className="font-mono text-sm text-paper-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-medium text-paper">{n.t}</p>
                      <p className="mt-1 text-sm text-paper-muted">{n.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {(site.contact.email || site.social.length > 0) && (
                <div className="mt-10">
                  <p className="label">Otros canales</p>
                  <ul className="mt-4 space-y-2">
                    {site.contact.email && (
                      <li><a className="link-underline break-all text-paper" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
                    )}
                    {site.social.map((s) => (
                      <li key={s.href}><a className="link-underline text-paper" href={s.href} target="_blank" rel="noopener noreferrer me">{s.label}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </Container>
      </section>
      <JsonLd data={breadcrumbLd([{ name: "Inicio", path: "/" }, { name: "Contacto", path: "/contacto" }])} />
    </>
  );
}
