"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/lib/contact/action";
import { budgets, projectTypes, type ContactState } from "@/lib/contact/schema";
import { Button } from "@/components/ui/button";
import { Check } from "@/components/ui/icons";

const initial: ContactState = { status: "idle" };

const fieldBase =
  "mt-2 block w-full rounded-xs border border-line-strong bg-ink-1 px-4 py-3.5 text-paper placeholder:text-paper-subtle/80 transition-colors duration-200 hover:border-paper-subtle focus:border-accent focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-error";

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-paper">
        {label}
        {optional && <span className="label normal-case tracking-normal">Opcional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ defaultProjectType = "" }: { defaultProjectType?: string }) {
  const [state, action, pending] = useActionState(submitContact, initial);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Marca de tiempo del primer montaje para el filtro anti-spam. Se escribe en el campo
  // oculto justo al enviar, porque React reinicia el formulario tras cada envío.
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const stampStart = () => {
    if (startedAtRef.current) startedAtRef.current.value = String(mountedAt.current);
  };
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className="rounded-sm border border-line bg-ink-1 p-8 focus:outline-none sm:p-12" role="status">
        <span className="flex h-12 w-12 items-center justify-center border border-accent text-accent">
          <Check />
        </span>
        <h2 className="mt-8 text-display-s font-[450] text-paper">Mensaje recibido{state.name ? `, ${state.name}` : ""}.</h2>
        <p className="mt-4 max-w-[52ch] text-lg text-paper-muted">
          Leo cada solicitud personalmente. Te responderé con las primeras preguntas o con una propuesta para hablar.
        </p>
        <Link href="/proyectos" className="link-underline mt-8 inline-block text-paper">Mientras tanto, ver proyectos</Link>
      </div>
    );
  }

  const err = state.status === "error" ? state.fieldErrors ?? {} : {};
  const v = state.status === "error" ? state.values ?? {} : {};
  const a11y = (name: keyof typeof err) =>
    err[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

  return (
    <form action={action} onSubmit={stampStart} noValidate className="space-y-7" aria-describedby={state.status === "error" ? "form-error" : undefined}>
      {state.status === "error" && (
        <p id="form-error" role="alert" className="rounded-xs border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
          {state.message}
        </p>
      )}

      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="name" label="Nombre" error={err.name}>
          <input id="name" name="name" type="text" autoComplete="name" required defaultValue={v.name} className={fieldBase} {...a11y("name")} />
        </Field>
        <Field id="email" label="Email" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required defaultValue={v.email} className={fieldBase} {...a11y("email")} />
        </Field>
      </div>

      <Field id="company" label="Empresa" optional error={err.company}>
        <input id="company" name="company" type="text" autoComplete="organization" defaultValue={v.company} className={fieldBase} />
      </Field>

      <fieldset>
        <legend className="text-sm font-medium text-paper">Tipo de proyecto</legend>
        <div className="mt-3 flex flex-wrap gap-2" {...(err.projectType ? { "aria-describedby": "projectType-error" } : {})}>
          {projectTypes.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input
                type="radio"
                name="projectType"
                value={t.value}
                defaultChecked={(v.projectType || defaultProjectType) === t.value}
                className="peer sr-only"
                required
              />
              <span className="inline-flex min-h-11 items-center rounded-xs border border-line-strong px-4 py-2 text-sm text-paper-muted transition-colors hover:border-paper-subtle hover:text-paper peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {t.label}
              </span>
            </label>
          ))}
        </div>
        {err.projectType && <p id="projectType-error" role="alert" className="mt-2 text-sm text-error">{err.projectType}</p>}
      </fieldset>

      <Field id="budget" label="Presupuesto orientativo" optional error={err.budget}>
        <select id="budget" name="budget" defaultValue={v.budget ?? ""} className={`${fieldBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a9a8a0%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-12`}>
          {budgets.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </Field>

      <Field id="message" label="Cuéntame tu proyecto" error={err.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={v.message}
          placeholder="Qué problema quieres resolver, para quién, qué existe hoy y si hay alguna fecha importante. No hace falta que esté todo claro."
          className={`${fieldBase} resize-y leading-relaxed`}
          {...a11y("message")}
        />
      </Field>

      {/* Campo trampa para bots: invisible para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">No rellenes este campo</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-paper-muted">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-xs border border-line-strong bg-ink-1 bg-center bg-no-repeat checked:border-accent checked:bg-accent checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231a0904%22 stroke-width=%222.5%22><path d=%22m5 12.5 4.5 4.5L19 7.5%22/></svg>')]"
            {...(err.consent ? { "aria-invalid": true, "aria-describedby": "consent-error" } : {})}
          />
          <span>
            He leído la <Link href="/privacidad" className="text-paper underline underline-offset-2">política de privacidad</Link> y acepto que se usen mis datos para responder a esta solicitud.
          </span>
        </label>
        {err.consent && <p id="consent-error" role="alert" className="mt-2 text-sm text-error">{err.consent}</p>}
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-paper-subtle">Sin compromiso. Tus datos solo se usan para responderte.</p>
        <Button type="submit" disabled={pending} arrow={!pending} aria-live="polite">
          {pending ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </div>
    </form>
  );
}
