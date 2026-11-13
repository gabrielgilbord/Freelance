import Link from "next/link";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { Wordmark } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { CotaLine } from "@/components/ui/cota-line";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line pt-16 pb-10 sm:pt-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark className="h-12 w-auto text-paper sm:h-16" />
            <CotaLine className="mt-4 max-w-[13.5rem] sm:max-w-[18rem]" />
            <p className="mt-8 max-w-sm text-paper-muted">
              Estudio de ingeniería de software. Del problema al sistema en producción.
            </p>
          </div>

          <nav aria-label="Servicios" className="lg:col-span-3">
            <p className="label mb-4">Servicios</p>
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
            <p className="label mb-4">Estudio</p>
            <ul className="space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline text-paper-muted hover:text-paper">{n.label}</Link>
                </li>
              ))}
              <li><Link href="/contacto" className="link-underline text-paper-muted hover:text-paper">Contacto</Link></li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="label mb-4">Contacto</p>
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

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-6 text-sm text-paper-subtle sm:flex-row sm:items-center sm:justify-between">
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
