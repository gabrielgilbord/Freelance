import { site } from "@/content/site";
import { LegalPage } from "@/components/ui/legal-page";
import { owner } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: "Aviso legal", description: `Aviso legal de ${site.name}.`, path: "/aviso-legal" });

export default function LegalNoticePage() {
  return (
    <LegalPage title="Aviso legal" path="/aviso-legal" updated="noviembre de 2026">
      <h2>Titular del sitio web</h2>
      <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:</p>
      <ul>
        <li>Nombre comercial: {site.name}</li>
        <li>Titular: {owner.name}</li>
        <li>NIF: {owner.taxId}</li>
        <li>Domicilio: {owner.address}</li>
        <li>Email de contacto: {owner.email}</li>
      </ul>
      <h2>Objeto</h2>
      <p>Este sitio web presenta los servicios profesionales de ingeniería y desarrollo de software ofrecidos bajo el nombre comercial {site.name} y permite a las personas interesadas ponerse en contacto.</p>
      <h2>Propiedad intelectual e industrial</h2>
      <p>Los contenidos, textos, diseño, logotipos y código de este sitio son propiedad de su titular o se utilizan con licencia. No se permite su reproducción con fines comerciales sin autorización expresa.</p>
      <h2>Responsabilidad</h2>
      <p>El titular no se hace responsable del uso que terceros hagan de la información publicada ni de los contenidos de sitios externos enlazados. Los casos identificados como “Concepto · Demo técnica” son ejemplos ilustrativos y no describen trabajos para clientes.</p>
      <h2>Legislación aplicable</h2>
      <p>Este aviso legal se rige por la legislación española.</p>
    </LegalPage>
  );
}
