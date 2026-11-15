import Link from "next/link";
import { layerInfo, layerOrder, workByLayer } from "@/content/work";
import { Container } from "@/components/ui/container";

/**
 * «De la señal al sistema»: las seis capas por las que pasa un dato y, en cada una,
 * dónde lo he hecho de verdad. Es la hoja de especificaciones de COTA con evidencia,
 * no una lista de tecnologías. Único capítulo claro de la home.
 */
export function SignalToSystem() {
  const rows = layerOrder.map((key) => {
    const evidence = workByLayer(key).map((w) => ({ label: w.name, href: `/proyectos/${w.slug}`, note: w.setting }));
    if (key === "cloud") evidence.push({ label: "AWS · Oracle Cloud · n8n", href: "/proyectos#infraestructura", note: "Despliegue y operación" });
    return { key, ...layerInfo[key], evidence };
  });

  return (
    <section aria-labelledby="capas-title" className="chapter-sheet py-16 sm:py-32">
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <h2 id="capas-title" className="text-display-m font-[450] lg:col-span-7">
            De la señal al sistema.
          </h2>
          <p className="max-w-[48ch] self-end text-lg leading-relaxed text-sheet-muted lg:col-span-5">
            He trabajado en todas las capas por las que pasa un dato: desde el sensor que lo capta hasta el producto que lo convierte en una
            decisión.<span className="hidden sm:inline"> Esta es la evidencia, capa por capa.</span>
          </p>
        </div>

        {/* Móvil: una fila por capa con su evidencia */}
        <ol className="mt-8 border-t-2 border-sheet-ink sm:hidden">
          {rows.map((r, i) => (
            <li key={r.key} className="grid grid-cols-[1.75rem_1fr] gap-x-2 border-b border-sheet-line py-4">
              <span className="pt-0.5 font-mono text-xs text-sheet-muted">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium leading-snug">{r.name}</p>
                <p className="mt-1.5 text-[0.9375rem] leading-snug text-sheet-muted">
                  {r.evidence.map((e, j) => (
                    <span key={e.label}>
                      {j > 0 && " · "}
                      <Link href={e.href} className="underline decoration-sheet-line underline-offset-4 active:text-accent-deep">
                        {e.label}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 hidden gap-8 sm:flex">
          {/* La cota vertical: todas las capas, un mismo responsable */}
          <div className="relative w-10 shrink-0" aria-hidden="true">
            <span className="absolute left-1/2 top-0 h-px w-7 -translate-x-1/2 bg-sheet-ink" />
            <span className="absolute bottom-0 left-1/2 h-px w-7 -translate-x-1/2 bg-sheet-ink" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-sheet-ink/50" />
            <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent-deep" />
            <span className="absolute bottom-0 left-1/2 h-4 w-[2px] -translate-x-1/2 translate-y-1/2 rotate-45 bg-accent-deep" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap bg-sheet px-3 font-mono text-xs text-sheet-muted">
              de la señal al sistema
            </span>
          </div>

          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Capas del sistema y proyectos en los que he trabajado en cada una</caption>
            <thead>
              <tr className="border-b-2 border-sheet-ink font-mono text-xs text-sheet-muted">
                <th scope="col" className="w-[30%] py-3 pr-6 font-normal">Capa</th>
                <th scope="col" className="w-[34%] py-3 pr-6 font-normal">Qué resuelve</th>
                <th scope="col" className="py-3 font-normal">Dónde lo he hecho</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.key} className="border-b border-sheet-line align-top transition-colors hover:bg-sheet-2/70">
                  <th scope="row" className="py-5 pr-6 font-normal">
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-sheet-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-lg font-medium leading-snug">{r.name}</span>
                    </span>
                  </th>
                  <td className="py-5 pr-6 text-sheet-muted">{r.text}</td>
                  <td className="py-5">
                    <ul className="space-y-2">
                      {r.evidence.map((e) => (
                        <li key={e.label}>
                          <Link href={e.href} className="group inline-flex flex-wrap items-baseline gap-x-2">
                            <span className="font-medium underline decoration-sheet-line underline-offset-4 transition-colors group-hover:decoration-accent-deep">
                              {e.label}
                            </span>
                            <span className="font-mono text-xs text-sheet-muted">{e.note}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-sheet-muted sm:mt-8">
          Cada trabajo indica su contexto: producto propio, investigación universitaria, experiencia profesional o proyecto en equipo.
        </p>
      </Container>
    </section>
  );
}
