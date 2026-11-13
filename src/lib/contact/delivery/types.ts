import type { ContactInput } from "../schema";

/** Mensaje ya validado y enriquecido, listo para entregar por cualquier canal. */
export type ContactMessage = ContactInput & {
  projectTypeLabel: string;
  budgetLabel: string;
  receivedAt: string;
};

/**
 * Strategy + Adapter: la acción del formulario depende de esta interfaz, no de
 * un proveedor concreto. Cambiar de Resend a un webhook (n8n, Make, Slack…) es
 * cuestión de configuración.
 */
export interface ContactDelivery {
  readonly name: string;
  send(message: ContactMessage): Promise<void>;
}
