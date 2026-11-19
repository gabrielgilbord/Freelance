import Link from "next/link";
import { getLedger } from "@/lib/finops/data";
import { invoicesToCreate, isOpen, isOverdue, nextInvoiceNumber, plusDays, todayISO } from "@/lib/finops/billing";
import { dateLabel, euros, money, monthLabel } from "@/lib/finops/format";
import { toCents } from "@/lib/finops/ledger";
import type { Invoice, InvoiceStatus } from "@/lib/finops/types";
import { createInvoice, deleteInvoice, setInvoiceStatus } from "@/app/panel/actions";
import { Adder, Empty, Field, PageTitle, SectionTitle, Swatch } from "@/components/finops/ui";

export const metadata = { title: "Facturas" };

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  pending: "Pendiente",
  processing: "En trámite",
  paid: "Pagada",
  cancelled: "Anulada",
};
const INTERVAL_LABEL = { monthly: "mensual", quarterly: "trimestral", yearly: "anual" } as const;
const FILTERS: { key: string; label: string; match: (i: Invoice) => boolean }[] = [
  { key: "todas", label: "Todas", match: () => true },
  { key: "por-cobrar", label: "Por cobrar", match: isOpen },
  { key: "pagadas", label: "Pagadas", match: (i) => i.status === "paid" },
  { key: "anuladas", label: "Anuladas", match: (i) => i.status === "cancelled" },
];

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado = "todas" } = await searchParams;
  const data = await getLedger();
  const today = todayISO();
  const projectById = new Map(data.projects.map((p) => [p.id, p]));
  const invoices = data.invoices;
  const due = invoicesToCreate(
    data.subscriptions.filter((s) => projectById.get(s.project_id)?.status !== "archived"),
    invoices,
    today,
  );
  const open = invoices.filter(isOpen).sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  const overdue = open.filter((i) => isOverdue(i, today));
  const nextNumber = nextInvoiceNumber(invoices, Number(today.slice(0, 4)));
  const filter = FILTERS.find((f) => f.key === estado) ?? FILTERS[0]!;
  const listed = invoices.filter(filter.match);

  return (
    <div className="space-y-16">
      <PageTitle title="Facturas">
        Por cobrar <span className="text-paper">{money(open.reduce((a, i) => a + toCents(i.amount), 0))}</span> en {open.length}{" "}
        {open.length === 1 ? "factura" : "facturas"}
        {overdue.length > 0 && <>, <span className="text-error">{overdue.length} {overdue.length === 1 ? "vencida" : "vencidas"}</span></>}.
        {due.length > 0 && <> Hay {due.length} {due.length === 1 ? "cuota" : "cuotas"} por facturar.</>}
      </PageTitle>

      {/* Toca facturar */}
      <section aria-labelledby="toca">
        <SectionTitle id="toca" title="Toca facturar" hint="Cuotas cuyo día de facturación ha llegado o llega en los próximos 3 días y aún no tienen factura." />
        {due.length === 0 ? (
          <Empty>Nada pendiente de facturar. Las cuotas aparecen aquí cuando llega su día.</Empty>
        ) : (
          <ul>
            {due.map(({ subscription: s, periodDate }) => {
              const p = projectById.get(s.project_id);
              const late = periodDate < today;
              return (
                <li key={`${s.id}-${periodDate}`} className="fin-row grid-cols-1 md:grid-cols-[1.5fr_1fr_0.8fr_auto] md:items-center">
                  <div className="min-w-0">
                    <span className="block">{s.client}{s.description && <span className="text-paper-muted">, {s.description}</span>}</span>
                    <span className="flex items-center gap-2 font-mono text-xs text-paper-subtle">
                      {p && <Swatch color={p.color} />}
                      {p?.name}, cuota {INTERVAL_LABEL[s.billing_interval]}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className={late ? "text-error" : "text-paper-muted"}>{late ? "Tocaba el" : "Se factura el"} {dateLabel(periodDate)}</span>
                    <span className="block truncate font-mono text-xs text-paper-subtle">{s.billing_emails || "sin email de facturación"}</span>
                  </div>
                  <span className="font-mono">{euros(s.amount)}</span>
                  <form action={createInvoice}>
                    <input type="hidden" name="project_id" value={s.project_id} />
                    <input type="hidden" name="subscription_id" value={s.id} />
                    <input type="hidden" name="period_date" value={periodDate} />
                    <input type="hidden" name="number" value={nextNumber} />
                    <input type="hidden" name="client" value={s.client} />
                    <input type="hidden" name="billing_emails" value={s.billing_emails ?? ""} />
                    <input type="hidden" name="concept" value={`${s.description || "Cuota"} (${monthLabel(periodDate.slice(0, 7)).toLowerCase()})`} />
                    <input type="hidden" name="amount" value={String(s.amount)} />
                    <input type="hidden" name="issue_date" value={today} />
                    <input type="hidden" name="due_date" value={plusDays(today, 15)} />
                    <button className="fin-btn-quiet">Crear factura {nextNumber}</button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Por cobrar */}
      <section aria-labelledby="cobrar">
        <SectionTitle id="cobrar" title="Por cobrar" hint="Facturas emitidas que aún no están pagadas." />
        {open.length === 0 ? <Empty>Todo cobrado.</Empty> : <InvoiceList invoices={open} today={today} projectById={projectById} />}
      </section>

      {/* Nueva factura */}
      <section aria-labelledby="nueva">
        <SectionTitle id="nueva" title="Nueva factura" hint="Para landings, desarrollos o cualquier cobro suelto. Las cuotas se facturan desde Toca facturar." />
        {data.projects.length === 0 ? (
          <Empty>Primero crea un proyecto.</Empty>
        ) : (
          <Adder label="Crear factura">
            <form action={createInvoice} className="grid gap-4 rounded-md border border-line bg-ink-1 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
              <Field label="Proyecto">
                <select className="fin-input" name="project_id" required>
                  {data.projects.filter((p) => p.status !== "archived").map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>
              <Field label="Número"><input className="fin-input font-mono" name="number" defaultValue={nextNumber} required /></Field>
              <Field label="Cliente"><input className="fin-input" name="client" required /></Field>
              <Field label="Emails de facturación"><input className="fin-input" name="billing_emails" placeholder="admin@cliente.com, conta@cliente.com" /></Field>
              <Field label="Concepto" className="lg:col-span-2"><input className="fin-input" name="concept" required placeholder="Landing page" /></Field>
              <Field label="Importe €"><input className="fin-input font-mono" name="amount" type="number" step="0.01" min="0" required /></Field>
              <Field label="Estado">
                <select className="fin-input" name="status" defaultValue="pending">
                  {(["pending", "processing", "paid"] as const).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </Field>
              <Field label="Fecha de emisión"><input className="fin-input" name="issue_date" type="date" defaultValue={today} /></Field>
              <Field label="Vence"><input className="fin-input" name="due_date" type="date" defaultValue={plusDays(today, 15)} /></Field>
              <label className="flex items-center gap-3 text-[0.9375rem] text-paper-muted lg:col-span-1">
                <input type="checkbox" name="count_one_off" defaultChecked className="size-4 accent-[var(--color-accent)]" />
                Contar como pago único en las cuentas del mes
              </label>
              <button className="fin-btn">Crear factura</button>
            </form>
          </Adder>
        )}
      </section>

      {/* Historial */}
      <section aria-labelledby="historial">
        <SectionTitle id="historial" title="Historial" />
        <nav aria-label="Filtrar facturas" className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={`/panel/facturas?estado=${f.key}`}
              aria-current={f.key === filter.key ? "page" : undefined}
              className={`rounded-xs border px-3 py-1.5 text-sm ${f.key === filter.key ? "border-paper text-paper" : "border-line-strong text-paper-muted hover:text-paper"}`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
        {listed.length === 0 ? <Empty>No hay facturas aquí.</Empty> : <InvoiceList invoices={listed} today={today} projectById={projectById} />}
      </section>
    </div>
  );
}

function InvoiceList({ invoices, today, projectById }: { invoices: Invoice[]; today: string; projectById: Map<string, { name: string; color: string }> }) {
  return (
    <ul>
      {invoices.map((i) => {
        const p = projectById.get(i.project_id);
        const late = isOverdue(i, today);
        return (
          <li key={i.id} className={`fin-row grid-cols-1 md:grid-cols-[0.6fr_1.5fr_1fr_0.7fr_auto] md:items-center ${i.status === "cancelled" ? "opacity-50" : ""}`}>
            <span className="font-mono text-sm text-paper-muted">{i.number}</span>
            <div className="min-w-0">
              <span className="block truncate">{i.client}<span className="text-paper-muted">, {i.concept}</span></span>
              <span className="flex items-center gap-2 truncate font-mono text-xs text-paper-subtle">
                {p && <Swatch color={p.color} />}
                {p?.name}{i.billing_emails && `, ${i.billing_emails}`}
              </span>
            </div>
            <div className="text-sm">
              <span className={`font-mono ${i.status === "paid" ? "text-ok" : late ? "text-error" : i.status === "processing" ? "text-paper" : "text-paper-muted"}`}>
                {STATUS_LABEL[i.status]}{late && ", vencida"}
              </span>
              <span className="block font-mono text-xs text-paper-subtle">
                {i.status === "paid" && i.paid_date ? `cobrada el ${dateLabel(i.paid_date)}` : i.due_date ? `vence el ${dateLabel(i.due_date)}` : `emitida el ${dateLabel(i.issue_date)}`}
              </span>
            </div>
            <span className="font-mono">{euros(i.amount)}</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
              {i.status !== "processing" && i.status !== "paid" && i.status !== "cancelled" && <StatusButton id={i.id} status="processing" label="En trámite" />}
              {i.status !== "paid" && i.status !== "cancelled" && <StatusButton id={i.id} status="paid" label="Marcar pagada" strong />}
              {i.status === "paid" && <StatusButton id={i.id} status="pending" label="Deshacer pago" />}
              {i.status !== "cancelled" && i.status !== "paid" && <StatusButton id={i.id} status="cancelled" label="Anular" />}
              <form action={deleteInvoice}>
                <input type="hidden" name="id" value={i.id} />
                <button className="text-sm text-paper-subtle hover:text-error">Borrar</button>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function StatusButton({ id, status, label, strong }: { id: string; status: InvoiceStatus; label: string; strong?: boolean }) {
  return (
    <form action={setInvoiceStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className={strong ? "fin-btn-quiet" : "text-sm text-paper-muted hover:text-paper"}>{label}</button>
    </form>
  );
}
