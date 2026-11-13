import { absoluteUrl, site } from "@/content/site";

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro y se serializa; se escapa "<" para evitar inyección.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const orgId = `${site.url}/#organization`;

export function organizationLd(): Json {
  const loc = site.location;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": orgId,
    name: site.name,
    alternateName: site.legalName,
    description: site.description,
    url: site.url,
    logo: absoluteUrl("/brand/logo-primary-light.svg"),
    image: absoluteUrl("/opengraph-image"),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
    ...(loc
      ? {
          address: { "@type": "PostalAddress", addressLocality: loc.city, addressRegion: loc.region, addressCountry: loc.country },
          areaServed: [{ "@type": "City", name: loc.city }, { "@type": "Country", name: "España" }],
        }
      : { areaServed: { "@type": "Country", name: "España" } }),
    knowsAbout: [
      "Desarrollo de software a medida",
      "Desarrollo de aplicaciones web",
      "Desarrollo de aplicaciones móviles",
      "Inteligencia artificial aplicada",
      "Internet of Things",
      "Arquitectura de software",
      "Automatización de procesos",
    ],
  };
}

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "es-ES",
    publisher: { "@id": orgId },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function serviceLd(s: { title: string; description: string; path: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.description,
    url: absoluteUrl(s.path),
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "España" },
  };
}

export function faqLd(faq: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
