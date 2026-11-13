import { toPlainText } from "./format";
import type { ContactDelivery } from "./types";

type ResendConfig = { apiKey: string; to: string; from: string };

/** Adapter para la API HTTP de Resend (sin SDK: una sola petición). */
export function createResendDelivery(config: ResendConfig): ContactDelivery {
  return {
    name: "resend",
    async send(message) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: config.from,
          to: [config.to],
          reply_to: message.email,
          subject: `Nuevo proyecto · ${message.projectTypeLabel} · ${message.name}`,
          text: toPlainText(message),
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
    },
  };
}
