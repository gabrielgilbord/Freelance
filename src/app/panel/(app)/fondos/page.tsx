import { getLedger } from "@/lib/finops/data";
import { computeUntil, currentMonth, monthOf } from "@/lib/finops/ledger";
import { dateLabel, euros, COLOR_NAMES, FUND_COLORS } from "@/lib/finops/format";
import { addFundMovement, deleteFund, deleteFundMovement, saveFund } from "@/app/panel/actions";
import { Adder, DeleteButton, Empty, Field, Money, MonthNav, SectionTitle } from "@/components/finops/ui";


export default async function FundsPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const month = m && /^\d{4}-\d{2}$/.test(m) ? m : currentMonth();
  const data = await getLedger();
  const all = computeUntil(data, month);
  const r = all.at(-1)!;
  const partnerById = new Map(data.partners.map((p) => [p.id, p]));
  const projectById = new Map(data.projects.map((p) => [p.id, p]));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-display-s font-[450]">Fondos</h1>
          <p className="text-paper-muted mt-1 max-w-[62ch]">
            Huchas comunes. Se llenan con los repartos de los proyectos. Los que cubren pérdidas pagan automáticamente los meses en los que un proyecto no llega.
          </p>
        </div>
        <MonthNav month={month} base="/panel/fondos" />
      </div>

      {data.funds.map((f) => {
        const fm = r.funds.find((x) => x.fundId === f.id)!;
        const feeders = data.rules.filter((rule) => rule.fund_id === f.id);
        const covered = r.projects.flatMap((p) => p.coveredBy.filter((c) => c.fundId === f.id).map((c) => ({ ...c, projectId: p.projectId })));
        const deposits = r.projects.flatMap((p) => p.allocations.filter((a) => a.targetType === "fund" && a.targetId === f.id).map((a) => ({ ...a, projectId: p.projectId })));
        const moves = data.fundMovements.filter((x) => x.fund_id === f.id);
        return (
          <section key={f.id} className="rounded-md border border-line bg-ink-1 overflow-hidden">
            <div className="p-5 md:p-7 grid gap-6 md:grid-cols-[1.2fr_1fr]" style={{ borderTop: `6px solid ${f.color}` }}>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-medium">{f.name}</h2>
                  {f.covers_deficits && <span className="rounded-xs bg-ink-2 text-paper-muted text-xs font-semibold px-2.5 py-1">Cubre pérdidas, prioridad {f.priority}</span>}
                </div>
                {f.description && <p className="text-paper-muted mt-1">{f.description}</p>}
                <p className="text-4xl font-medium mt-4"><Money cents={fm.closing} /></p>
                <p className="text-sm text-paper-subtle">saldo a final de mes</p>
                {feeders.length > 0 && (
                  <p className="text-sm text-paper-muted mt-4">
                    Lo alimentan:{" "}
                    {feeders
                      .map((rule) => `${projectById.get(rule.project_id)?.name} (${Number(rule.percent)}% de ${rule.stream === "one_off" ? "pagos únicos" : "mensualidades"})`)
                      .join(", ")}
                  </p>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm self-start">
                <dt className="text-paper-subtle">Saldo al empezar el mes</dt><dd className="text-right"><Money cents={fm.opening} /></dd>
                <dt className="text-paper-subtle">Entra de proyectos</dt><dd className="text-right"><Money cents={fm.deposits} sign /></dd>
                <dt className="text-paper-subtle">Movimientos manuales</dt><dd className="text-right"><Money cents={fm.manual} sign /></dd>
                <dt className="text-paper-subtle">Sale para cubrir pérdidas</dt><dd className="text-right"><Money cents={-fm.coverage} /></dd>
                <div className="col-span-2 border-t border-line" aria-hidden />
                <dt className="font-semibold">Saldo final</dt><dd className="text-right font-semibold"><Money cents={fm.closing} /></dd>
              </dl>
            </div>

            {(deposits.length > 0 || covered.length > 0) && (
              <div className="px-5 md:px-7 pb-2 text-sm">
                {deposits.map((d, i) => (
                  <div key={`d${i}`} className="fin-row grid-cols-[1fr_auto]">
                    <span>{projectById.get(d.projectId)?.name}, {d.stream === "one_off" ? "pagos únicos" : "mensualidades"}</span>
                    <Money cents={d.amount} sign className="text-ok" />
                  </div>
                ))}
                {covered.map((c, i) => (
                  <div key={`c${i}`} className="fin-row grid-cols-[1fr_auto]">
                    <span>Cubre la pérdida de {projectById.get(c.projectId)?.name}</span>
                    <Money cents={-c.amount} />
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-line bg-ink-2 p-5 md:px-7 space-y-4">
              <h3 className="font-semibold">Movimientos manuales</h3>
              {moves.length === 0 && <Empty>Aportes, pagos hechos desde el fondo o retiradas para un socio.</Empty>}
              {moves.slice(0, 12).map((mv) => (
                <div key={mv.id} className={`fin-row grid-cols-[1fr_auto_auto] text-sm ${monthOf(mv.date) === month ? "" : "opacity-70"}`}>
                  <span>
                    {mv.note ?? (Number(mv.amount) > 0 ? "Aporte" : "Salida")}
                    {mv.partner_id && <> para {partnerById.get(mv.partner_id)?.name}</>}
                    <span className="block text-xs text-paper-subtle">{dateLabel(mv.date)}</span>
                  </span>
                  <span className={`font-mono tabular-nums font-semibold ${Number(mv.amount) < 0 ? "text-error" : "text-ok"}`}>{Number(mv.amount) > 0 ? "+" : ""}{euros(mv.amount)}</span>
                  <DeleteButton action={deleteFundMovement} fields={{ id: mv.id }} />
                </div>
              ))}
              <Adder label="Apuntar movimiento">
                <form action={addFundMovement} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 items-end">
                  <input type="hidden" name="fund_id" value={f.id} />
                  <Field label="Tipo">
                    <select className="fin-input" name="direction" defaultValue="out">
                      <option value="out">Sale dinero</option>
                      <option value="in">Entra dinero</option>
                    </select>
                  </Field>
                  <Field label="Importe €"><input className="fin-input num" name="amount" type="number" step="0.01" min="0.01" required /></Field>
                  <Field label="Para el socio (si sale)">
                    <select className="fin-input" name="partner_id" defaultValue="">
                      <option value="">Nadie, es un pago</option>
                      {data.partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Fecha"><input className="fin-input" name="date" type="date" defaultValue={today} /></Field>
                  <Field label="Nota"><input className="fin-input" name="note" placeholder="Renovación de dominios" /></Field>
                  <button className="fin-btn">Apuntar</button>
                </form>
              </Adder>
            </div>

            <details className="adder border-t border-line px-5 md:px-7 py-4">
              <summary className="text-sm font-semibold text-paper-muted underline underline-offset-4">Editar fondo</summary>
              <FundForm fund={f} />
              <div className="mt-3">
                <DeleteButton action={deleteFund} fields={{ id: f.id }} label="Borrar el fondo" />
              </div>
            </details>
          </section>
        );
      })}

      <section>
        <SectionTitle title="Nuevo fondo" hint="Ejemplos: Reserva de mensualidades, Colchón para meses flojos, Impuestos." />
        <Adder label="Crear fondo" open={data.funds.length === 0}>
          <div className="rounded-md border border-line bg-ink-1 p-5 max-w-3xl">
            <FundForm color={FUND_COLORS[data.funds.length % FUND_COLORS.length]} />
          </div>
        </Adder>
      </section>
    </div>
  );
}

function FundForm({ fund, color }: { fund?: { id: string; name: string; description: string | null; color: string; covers_deficits: boolean; priority: number }; color?: string }) {
  return (
    <form action={saveFund} className="grid gap-4 sm:grid-cols-2 items-end">
      {fund && <input type="hidden" name="id" value={fund.id} />}
      <Field label="Nombre"><input className="fin-input" name="name" required defaultValue={fund?.name} /></Field>
      <Field label="Para qué es"><input className="fin-input" name="description" defaultValue={fund?.description ?? ""} /></Field>
      <Field label="Color">
        <select className="fin-input" name="color" defaultValue={fund?.color ?? color}>
          {FUND_COLORS.map((c) => <option key={c} value={c}>{COLOR_NAMES[c] ?? c}</option>)}
        </select>
      </Field>
      <Field label="Prioridad al cubrir pérdidas (1 = primero)">
        <input className="fin-input num" name="priority" type="number" min="1" defaultValue={fund?.priority ?? 1} />
      </Field>
      <label className="sm:col-span-2 flex items-start gap-3 rounded-xs border border-line p-3 cursor-pointer">
        <input type="checkbox" name="covers_deficits" defaultChecked={fund?.covers_deficits} className="mt-1 size-4 accent-[var(--color-accent)]" />
        <span>
          <span className="font-semibold block">Usar para cubrir pérdidas</span>
          <span className="text-sm text-paper-muted">Si un proyecto cierra el mes en negativo, la diferencia sale de aquí antes de pedírsela a los socios.</span>
        </span>
      </label>
      <button className="fin-btn w-fit">{fund ? "Guardar cambios" : "Crear fondo"}</button>
    </form>
  );
}
