import { sendMail } from "@/lib/mail/smtp";
import { toPlainText } from "./format";
import type { ContactDelivery } from "./types";

/** Adapter SMTP (Gmail): el mensaje llega a CONTACT_TO_EMAIL y "Responder" va al cliente. */
export function createSmtpDelivery(config: { to: string }): ContactDelivery {
  return {
    name: "smtp",
    async send(message) {
      await sendMail({
        to: config.to,
        replyTo: `${message.name} <${message.email}>`,
        subject: `Nuevo proyecto: ${message.projectTypeLabel}, ${message.name}`,
        text: toPlainText(message),
      });
    },
  };
}
