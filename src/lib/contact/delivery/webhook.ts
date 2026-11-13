import { createHmac } from "node:crypto";
import { toPlainText } from "./format";
import type { ContactDelivery } from "./types";

type WebhookConfig = { url: string; secret?: string };

/**
 * Adapter genérico: envía el mensaje como JSON a cualquier webhook
 * (n8n, Make, Zapier, Slack…). Si hay secreto, firma el cuerpo con HMAC-SHA256
 * en la cabecera X-Signature para que el receptor pueda verificar el origen.
 */
export function createWebhookDelivery(config: WebhookConfig): ContactDelivery {
  return {
    name: "webhook",
    async send(message) {
      const body = JSON.stringify({ ...message, text: toPlainText(message) });
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (config.secret) {
        headers["X-Signature"] = createHmac("sha256", config.secret).update(body).digest("hex");
      }
      const res = await fetch(config.url, { method: "POST", headers, body, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
    },
  };
}
