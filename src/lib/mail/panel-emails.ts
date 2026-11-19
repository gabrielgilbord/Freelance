import "server-only";
import { headers } from "next/headers";
import { mailConfigured, sendMail } from "./smtp";

const ROLE: Record<string, string> = { admin: "admin", member: "miembro" };

async function panelUrl() {
  const base = process.env.PANEL_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (base) return `${base.replace(/\/$/, "")}/panel/entrar`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}/panel/entrar`;
}

function html(title: string, lines: string[], cta: { href: string; label: string }) {
  const body = lines.map((l) => `<p style="margin:0 0 14px;color:#c9c8c0;font-size:15px;line-height:1.55">${l}</p>`).join("");
  return `<!doctype html><html lang="es"><body style="margin:0;background:#0c0d0c;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#121412;border:1px solid #2a2d2a;border-radius:8px">
<tr><td style="padding:32px 28px">
<p style="margin:0 0 28px;color:#eceae4;font-size:20px;font-weight:600;letter-spacing:-0.02em">cota<span style="color:#ff5a36">.</span> <span style="color:#8a8a83;font-weight:400;font-size:14px">Finanzas</span></p>
<h1 style="margin:0 0 18px;color:#eceae4;font-size:22px;font-weight:500;letter-spacing:-0.02em">${title}</h1>
${body}
<p style="margin:26px 0 0"><a href="${cta.href}" style="display:inline-block;background:#ff5a36;color:#0c0d0c;text-decoration:none;font-weight:600;font-size:15px;padding:12px 20px;border-radius:2px">${cta.label}</a></p>
</td></tr></table></body></html>`;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Devuelve true si se envió; false si no hay SMTP o falló (el alta ya está hecha igualmente). */
export async function sendInvite(to: string, password: string, role: string, invitedBy: string | null) {
  if (!mailConfigured()) return false;
  const url = await panelUrl();
  const who = invitedBy ? `${invitedBy} te ha dado` : "Tienes";
  try {
    await sendMail({
      to,
      subject: "Tu acceso al panel de finanzas de Cota",
      text: `${who} acceso al panel de finanzas de Cota como ${ROLE[role] ?? role}.\n\nEntra en: ${url}\nEmail: ${to}\nContraseña inicial: ${password}\n\nCuando entres, cámbiala en Equipo > Mi contraseña.`,
      html: html(
        "Tienes acceso al panel de finanzas",
        [
          `${esc(who)} acceso como <strong style="color:#eceae4">${ROLE[role] ?? role}</strong>.`,
          `Email: <strong style="color:#eceae4">${esc(to)}</strong><br>Contraseña inicial: <strong style="color:#eceae4;font-family:monospace">${esc(password)}</strong>`,
          "Cuando entres, cámbiala en Equipo, apartado Mi contraseña.",
        ],
        { href: url, label: "Entrar al panel" },
      ),
    });
    return true;
  } catch (err) {
    console.error("[panel] No se pudo enviar la invitación:", err);
    return false;
  }
}

export async function sendPasswordReset(to: string, password: string) {
  if (!mailConfigured()) return false;
  const url = await panelUrl();
  try {
    await sendMail({
      to,
      subject: "Nueva contraseña para el panel de Cota",
      text: `Te han puesto una contraseña nueva para el panel de finanzas de Cota.\n\nEntra en: ${url}\nContraseña: ${password}\n\nCámbiala al entrar en Equipo > Mi contraseña.`,
      html: html(
        "Tienes una contraseña nueva",
        [`Contraseña: <strong style="color:#eceae4;font-family:monospace">${esc(password)}</strong>`, "Cámbiala al entrar, en Equipo, apartado Mi contraseña."],
        { href: url, label: "Entrar al panel" },
      ),
    });
    return true;
  } catch (err) {
    console.error("[panel] No se pudo enviar la nueva contraseña:", err);
    return false;
  }
}
