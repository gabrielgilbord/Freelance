import type { Project } from "./types";
import { projects as staticProjects } from "@/content/projects";

/**
 * Repository Pattern: la web solo depende de esta interfaz.
 * Hoy los proyectos viven en un archivo TypeScript; mañana pueden venir de un
 * CMS (Sanity, Contentful, Notion…) implementando la misma interfaz.
 */
export interface ProjectRepository {
  all(): Promise<Project[]>;
  featured(): Promise<Project[]>;
  bySlug(slug: string): Promise<Project | undefined>;
}

class StaticProjectRepository implements ProjectRepository {
  constructor(private readonly source: Project[]) {}

  // Los proyectos reales aparecen siempre antes que los conceptos.
  private sorted() {
    const rank = { client: 0, product: 1, concept: 2 } as const;
    return [...this.source].sort((a, b) => rank[a.status] - rank[b.status]);
  }
  async all() {
    return this.sorted();
  }
  async featured() {
    return this.sorted().filter((p) => p.featured);
  }
  async bySlug(slug: string) {
    return this.source.find((p) => p.slug === slug);
  }
}

export const projectRepository: ProjectRepository = new StaticProjectRepository(staticProjects);

export const statusLabel: Record<Project["status"], string> = {
  client: "Proyecto para cliente",
  product: "Producto propio",
  concept: "Concepto · Demo técnica",
};
