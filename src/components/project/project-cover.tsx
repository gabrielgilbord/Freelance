import type { Project } from "@/lib/projects/types";

/**
 * Portada del proyecto: su foto real si existe; si no, la ilustración isométrica del
 * caso (public/art/projects/<slug>.svg, generada con Anatomy Asset).
 */
export function ProjectCover({ project, className = "", priority = false }: { project: Project; className?: string; priority?: boolean }) {
  const src = project.cover?.src ?? `/art/projects/${project.slug}.svg`;
  const alt = project.cover?.alt ?? `Ilustración isométrica del concepto: ${project.title}.`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={800}
      height={520}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`h-auto w-full ${className}`}
    />
  );
}
