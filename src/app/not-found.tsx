import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CotaLine } from "@/components/ui/cota-line";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="contenido">
    <section className="flex min-h-[80dvh] items-center pt-[var(--header-h)]">
      <Container>
        <p className="label text-accent">Error 404</p>
        <h1 className="mt-6 max-w-[16ch] text-display-m font-[450]">Esta página está fuera de cota.</h1>
        <CotaLine className="mt-10 max-w-md" start="Tú" end="Inicio" label="1 clic" />
        <p className="mt-8 max-w-md text-paper-muted">La dirección no existe o ha cambiado. Desde el inicio puedes llegar a todo lo demás.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
          <ButtonLink href="/contacto" variant="secondary">Contactar</ButtonLink>
        </div>
      </Container>
    </section>
    </main>
    <Footer />
    </>
  );
}
