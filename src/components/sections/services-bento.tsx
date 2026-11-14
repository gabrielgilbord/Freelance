import { services } from "@/content/services";
import { Container } from "@/components/ui/container";
import { ServiceCatalog } from "./service-catalog";

export function ServicesBento() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="border-t border-line py-16 sm:py-32">
      <Container>
        <div className="mb-10 grid gap-6 lg:mb-20 lg:grid-cols-12">
          <h2 id="servicios-title" className="text-display-m font-medium text-paper lg:col-span-7">
            Seis disciplinas, un mismo banco de trabajo.
          </h2>
          <p className="max-w-[46ch] self-end text-lg leading-relaxed text-paper-muted lg:col-span-5">
            Cada proyecto combina varias. Lo que importa no es la tecnología, sino que todas las piezas encajen y resuelvan el problema de tu negocio.
          </p>
        </div>
        <ServiceCatalog
          services={services.map(({ slug, title, discipline, pitch, deliverables }) => ({ slug, title, discipline, pitch, deliverables }))}
        />
      </Container>
    </section>
  );
}
