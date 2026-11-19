import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { invoicesToCreate, isOverdue, todayISO } from "@/lib/finops/billing";
import { dateLabel, euros } from "@/lib/finops/format";
import type { Invoice, Subscription } from "@/lib/finops/types";
import { mailConfigured, sendMail } from "@/lib/mail/smtp";

/**
 * Aviso diario (Vercel Cron, ver vercel.json): manda a superadmins y admins las
 * cuotas que toca facturar y las facturas vencidas. Si no hay nada, no envía.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false },
  });
  const { data, error } = await sb.rpc("billing_reminder_data", { p_secret: secret });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const d = data as { projects: { id: string; name: string; status: string }[]; subscriptions: Subscription[]; invoices: Invoice[]; recipients: string[] };
  const today = todayISO();
  const projectName = new Map(d.projects.map((p) => [p.id, p.name]));
  const archived = new Set(d.projects.filter((p) => p.status === "archived").map((p) => p.id));
  const due = invoicesToCreate(d.subscriptions.filter((s) => !archived.has(s.project_id)), d.invoices, today);
  const overdue = d.invoices.filter((i) => isOverdue(i, today));

  if (due.length === 0 && overdue.length === 0) return NextResponse.json({ sent: false, reason: "nada pendiente" });
  if (!mailConfigured() || d.recipients.length === 0) return NextResponse.json({ sent: false, reason: "sin SMTP o sin destinatarios" });

  const base = (process.env.PANEL_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const lines: string[] = [];
  if (due.length) {
    lines.push(`Toca facturar (${due.length}):`);
    for (const { subscription: s, periodDate } of due)
      lines.push(`- ${s.client}, ${projectName.get(s.project_id) ?? ""}: ${euros(s.amount)}, ${periodDate < today ? "tocaba" : "toca"} el ${dateLabel(periodDate)}${s.billing_emails ? ` (a ${s.billing_emails})` : ""}`);
    lines.push("");
  }
  if (overdue.length) {
    lines.push(`Facturas vencidas sin cobrar (${overdue.length}):`);
    for (const i of overdue) lines.push(`- ${i.number} ${i.client}: ${euros(i.amount)}, venció el ${dateLabel(i.due_date!)}`);
    lines.push("");
  }
  lines.push(`Gestiónalo en ${base}/panel/facturas`);

  const subject = [due.length ? `${due.length} por facturar` : "", overdue.length ? `${overdue.length} vencidas` : ""].filter(Boolean).join(", ");
  await sendMail({ to: d.recipients.join(", "), subject: `Facturación Cota: ${subject}`, text: lines.join("\n") });
  return NextResponse.json({ sent: true, due: due.length, overdue: overdue.length });
}
