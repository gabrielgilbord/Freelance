# DESIGN · COTA v2 — "Banco de pruebas"

## Direction (pinned by the brief)
An experimental technology lab crossed with an editorial design studio. The site is a **test bench**: real, well-made machines drawn in isometric, each one a working system, presented with editorial typography and the measured rigour of a technical datasheet. References for craft level, never for composition: Teenage Engineering manuals, Nothing's product pages, Linear's restraint, Locomotive's editorial pacing.

**Memory test:** after one viewport, a visitor remembers *"a black machined bench full of modules, with an orange block floating above its socket — that's the part they build for you."*

## Colour (strategy: dark ground, page-scale colour shifts)
| Token | Hex | Role |
|---|---|---|
| `ink` | `#0C0D0C` | Ground of the bench chapters |
| `ink-1 / ink-2` | `#121312` / `#181A18` | Surfaces, demo panels |
| `paper` | `#ECEAE4` | Text on ink |
| `sheet` | `#E8E5DD` | Ground of the datasheet chapter (light) |
| `sheet-ink` | `#141514` | Text on sheet |
| `accent` | `#FF5A36` | The subject: CTA, focus, the lifted part, live data |
| `accent-deep` | `#D9411E` | Accent on sheet |

Colour commits at page scale: the page moves **ink → sheet (capabilities datasheet) → ink → accent (closing chapter, drenched)**. The accent is never a decoration on large neutral areas inside an ink chapter.

## Type
- **Schibsted Grotesk** carries everything: display at 500 with tight tracking (−0.035em), body at 400.
- **IBM Plex Mono** only for real data and measurement: demo readouts, coordinates, step indices of the process (a true sequence), specs. Never as an eyebrow, never uppercase-tracked labels above headings.
- No eyebrows. Headings speak alone. No section numbers except the process.

## Illustration system (Anatomy Asset)
One camera (azimuth 52°, elevation 30°), one world scale per family, four-tone shading, painter's order, CSS-only motion, orange only on the subject of each drawing. Every piece stands on the same machined lab plinth. Sources live in `art/*.mjs`; outputs in `public/art/`.

| Asset | File |
|---|---|
| Hero: the COTA bench | `public/art/hero.svg` |
| Services (6 spots) | `public/art/services/*.svg` |
| Projects (3 tiles) | `public/art/projects/*.svg` |

Labels never go inside a drawing: the hero's hotspots live in the page as a legend with numbered markers.

## Composition
- 12-column grid, max 1440 px, gutters 16/32/48.
- Every chapter has a different structure: bench (hero, asymmetric), manifesto (one statement, word-by-word reveal), catalogue (service index + live illustration), datasheet (light table), sequence (sticky counter), cases (illustration + live demo), studio (statement + principles as rules), closing (drenched accent).
- Radii 2–8 px. Depth from 1 px rules and tone steps, not shadows.

## Motion
One authored moment per chapter, no generic fade-ups:
- Hero: headline lines rise once; the bench's own motion runs (fan, drawer, LEDs, floating module).
- Header: a scroll-progress dimension line.
- Manifesto: words brighten as the statement scrolls through (scroll-driven, CSS only).
- Process: the counter follows the step in view.
- Demos: data runs only while visible.
All of it stops under `prefers-reduced-motion`, showing the final readable state. No animation libraries.
