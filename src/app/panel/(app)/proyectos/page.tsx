import Link from "next/link";
import { getLedger } from "@/lib/finops/data";
import { activeIn, currentMonth, toCents } from "@/lib/finops/ledger";
import { PROJECT_COLORS , COLOR_NAMES } from "@/lib/finops/format";
import { createProject } from "@/app/panel/actions";
import { Adder, Swatch, Field, Money, SectionTitle } from "@/components/finops/ui";

const STATUS: Record<string, string> = { active: "Activo", paused: "En pausa", archived: "Archivado" };

export default async function ProjectsPage() {
  const data = await getLedger();
  const month = currentMonth();

  const rows = data.projects.map((p) => {
    const mrr = data.subscriptions
      .filter((s) => s.project_id === p.id && activeIn(month, s.start_date, s.end_date))
      .reduce((a, s) => a + toCents(s.amount), 0);
    const res = data.resources.filter((r) => r.project_id === p.id && activeIn(month, r.start_date, r.end_date));
    const infra = res.reduce((a, r) => a + (r.billing === "free" ? 0 : r.billing === "yearly" ? Math.round(toCents(r.cost) / 12) : toCents(r.cost)), 0);
    const oneOffTotal = data.movements.filter((m) => m.project_id === p.id && m.kind === "income").reduce((a, m) => a + toCents(m.amount), 0);
    const hasRules = data.rules.some((r) => r.project_id === p.id);
    return { p, mrr, infra, resCount: res.length, oneOffTotal, hasRules };
  });

  const order = { active: 0, paused: 1, archived: 2 } as const;
  rows.sort((a, b) => order[a.p.status] - order[b.p.status] || a.p.name.localeCompare(b.p.name));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-s font-[450]">Proyectos</h1>
          <p className="text-paper-muted mt-1">Cifras mensuales de este mes: lo que entra por cuotas, lo que cuesta la infra y el margen fijo.</p>
        </div>
      </div>

      <Adder label="Nuevo proyecto" open={data.projects.length === 0}>
        <form action={createProject} className="rounded-md border border-line bg-ink-1 p-5 grid gap-4 sm:grid-cols-[2fr_2fr_auto_auto] items-end max-w-3xl">
          <Field label="Nombre">
            <input className="fin-input" name="name" required placeholder="Web de la clínica" />
          </Field>
          <Field label="Cliente (opcional)">
            <input className="fin-input" name="client" placeholder="Clínica Dental Arucas" />
          </Field>
          <Field label="Color">
            <select className="fin-input" name="color" defaultValue={PROJECT_COLORS[data.projects.length % PROJECT_COLORS.length]}>
              {PROJECT_COLORS.map((c) => (
                <option key={c} value={c}>{COLOR_NAMES[c] ?? c}</option>
              ))}
            </select>
          </Field>
          <button className="fin-btn">Crear proyecto</button>
        </form>
      </Adder>

      {rows.length > 0 && (
        <section>
          <SectionTitle title={`${rows.length} ${rows.length === 1 ? "proyecto" : "proyectos"}`} />
          <ul className="grid gap-3">
            {rows.map(({ p, mrr, infra, resCount, oneOffTotal, hasRules }) => (
              <li key={p.id}>
                <Link
                  href={`/panel/proyectos/${p.id}`}
                  className={`rounded-md border border-line bg-ink-1 grid gap-4 p-5 md:grid-cols-[1.5fr_repeat(3,1fr)] md:items-center hover:border-line-strong transition-colors ${p.status === "archived" ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5"><Swatch color={p.color} /></span>
                    <div>
                      <span className="block text-lg font-medium">{p.name}</span>
                      <span className="block text-sm text-paper-subtle">
                        {[p.client, p.status !== "active" ? STATUS[p.status] : null, `${resCount} ${resCount === 1 ? "recurso" : "recursos"}`].filter(Boolean).join(", ")}
                      </span>
                      {!hasRules && <span className="inline-block mt-1.5 text-xs font-semibold text-paper-muted">Falta decir cómo se reparte</span>}
                    </div>
                  </div>
                  <Stat label="Cuotas al mes" cents={mrr} />
                  <Stat label="Infra al mes" cents={-infra} />
                  <Stat label="Margen fijo" cents={mrr - infra} strong sub={oneOffTotal > 0 ? <>+ <Money cents={oneOffTotal} /> en pagos únicos</> : undefined} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, cents, strong, sub }: { label: string; cents: number; strong?: boolean; sub?: React.ReactNode }) {
  return (
    <div className="flex justify-between md:block md:text-right">
      <span className="text-sm text-paper-subtle md:block">{label}</span>
      <span className="text-right">
        <Money cents={cents} className={strong ? "text-lg font-medium" : "font-semibold"} />
        {sub && <span className="block text-xs text-paper-subtle">{sub}</span>}
      </span>
    </div>
  );
}
