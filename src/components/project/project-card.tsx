import Link from "next/link";
import type { Project } from "@/lib/projects/types";
import { statusLabel } from "@/lib/projects/repository";
import { ArrowUpRight } from "@/components/ui/icons";
import { Tag } from "@/components/ui/tag";
import { ProjectCover } from "./project-cover";

export function ProjectCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link href={`/proyectos/${project.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[600/340] overflow-hidden rounded-sm border border-line">
        <ProjectCover project={project} className="transition-transform duration-1000 ease-out-quint group-hover:scale-[1.03]" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Tag tone={project.status === "concept" ? "default" : "accent"}>{statusLabel[project.status]}</Tag>
        <p className="label">{project.sector}</p>
      </div>
      <H className="mt-4 flex items-start justify-between gap-4 text-xl font-medium text-paper">
        {project.title}
        <ArrowUpRight size={20} className="mt-1 shrink-0 text-paper-subtle transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </H>
      <p className="mt-3 text-paper-muted">{project.summary}</p>
    </Link>
  );
}
