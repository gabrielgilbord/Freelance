"use client";

import { useActionState } from "react";
import { signIn } from "../actions";
import { LogoCompact } from "@/components/brand/logo";
import { Dimension } from "@/components/finops/ui";

type State = { error?: string; info?: string } | undefined;

export default function LoginPage() {
  const [state, action, pending] = useActionState<State, FormData>(signIn, undefined);

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="hidden flex-col justify-between border-r border-line bg-ink-1 p-12 lg:flex">
        <LogoCompact className="h-6" />
        <div className="max-w-lg">
          <p className="text-display-s font-[450]">Lo que entra, lo que cuesta la infra y lo que se lleva cada uno.</p>
          <div className="mt-12">
            <Dimension label="100 %" />
            <div className="mt-2 flex h-12 gap-[2px]" aria-hidden>
              <div className="fin-hatch rounded-l-xs" style={{ flexGrow: 18 }} />
              <div style={{ flexGrow: 32, background: "#ECEAE4" }} />
              <div style={{ flexGrow: 32, background: "#93AAB5" }} />
              <div className="rounded-r-xs" style={{ flexGrow: 18, background: "#6E7A73" }} />
            </div>
          </div>
        </div>
        <p className="font-mono text-xs text-paper-subtle">Panel interno de Cota</p>
      </section>

      <section className="flex items-center justify-center p-6">
        <form action={action} className="w-full max-w-sm">
          <LogoCompact className="mb-14 h-5 lg:hidden" />
          <h1 className="text-display-s font-[450]">Entrar</h1>
          <p className="mb-8 mt-3 text-paper-muted">
            Acceso solo para el equipo. Si no tienes cuenta, pídela a un administrador.
          </p>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm text-paper-muted">Email</span>
            <input className="fin-input" type="email" name="email" required autoComplete="email" />
          </label>
          <label className="mb-6 block">
            <span className="mb-1.5 block text-sm text-paper-muted">Contraseña</span>
            <input className="fin-input" type="password" name="password" required minLength={6} autoComplete="current-password" />
          </label>
          {state?.error && <p className="mb-4 text-sm text-error" role="alert">{state.error}</p>}
          {state?.info && <p className="mb-4 text-sm text-ok" role="status">{state.info}</p>}
          <button className="fin-btn w-full" disabled={pending}>
            {pending ? "Un momento…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
