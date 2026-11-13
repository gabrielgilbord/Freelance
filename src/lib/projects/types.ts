/**
 * Modelo de un caso de estudio. Plantilla reutilizable para proyectos reales.
 *
 * `status` es obligatorio y explícito para no presentar nunca un concepto como
 * un trabajo para cliente:
 *  - "client":  proyecto real para un cliente (requiere permiso para publicarlo)
 *  - "product": producto propio publicado
 *  - "concept": demo técnica / concepto, sin cliente ni resultados reales
 */
export type ProjectStatus = "client" | "product" | "concept";

export type ArchitectureLayer = { name: string; parts: string[] };

export type Project = {
  slug: string;
  status: ProjectStatus;
  title: string;
  /** Sector o tipo de cliente, sin nombres si no hay autorización */
  sector: string;
  year?: number;
  summary: string;
  problem: string;
  solution: string;
  services: string[]; // slugs de servicios relacionados
  stack: string[];
  architecture: ArchitectureLayer[];
  /** Solo para proyectos reales: resultados medidos y verificables */
  results?: { metric: string; value: string; note?: string }[];
  /** Para conceptos: cómo se mediría el éxito si se implantase */
  successCriteria?: string[];
  /** Imagen principal (ruta en /public). Si falta, se genera una portada a partir de la arquitectura. */
  cover?: { src: string; alt: string };
  gallery?: { src: string; alt: string; caption?: string }[];
  links?: { label: string; href: string }[];
  featured?: boolean;
};
