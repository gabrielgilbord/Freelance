import Link from "next/link";
import { getLedger } from "@/lib/finops/data";
import { computeUntil, currentMonth } from "@/lib/finops/ledger";
import { money, monthShort } from "@/lib/finops/format";
import { invoicesToCreate, isOpen, isOverdue, todayISO } from "@/lib/finops/billing";
import { Figure, Money, MonthNav, PageTitle, Ribbon, SectionTitle, Swatch, type Segment } from "@/components/finops/ui";

export const metadata = { title: "El mes" };

export default async function MonthPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const month = m && /^\d{4}-\d{2}$/.test(m) ? m : currentMonth();
  const data = await getLedger();

  if (data.projects.length === 0) return <Onboarding hasPartners={data.partners.length > 0} hasFunds={data.funds.length > 0} />;

  const all = computeUntil(data, month);
  const r = all.at(-1)!;
  const history = all.slice(-6);
  const partnerById = new Map(data.partners.map((p) => [p.id, p]));
  const fundById = new Map(data.funds.map((f) => [f.id, f]));
  const projectById = new Map(data.projects.map((p) => [p.id, p]));

  // A dónde acaba cada euro, una vez cubiertas las pérdidas
  const segments: Segment[] = [
    { key: "exp", label: "Infra y gastos", amount: r.totals.expenses, hatch: true },
    ...r.partners.map((pm) => ({
      key: pm.partnerId,
      label: partnerById.get(pm.partnerId)?.name ?? "—",
      amount: pm.byProject.reduce((a, b) => a + b.amount, 0),
      color: partnerById.get(pm.partnerId)?.color,
    })),
    ...r.funds.map((fm) => ({ key: fm.fundId, label: fundById.get(fm.fundId)?.name ?? "—", amount: fm.deposits - fm.coverage, color: fundById.get(fm.fundId)?.color })),
    { key: "un", label: "Sin regla de reparto", amount: r.totals.unassigned, color: "#3d413d" },
  ];
  const fromSavings = segments.reduce((a, s) => a + Math.max(0, s.amount), 0) - r.totals.income;
  const today = todayISO();
  const toInvoice = invoicesToCreate(data.subscriptions, data.invoices, today).length;
  const overdueCount = data.invoices.filter((i) => isOverdue(i, today)).length;
  const openCount = data.invoices.filter(isOpen).length;
  const warnings = r.projects.filter((p) => p.unassigned.one_off + p.unassigned.recurring > 0 || p.uncovered > 0);
  const maxBar = Math.max(1, ...history.map((h) => Math.max(h.totals.income, h.totals.expenses)));

  return (
    <div className="space-y-16 sm:space-y-20">
      <PageTitle title="El mes" aside={<MonthNav month={month} />} />

      {/* La pieza medida del mes */}
      <section aria-label="Resumen del mes">
        <p className="max-w-[30ch] text-[1.75rem] font-[450] leading-[1.15] tracking-[-0.03em] sm:text-[2.5rem]">
          Entran <span>{money(r.totals.income)}</span>
          {r.totals.expenses > 0 && <>, la infra y los gastos cuestan <span>{money(r.totals.expenses)}</span></>} y quedan{" "}
          <span className={`${r.totals.net < 0 ? "text-error" : "text-accent"}`}>{money(r.totals.net)}</span>.
        </p>
        <div className="mt-10">
          <Ribbon segments={segments} total={Math.max(r.totals.income, 0)} />
          {fromSavings > 0 && (
            <p className="mt-4 text-sm text-paper-subtle">
              Incluye {money(fromSavings)} que han salido de fondos o del bolsillo de los socios para cubrir pérdidas.
            </p>
          )}
        </div>
      </section>

      {/* Socios */}
      <section aria-labelledby="socios-mes">
        <SectionTitle id="socios-mes" title="Lo que se lleva cada socio" hint="Repartos de todos los proyectos, más lo que haya retirado de algún fondo." />
        {data.partners.length === 0 ? (
          <p className="text-paper-muted">Aún no hay socios. <Link href="/panel/socios" className="text-paper underline underline-offset-4">Añádelos</Link>.</p>
        ) : (
          <div className={`grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 ${r.partners.length >= 3 ? "lg:grid-cols-3" : ""}`}>
            {r.partners.map((pm) => {
              const p = partnerById.get(pm.partnerId)!;
              return (
                <article key={pm.partnerId} className="bg-ink-1 p-6">
                  <h3 className="flex items-center gap-2.5 text-paper-muted"><Swatch color={p.color} />{p.name}</h3>
                  <Figure cents={pm.total} className="mt-3 block text-[2.5rem] leading-none" />
                  <ul className="mt-6 space-y-2 text-sm">
                    {pm.byProject.map((bp) => (
                      <li key={bp.projectId} className="flex justify-between gap-4">
                        <span className="truncate text-paper-subtle">{projectById.get(bp.projectId)?.name}</span>
                        <Money cents={bp.amount} />
                      </li>
                    ))}
                    {pm.fromFunds > 0 && (
                      <li className="flex justify-between gap-4">
                        <span className="text-paper-subtle">Retirado de fondos</span>
                        <Money cents={pm.fromFunds} />
                      </li>
                    )}
                    {pm.byProject.length === 0 && pm.fromFunds === 0 && <li className="text-paper-subtle">Nada este mes</li>}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {(toInvoice > 0 || overdueCount > 0) && (
        <Link href="/panel/facturas" className="flex flex-wrap items-baseline justify-between gap-3 rounded-md border border-line-strong bg-ink-1 px-5 py-4 hover:border-paper/60">
          <span>
            {toInvoice > 0 && <>Toca facturar {toInvoice} {toInvoice === 1 ? "cuota" : "cuotas"}. </>}
            {overdueCount > 0 && <span className="text-error">{overdueCount} {overdueCount === 1 ? "factura vencida" : "facturas vencidas"} sin cobrar. </span>}
            {openCount > overdueCount && <span className="text-paper-muted">{openCount - overdueCount} más por cobrar.</span>}
          </span>
          <span className="text-sm text-paper-muted">Ir a Facturas</span>
        </Link>
      )}

      {warnings.length > 0 && (
        <section className="border-l-2 border-paper pl-5">
          <h2 className="font-medium">Pendiente de revisar</h2>
          <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-paper-muted">
            {warnings.map((w) => {
              const p = projectById.get(w.projectId)!;
              const un = w.unassigned.one_off + w.unassigned.recurring;
              return (
                <li key={w.projectId}>
                  <Link href={`/panel/proyectos/${p.id}`} className="text-paper underline underline-offset-4">{p.name}</Link>
                  {un > 0 && <> tiene {money(un)} de beneficio sin regla de reparto.</>}
                  {w.uncovered > 0 && <> pierde {money(w.uncovered)} que ningún fondo ha podido cubrir; lo ponen los socios.</>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Proyectos */}
      <section aria-labelledby="proyectos-mes">
        <SectionTitle id="proyectos-mes" title="Proyectos" />
        <table className="hidden w-full border-collapse text-left md:table">
          <thead>
            <tr className="border-b border-line-strong font-mono text-xs text-paper-subtle">
              <th scope="col" className="py-3 pr-4 font-normal">Proyecto</th>
              <th scope="col" className="py-3 pr-4 text-right font-normal">Pagos únicos</th>
              <th scope="col" className="py-3 pr-4 text-right font-normal">Mensualidades</th>
              <th scope="col" className="py-3 pr-4 text-right font-normal">Infra y gastos</th>
              <th scope="col" className="py-3 text-right font-normal">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {r.projects.map((pm) => {
              const p = projectById.get(pm.projectId)!;
              return (
                <tr key={p.id} className="border-b border-line text-[0.9375rem]">
                  <th scope="row" className="py-4 pr-4 font-normal">
                    <Link href={`/panel/proyectos/${p.id}`} className="inline-flex items-center gap-3 hover:underline hover:underline-offset-4">
                      <Swatch color={p.color} />
                      {p.name}
                    </Link>
                    {pm.coveredBy.length > 0 && (
                      <span className="ml-3 font-mono text-xs text-paper-subtle">lo cubre {pm.coveredBy.map((c) => fundById.get(c.fundId)?.name).join(", ")}</span>
                    )}
                  </th>
                  <Td cents={pm.oneOffIncome} />
                  <Td cents={pm.recurringIncome} />
                  <Td cents={-pm.expenses} />
                  <td className="py-4 text-right"><Money cents={pm.net} className="text-paper" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Móvil: una ficha por proyecto */}
        <ul className="md:hidden">
          {r.projects.map((pm) => {
            const p = projectById.get(pm.projectId)!;
            return (
              <li key={p.id} className="border-b border-line py-4">
                <Link href={`/panel/proyectos/${p.id}`} className="flex items-baseline justify-between gap-4">
                  <span className="flex items-center gap-2.5 font-medium"><Swatch color={p.color} />{p.name}</span>
                  <Money cents={pm.net} />
                </Link>
                <p className="mt-1.5 font-mono text-xs text-paper-subtle">
                  {[
                    pm.oneOffIncome ? `único ${money(pm.oneOffIncome)}` : null,
                    pm.recurringIncome ? `mensual ${money(pm.recurringIncome)}` : null,
                    pm.expenses ? `gastos ${money(pm.expenses)}` : null,
                  ].filter(Boolean).join(", ") || "sin movimiento"}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
        <section aria-labelledby="fondos-mes">
          <SectionTitle id="fondos-mes" title="Fondos" hint="Saldo a final de mes." />
          {data.funds.length === 0 ? (
            <p className="text-paper-muted">Sin fondos. <Link href="/panel/fondos" className="text-paper underline underline-offset-4">Crea uno</Link> para guardar las mensualidades o cubrir pérdidas.</p>
          ) : (
            <ul>
              {r.funds.map((fm) => {
                const f = fundById.get(fm.fundId)!;
                return (
                  <li key={f.id} className="fin-row grid-cols-[1fr_auto]">
                    <span className="flex items-center gap-3">
                      <Swatch color={f.color} />
                      {f.name}
                      {f.covers_deficits && <span className="font-mono text-xs text-paper-subtle">cubre pérdidas</span>}
                    </span>
                    <span className="text-right">
                      <Money cents={fm.closing} className="text-paper" />
                      <span className="block font-mono text-xs text-paper-subtle"><Money cents={fm.closing - fm.opening} sign /> este mes</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="historico">
          <SectionTitle id="historico" title="Últimos meses" hint="Ingresos frente a infra y gastos." />
          <div className="flex h-44 items-end gap-3">
            {history.map((h) => (
              <Link key={h.month} href={`/panel?m=${h.month}`} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" aria-label={`${h.month}: quedan ${money(h.totals.net)}`}>
                <div className="flex w-full flex-1 items-end justify-center gap-1">
                  <div className="w-1/2 max-w-4 bg-paper" style={{ height: `${(h.totals.income / maxBar) * 100}%` }} />
                  <div className="fin-hatch w-1/2 max-w-4" style={{ height: `${(h.totals.expenses / maxBar) * 100}%` }} />
                </div>
                <span className={`font-mono text-xs ${h.month === month ? "text-paper" : "text-paper-subtle"} group-hover:text-paper`}>{monthShort(h.month)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Td({ cents }: { cents: number }) {
  return (
    <td className="py-4 pr-4 text-right text-paper-muted">
      {cents === 0 ? <span className="text-paper-subtle">—</span> : <Money cents={cents} />}
    </td>
  );
}

function Onboarding({ hasPartners, hasFunds }: { hasPartners: boolean; hasFunds: boolean }) {
  const steps = [
    { done: hasPartners, href: "/panel/socios", title: "Añade a los socios", text: "Las personas entre las que se reparten los beneficios." },
    { done: hasFunds, href: "/panel/fondos", title: "Crea los fondos", text: "Una reserva para las mensualidades y un colchón que cubra los meses en pérdidas." },
    { done: false, href: "/panel/proyectos", title: "Da de alta el primer proyecto", text: "Con su infra, lo que se cobra y cómo se reparte." },
  ];
  return (
    <div className="max-w-2xl">
      <PageTitle title="Empecemos por lo básico">Tres pasos y el resumen del mes se rellena solo.</PageTitle>
      <ol className="mt-10 border-t border-line-strong">
        {steps.map((s, i) => (
          <li key={s.href}>
            <Link href={s.href} className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-5">
              <span className={`font-mono text-sm ${s.done ? "text-ok" : "text-paper-subtle"}`}>{s.done ? "hecho" : `0${i + 1}`}</span>
              <span>
                <span className="block text-lg group-hover:underline group-hover:underline-offset-4">{s.title}</span>
                <span className="mt-1 block text-[0.9375rem] text-paper-muted">{s.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
