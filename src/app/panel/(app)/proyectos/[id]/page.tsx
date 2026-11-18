import Link from "next/link";
import { notFound } from "next/navigation";
import { getLedger } from "@/lib/finops/data";
import { activeIn, computeUntil, currentMonth } from "@/lib/finops/ledger";
import { BILLING_LABEL, CATEGORY_LABEL, POLICY_LABEL, PROJECT_COLORS, STREAM_LABEL, dateLabel, euros, money , COLOR_NAMES } from "@/lib/finops/format";
import type { Stream } from "@/lib/finops/types";
import {
  addRule,
  applyRulePreset,
  deleteProject,
  deleteRow,
  endRow,
  saveMovement,
  saveResource,
  saveSubscription,
  updateProject,
} from "@/app/panel/actions";
import { Adder, DeleteButton, Swatch, Empty, Field, Money, MonthNav, Ribbon, SectionTitle, type Segment } from "@/components/finops/ui";

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ m?: string }> }) {
  const { id } = await params;
  const { m } = await searchParams;
  const month = m && /^\d{4}-\d{2}$/.test(m) ? m : currentMonth();
  const data = await getLedger();
  const project = data.projects.find((p) => p.id === id);
  if (!project) notFound();

  const all = computeUntil(data, month);
  const pm = all.at(-1)!.projects.find((p) => p.projectId === id)!;
  const partnerById = new Map(data.partners.map((p) => [p.id, p]));
  const fundById = new Map(data.funds.map((f) => [f.id, f]));
  const targetName = (t: { partner_id: string | null; fund_id: string | null }) =>
    t.partner_id ? partnerById.get(t.partner_id)?.name : fundById.get(t.fund_id!)?.name;
  const targetColor = (t: { partner_id: string | null; fund_id: string | null }) =>
    (t.partner_id ? partnerById.get(t.partner_id)?.color : fundById.get(t.fund_id!)?.color) ?? "#999";

  const resources = data.resources.filter((r) => r.project_id === id);
  const subs = data.subscriptions.filter((s) => s.project_id === id);
  const moves = data.movements.filter((mv) => mv.project_id === id);
  const rules = data.rules.filter((r) => r.project_id === id);
  const today = new Date().toISOString().slice(0, 10);

  const segments: Segment[] = [
    { key: "exp", label: "Infra y gastos", amount: pm.absorbed.one_off + pm.absorbed.recurring, hatch: true },
    ...pm.allocations.map((a, i) => ({
      key: `${a.stream}-${a.targetId}-${i}`,
      label: `${(a.targetType === "partner" ? partnerById.get(a.targetId)?.name : fundById.get(a.targetId)?.name) ?? "—"} (${a.stream === "one_off" ? "único" : "mensual"})`,
      amount: a.amount,
      color: (a.targetType === "partner" ? partnerById.get(a.targetId)?.color : fundById.get(a.targetId)?.color) ?? "#999",
    })),
    { key: "un", label: "Sin regla", amount: pm.unassigned.one_off + pm.unassigned.recurring, color: "#b9c6c0" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <Link href="/panel/proyectos" className="text-sm text-paper-muted hover:underline">Proyectos</Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Swatch color={project.color} />
            <div>
              <h1 className="text-display-s font-[450]">{project.name}</h1>
              {project.client && <p className="text-paper-muted">{project.client}</p>}
            </div>
          </div>
          <MonthNav month={month} base={`/panel/proyectos/${id}`} />
        </div>
      </div>

      {/* Resumen del mes del proyecto */}
      <section className="rounded-md border border-line bg-ink-1 p-5 md:p-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          <Figure label="Pagos únicos" cents={pm.oneOffIncome} />
          <Figure label="Mensualidades" cents={pm.recurringIncome} />
          <Figure label="Infra y gastos" cents={-pm.expenses} />
          <Figure label="Resultado" cents={pm.net} strong />
        </div>
        <Ribbon segments={segments} height={40} />
        {pm.deficit > 0 && (
          <p className="mt-4 text-sm text-paper-muted">
            Este mes pierde {money(pm.deficit)}.{" "}
            {pm.coveredBy.map((c) => `${fundById.get(c.fundId)?.name} cubre ${money(c.amount)}`).join(", ")}
            {pm.coveredBy.length > 0 && ". "}
            {pm.uncovered > 0 && (
              <>
                Quedan {money(pm.uncovered)} sin cubrir que ponen{" "}
                {pm.uncoveredSplit.map((s) => `${partnerById.get(s.partnerId)?.name} (${money(-s.amount)})`).join(" y ")}.
              </>
            )}
          </p>
        )}
      </section>

      {/* Reparto */}
      <section>
        <SectionTitle
          title="Cómo se reparte"
          hint={`${POLICY_LABEL[project.expense_policy]}. Lo que quede de cada tipo de ingreso se reparte así; puedes cambiarlo en Ajustes.`}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {(["one_off", "recurring"] as Stream[]).map((stream) => {
            const rs = rules.filter((r) => r.stream === stream);
            const sum = rs.reduce((a, r) => a + Number(r.percent), 0);
            return (
              <div key={stream} className="rounded-md border border-line bg-ink-1 p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-lg font-medium">{STREAM_LABEL[stream]}</h3>
                  <span className={`font-mono tabular-nums text-sm font-semibold ${sum === 100 ? "text-ok" : "text-paper-muted"}`}>{sum}% asignado</span>
                </div>
                <p className="text-sm text-paper-subtle mb-3">{stream === "one_off" ? "Landing, setup, desarrollos que se cobran una vez." : "Cuotas que se cobran cada mes."}</p>

                {rs.length > 0 && (
                  <div className="flex h-2.5 rounded-xs overflow-hidden gap-[2px] mb-3" aria-hidden>
                    {rs.map((r) => <div key={r.id} style={{ flexGrow: Number(r.percent), background: targetColor(r) }} />)}
                    {sum < 100 && <div style={{ flexGrow: 100 - sum }} className="bg-ink-2" />}
                  </div>
                )}

                <ul>
                  {rs.map((r) => (
                    <li key={r.id} className="fin-row grid-cols-[1fr_auto_auto]">
                      <span className="flex items-center gap-2">
                        <Swatch color={targetColor(r)} />
                        {targetName(r)}
                        {r.fund_id && <span className="text-xs text-paper-muted">fondo</span>}
                      </span>
                      <span className="font-mono tabular-nums font-semibold">{Number(r.percent)}%</span>
                      <DeleteButton action={deleteRow} fields={{ table: "distribution_rules", id: r.id }} label="Quitar" />
                    </li>
                  ))}
                </ul>
                {rs.length === 0 && <Empty>Sin reparto: el beneficio de este tipo quedará como pendiente.</Empty>}

                <div className="flex flex-wrap gap-2 mt-3">
                  {data.partners.length > 0 && (
                    <PresetButton projectId={id} stream={stream} preset="equal" label="A partes iguales entre socios" />
                  )}
                  {data.funds.map((f) => (
                    <PresetButton key={f.id} projectId={id} stream={stream} preset={`fund:${f.id}`} label={`Todo a ${f.name}`} />
                  ))}
                </div>

                <details className="adder mt-4">
                  <summary className="text-sm font-semibold text-paper-muted underline underline-offset-4">Reparto a medida</summary>
                  <form action={addRule} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="project_id" value={id} />
                    <input type="hidden" name="stream" value={stream} />
                    <Field label="Para" className="flex-1 min-w-40">
                      <select className="fin-input" name="target" required>
                        <optgroup label="Socios">
                          {data.partners.map((p) => <option key={p.id} value={`partner:${p.id}`}>{p.name}</option>)}
                        </optgroup>
                        <optgroup label="Fondos">
                          {data.funds.map((f) => <option key={f.id} value={`fund:${f.id}`}>{f.name}</option>)}
                        </optgroup>
                      </select>
                    </Field>
                    <Field label="Porcentaje" className="w-28">
                      <input className="fin-input num" name="percent" type="number" step="0.01" min="0.01" max="100" defaultValue={Math.max(0, 100 - sum) || ""} required />
                    </Field>
                    <button className="fin-btn">Añadir</button>
                  </form>
                </details>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recursos */}
      <section>
        <SectionTitle title="Recursos e infraestructura" hint="Dónde está montado y lo que cuesta. Los anuales se prorratean entre 12 meses." />
        <div className="rounded-md border border-line bg-ink-1 px-5 md:px-6 mb-4">
          {resources.length === 0 && <Empty>Aún no has apuntado dónde está alojado este proyecto.</Empty>}
          {resources.map((r) => {
            const active = activeIn(month, r.start_date, r.end_date);
            return (
              <div key={r.id} className={`fin-row grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_1fr_auto] ${active ? "" : "opacity-50"}`}>
                <div>
                  <span className="font-semibold">{r.name}</span>
                  {r.provider && <span className="text-paper-muted"> en {r.provider}</span>}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="ml-2 text-sm underline text-paper-muted">abrir</a>
                  )}
                  {r.notes && <p className="text-sm text-paper-subtle">{r.notes}</p>}
                </div>
                <span className="hidden md:block text-sm text-paper-muted">{CATEGORY_LABEL[r.category]}</span>
                <span className="text-right md:text-left">
                  {r.billing === "free" ? <span className="text-ok font-semibold">Gratis</span> : <span className="font-mono tabular-nums font-semibold">{euros(r.cost)} <span className="text-paper-subtle font-normal">{BILLING_LABEL[r.billing]}</span></span>}
                  <span className="block text-xs text-paper-subtle">
                    desde {dateLabel(r.start_date)}{r.end_date && `, hasta ${dateLabel(r.end_date)}`}
                  </span>
                </span>
                <div className="col-span-2 md:col-span-1 flex gap-4 justify-end">
                  {!r.end_date && (
                    <form action={endRow}>
                      <input type="hidden" name="table" value="resources" />
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="end_date" value={today} />
                      <button className="text-sm font-semibold text-paper-muted hover:underline">Dar de baja</button>
                    </form>
                  )}
                  <DeleteButton action={deleteRow} fields={{ table: "resources", id: r.id }} />
                </div>
              </div>
            );
          })}
        </div>
        <Adder label="Añadir recurso">
          <form action={saveResource} className="rounded-md border border-line bg-ink-1 p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
            <input type="hidden" name="project_id" value={id} />
            <Field label="Qué es"><input className="fin-input" name="name" required placeholder="Hosting web" /></Field>
            <Field label="Proveedor"><input className="fin-input" name="provider" placeholder="Vercel" /></Field>
            <Field label="Tipo">
              <select className="fin-input" name="category" defaultValue="hosting">
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Coste €"><input className="fin-input num" name="cost" type="number" step="0.01" min="0" defaultValue="0" /></Field>
              <Field label="Se paga">
                <select className="fin-input" name="billing" defaultValue="monthly">
                  <option value="monthly">Al mes</option>
                  <option value="yearly">Al año</option>
                  <option value="free">Gratis</option>
                </select>
              </Field>
            </div>
            <Field label="Desde"><input className="fin-input" name="start_date" type="date" defaultValue={today} /></Field>
            <Field label="Enlace (opcional)"><input className="fin-input" name="url" type="url" placeholder="https://vercel.com/…" /></Field>
            <Field label="Notas" className="lg:col-span-1"><input className="fin-input" name="notes" placeholder="Plan Pro, cuenta de Gabi" /></Field>
            <button className="fin-btn">Guardar recurso</button>
          </form>
        </Adder>
      </section>

      {/* Mensualidades */}
      <section>
        <SectionTitle title="Mensualidades" hint="Cuotas recurrentes. Cuentan solas cada mes mientras estén activas." />
        <div className="rounded-md border border-line bg-ink-1 px-5 md:px-6 mb-4">
          {subs.length === 0 && <Empty>Sin cuotas mensuales.</Empty>}
          {subs.map((s) => {
            const active = activeIn(month, s.start_date, s.end_date);
            return (
              <div key={s.id} className={`fin-row grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_auto] ${active ? "" : "opacity-50"}`}>
                <div>
                  <span className="font-semibold">{s.client}</span>
                  {s.description && <span className="text-paper-muted">, {s.description}</span>}
                  <span className="block text-xs text-paper-subtle">desde {dateLabel(s.start_date)}{s.end_date && `, hasta ${dateLabel(s.end_date)}`}</span>
                </div>
                <span className="font-mono tabular-nums font-semibold text-right md:text-left">{euros(s.amount)} <span className="text-paper-subtle font-normal">al mes</span></span>
                <div className="col-span-2 md:col-span-1 flex gap-4 justify-end">
                  {!s.end_date && (
                    <form action={endRow}>
                      <input type="hidden" name="table" value="subscriptions" />
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="end_date" value={today} />
                      <button className="text-sm font-semibold text-paper-muted hover:underline">Dar de baja</button>
                    </form>
                  )}
                  <DeleteButton action={deleteRow} fields={{ table: "subscriptions", id: s.id }} />
                </div>
              </div>
            );
          })}
        </div>
        <Adder label="Añadir mensualidad">
          <form action={saveSubscription} className="rounded-md border border-line bg-ink-1 p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
            <input type="hidden" name="project_id" value={id} />
            <Field label="Cliente"><input className="fin-input" name="client" required defaultValue={project.client ?? ""} /></Field>
            <Field label="Concepto"><input className="fin-input" name="description" placeholder="Mantenimiento y hosting" /></Field>
            <Field label="Importe al mes €"><input className="fin-input num" name="amount" type="number" step="0.01" min="0" required /></Field>
            <Field label="Desde"><input className="fin-input" name="start_date" type="date" defaultValue={today} /></Field>
            <button className="fin-btn">Guardar mensualidad</button>
          </form>
        </Adder>
      </section>

      {/* Movimientos */}
      <section>
        <SectionTitle title="Pagos únicos y gastos sueltos" hint="La landing, un setup, o un gasto puntual. Cuentan solo en el mes de su fecha." />
        <div className="rounded-md border border-line bg-ink-1 px-5 md:px-6 mb-4">
          {moves.length === 0 && <Empty>Sin movimientos.</Empty>}
          {moves.map((mv) => (
            <div key={mv.id} className="fin-row grid-cols-[1fr_auto_auto]">
              <div>
                <span className="font-semibold">{mv.description}</span>
                <span className="block text-xs text-paper-subtle">{mv.kind === "income" ? "Pago único" : "Gasto"}, {dateLabel(mv.date)}</span>
              </div>
              <span className={`font-mono tabular-nums font-semibold ${mv.kind === "income" ? "text-ok" : "text-error"}`}>
                {mv.kind === "income" ? "+" : "−"}{euros(mv.amount)}
              </span>
              <DeleteButton action={deleteRow} fields={{ table: "movements", id: mv.id }} />
            </div>
          ))}
        </div>
        <Adder label="Apuntar movimiento">
          <form action={saveMovement} className="rounded-md border border-line bg-ink-1 p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
            <input type="hidden" name="project_id" value={id} />
            <Field label="Tipo">
              <select className="fin-input" name="kind" defaultValue="income">
                <option value="income">Pago único (ingreso)</option>
                <option value="expense">Gasto suelto</option>
              </select>
            </Field>
            <Field label="Concepto"><input className="fin-input" name="description" required placeholder="Landing page" /></Field>
            <Field label="Importe €"><input className="fin-input num" name="amount" type="number" step="0.01" min="0" required /></Field>
            <Field label="Fecha"><input className="fin-input" name="date" type="date" defaultValue={today} /></Field>
            <button className="fin-btn">Apuntar</button>
          </form>
        </Adder>
      </section>

      {/* Ajustes */}
      <section>
        <SectionTitle title="Ajustes del proyecto" />
        <form action={updateProject} className="rounded-md border border-line bg-ink-1 p-5 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={id} />
          <Field label="Nombre"><input className="fin-input" name="name" required defaultValue={project.name} /></Field>
          <Field label="Cliente"><input className="fin-input" name="client" defaultValue={project.client ?? ""} /></Field>
          <Field label="De dónde salen los gastos" className="md:col-span-2">
            <select className="fin-input" name="expense_policy" defaultValue={project.expense_policy}>
              {Object.entries(POLICY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Estado">
            <select className="fin-input" name="status" defaultValue={project.status}>
              <option value="active">Activo</option>
              <option value="paused">En pausa</option>
              <option value="archived">Archivado</option>
            </select>
          </Field>
          <Field label="Color">
            <select className="fin-input" name="color" defaultValue={project.color}>
              {PROJECT_COLORS.map((c) => <option key={c} value={c}>{COLOR_NAMES[c] ?? c}</option>)}
            </select>
          </Field>
          <Field label="Notas" className="md:col-span-2">
            <textarea className="fin-input" name="notes" rows={3} defaultValue={project.notes ?? ""} />
          </Field>
          <div className="md:col-span-2 flex justify-between items-center">
            <button className="fin-btn">Guardar cambios</button>
          </div>
        </form>
        <div className="mt-4">
          <DeleteButton action={deleteProject} fields={{ id }} label="Borrar el proyecto y todos sus movimientos" />
        </div>
      </section>
    </div>
  );
}

function Figure({ label, cents, strong }: { label: string; cents: number; strong?: boolean }) {
  return (
    <div>
      <span className="block text-sm text-paper-subtle">{label}</span>
      <Money cents={cents} className={strong ? "text-2xl font-medium" : "text-xl font-semibold"} />
    </div>
  );
}

function PresetButton({ projectId, stream, preset, label }: { projectId: string; stream: string; preset: string; label: string }) {
  return (
    <form action={applyRulePreset}>
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="stream" value={stream} />
      <input type="hidden" name="preset" value={preset} />
      <button className="fin-btn-quiet">{label}</button>
    </form>
  );
}
