# 03 · Arquitectura técnica

## Stack y por qué
| Pieza | Elección | Motivo |
|---|---|---|
| Framework | **Next.js 16 (App Router)** + React 19 | SSG para casi todo, Server Components por defecto, Server Actions para el formulario, metadatos/OG/sitemap nativos |
| Lenguaje | **TypeScript** estricto (`noUncheckedIndexedAccess`) | Contenido tipado: un servicio o proyecto mal formado no compila |
| Estilos | **Tailwind CSS 4** con tokens en `@theme` | Una única fuente de verdad para colores, tipografía, radios y motion |
| Validación | **zod** | Mismo esquema para validar en servidor y tipar el formulario |
| Animación | **CSS + IntersectionObserver + SMIL** | Se descartó Motion/Framer Motion: los efectos necesarios no lo justifican (0 kB extra) |
| Fuentes | `next/font/google` | Autoalojadas en el build, sin peticiones a Google desde el navegador, sin CLS |

Dependencias de producción: `next`, `react`, `react-dom`, `zod`, `server-only`. Nada más.

## Estructura
```
src/
├─ app/                      # Rutas (App Router)
│  ├─ page.tsx               # Home
│  ├─ servicios/[slug]/      # 6 páginas de servicio (SSG)
│  ├─ proyectos/[slug]/      # Casos (SSG)
│  ├─ sobre-mi/ contacto/ aviso-legal/ privacidad/ marca/
│  ├─ sitemap.ts robots.ts manifest.ts opengraph-image.tsx twitter-image.tsx icon.svg apple-icon.png
│  └─ globals.css            # Design tokens + utilidades de marca + motion
├─ components/
│  ├─ ui/                    # Átomos: Button, Tag, CotaLine, Reveal, icons…
│  ├─ brand/                 # Logo como componente
│  ├─ layout/                # Header (+ shell cliente), MobileNav, Footer
│  ├─ sections/              # Organismos de página (Hero, ServicesBento, Process…)
│  ├─ project/               # ProjectCard, ProjectCover
│  └─ contact/               # ContactForm (cliente)
├─ content/                  # TODO el contenido editable: site, services, projects, process…
└─ lib/
   ├─ contact/               # schema (zod), action (Server Action), delivery/ (adapters)
   ├─ projects/              # types + repository
   └─ seo/                   # metadata + JSON-LD
```

## Patrones aplicados (y dónde)
- **Separation of Concerns:** contenido (`content/`), dominio (`lib/`), presentación (`components/`), rutas (`app/`).
- **Component-based / Atomic Design:** `ui` (átomos) → `sections`, `project`, `contact` (organismos) → páginas.
- **Design tokens:** `@theme` en `globals.css` genera utilidades (`bg-ink`, `text-accent`…).
- **Repository Pattern:** `ProjectRepository` (`lib/projects/repository.ts`). Hoy lee un archivo TS; migrar a un CMS = nueva implementación de la interfaz, sin tocar páginas.
- **Strategy + Adapter + Factory:** entrega del formulario. `ContactDelivery` es la interfaz; `resend.ts` y `webhook.ts` adaptan APIs externas; `getContactDelivery()` elige por `CONTACT_PROVIDER`.
- **Dependency Inversion:** la Server Action depende de `ContactDelivery`, no de Resend.
- **Composition over Inheritance:** variantes por props (`Button variant`), `Reveal as="li"`.
- **KISS:** sin estado global, sin CMS, sin librería de animación ni de UI.

## Rendering
- Todas las páginas son **estáticas** (SSG) salvo `/contacto`, que lee `searchParams` para preseleccionar el tipo de proyecto (`/contacto?servicio=…`).
- Componentes cliente mínimos: `HeaderShell` (estado de scroll), `MobileNav`, `Reveal`, `ContactForm`.

## Formulario de contacto
1. `ContactForm` (cliente) usa `useActionState` → `submitContact` (Server Action).
2. Anti-spam sin captcha: campo trampa oculto + tiempo mínimo de 2,5 s desde la carga.
3. Validación con zod; los errores vuelven por campo con `aria-invalid` / `aria-describedby` y se conservan los valores escritos.
4. Entrega mediante el adaptador configurado. En producción en Vercel, `console` está prohibido para no perder mensajes en silencio.

## SEO técnico
- `metadata` por página con `pageMetadata()` → title, description, canonical, Open Graph, Twitter Card.
- OG image generada (`opengraph-image.tsx`), `sitemap.xml`, `robots.txt` (excluye `/marca`), `manifest.webmanifest`.
- JSON-LD: `ProfessionalService` + `WebSite` global; `BreadcrumbList` en interiores; `Service` + `FAQPage` en cada servicio; `CreativeWork` en proyectos.
- HTML semántico, un `h1` por página, URLs limpias en español, `lang="es"`.
- SEO local: rellenar `site.location` en `src/content/site.ts` añade dirección y `areaServed` al JSON-LD.

## Calidad verificada
- `npm run typecheck` y `npm run lint` sin errores; `npm run build` OK (25 rutas).
- Lighthouse (build de producción, local): Rendimiento 92–96 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100.
- Sin errores de consola en ninguna página; sin scroll horizontal a 390 px; formulario probado de punta a punta (validación, preselección, envío).
- Cabeceras de seguridad en `next.config.ts`.
