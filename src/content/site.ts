/**
 * Configuración central de la marca. Todo lo que dependa de datos personales
 * vive aquí o en variables de entorno, nunca repartido por los componentes.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export type SocialLink = { label: string; href: string };

export const site = {
  name: "Cota",
  legalName: "Cota — Estudio de ingeniería digital",
  tagline: "Ingeniería digital a medida",
  descriptor: "Software Engineering Studio",
  url: rawUrl.replace(/\/$/, ""),
  locale: "es_ES",
  lang: "es",
  description:
    "Ingeniería digital a medida: plataformas SaaS, inteligencia artificial aplicada, IoT, automatización e infraestructura cloud. De la señal al sistema en producción, con experiencia real en hardware, software industrial y productos propios.",

  contact: {
    /** Email público. Si está vacío, la web no muestra ningún enlace de email. */
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
    /** Tiempo de respuesta comprometido: es una promesa, ajústala a la realidad. */
    responseTime: "en 48 horas laborables",
  },

  /**
   * Redes y canales. Solo se renderizan los que tengan URL.
   * Ejemplo: { label: "LinkedIn", href: "https://www.linkedin.com/in/…" }
   */
  social: [] as SocialLink[],

  /**
   * Ubicación para SEO local (opcional). Si se rellena, se añade a JSON-LD y a los textos.
   * Ejemplo: { city: "Valencia", region: "Comunidad Valenciana", country: "ES" }
   */
  location: null as null | { city: string; region?: string; country: string },

  /** Datos del titular para Aviso legal y Privacidad (LSSI / RGPD). */
  legal: {
    ownerName: process.env.LEGAL_OWNER_NAME?.trim() || "",
    taxId: process.env.LEGAL_TAX_ID?.trim() || "",
    address: process.env.LEGAL_ADDRESS?.trim() || "",
  },
} as const;

export const nav = [
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Sobre mí", href: "/sobre-mi" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
