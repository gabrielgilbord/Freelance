import "server-only";
import { consoleDelivery } from "./console";
import { createResendDelivery } from "./resend";
import { createWebhookDelivery } from "./webhook";
import type { ContactDelivery } from "./types";

/**
 * Factory: elige la estrategia de entrega según CONTACT_PROVIDER.
 * En producción, una configuración incompleta es un error explícito: preferimos
 * fallar de forma visible antes que perder solicitudes en silencio.
 */
export function getContactDelivery(env = process.env): ContactDelivery {
  const provider = (env.CONTACT_PROVIDER || "console").toLowerCase();

  switch (provider) {
    case "resend": {
      const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
      if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
        throw new Error("CONTACT_PROVIDER=resend requiere RESEND_API_KEY, CONTACT_TO_EMAIL y CONTACT_FROM_EMAIL");
      }
      return createResendDelivery({ apiKey: RESEND_API_KEY, to: CONTACT_TO_EMAIL, from: CONTACT_FROM_EMAIL });
    }
    case "webhook": {
      if (!env.CONTACT_WEBHOOK_URL) throw new Error("CONTACT_PROVIDER=webhook requiere CONTACT_WEBHOOK_URL");
      return createWebhookDelivery({ url: env.CONTACT_WEBHOOK_URL, secret: env.CONTACT_WEBHOOK_SECRET });
    }
    case "console":
      if (env.NODE_ENV === "production" && env.VERCEL_ENV === "production") {
        throw new Error("CONTACT_PROVIDER=console no está permitido en producción");
      }
      return consoleDelivery;
    default:
      throw new Error(`CONTACT_PROVIDER desconocido: ${provider}`);
  }
}

export type { ContactDelivery, ContactMessage } from "./types";
