import { layers } from "@/content/capabilities";
import { Container } from "@/components/ui/container";

/**
 * Capacidades como hoja de especificaciones: el único capítulo claro de la página.
 * Una tabla real (capa, disciplina, qué resuelve) con una cota vertical que recorre
 * todas las capas: un mismo responsable de arriba abajo.
 */
export function Capabilities() {
  return (
    <section aria-labelledby="capacidades-title" className="chapter-sheet py-16 sm:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 id="capacidades-title" className="text-display-m font-[450] lg:col-span-7">
            Del sensor a la pantalla, sin cambiar de interlocutor.
          </h2>
          <p className="max-w-[46ch] self-end text-lg leading-relaxed text-sheet-muted lg:col-span-5">
            Un producto digital atraviesa varias capas.<span className="hidden sm:inline"> Cuando cada una la resuelve un proveedor distinto, los problemas aparecen en las fronteras.</span>{" "}
            Esta es la hoja de especificaciones de lo que cubro.
          </p>
        </div>

        {/* Móvil: la hoja resumida, una fila por capa */}
        <dl className="mt-8 border-t-2 border-sheet-ink sm:hidden">
          {layers.map((layer) => (
            <div key={layer.key} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-sheet-line py-3.5">
              <dt className="text-[0.9375rem] font-medium leading-snug">{layer.name}</dt>
              <dd className="flex flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] text-sheet-muted">
                {layer.items.map((c) => (
                  <span key={c.name} className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-accent-deep" aria-hidden="true" />
                    {c.name}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 hidden gap-4 sm:flex sm:gap-8">
          {/* la cota vertical: todas las capas, un mismo responsable */}
          <div className="relative hidden w-10 shrink-0 sm:block" aria-hidden="true">
            <span className="absolute left-1/2 top-0 h-px w-7 -translate-x-1/2 bg-sheet-ink" />
            <span className="absolute bottom-0 left-1/2 h-px w-7 -translate-x-1/2 bg-sheet-ink" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-sheet-ink/50" />
            <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent-deep" />
            <span className="absolute bottom-0 left-1/2 h-4 w-[2px] -translate-x-1/2 translate-y-1/2 rotate-45 bg-accent-deep" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap bg-sheet px-3 font-mono text-xs text-sheet-muted">
              un mismo responsable
            </span>
          </div>

          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Capacidades técnicas por capa del sistema</caption>
            <thead>
              <tr className="border-b-2 border-sheet-ink font-mono text-xs text-sheet-muted">
                <th scope="col" className="w-[38%] py-3 pr-4 font-normal sm:w-[28%]">Capa</th>
                <th scope="col" className="w-[24%] py-3 pr-4 font-normal">Disciplina</th>
                <th scope="col" className="hidden py-3 font-normal sm:table-cell">Qué resuelve</th>
              </tr>
            </thead>
            {layers.map((layer) => (
              <tbody key={layer.key} className="border-b border-sheet-line">
                {layer.items.map((c, j) => (
                  <tr key={c.name} className="group align-top transition-colors hover:bg-sheet-2/70">
                    {j === 0 && (
                      <th scope="rowgroup" rowSpan={layer.items.length} className="py-5 pr-4 font-normal">
                        <span className="block text-lg font-medium sm:text-xl">{layer.name}</span>
                        <span className="mt-1 block text-sm text-sheet-muted">{layer.caption}</span>
                      </th>
                    )}
                    <td className={`py-5 pr-4 ${j > 0 ? "border-t border-dashed border-sheet-line" : ""}`}>
                      <span className="flex items-center gap-2 font-medium">
                        <span className="h-1.5 w-1.5 shrink-0 bg-accent-deep" aria-hidden="true" />
                        {c.name}
                      </span>
                      <span className="mt-1 block font-mono text-xs text-sheet-muted">{c.label}</span>
                      <span className="mt-2 block text-sm text-sheet-muted sm:hidden">{c.text}</span>
                    </td>
                    <td className={`hidden py-5 text-sheet-muted sm:table-cell ${j > 0 ? "border-t border-dashed border-sheet-line" : ""}`}>{c.text}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Container>
    </section>
  );
}
