/**
 * Avisos de facturación: qué cuotas toca facturar y qué facturas están sin cobrar.
 * Puro (sin BD) para usarlo igual en el panel y en el aviso diario por email.
 */
import { intervalMonths } from "./ledger";
import type { Invoice, Subscription } from "./types";

export const LEAD_DAYS = 3; // avisar unos días antes del día de facturación
export const LOOKBACK_DAYS = 62; // no arrastrar periodos muy antiguos

const iso = (d: Date) => d.toISOString().slice(0, 10);
const day = (s: string) => new Date(s + "T00:00:00Z");
const addDays = (s: string, n: number) => iso(new Date(day(s).getTime() + n * 86400000));

function dateIn(year: number, month0: number, dom: number) {
  return iso(new Date(Date.UTC(year, month0, dom)));
}

/** Fechas de facturación de una cuota entre `from` y `to` (inclusive). */
export function periodDates(s: Pick<Subscription, "start_date" | "end_date" | "billing_interval" | "billing_day">, from: string, to: string) {
  const start = day(s.start_date);
  const y = start.getUTCFullYear();
  let m = start.getUTCMonth();
  let first = dateIn(y, m, s.billing_day);
  if (first < s.start_date) {
    m += 1;
    first = dateIn(y, m, s.billing_day);
  }
  const step = intervalMonths(s.billing_interval);
  const out: string[] = [];
  for (let k = 0; k < 600; k++) {
    const d = dateIn(y, m + k * step, s.billing_day);
    if (d > to) break;
    if (s.end_date && d > s.end_date) break;
    if (d >= from) out.push(d);
  }
  return out;
}

export interface DueInvoice {
  subscription: Subscription;
  periodDate: string;
}

/** Periodos de cuotas que ya toca facturar (o en los próximos días) y aún no tienen factura. */
export function invoicesToCreate(subs: Subscription[], invoices: Invoice[], today: string): DueInvoice[] {
  const done = new Set(invoices.filter((i) => i.subscription_id && i.period_date).map((i) => `${i.subscription_id}|${i.period_date}`));
  const from = addDays(today, -LOOKBACK_DAYS);
  const to = addDays(today, LEAD_DAYS);
  const out: DueInvoice[] = [];
  for (const s of subs) {
    for (const d of periodDates(s, from, to)) {
      if (!done.has(`${s.id}|${d}`)) out.push({ subscription: s, periodDate: d });
    }
  }
  return out.sort((a, b) => a.periodDate.localeCompare(b.periodDate));
}

export const isOpen = (i: Pick<Invoice, "status">) => i.status === "pending" || i.status === "processing";
export const isOverdue = (i: Pick<Invoice, "status" | "due_date">, today: string) => isOpen(i) && !!i.due_date && i.due_date < today;

/** Siguiente número de factura: AAAA-NNN correlativo dentro del año. */
export function nextInvoiceNumber(invoices: Pick<Invoice, "number">[], year: number) {
  const prefix = `${year}-`;
  const max = invoices
    .map((i) => (i.number.startsWith(prefix) ? Number(i.number.slice(prefix.length)) : 0))
    .filter(Number.isFinite)
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const plusDays = addDays;
