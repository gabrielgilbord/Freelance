import { site } from "@/content/site";
import { LegalPage } from "@/components/ui/legal-page";
import { owner } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ title: "Política de privacidad", description: `Política de privacidad de ${site.name}.`, path: "/privacidad" });

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidad" path="/privacidad" updated="noviembre de 2026">
      <h2>Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: {owner.name} ({site.name})</li>
        <li>NIF: {owner.taxId}</li>
        <li>Contacto: {owner.email}</li>
      </ul>
      <h2>Qué datos se recogen</h2>
      <p>A través del formulario de contacto se recogen nombre, email, empresa (opcional), tipo de proyecto, presupuesto orientativo (opcional) y la descripción que decidas compartir.</p>
      <h2>Finalidad y base legal</h2>
      <p>Los datos se usan exclusivamente para responder a tu solicitud y, en su caso, preparar una propuesta. La base legal es tu consentimiento (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).</p>
      <h2>Conservación</h2>
      <p>Los datos se conservan mientras dure la comunicación y, si no se inicia una relación profesional, se eliminan en un plazo máximo de 12 meses.</p>
      <h2>Destinatarios</h2>
      <p>No se ceden datos a terceros salvo obligación legal. Para el envío de los mensajes del formulario y el alojamiento de la web pueden intervenir proveedores tecnológicos que actúan como encargados del tratamiento con garantías adecuadas.</p>
      <h2>Tus derechos</h2>
      <p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {owner.email}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>
      <h2>Cookies</h2>
      <p>Este sitio no utiliza cookies de seguimiento ni de publicidad. Si en el futuro se incorpora analítica, se informará y se solicitará el consentimiento cuando sea necesario.</p>
    </LegalPage>
  );
}
