/**
 * Motor de cálculo mensual.
 *
 * Por cada proyecto y mes:
 *  1. Ingresos de pago único (landing, setup) = movimientos de ingreso del mes.
 *  2. Ingresos mensuales = cuotas activas ese mes.
 *  3. Gastos = recursos activos (anuales prorrateados /12) + gastos sueltos del mes.
 *  4. Los gastos se descuentan de cada tipo de ingreso según la política del proyecto.
 *  5. Lo que queda de cada tipo se reparte según sus reglas (socios o fondos).
 *  6. Si el proyecto pierde dinero, el déficit lo cubren los fondos de cobertura
 *     (por prioridad). Lo que no cubran lo ponen los socios del proyecto.
 *
 * Todo se calcula en céntimos para que los repartos cuadren al céntimo.
 */
import type { LedgerData, Project, Rule, Stream } from "./types";

export type Month = string; // "YYYY-MM"

export interface Allocation {
  stream: Stream;
  targetType: "partner" | "fund";
  targetId: string;
  percent: number;
  amount: number; // céntimos
}

export interface ProjectMonth {
  projectId: string;
  oneOffIncome: number;
  recurringIncome: number;
  resourceCost: number;
  looseExpenses: number;
  expenses: number;
  /** Gastos absorbidos por cada tipo de ingreso */
  absorbed: Record<Stream, number>;
  /** Beneficio que queda en cada tipo tras gastos (>= 0) */
  profit: Record<Stream, number>;
  net: number; // ingresos - gastos (puede ser negativo)
  allocations: Allocation[];
  unassigned: Record<Stream, number>; // beneficio sin regla de reparto
  deficit: number; // >= 0
  coveredBy: { fundId: string; amount: number }[];
  uncovered: number;
  uncoveredSplit: { partnerId: string; amount: number }[]; // importes negativos
}

export interface PartnerMonth {
  partnerId: string;
  byProject: { projectId: string; amount: number }[];
  fromFunds: number;
  total: number;
}

export interface FundMonth {
  fundId: string;
  opening: number;
  deposits: number; // desde repartos de proyectos
  manual: number; // movimientos manuales (+/-)
  coverage: number; // lo que salió para cubrir déficits (positivo)
  closing: number;
}

export interface MonthResult {
  month: Month;
  projects: ProjectMonth[];
  partners: PartnerMonth[];
  funds: FundMonth[];
  totals: {
    income: number;
    expenses: number;
    net: number;
    toPartners: number;
    toFunds: number;
    unassigned: number;
    uncovered: number;
  };
}

/** Meses que cubre cada cuota. Las trimestrales y anuales se prorratean al mes. */
export const intervalMonths = (i?: string) => (i === "quarterly" ? 3 : i === "yearly" ? 12 : 1);

export const toCents = (v: number | string) => Math.round(Number(v) * 100);

export function monthOf(date: string): Month {
  return date.slice(0, 7);
}

export function addMonths(m: Month, n: number): Month {
  const [y, mo] = m.split("-").map(Number) as [number, number];
  const d = new Date(Date.UTC(y, mo - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function currentMonth(now = new Date()): Month {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** ¿Está activo en el mes un elemento con fecha de inicio y fin opcional? */
export function activeIn(m: Month, start: string, end: string | null): boolean {
  if (monthOf(start) > m) return false;
  if (end && monthOf(end) < m) return false;
  return true;
}

/** Reparte `total` céntimos según pesos, cuadrando al céntimo (mayor resto). */
export function splitCents(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0 || total === 0) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / sum);
  const floored = raw.map((r) => Math.floor(r));
  let rest = total - floored.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; rest > 0; k = (k + 1) % order.length, rest--) floored[order[k]!.i]!++;
  return floored;
}

function absorbExpenses(project: Project, oneOff: number, recurring: number, expenses: number) {
  const absorbed: Record<Stream, number> = { one_off: 0, recurring: 0 };
  let left = expenses;
  if (project.expense_policy === "proportional") {
    const income = oneOff + recurring;
    const usable = Math.min(left, income);
    const [a, b] = splitCents(usable, [oneOff, recurring]);
    absorbed.one_off = a!;
    absorbed.recurring = b!;
    left -= usable;
  } else {
    const order: Stream[] =
      project.expense_policy === "recurring_first" ? ["recurring", "one_off"] : ["one_off", "recurring"];
    const avail: Record<Stream, number> = { one_off: oneOff, recurring };
    for (const s of order) {
      const take = Math.min(left, avail[s]);
      absorbed[s] = take;
      left -= take;
    }
  }
  return { absorbed, deficit: left };
}

function distribute(amount: number, stream: Stream, rules: Rule[]) {
  const rs = rules.filter((r) => r.stream === stream);
  const pctSum = rs.reduce((a, r) => a + Number(r.percent), 0);
  if (amount <= 0 || rs.length === 0) return { allocations: [] as Allocation[], unassigned: amount };
  // Si suman más de 100 se normaliza; si suman menos, el resto queda sin asignar.
  const assignable = pctSum >= 100 ? amount : Math.round((amount * pctSum) / 100);
  const parts = splitCents(assignable, rs.map((r) => Number(r.percent)));
  const allocations: Allocation[] = rs.map((r, i) => ({
    stream,
    targetType: r.partner_id ? "partner" : "fund",
    targetId: (r.partner_id ?? r.fund_id)!,
    percent: Number(r.percent),
    amount: parts[i]!,
  }));
  return { allocations, unassigned: amount - assignable };
}

export function computeMonth(data: LedgerData, month: Month, opening: Record<string, number>): MonthResult {
  const fundState: Record<string, FundMonth> = {};
  for (const f of data.funds) {
    const o = opening[f.id] ?? 0;
    fundState[f.id] = { fundId: f.id, opening: o, deposits: 0, manual: 0, coverage: 0, closing: o };
  }
  const partnerState: Record<string, PartnerMonth> = {};
  for (const p of data.partners) partnerState[p.id] = { partnerId: p.id, byProject: [], fromFunds: 0, total: 0 };
  const credit = (partnerId: string, projectId: string, amount: number) => {
    const ps = partnerState[partnerId];
    if (!ps || amount === 0) return;
    const row = ps.byProject.find((r) => r.projectId === projectId);
    if (row) row.amount += amount;
    else ps.byProject.push({ projectId, amount });
    ps.total += amount;
  };

  const projects: ProjectMonth[] = [];
  const sortedProjects = [...data.projects].sort((a, b) => a.name.localeCompare(b.name));

  for (const project of sortedProjects) {
    const oneOffIncome = data.movements
      .filter((m) => m.project_id === project.id && m.kind === "income" && monthOf(m.date) === month)
      .reduce((a, m) => a + toCents(m.amount), 0);
    const recurringIncome = data.subscriptions
      .filter((s) => s.project_id === project.id && activeIn(month, s.start_date, s.end_date))
      .reduce((a, s) => a + Math.round(toCents(s.amount) / intervalMonths(s.billing_interval)), 0);
    const resourceCost = data.resources
      .filter((r) => r.project_id === project.id && r.billing !== "free" && activeIn(month, r.start_date, r.end_date))
      .reduce((a, r) => a + (r.billing === "yearly" ? Math.round(toCents(r.cost) / 12) : toCents(r.cost)), 0);
    const looseExpenses = data.movements
      .filter((m) => m.project_id === project.id && m.kind === "expense" && monthOf(m.date) === month)
      .reduce((a, m) => a + toCents(m.amount), 0);
    const expenses = resourceCost + looseExpenses;

    const { absorbed, deficit } = absorbExpenses(project, oneOffIncome, recurringIncome, expenses);
    const profit: Record<Stream, number> = {
      one_off: oneOffIncome - absorbed.one_off,
      recurring: recurringIncome - absorbed.recurring,
    };
    const rules = data.rules.filter((r) => r.project_id === project.id);
    const d1 = distribute(profit.one_off, "one_off", rules);
    const d2 = distribute(profit.recurring, "recurring", rules);
    const allocations = [...d1.allocations, ...d2.allocations];

    for (const a of allocations) {
      if (a.targetType === "partner") credit(a.targetId, project.id, a.amount);
      else if (fundState[a.targetId]) {
        fundState[a.targetId]!.deposits += a.amount;
        fundState[a.targetId]!.closing += a.amount;
      }
    }

    projects.push({
      projectId: project.id,
      oneOffIncome,
      recurringIncome,
      resourceCost,
      looseExpenses,
      expenses,
      absorbed,
      profit,
      net: oneOffIncome + recurringIncome - expenses,
      allocations,
      unassigned: { one_off: d1.unassigned, recurring: d2.unassigned },
      deficit,
      coveredBy: [],
      uncovered: 0,
      uncoveredSplit: [],
    });
  }

  // Movimientos manuales de fondos (aportes, pagos, retiradas a socios)
  for (const fm of data.fundMovements.filter((m) => monthOf(m.date) === month)) {
    const fs = fundState[fm.fund_id];
    if (!fs) continue;
    const c = toCents(fm.amount);
    fs.manual += c;
    fs.closing += c;
    if (fm.partner_id && c < 0 && partnerState[fm.partner_id]) {
      partnerState[fm.partner_id]!.fromFunds += -c;
      partnerState[fm.partner_id]!.total += -c;
    }
  }

  // Cubrir déficits con fondos de cobertura (por prioridad)
  const coverFunds = data.funds
    .filter((f) => f.covers_deficits)
    .sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name));
  for (const pm of projects) {
    let need = pm.deficit;
    for (const f of coverFunds) {
      if (need <= 0) break;
      const fs = fundState[f.id]!;
      const take = Math.min(need, Math.max(0, fs.closing));
      if (take > 0) {
        fs.coverage += take;
        fs.closing -= take;
        pm.coveredBy.push({ fundId: f.id, amount: take });
        need -= take;
      }
    }
    pm.uncovered = need;
    if (need > 0) {
      // Lo pone cada socio según su peso en las reglas del proyecto; si no hay, a partes iguales.
      const rules = data.rules.filter((r) => r.project_id === pm.projectId && r.partner_id);
      const weights = new Map<string, number>();
      for (const r of rules) weights.set(r.partner_id!, (weights.get(r.partner_id!) ?? 0) + Number(r.percent));
      if (weights.size === 0) {
        // Sin reparto a socios: lo ponen los socios del proyecto; si no tiene, todos los activos.
        const members = (data.projectPartners ?? []).filter((pp) => pp.project_id === pm.projectId).map((pp) => pp.partner_id);
        const pool = members.length ? data.partners.filter((p) => members.includes(p.id)) : data.partners.filter((p) => p.active);
        for (const p of pool) weights.set(p.id, 1);
      }
      const ids = [...weights.keys()];
      const parts = splitCents(need, ids.map((id) => weights.get(id)!));
      pm.uncoveredSplit = ids.map((id, i) => ({ partnerId: id, amount: -parts[i]! }));
      for (const s of pm.uncoveredSplit) credit(s.partnerId, pm.projectId, s.amount);
    }
  }

  const partners = Object.values(partnerState);
  const funds = Object.values(fundState);
  const income = projects.reduce((a, p) => a + p.oneOffIncome + p.recurringIncome, 0);
  const expenses = projects.reduce((a, p) => a + p.expenses, 0);
  return {
    month,
    projects,
    partners,
    funds,
    totals: {
      income,
      expenses,
      net: income - expenses,
      toPartners: projects.reduce(
        (a, p) => a + p.allocations.filter((x) => x.targetType === "partner").reduce((s, x) => s + x.amount, 0),
        0,
      ),
      toFunds: projects.reduce(
        (a, p) => a + p.allocations.filter((x) => x.targetType === "fund").reduce((s, x) => s + x.amount, 0),
        0,
      ),
      unassigned: projects.reduce((a, p) => a + p.unassigned.one_off + p.unassigned.recurring, 0),
      uncovered: projects.reduce((a, p) => a + p.uncovered, 0),
    },
  };
}

/** Primer mes con datos (para arrastrar saldos de fondos desde el principio). */
export function firstMonth(data: LedgerData, fallback: Month): Month {
  const dates = [
    ...data.movements.map((m) => m.date),
    ...data.subscriptions.map((s) => s.start_date),
    ...data.resources.map((r) => r.start_date),
    ...data.fundMovements.map((f) => f.date),
  ];
  if (dates.length === 0) return fallback;
  const min = monthOf(dates.sort()[0]!);
  return min < fallback ? min : fallback;
}

/** Calcula todos los meses desde el primero con datos hasta `target`, arrastrando saldos. */
export function computeUntil(data: LedgerData, target: Month): MonthResult[] {
  let m = firstMonth(data, target);
  const minAllowed = addMonths(target, -120);
  if (m < minAllowed) m = minAllowed;
  const results: MonthResult[] = [];
  let balances: Record<string, number> = {};
  while (m <= target) {
    const r = computeMonth(data, m, balances);
    balances = Object.fromEntries(r.funds.map((f) => [f.fundId, f.closing]));
    results.push(r);
    m = addMonths(m, 1);
  }
  return results;
}
