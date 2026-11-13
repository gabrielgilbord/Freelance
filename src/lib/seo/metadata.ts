import type { Metadata } from "next";
import { absoluteUrl, site } from "@/content/site";

type PageMeta = { title: string; description: string; path: string; noIndex?: boolean };

/** Metadatos coherentes por página: title, description, canonical, OG y Twitter. */
export function pageMetadata({ title, description, path, noIndex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, locale: site.locale, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
