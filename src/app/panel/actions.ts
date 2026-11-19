"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/finops/supabase/server";
import { sendInvite, sendPasswordReset } from "@/lib/mail/panel-emails";

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
};
const num = (f: FormData, k: string) => {
  const v = str(f, k);
  if (v === null) return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
const req = (f: FormData, k: string) => {
  const v = str(f, k);
  if (v === null) throw new Error(`Falta el campo ${k}`);
  return v;
};

async function db() {
  return createClient();
}

function done(path?: string | null) {
  revalidatePath("/panel", "layout");
  if (path) redirect(path);
}

async function run<T>(p: PromiseLike<{ error: { message: string } | null } & T>) {
  const { error } = await p;
  if (error) throw new Error(error.message);
}

/* ---------- Auth ---------- */

export async function signIn(_: unknown, f: FormData) {
  const sb = await db();
  const { error } = await sb.auth.signInWithPassword({ email: req(f, "email"), password: req(f, "password") });
  if (error) return { error: "Email o contraseña incorrectos." };
  redirect("/panel");
}

export async function signOut() {
  const sb = await db();
  await sb.auth.signOut();
  redirect("/panel/entrar");
}

/* ---------- Socios y acceso ---------- */

export async function savePartner(f: FormData) {
  const sb = await db();
  const id = str(f, "id");
  const row = { name: req(f, "name"), color: str(f, "color") ?? "#ECEAE4", active: f.get("active") !== "off" };
  await run(id ? sb.from("partners").update(row).eq("id", id) : sb.from("partners").insert(row));
  done();
}

export async function deletePartner(f: FormData) {
  const sb = await db();
  await run(sb.from("partners").delete().eq("id", req(f, "id")));
  done();
}

/* Equipo: los usuarios los crea alguien de rango superior (no hay registro público). */

function back(kind: "ok" | "error", msg: string): never {
  revalidatePath("/panel", "layout");
  redirect(`/panel/equipo?${kind}=${encodeURIComponent(msg)}`);
}

async function rpc(fn: string, args: Record<string, string>, okMsg: string) {
  const sb = await db();
  const { error } = await sb.rpc(fn, args);
  if (error) back("error", error.message);
  back("ok", okMsg);
}

export async function createUser(f: FormData) {
  const email = req(f, "email").toLowerCase();
  const password = req(f, "password");
  const role = str(f, "role") ?? "member";
  const sb = await db();
  const { error } = await sb.rpc("create_panel_user", { p_email: email, p_password: password, p_role: role });
  if (error) back("error", error.message);
  const { data: me } = await sb.auth.getUser();
  const sent = await sendInvite(email, password, role, me.user?.email ?? null);
  back("ok", sent ? `Usuario ${email} creado. Le hemos enviado la invitación por email.` : `Usuario ${email} creado, pero el email no se pudo enviar: pásale tú la contraseña.`);
}

export async function removeUser(f: FormData) {
  const email = req(f, "email");
  await rpc("remove_panel_user", { p_email: email }, `${email} ya no tiene acceso.`);
}

export async function setRole(f: FormData) {
  await rpc("set_panel_role", { p_email: req(f, "email"), p_role: req(f, "role") }, "Rol actualizado.");
}

export async function resetPassword(f: FormData) {
  const email = req(f, "email");
  const password = req(f, "password");
  const sb = await db();
  const { error } = await sb.rpc("reset_panel_password", { p_email: email, p_password: password });
  if (error) back("error", error.message);
  const sent = await sendPasswordReset(email, password);
  back("ok", sent ? `Contraseña de ${email} cambiada y enviada por email.` : `Contraseña de ${email} cambiada. El email no se pudo enviar: pásasela tú.`);
}

export async function changeMyPassword(f: FormData) {
  const pass = req(f, "password");
  if (pass.length < 8) back("error", "La contraseña debe tener al menos 8 caracteres.");
  if (pass !== str(f, "confirm")) back("error", "Las contraseñas no coinciden.");
  const sb = await db();
  const { error } = await sb.auth.updateUser({ password: pass });
  if (error) back("error", error.message);
  back("ok", "Tu contraseña se ha cambiado.");
}

/* ---------- Fondos ---------- */

export async function saveFund(f: FormData) {
  const sb = await db();
  const id = str(f, "id");
  const row = {
    name: req(f, "name"),
    description: str(f, "description"),
    color: str(f, "color") ?? "#6E7A73",
    covers_deficits: f.get("covers_deficits") === "on",
    priority: num(f, "priority") ?? 1,
  };
  await run(id ? sb.from("funds").update(row).eq("id", id) : sb.from("funds").insert(row));
  done();
}

export async function deleteFund(f: FormData) {
  const sb = await db();
  await run(sb.from("funds").delete().eq("id", req(f, "id")));
  done();
}

export async function addFundMovement(f: FormData) {
  const sb = await db();
  const amount = num(f, "amount") ?? 0;
  const direction = str(f, "direction") ?? "out";
  await run(
    sb.from("fund_movements").insert({
      fund_id: req(f, "fund_id"),
      amount: direction === "in" ? Math.abs(amount) : -Math.abs(amount),
      date: str(f, "date") ?? undefined,
      partner_id: direction === "out" ? str(f, "partner_id") : null,
      note: str(f, "note"),
    }),
  );
  done();
}

export async function deleteFundMovement(f: FormData) {
  const sb = await db();
  await run(sb.from("fund_movements").delete().eq("id", req(f, "id")));
  done();
}

/* ---------- Proyectos ---------- */

export async function createProject(f: FormData) {
  const sb = await db();
  const { data, error } = await sb
    .from("projects")
    .insert({ name: req(f, "name"), client: str(f, "client"), color: str(f, "color") ?? "#93AAB5" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  done(`/panel/proyectos/${data.id}`);
}

export async function updateProject(f: FormData) {
  const sb = await db();
  const id = req(f, "id");
  await run(
    sb
      .from("projects")
      .update({
        name: req(f, "name"),
        client: str(f, "client"),
        color: str(f, "color") ?? "#93AAB5",
        status: str(f, "status") ?? "active",
        expense_policy: str(f, "expense_policy") ?? "recurring_first",
        notes: str(f, "notes"),
      })
      .eq("id", id),
  );
  done();
}

export async function deleteProject(f: FormData) {
  const sb = await db();
  await run(sb.from("projects").delete().eq("id", req(f, "id")));
  done("/panel/proyectos");
}

export async function saveResource(f: FormData) {
  const sb = await db();
  const id = str(f, "id");
  const billing = str(f, "billing") ?? "monthly";
  const row = {
    project_id: req(f, "project_id"),
    name: req(f, "name"),
    provider: str(f, "provider"),
    category: str(f, "category") ?? "otro",
    cost: billing === "free" ? 0 : num(f, "cost") ?? 0,
    billing,
    start_date: str(f, "start_date") ?? undefined,
    end_date: str(f, "end_date"),
    url: str(f, "url"),
    notes: str(f, "notes"),
  };
  await run(id ? sb.from("resources").update(row).eq("id", id) : sb.from("resources").insert(row));
  done();
}

export async function saveSubscription(f: FormData) {
  const sb = await db();
  const id = str(f, "id");
  const row = {
    project_id: req(f, "project_id"),
    client: req(f, "client"),
    description: str(f, "description"),
    amount: num(f, "amount") ?? 0,
    start_date: str(f, "start_date") ?? undefined,
    end_date: str(f, "end_date"),
  };
  await run(id ? sb.from("subscriptions").update(row).eq("id", id) : sb.from("subscriptions").insert(row));
  done();
}

export async function saveMovement(f: FormData) {
  const sb = await db();
  await run(
    sb.from("movements").insert({
      project_id: req(f, "project_id"),
      kind: req(f, "kind"),
      amount: num(f, "amount") ?? 0,
      date: str(f, "date") ?? undefined,
      description: req(f, "description"),
    }),
  );
  done();
}

export async function addRule(f: FormData) {
  const sb = await db();
  const target = req(f, "target"); // "partner:<id>" | "fund:<id>"
  const [type, targetId] = target.split(":");
  await run(
    sb.from("distribution_rules").insert({
      project_id: req(f, "project_id"),
      stream: req(f, "stream"),
      partner_id: type === "partner" ? targetId : null,
      fund_id: type === "fund" ? targetId : null,
      percent: num(f, "percent") ?? 0,
    }),
  );
  done();
}

/** Aplica una plantilla de reparto rápida a un tipo de ingreso. */
export async function applyRulePreset(f: FormData) {
  const sb = await db();
  const projectId = req(f, "project_id");
  const stream = req(f, "stream");
  const preset = req(f, "preset");
  const { data: partners } = await sb.from("partners").select("id").eq("active", true).order("created_at");
  await run(sb.from("distribution_rules").delete().eq("project_id", projectId).eq("stream", stream));
  let rows: { partner_id: string | null; fund_id: string | null; percent: number }[] = [];
  if (preset === "equal" && partners?.length) {
    const base = Math.floor((10000 / partners.length)) / 100;
    rows = partners.map((p, i) => ({
      partner_id: p.id,
      fund_id: null,
      percent: i === 0 ? Math.round((100 - base * (partners.length - 1)) * 100) / 100 : base,
    }));
  } else if (preset.startsWith("fund:")) {
    rows = [{ partner_id: null, fund_id: preset.slice(5), percent: 100 }];
  }
  if (rows.length) {
    await run(sb.from("distribution_rules").insert(rows.map((r) => ({ ...r, project_id: projectId, stream }))));
  }
  done();
}

/** Borrado genérico para filas hijas de un proyecto. */
const DELETABLE = ["resources", "subscriptions", "movements", "distribution_rules"] as const;
export async function deleteRow(f: FormData) {
  const table = req(f, "table") as (typeof DELETABLE)[number];
  if (!DELETABLE.includes(table)) throw new Error("Tabla no permitida");
  const sb = await db();
  await run(sb.from(table).delete().eq("id", req(f, "id")));
  done();
}

/** Termina una cuota o recurso a fin de mes (sin borrar el histórico). */
export async function endRow(f: FormData) {
  const table = req(f, "table");
  if (table !== "subscriptions" && table !== "resources") throw new Error("Tabla no permitida");
  const sb = await db();
  await run(sb.from(table).update({ end_date: req(f, "end_date") }).eq("id", req(f, "id")));
  done();
}
