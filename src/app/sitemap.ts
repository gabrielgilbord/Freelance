import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/content/site";
import { services } from "@/content/services";
import { projectRepository } from "@/lib/projects/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const projects = await projectRepository.all();
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/servicios", priority: 0.9 },
    { path: "/proyectos", priority: 0.7 },
    { path: "/sobre-mi", priority: 0.6 },
    { path: "/contacto", priority: 0.8 },
  ];
  return [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r.path), lastModified: now, priority: r.priority })),
    ...services.map((s) => ({ url: absoluteUrl(`/servicios/${s.slug}`), lastModified: now, priority: 0.8 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/proyectos/${p.slug}`), lastModified: now, priority: 0.5 })),
    { url: absoluteUrl("/aviso-legal"), lastModified: now, priority: 0.1 },
    { url: absoluteUrl("/privacidad"), lastModified: now, priority: 0.1 },
  ];
}
