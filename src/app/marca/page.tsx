import { Isotipo, Wordmark } from "@/components/brand/logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CotaLine } from "@/components/ui/cota-line";
import { ServiceGlyph } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { services } from "@/content/services";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Sistema de marca",
  description: "Manual de identidad y design system de Cota.",
  path: "/marca",
  noIndex: true,
});

const palette = [
  { name: "Ink", token: "ink", hex: "#0C0D0C", use: "Fondo principal" },
  { name: "Ink 1", token: "ink-1", hex: "#121312", use: "Superficies" },
  { name: "Ink 2", token: "ink-2", hex: "#181A18", use: "Hover / elevación" },
  { name: "Line", token: "line", hex: "#2A2D2A", use: "Bordes y divisores" },
  { name: "Line strong", token: "line-strong", hex: "#3D413D", use: "Bordes interactivos" },
  { name: "Paper", token: "paper", hex: "#ECEAE4", use: "Texto principal · 16.2:1" },
  { name: "Paper muted", token: "paper-muted", hex: "#A9A8A0", use: "Texto secundario · 8.2:1" },
  { name: "Paper subtle", token: "paper-subtle", hex: "#8A8A83", use: "Rótulos · 5.6:1" },
  { name: "Cota (acento)", token: "accent", hex: "#FF5A36", use: "CTA, cotas, foco · 6.3:1" },
  { name: "Steel", token: "steel", hex: "#93AAB5", use: "Diagramas (secundario)" },
];

const logos = [
  { file: "logo-primary-dark.svg", label: "Principal · fondo oscuro", bg: "bg-ink" },
  { file: "logo-primary-light.svg", label: "Principal · fondo claro", bg: "bg-[#F4F2EC]" },
  { file: "logo-horizontal-dark.svg", label: "Horizontal · oscuro", bg: "bg-ink" },
  { file: "logo-horizontal-light.svg", label: "Horizontal · claro", bg: "bg-[#F4F2EC]" },
  { file: "logo-compact-dark.svg", label: "Compacta", bg: "bg-ink" },
  { file: "logo-primary-mono-black.svg", label: "Monocromo negro", bg: "bg-white" },
  { file: "logo-primary-mono-white.svg", label: "Monocromo blanco", bg: "bg-[#FF5A36]" },
  { file: "isotipo-dark.svg", label: "Isotipo", bg: "bg-ink" },
  { file: "favicon.svg", label: "Favicon", bg: "bg-ink-2" },
  { file: "avatar.svg", label: "Avatar redes", bg: "bg-ink-2" },
];

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-16 sm:py-20">
      <Container>
        <h2 id={id} className="label text-accent">{title}</h2>
        <div className="mt-8">{children}</div>
      </Container>
    </section>
  );
}

// Manual interno: solo visible en local o si se activa expresamente.
const brandPageEnabled = process.env.NODE_ENV !== "production" || process.env.SHOW_BRAND_PAGE === "true";

export default function BrandPage() {
  if (!brandPageEnabled) notFound();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Inicio", path: "/" }, { name: "Marca", path: "/marca" }]}
        eyebrow="Sistema de marca · uso interno"
        title="Cota, en una página."
        intro="Identidad, tokens y componentes. Todo lo que aparece aquí sale del mismo código que la web."
      />

      <Block id="logo" title="Logotipo">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logos.map((l) => (
            <li key={l.file} className="overflow-hidden rounded-sm border border-line">
              <div className={`flex h-48 items-center justify-center p-8 ${l.bg}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/brand/${l.file}`} alt={l.label} className="max-h-full max-w-full" />
              </div>
              <div className="flex items-center justify-between border-t border-line px-4 py-3">
                <span className="text-sm text-paper">{l.label}</span>
                <a href={`/brand/${l.file}`} download className="label hover:text-paper">SVG ↓</a>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-sm border border-line p-8">
            <p className="label">Zona de respeto</p>
            <div className="mt-6 inline-block border border-dashed border-steel/50 p-[1.15rem]">
              <Wordmark className="h-12 w-auto text-paper" />
            </div>
            <p className="mt-4 text-sm text-paper-muted">Margen mínimo igual a la altura de la “o”. Tamaño mínimo: 64 px de ancho en pantalla, 18 mm en impresión. Por debajo, usar el isotipo.</p>
          </div>
          <div className="rounded-sm border border-line p-8">
            <p className="label">Isotipo</p>
            <div className="mt-6 flex items-end gap-6 text-paper">
              <Isotipo className="h-24 w-24" />
              <Isotipo className="h-12 w-12" />
              <Isotipo className="h-6 w-6" />
              <Isotipo className="h-4 w-4" />
            </div>
            <p className="mt-4 text-sm text-paper-muted">La “c” del logotipo cerrada por el trazo oblicuo con el que se marca el extremo de una cota. El trazo siempre en acento, salvo en versiones monocromas.</p>
          </div>
        </div>
      </Block>

      <Block id="color" title="Color">
        <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {palette.map((c) => (
            <li key={c.token} className="bg-ink">
              <div className="h-24 border-b border-line" style={{ background: c.hex }} />
              <div className="p-4">
                <p className="font-medium text-paper">{c.name}</p>
                <p className="label mt-1">{c.hex} · {c.token}</p>
                <p className="mt-2 text-sm text-paper-muted">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-paper-subtle">Ratios de contraste calculados sobre Ink (#0C0D0C). Regla: el acento ocupa menos del 5 % de cualquier pantalla.</p>
      </Block>

      <Block id="tipo" title="Tipografía">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="label">Schibsted Grotesk · display y texto</p>
            <p className="mt-6 text-display-l font-medium">Aa</p>
            <div className="mt-8 space-y-4 border-t border-line pt-6">
              <p className="text-display-m font-medium">Display M</p>
              <p className="text-display-s font-medium">Display S · títulos de sección</p>
              <p className="text-2xl font-medium">Heading · 24 px</p>
              <p className="text-lg text-paper-muted">Lead · 18–20 px para introducciones.</p>
              <p className="text-paper-muted">Body · 16 px, interlineado 1.6, medida máxima 65 caracteres.</p>
            </div>
          </div>
          <div>
            <p className="label">IBM Plex Mono · rotulado técnico</p>
            <p className="mt-6 font-mono text-display-l">Aa</p>
            <div className="mt-8 space-y-4 border-t border-line pt-6">
              <p className="label">Label · 11 px · mayúsculas · tracking 0.08em</p>
              <p className="font-mono text-sm text-paper-muted">Mono 14 px · datos, índices, especificaciones</p>
              <p className="text-sm text-paper-muted">El monoespaciado se reserva para el “rotulado del plano”: índices, etiquetas, cotas y metadatos. Nunca para párrafos.</p>
            </div>
          </div>
        </div>
      </Block>

      <Block id="motivo" title="Motivo gráfico: la cota">
        <div className="space-y-10">
          <CotaLine start="Idea" end="Producción" label="De principio a fin" />
          <CotaLine label="Primera conversación" />
          <CotaLine />
        </div>
        <p className="mt-6 max-w-[60ch] text-sm text-paper-muted">Se usa para expresar recorrido, alcance o medida: del problema a la solución, de hoy al lanzamiento. Nunca como simple decoración ni más de una vez por pantalla.</p>
      </Block>

      <Block id="componentes" title="Componentes">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/contacto" arrow>Primario</ButtonLink>
          <ButtonLink href="/servicios" variant="secondary">Secundario</ButtonLink>
          <ButtonLink href="/proyectos" variant="text" arrow>Texto</ButtonLink>
          <Button disabled>Deshabilitado</Button>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <Tag>Etiqueta</Tag>
          <Tag tone="accent">Proyecto para cliente</Tag>
          <Tag>Concepto · Demo técnica</Tag>
        </div>
        <div className="mt-10">
          <p className="label">Iconografía · trazo 1.5 px · rejilla 24 px</p>
          <ul className="mt-4 flex flex-wrap gap-6 text-paper">
            {services.map((s) => <li key={s.slug} title={s.title}><ServiceGlyph slug={s.slug} size={32} /></li>)}
          </ul>
        </div>
      </Block>

      <Block id="reglas" title="Reglas de composición">
        <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Retícula", "12 columnas, gutter 32–48 px, contenedor máximo 1440 px, márgenes 16/32/48 px."],
            ["Espaciado", "Base 4 px. Secciones 96–128 px en escritorio, 80–96 px en móvil."],
            ["Geometría", "Radios de 2–4 px. Esquinas casi rectas: precisión antes que suavidad."],
            ["Superficies", "Sin sombras difusas. La profundidad se construye con bordes de 1 px y saltos de tono."],
            ["Asimetría", "Títulos a 3/12, contenido a 9/12. Bento con anchos alternos 7/5 y 5/7."],
            ["Imagen", "Diagramas y capturas reales. Sin fotos de stock ni ilustraciones 3D genéricas."],
            ["Movimiento", "Entradas de 0.9–1.4 s con ease-out-quint. Nada se mueve sin razón; respeta reduced-motion."],
            ["Acento", "Un solo color de acento, en menos del 5 % de la superficie: CTA, cotas y foco."],
            ["Voz", "Primera persona, frases cortas, verbos concretos. Problemas antes que tecnologías."],
          ].map(([t, d]) => (
            <li key={t} className="bg-ink p-6">
              <p className="font-medium text-paper">{t}</p>
              <p className="mt-2 text-sm text-paper-muted">{d}</p>
            </li>
          ))}
        </ul>
      </Block>
    </>
  );
}
