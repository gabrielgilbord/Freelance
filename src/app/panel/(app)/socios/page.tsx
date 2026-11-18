import { getLedger, getMembers } from "@/lib/finops/data";
import { computeUntil, currentMonth } from "@/lib/finops/ledger";
import { PARTNER_COLORS, monthShort , COLOR_NAMES } from "@/lib/finops/format";
import { addMember, deletePartner, removeMember, savePartner } from "@/app/panel/actions";
import { Adder, DeleteButton, Swatch, Field, Money, MonthNav, SectionTitle } from "@/components/finops/ui";

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const month = m && /^\d{4}-\d{2}$/.test(m) ? m : currentMonth();
  const [data, members] = await Promise.all([getLedger(), getMembers()]);
  const all = computeUntil(data, month);
  const last12 = all.slice(-12);
  const r = all.at(-1)!;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display-s font-[450]">Socios</h1>
        <MonthNav month={month} base="/panel/socios" />
      </div>

      <section className="space-y-4">
        {data.partners.map((p) => {
          const now = r.partners.find((x) => x.partnerId === p.id)?.total ?? 0;
          const series = last12.map((mr) => ({ m: mr.month, v: mr.partners.find((x) => x.partnerId === p.id)?.total ?? 0 }));
          const year = series.reduce((a, s) => a + s.v, 0);
          const max = Math.max(1, ...series.map((s) => Math.abs(s.v)));
          return (
            <article key={p.id} className="rounded-md border border-line bg-ink-1 p-5 md:p-6 grid gap-5 md:grid-cols-[1fr_1.4fr] md:items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <Swatch color={p.color} />
                  <h2 className="text-2xl font-medium">{p.name}</h2>
                  {!p.active && <span className="text-xs text-paper-subtle">inactivo</span>}
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-paper-subtle">Este mes</dt>
                    <dd className="text-2xl font-medium"><Money cents={now} /></dd>
                  </div>
                  <div>
                    <dt className="text-sm text-paper-subtle">Últimos 12 meses</dt>
                    <dd className="text-2xl font-medium"><Money cents={year} /></dd>
                  </div>
                </dl>
              </div>
              <div>
                <div className="flex items-end gap-1.5 h-24" aria-label={`Cobros mensuales de ${p.name}`}>
                  {series.map((s) => (
                    <div key={s.m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full rounded-t"
                        style={{ height: `${Math.max(2, (Math.abs(s.v) / max) * 100)}%`, background: s.v < 0 ? "var(--color-loss)" : s.v === 0 ? "var(--color-line)" : p.color }}
                        title={`${s.m}`}
                      />
                      <span className={`text-[0.65rem] capitalize ${s.m === month ? "font-medium" : "text-paper-subtle"}`}>{monthShort(s.m).slice(0, 3)}</span>
                    </div>
                  ))}
                </div>
                <details className="adder mt-4">
                  <summary className="text-sm font-semibold text-paper-muted underline underline-offset-4">Editar</summary>
                  <form action={savePartner} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="id" value={p.id} />
                    <Field label="Nombre" className="flex-1 min-w-32"><input className="fin-input" name="name" defaultValue={p.name} required /></Field>
                    <Field label="Color">
                      <select className="fin-input" name="color" defaultValue={p.color}>
                        {PARTNER_COLORS.map((c) => <option key={c} value={c}>{COLOR_NAMES[c] ?? c}</option>)}
                      </select>
                    </Field>
                    <Field label="Estado">
                      <select className="fin-input" name="active" defaultValue={p.active ? "on" : "off"}>
                        <option value="on">Activo</option>
                        <option value="off">Inactivo</option>
                      </select>
                    </Field>
                    <button className="fin-btn">Guardar</button>
                  </form>
                  <div className="mt-3">
                    <DeleteButton action={deletePartner} fields={{ id: p.id }} label={`Borrar a ${p.name} y sus reglas de reparto`} />
                  </div>
                </details>
              </div>
            </article>
          );
        })}

        <Adder label="Añadir socio" open={data.partners.length === 0}>
          <form action={savePartner} className="rounded-md border border-line bg-ink-1 p-5 flex flex-wrap items-end gap-3 max-w-xl">
            <Field label="Nombre" className="flex-1 min-w-40"><input className="fin-input" name="name" required /></Field>
            <Field label="Color">
              <select className="fin-input" name="color" defaultValue={PARTNER_COLORS[data.partners.length % PARTNER_COLORS.length]}>
                {PARTNER_COLORS.map((c) => <option key={c} value={c}>{COLOR_NAMES[c] ?? c}</option>)}
              </select>
            </Field>
            <button className="fin-btn">Añadir socio</button>
          </form>
        </Adder>
      </section>

      <section className="max-w-xl">
        <SectionTitle title="Acceso" hint="Emails que pueden entrar en la app. Cada persona crea su cuenta con su email desde la pantalla de entrada." />
        <ul className="rounded-md border border-line bg-ink-1 px-5 mb-4">
          {members.map((e) => (
            <li key={e} className="fin-row grid-cols-[1fr_auto]">
              <span>{e}</span>
              {members.length > 1 && <DeleteButton action={removeMember} fields={{ email: e }} label="Quitar acceso" />}
            </li>
          ))}
        </ul>
        <form action={addMember} className="flex items-end gap-3">
          <Field label="Dar acceso a" className="flex-1"><input className="fin-input" name="email" type="email" required placeholder="socia@correo.com" /></Field>
          <button className="fin-btn">Dar acceso</button>
        </form>
      </section>
    </div>
  );
}
