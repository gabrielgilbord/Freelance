"use server";

import { budgets, contactSchema, labelFor, projectTypes, type ContactFieldErrors, type ContactState } from "./schema";
import { getContactDelivery } from "./delivery";

const ECHO_FIELDS = ["name", "email", "company", "projectType", "budget", "message"] as const;

/** Devuelve al formulario solo los campos visibles para no perder lo escrito tras un error. */
function echoValues(raw: Record<string, string>) {
  return Object.fromEntries(ECHO_FIELDS.map((k) => [k, raw[k] ?? ""]));
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(
    ["name", "email", "company", "projectType", "budget", "message", "consent", "website", "startedAt"].map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ]),
  );

  // Anti-spam sin fricción: campo trampa invisible + tiempo mínimo de cumplimentación.
  const elapsed = Date.now() - Number(raw.startedAt || 0);
  if (raw.website || (raw.startedAt && elapsed < 2500)) {
    return { status: "success", name: raw.name || "" };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors, values: echoValues(raw) };
  }

  const data = parsed.data;
  try {
    await getContactDelivery().send({
      ...data,
      projectTypeLabel: labelFor(projectTypes, data.projectType),
      budgetLabel: data.budget ? labelFor(budgets, data.budget) : "",
      receivedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[contacto] Error al entregar el mensaje:", err);
    return {
      status: "error",
      message: "No se ha podido enviar el mensaje. Inténtalo de nuevo en unos minutos.",
      values: echoValues(raw),
    };
  }

  return { status: "success", name: data.name.split(" ")[0] ?? data.name };
}
