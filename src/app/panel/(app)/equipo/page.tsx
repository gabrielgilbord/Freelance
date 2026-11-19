import { getTeam, type Role } from "@/lib/finops/data";
import { dateLabel } from "@/lib/finops/format";
import { changeMyPassword, createUser, removeUser, resetPassword, setRole } from "@/app/panel/actions";
import { Adder, Field, PageTitle, SectionTitle } from "@/components/finops/ui";

export const metadata = { title: "Equipo" };

const ROLE_LABEL: Record<Role, string> = { superadmin: "Superadmin", admin: "Admin", member: "Miembro" };
const RANK: Record<Role, number> = { superadmin: 3, admin: 2, member: 1 };
const ROLE_HINT: Record<Role, string> = {
  superadmin: "Controla todo: crea admins y miembros, cambia roles y quita accesos.",
  admin: "Lleva las cuentas y puede dar de alta miembros.",
  member: "Lleva las cuentas. No gestiona accesos.",
};

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const { members, me } = await getTeam();
  if (!me) return null;
  const canCreate: Role[] = me.role === "superadmin" ? ["member", "admin"] : me.role === "admin" ? ["member"] : [];

  return (
    <div className="space-y-14">
      <PageTitle title="Equipo">
        Nadie se puede registrar por su cuenta: cada acceso lo crea alguien de rango superior. Tú eres{" "}
        <span className="text-paper">{ROLE_LABEL[me.role].toLowerCase()}</span>. {ROLE_HINT[me.role]}
      </PageTitle>

      {(ok || error) && (
        <p role={error ? "alert" : "status"} className={`border-l-2 pl-4 ${error ? "border-error text-error" : "border-ok text-ok"}`}>
          {error ?? ok}
        </p>
      )}

      <section aria-labelledby="accesos">
        <SectionTitle id="accesos" title="Quién tiene acceso" />
        <ul>
          {members.map((m) => {
            const below = RANK[me.role] > RANK[m.role];
            return (
              <li key={m.email} className="fin-row grid-cols-1 gap-3 md:grid-cols-[1.4fr_0.6fr_1.6fr]">
                <div className="min-w-0">
                  <span className="block truncate">{m.email}{m.email === me.email && <span className="text-paper-subtle"> (tú)</span>}</span>
                  <span className="font-mono text-xs text-paper-subtle">
                    {m.created_by && m.created_by !== "sistema" ? `creado por ${m.created_by}, ` : ""}desde {dateLabel(m.created_at.slice(0, 10))}
                  </span>
                </div>
                <span className={`font-mono text-sm ${m.role === "superadmin" ? "text-accent" : "text-paper-muted"}`}>{ROLE_LABEL[m.role]}</span>
                {below ? (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:justify-end">
                    {me.role === "superadmin" && (
                      <form action={setRole} className="flex items-center gap-2">
                        <input type="hidden" name="email" value={m.email} />
                        <input type="hidden" name="role" value={m.role === "admin" ? "member" : "admin"} />
                        <button className="text-sm text-paper-muted hover:text-paper">{m.role === "admin" ? "Pasar a miembro" : "Hacer admin"}</button>
                      </form>
                    )}
                    <details className="fin-adder">
                      <summary className="cursor-pointer text-sm text-paper-muted hover:text-paper">Nueva contraseña</summary>
                      <form action={resetPassword} className="mt-3 flex gap-2">
                        <input type="hidden" name="email" value={m.email} />
                        <input className="fin-input" name="password" type="text" minLength={8} required placeholder="Mínimo 8 caracteres" autoComplete="off" />
                        <button className="fin-btn-quiet">Guardar</button>
                      </form>
                    </details>
                    <form action={removeUser}>
                      <input type="hidden" name="email" value={m.email} />
                      <button className="text-sm text-paper-subtle hover:text-error">Quitar acceso</button>
                    </form>
                  </div>
                ) : (
                  <span />
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {canCreate.length > 0 && (
        <section aria-labelledby="nuevo">
          <SectionTitle id="nuevo" title="Dar acceso a alguien" hint="Le creas el usuario con una contraseña inicial y le llega una invitación por email con el enlace y la contraseña. Después puede cambiarla desde aquí." />
          <Adder label="Crear usuario">
            <form action={createUser} className="grid max-w-3xl gap-4 rounded-md border border-line bg-ink-1 p-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_auto] lg:items-end">
              <Field label="Email"><input className="fin-input" name="email" type="email" required autoComplete="off" /></Field>
              <Field label="Contraseña inicial"><input className="fin-input" name="password" type="text" minLength={8} required autoComplete="off" placeholder="Mínimo 8 caracteres" /></Field>
              <Field label="Rol">
                <select className="fin-input" name="role" defaultValue="member">
                  {canCreate.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
              </Field>
              <button className="fin-btn">Crear usuario</button>
            </form>
          </Adder>
        </section>
      )}

      <section aria-labelledby="mi-cuenta" className="max-w-xl">
        <SectionTitle id="mi-cuenta" title="Mi contraseña" />
        <form action={changeMyPassword} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Nueva contraseña"><input className="fin-input" name="password" type="password" minLength={8} required autoComplete="new-password" /></Field>
          <Field label="Repítela"><input className="fin-input" name="confirm" type="password" minLength={8} required autoComplete="new-password" /></Field>
          <button className="fin-btn">Cambiar</button>
        </form>
      </section>
    </div>
  );
}
