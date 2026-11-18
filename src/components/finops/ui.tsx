import Link from "next/link";
import { addMonths } from "@/lib/finops/ledger";
import { COLOR_NAMES, money, monthLabel } from "@/lib/finops/format";

/** Importe en monoespaciada: es dato real, como las medidas de un plano. */
export function Money({ cents, className = "", sign = false }: { cents: number; className?: string; sign?: boolean }) {
  cents = cents === 0 ? 0 : cents; // evita "-0,00 €"
  return (
    <span className={`font-mono tabular-nums whitespace-nowrap ${cents < 0 ? "text-error" : ""} ${className}`}>
      {sign && cents > 0 ? "+" : ""}
      {money(cents)}
    </span>
  );
}

/** Cifra grande en la tipografía de display, con números tabulares. */
export function Figure({ cents, className = "" }: { cents: number; className?: string }) {
  cents = cents === 0 ? 0 : cents;
  return <span className={`tracking-[-0.03em] font-[450] whitespace-nowrap ${cents < 0 ? "text-error" : ""} ${className}`}>{money(cents)}</span>;
}

export function MonthNav({ month, base = "/panel" }: { month: string; base?: string }) {
  return (
    <div className="inline-flex h-11 items-stretch rounded-xs border border-line-strong">
      <Link href={`${base}?m=${addMonths(month, -1)}`} className="grid w-11 place-items-center hover:bg-paper/[0.05]" aria-label="Mes anterior">
        <Chevron dir="left" />
      </Link>
      <span className="grid min-w-40 place-items-center border-x border-line px-3 text-[0.9375rem]">{monthLabel(month)}</span>
      <Link href={`${base}?m=${addMonths(month, 1)}`} className="grid w-11 place-items-center hover:bg-paper/[0.05]" aria-label="Mes siguiente">
        <Chevron dir="right" />
      </Link>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export function Swatch({ color, className = "" }: { color: string; className?: string }) {
  return <span className={`inline-block h-2.5 w-2.5 shrink-0 ${className}`} style={{ background: color }} aria-hidden />;
}

export interface Segment {
  key: string;
  label: string;
  amount: number;
  color?: string;
  hatch?: boolean;
}

/**
 * La pieza medida: el ancho es todo lo que entra y cada tramo es a dónde acaba.
 * Encima, una línea de cota con el total, como en un plano.
 */
export function Ribbon({ segments, total, height = 56, legend = true }: { segments: Segment[]; total?: number; height?: number; legend?: boolean }) {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.amount), 0);
  if (sum <= 0) {
    return (
      <div className="grid place-items-center border border-dashed border-line-strong font-mono text-xs text-paper-subtle" style={{ height }}>
        Sin ingresos este mes
      </div>
    );
  }
  const visible = segments.filter((s) => s.amount > 0);
  return (
    <div>
      <Dimension label={money(total ?? sum)} />
      <div
        className="mt-2 flex w-full gap-[2px]"
        style={{ height }}
        role="img"
        aria-label={visible.map((s) => `${s.label}: ${money(s.amount)}`).join(", ")}
      >
        {visible.map((s, i) => (
          <div
            key={s.key}
            className={`fin-seg h-full first:rounded-l-xs last:rounded-r-xs ${s.hatch ? "fin-hatch" : ""}`}
            style={{ flexGrow: s.amount, flexBasis: 0, minWidth: 4, background: s.hatch ? undefined : s.color, animationDelay: `${i * 60}ms` }}
            title={`${s.label}: ${money(s.amount)}`}
          />
        ))}
      </div>
      {legend && (
        <ul className="mt-5 grid gap-x-8 gap-y-2.5 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <li key={s.key} className="flex items-baseline gap-3 border-b border-line pb-2.5">
              {s.hatch ? <span className="fin-hatch inline-block h-2.5 w-2.5 shrink-0 self-center" /> : <Swatch color={s.color!} className="self-center" />}
              <span className="min-w-0 flex-1 truncate text-paper-muted">{s.label}</span>
              <Money cents={s.amount} className="text-sm" />
              <span className="w-9 text-right font-mono text-xs text-paper-subtle">{Math.round((s.amount / sum) * 100)}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Línea de cota horizontal con etiqueta centrada (trazos a 45° en naranja). */
export function Dimension({ label }: { label: string }) {
  return (
    <div className="relative h-6" aria-hidden>
      <span className="absolute inset-y-1 left-0 w-px bg-line-strong" />
      <span className="absolute inset-y-1 right-0 w-px bg-line-strong" />
      <span className="absolute inset-x-0 top-1/2 h-px bg-paper-subtle/60" />
      <span className="absolute left-0 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
      <span className="absolute right-0 top-1/2 h-3 w-[2px] translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink px-3 font-mono text-xs text-paper-muted">{label}</span>
    </div>
  );
}

export function PageTitle({ title, children, aside }: { title: string; children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[60ch]">
        <h1 className="text-display-s font-[450]">{title}</h1>
        {children && <p className="mt-3 text-paper-muted">{children}</p>}
      </div>
      {aside}
    </div>
  );
}

export function SectionTitle({ title, hint, id }: { title: string; hint?: string; id?: string }) {
  return (
    <div className="mb-5 border-b border-line pb-4">
      <h2 id={id} className="text-[1.375rem] font-medium tracking-[-0.02em]">{title}</h2>
      {hint && <p className="mt-1.5 max-w-[64ch] text-[0.9375rem] text-paper-subtle">{hint}</p>}
    </div>
  );
}

export function Adder({ label, children, open = false }: { label: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="fin-adder" open={open}>
      <summary className="fin-btn-quiet w-fit">
        <span className="fin-plus" aria-hidden>+</span> {label}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm text-paper-muted">{label}</span>
      {children}
    </label>
  );
}

export function ColorSelect({ name, colors, value }: { name: string; colors: string[]; value?: string }) {
  return (
    <select className="fin-input" name={name} defaultValue={value ?? colors[0]}>
      {colors.map((c) => (
        <option key={c} value={c}>{COLOR_NAMES[c] ?? c}</option>
      ))}
    </select>
  );
}

export function Submit({ children }: { children: React.ReactNode }) {
  return <button className="fin-btn">{children}</button>;
}

export function DeleteButton({ action, fields, label = "Borrar" }: { action: (f: FormData) => Promise<void>; fields: Record<string, string>; label?: string }) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button className="text-sm text-paper-subtle hover:text-error">{label}</button>
    </form>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-5 text-[0.9375rem] text-paper-subtle">{children}</p>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-md border border-line bg-ink-1 ${className}`}>{children}</div>;
}
