import Image from "next/image";

/**
 * Captura real de un producto dentro de un marco de navegador sobrio.
 * El marco solo enmarca: la imagen nunca se retoca ni se completa con datos inventados,
 * y el pie dice siempre de dónde sale y cuándo se tomó.
 */
export function ProductShot({
  src,
  alt,
  caption,
  host,
  width = 1440,
  height = 900,
  priority = false,
  sizes = "(min-width: 1024px) 58vw, 100vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  host?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-md border border-line-strong bg-ink-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-3 border-b border-line px-3 py-2 sm:px-4" aria-hidden="true">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
          </span>
          {host && <span className="truncate font-mono text-[0.6875rem] text-paper-subtle">{host}</span>}
        </div>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-paper-subtle">{caption}</figcaption>}
    </figure>
  );
}
