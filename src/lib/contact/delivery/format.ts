import type { ContactMessage } from "./types";

export function toPlainText(m: ContactMessage) {
  return [
    `Nueva solicitud desde la web`,
    ``,
    `Nombre: ${m.name}`,
    `Email: ${m.email}`,
    `Empresa: ${m.company || "—"}`,
    `Tipo de proyecto: ${m.projectTypeLabel}`,
    `Presupuesto: ${m.budgetLabel || "No indicado"}`,
    `Recibido: ${m.receivedAt}`,
    ``,
    `Mensaje:`,
    m.message,
  ].join("\n");
}
