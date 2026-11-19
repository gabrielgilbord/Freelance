import Link from "next/link";
import { getLedger, getTeam } from "@/lib/finops/data";
import { computeUntil, currentMonth } from "@/lib/finops/ledger";
import { COLOR_NAMES, PARTNER_COLORS, monthShort } from "@/lib/finops/format";
import type { Project } from "@/lib/finops/types";
import { createPartner, deletePartner, updatePartner } from "@/app/panel/actions";
import { Adder, Field, Figure, MonthNav, PageTitle, SectionTitle, Swatch } from "@/components/finops/ui";

export const metadata = { title: "Socios" };

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ m?: string; ok?: string; error?: string }> }) {
  const { m, ok, error } = await searchParams;
  const month = m && /^\d{4}-\d{2}$/.test(m) ? m : currentMonth();
  const [data, team] = await Promise.all([getLedger(), getTeam()]);
  const all = computeUntil(data, month);
  const last12 = all.slice(-12);
  const r = all.at(-1)!;
  const projects = data.projects.filter((p) => p.status !== "archived");
  const projectsOf = (partnerId: string) =>
    data.projectPartners.filter((pp) => pp.partner_id === partnerId).map((pp) => pp.project_id);
  const canInvite = team.me?.role === "superadmin" || team.me?.role === "admin";
  const hasAccess = (email?: string | null) => !!email && team.members.some((mm) => mm.email === email.toLowerCase());

  return (
    <div className="space-y-14">
      <PageTitle title="Socios" aside={<MonthNav month={month} base="/panel/socios" />}>
        Las personas entre las que se reparten los beneficios. Cada socio participa solo en los proyectos que marques.
      </PageTitle>

      {(ok || error) && (
        <p role={error ? "alert" : "status"} className={`border-l-2 pl-4 ${error ? "border-error text-error" : "border-ok text-ok"}`}>
          {error ?? ok}
        </p>
      )}

      <section aria-labelledby="nuevo-socio">
        <SectionTitle
          id="nuevo-socio"
          title="Añadir socio"
          hint={canInvite ? "Si pones su email, le llega una invitación al panel con su contraseña inicial." : "Solo los admins pueden invitar al panel; el email se guardará igualmente."}
        />
        <Adder label="Nuevo socio" open={data.partners.length === 0}>
          <form action={createPartner} className="grid gap-5 rounded-md border border-line bg-ink-1 p-5">
            <div className="grid gap-4 sm:grid-cols-[1.2fr_1.4fr_0.8fr]">
              <Field label="Nombre"><input className="fin-input" name="name" required /></Field>
              <Field label="Email (para invitarle)"><input className="fin-input" name="email" type="email" placeholder="socia@correo.com" /></Field>
              <Field label="Color"><ColorPicker value={PARTNER_COLORS[data.partners.length % PARTNER_COLORS.length]!} /></Field>
            </div>
            <ProjectChecks projects={projects} checked={[]} />
            <button className="fin-btn w-fit">Añadir socio</button>
          </form>
        </Adder>
      </section>

      <section aria-labelledby="lista-socios" className="space-y-4">
        <h2 id="lista-socios" className="sr-only">Socios</h2>
        {data.partners.map((p) => {
          const now = r.partners.find((x) => x.partnerId === p.id)?.total ?? 0;
          const series = last12.map((mr) => ({ m: mr.month, v: mr.partners.find((x) => x.partnerId === p.id)?.total ?? 0 }));
          const year = series.reduce((a, s) => a + s.v, 0);
          const max = Math.max(1, ...series.map((s) => Math.abs(s.v)));
          const mine = projectsOf(p.id);
          return (
            <article key={p.id} className="rounded-md border border-line bg-ink-1">
              <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.3fr] md:p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Swatch color={p.color} />
                    <h3 className="text-2xl font-medium tracking-[-0.02em]">{p.name}</h3>
                    {!p.active && <span className="font-mono text-xs text-paper-subtle">inactivo</span>}
                  </div>
                  <p className="mt-1 font-mono text-xs text-paper-subtle">
                    {p.email ? `${p.email}${hasAccess(p.email) ? ", con acceso al panel" : ", sin acceso al panel"}` : "sin email"}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm text-paper-subtle">Este mes</dt>
                      <dd><Figure cents={now} className="text-2xl" /></dd>
                    </div>
                    <div>
                      <dt className="text-sm text-paper-subtle">Últimos 12 meses</dt>
                      <dd><Figure cents={year} className="text-2xl" /></dd>
                    </div>
                  </dl>
                  <div className="mt-5">
                    <span className="text-sm text-paper-subtle">Proyectos</span>
                    {mine.length === 0 ? (
                      <p className="mt-1 text-sm text-paper-muted">No está en ningún proyecto.</p>
                    ) : (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {mine.map((pid) => {
                          const pr = data.projects.find((x) => x.id === pid);
                          return pr ? (
                            <li key={pid}>
                              <Link href={`/panel/proyectos/${pid}`} className="inline-flex items-center gap-2 rounded-xs border border-line-strong px-2.5 py-1 text-sm hover:border-paper/60">
                                <Swatch color={pr.color} />{pr.name}
                              </Link>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex h-28 items-end gap-1.5 self-end" aria-label={`Cobros mensuales de ${p.name}`}>
                  {series.map((s) => (
                    <div key={s.m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <div
                        className="w-full rounded-t-xs"
                        style={{ height: `${Math.max(2, (Math.abs(s.v) / max) * 100)}%`, background: s.v < 0 ? "var(--color-error)" : s.v === 0 ? "var(--color-line)" : p.color }}
                      />
                      <span className={`font-mono text-[0.65rem] ${s.m === month ? "text-paper" : "text-paper-subtle"}`}>{monthShort(s.m).slice(0, 3)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-5 py-3 md:px-6">
                <details className="fin-adder flex-1 [&[open]]:basis-full">
                  <summary className="text-sm text-paper-muted hover:text-paper">Editar</summary>
                  <form action={updatePartner} className="mt-4 grid gap-5 pb-2">
                    <input type="hidden" name="id" value={p.id} />
                    <div className="grid gap-4 sm:grid-cols-[1.2fr_1.4fr_0.8fr_0.8fr]">
                      <Field label="Nombre"><input className="fin-input" name="name" defaultValue={p.name} required /></Field>
                      <Field label="Email"><input className="fin-input" name="email" type="email" defaultValue={p.email ?? ""} /></Field>
                      <Field label="Color"><ColorPicker value={p.color} /></Field>
                      <Field label="Estado">
                        <select className="fin-input" name="active" defaultValue={p.active ? "on" : "off"}>
                          <option value="on">Activo</option>
                          <option value="off">Inactivo</option>
                        </select>
                      </Field>
                    </div>
                    <ProjectChecks projects={projects} checked={mine} />
                    <button className="fin-btn w-fit">Guardar cambios</button>
                  </form>
                </details>
                <form action={deletePartner}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-sm text-paper-subtle hover:text-error">Borrar socio</button>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function ColorPicker({ value }: { value: string }) {
  const colors = PARTNER_COLORS.includes(value) ? PARTNER_COLORS : [value, ...PARTNER_COLORS];
  return (
    <fieldset className="flex h-11 items-center gap-2">
      <legend className="sr-only">Color</legend>
      {colors.map((c) => (
        <label key={c} className="relative cursor-pointer" title={COLOR_NAMES[c] ?? c}>
          <input type="radio" name="color" value={c} defaultChecked={c === value} className="peer sr-only" />
          <span className="block size-7 rounded-xs border border-line-strong peer-checked:outline peer-checked:outline-2 peer-checked:outline-offset-2 peer-checked:outline-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent" style={{ background: c }} />
          <span className="sr-only">{COLOR_NAMES[c] ?? c}</span>
        </label>
      ))}
    </fieldset>
  );
}

function ProjectChecks({ projects, checked }: { projects: Project[]; checked: string[] }) {
  if (projects.length === 0) return <p className="text-sm text-paper-subtle">Cuando crees proyectos podrás marcar en cuáles participa.</p>;
  return (
    <fieldset>
      <legend className="mb-2 text-sm text-paper-muted">Participa en</legend>
      <div className="flex flex-wrap gap-2">
        {projects.map((pr) => (
          <label key={pr.id} className="inline-flex cursor-pointer items-center gap-2 rounded-xs border border-line-strong px-3 py-2 text-sm has-[:checked]:border-paper has-[:checked]:bg-paper/[0.06]">
            <input type="checkbox" name="project_ids" value={pr.id} defaultChecked={checked.includes(pr.id)} className="size-4 accent-[var(--color-accent)]" />
            <Swatch color={pr.color} />
            {pr.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
