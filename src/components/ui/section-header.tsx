import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type Props = { index?: string; eyebrow: string; title: ReactNode; intro?: ReactNode; id?: string; className?: string };

export function SectionHeader({ index, eyebrow, title, intro, id, className = "" }: Props) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:gap-12 ${className}`}>
      <Reveal className="lg:col-span-3">
        <p className="label flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
      </Reveal>
      <div className="lg:col-span-9">
        <Reveal as="h2" id={id} className="max-w-[18ch] text-display-s font-medium text-paper" delay={60}>
          {title}
        </Reveal>
        {intro && (
          <Reveal as="p" className="mt-6 max-w-[58ch] text-lg leading-relaxed text-paper-muted" delay={120}>
            {intro}
          </Reveal>
        )}
      </div>
    </div>
  );
}
