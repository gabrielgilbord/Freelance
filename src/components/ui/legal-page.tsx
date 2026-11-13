import type { ReactNode } from "react";
import { Container } from "./container";
import { PageHeader } from "./page-header";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHeader crumbs={[{ name: "Inicio", path: "/" }, { name: title, path }]} eyebrow="Información legal" title={title}>
        <p className="label mt-8">Última actualización: {updated}</p>
      </PageHeader>
      <section className="pb-24">
        <Container>
          <div className="prose-cota max-w-[68ch]">{children}</div>
        </Container>
      </section>
    </>
  );
}
