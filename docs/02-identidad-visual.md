# 02 · Identidad visual y design system (v1)

> **Superado.** La identidad vigente es la v2 "calibrada": consulta [`brand/IDENTITY.md`](../brand/IDENTITY.md) (logotipo, calibre, color, tipografía y normas) y [`DESIGN.md`](../DESIGN.md) (sistema web). Este documento se conserva como registro de la v1, archivada en `brand/archive/v1/`.

La versión navegable de este documento está en la propia web: **`/marca`** (excluida de buscadores).

## Logotipo
Archivos en [`/brand`](../brand) (y copia servida en `/public/brand`). Todos se generan desde una única geometría con `node scripts/build-brand.mjs`.

| Pieza | Archivo | Uso |
|---|---|---|
| Principal | `logo-primary-{dark,light}.svg` | Wordmark `cota` + línea de cota. Portadas, firma de documentos, presentaciones |
| Horizontal | `logo-horizontal-{dark,light}.svg` | Isotipo + wordmark + descriptor *Software Engineering*. Cabeceras de documentos, facturas |
| Compacta | `logo-compact-{dark,light}.svg` | Isotipo + wordmark. Cabecera web, apps |
| Monocromo | `*-mono-black.svg`, `*-mono-white.svg` | Impresión a una tinta, grabados, fondos de color |
| Isotipo | `isotipo-*.svg` | Espacios pequeños, sellos, marca de agua |
| Favicon | `favicon.svg` (+ `src/app/icon.svg`, `apple-icon.png`) | Pestaña del navegador, accesos directos |
| Avatar | `avatar.svg` / `avatar.png` | Perfiles de LinkedIn, GitHub, X… |
| Banner | `social-banner.svg` / `.png` | Cabecera de LinkedIn / X (1500×500) |

**Wordmark:** geométrico monolínea dibujado a medida (no es una fuente), trazo uniforme, minúsculas.
**Isotipo:** la "c" del wordmark cerrada por el trazo oblicuo con el que se marca el extremo de una cota. Evita circuitos, cerebros, bombillas y símbolos de código.
**Motivo gráfico:** la línea de cota completa (`|⟋——⟋|`), que expresa recorrido y alcance.

Reglas: zona de respeto = altura de la "o"; tamaño mínimo 64 px (wordmark) / 16 px (isotipo); el trazo oblicuo va siempre en acento salvo en versiones monocromas; no rotar, no deformar, no añadir sombras ni degradados.

## Color
| Token | Hex | Uso | Contraste sobre Ink |
|---|---|---|---|
| `ink` | `#0C0D0C` | Fondo principal (grafito cálido) | — |
| `ink-1` / `ink-2` / `ink-3` | `#121312` / `#181A18` / `#202220` | Superficies y elevación | — |
| `line` / `line-strong` | `#2A2D2A` / `#3D413D` | Bordes, divisores | — |
| `paper` | `#ECEAE4` | Texto principal | 16.2:1 AAA |
| `paper-muted` | `#A9A8A0` | Texto secundario | 8.2:1 AAA |
| `paper-subtle` | `#8A8A83` | Rótulos, metadatos | 5.6:1 AA |
| `accent` | `#FF5A36` | CTA, cotas, foco (≤ 5 % de la superficie) | 6.3:1 AA |
| `accent` (fondo claro) | `#D9411E` | Solo en piezas sobre papel | — (gráfico) |
| `steel` | `#93AAB5` | Secundario, solo diagramas | — |

Texto sobre botón de acento: `accent-ink #1A0904` (6.2:1).

## Tipografía
- **Schibsted Grotesk** (variable) — titulares y texto. Grotesca editorial con carácter, menos vista que Inter/Geist.
- **IBM Plex Mono** (400/500) — "rotulado del plano": índices, etiquetas, metadatos. Nunca para párrafos.

Escala: `display-l` clamp(2.6→5 rem) · `display-m` clamp(2.5→4.75 rem) · `display-s` clamp(2→3.25 rem) · 24 · 20 · 18 · 16 · 14 · `micro` 11 px (label, mayúsculas, tracking 0.08em). Interlineado de texto 1.6–1.7, medida máxima ~65 caracteres.

## Espaciado, retícula y geometría
- Base 4 px (escala de Tailwind). Secciones: 96–128 px escritorio, 80–96 px móvil.
- Retícula de 12 columnas, contenedor máximo 1440 px, márgenes 16 / 32 / 48 px.
- Radios 2–4 px (`rounded-xs`, `rounded-sm`): precisión antes que suavidad.
- Sin sombras difusas: la profundidad se construye con bordes de 1 px y saltos de tono. Bento con `gap-px` sobre fondo `line` para obtener divisores perfectos.

## Iconografía e ilustración
- Iconos propios: trazo 1.5 px, terminaciones rectas, rejilla 24 px, lenguaje de dibujo técnico (`src/components/ui/icons.tsx`).
- Ilustración = **diagramas de sistema reales** (nodos, conexiones ortogonales, rótulos mono, cotas). Sin 3D genérico ni stock.
- Imágenes de proyectos: capturas reales del producto, fondo oscuro, sin mockups de dispositivos recargados. Para conceptos, portadas generadas a partir de la arquitectura (`ProjectCover`).

## Componentes
Átomos en `src/components/ui`: `Button`/`ButtonLink` (primario, secundario, texto), `Tag`, `CotaLine`, `Container`, `SectionHeader`, `PageHeader`, `Reveal`, iconos. Moléculas/organismos en `components/sections`, `components/project`, `components/contact`, `components/layout`.

## Motion
- Entradas: titular por líneas desde máscara (1.1 s), revelado al scroll (0.9 s, `ease-out-quint`), trazado de cotas y conexiones (stroke-draw), pulsos de datos en el diagrama del hero (SMIL).
- Microinteracción de marca: al pasar sobre una tarjeta de servicio se traza una cota en su borde superior.
- Todo en CSS + un IntersectionObserver: **0 kB de librería de animación**. `prefers-reduced-motion` desactiva todo.

## Composición
Títulos de sección a 3/12 y contenido a 9/12; bento con anchos alternos 7/5 · 5/7 · 6/6; una sola cota por pantalla como máximo; el acento nunca supera el 5 % de la superficie.
