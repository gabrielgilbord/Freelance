import Link from "next/link";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { Wordmark } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="overflow-hidden border-t border-line pt-12 sm:pt-24">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-12">
          <p className="max-w-sm text-lg leading-snug text-paper lg:col-span-4">
            Estudio de ingeniería de software. Del problema al sistema en producción.
          </p>
          <nav aria-label="Servicios" className="hidden sm:block lg:col-span-3 lg:col-start-6">
            <h2 className="mb-4 text-sm text-paper-subtle">Servicios</h2>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`} className="link-underline text-paper-muted hover:text-paper">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Estudio" className="lg:col-span-2">
            <h2 className="mb-4 text-sm text-paper-subtle">Estudio</h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2.5 sm:block sm:space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline text-paper-muted hover:text-paper">{n.label}</Link>
                </li>
              ))}
              <li><Link href="/contacto" className="link-underline text-paper-muted hover:text-paper">Contacto</Link></li>
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-sm text-paper-subtle">Contacto</h2>
            <ul className="space-y-2.5">
              {site.contact.email && (
                <li><a href={`mailto:${site.contact.email}`} className="link-underline break-all text-paper-muted hover:text-paper">{site.contact.email}</a></li>
              )}
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer me" className="link-underline text-paper-muted hover:text-paper">{s.label}</a>
                </li>
              ))}
              <li><Link href="/contacto" className="link-underline text-paper-muted hover:text-paper">Formulario de proyecto</Link></li>
            </ul>
          </div>
        </div>

        {/* el logotipo a todo el ancho, con su cota debajo */}
        <div className="mt-12 sm:mt-28" aria-hidden="true">
          <Wordmark className="h-auto w-full text-paper" title="" />
          <div className="relative mt-[2.5%] h-4 sm:h-6">
            <span className="absolute inset-y-0 left-[0.4%] w-px bg-line-strong" />
            <span className="absolute inset-y-0 right-[0.4%] w-px bg-line-strong" />
            <span className="absolute inset-x-[0.4%] top-1/2 h-px bg-paper-subtle/70" />
            <span className="absolute left-[0.4%] top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
            <span className="absolute right-[0.4%] top-1/2 h-4 w-[2px] translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line py-6 text-sm text-paper-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {site.name}. Ingeniería de software de principio a fin.</p>
          <ul className="flex gap-6">
            <li><Link href="/aviso-legal" className="hover:text-paper">Aviso legal</Link></li>
            <li><Link href="/privacidad" className="hover:text-paper">Privacidad</Link></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
