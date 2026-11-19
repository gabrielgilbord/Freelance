import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Envío por SMTP de Google (Gmail con contraseña de aplicación).
 * Variables: SMTP_USER (la cuenta de Gmail) y SMTP_PASSWORD (contraseña de aplicación).
 * Opcionales: SMTP_HOST, SMTP_PORT, MAIL_FROM_NAME.
 */
let transporter: Transporter | null = null;

export function mailConfigured(env = process.env) {
  return Boolean(env.SMTP_USER && env.SMTP_PASSWORD);
}

function getTransporter(env = process.env): Transporter {
  if (!mailConfigured(env)) throw new Error("Faltan SMTP_USER y SMTP_PASSWORD");
  if (!transporter) {
    const port = Number(env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD!.replace(/\s+/g, "") },
    });
  }
  return transporter;
}

export type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

export async function sendMail(mail: Mail, env = process.env) {
  const from = `${env.MAIL_FROM_NAME || "Cota"} <${env.SMTP_USER}>`;
  await getTransporter(env).sendMail({ from, ...mail });
}
