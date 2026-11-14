# Cota — Estudio de ingeniería de software

Marca, sistema de diseño y web comercial de **Cota**: *ingeniería de software de principio a fin*.
Next.js 16 · React 19 · TypeScript · Tailwind CSS 4.

- Estrategia, posicionamiento y naming → [`docs/01-estrategia-de-marca.md`](docs/01-estrategia-de-marca.md)
- Identidad visual y design system → [`docs/02-identidad-visual.md`](docs/02-identidad-visual.md) (versión visual en `/marca`)
- Arquitectura técnica → [`docs/03-arquitectura.md`](docs/03-arquitectura.md)
- Logotipos y recursos gráficos → [`brand/`](brand)

## Puesta en marcha

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local   # y rellena lo que necesites
npm run dev                  # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run lint` / `npm run typecheck` | ESLint y TypeScript |
| `node scripts/build-brand.mjs` | Regenera todos los SVG de marca desde una única geometría |
| `node scripts/export-brand-png.mjs` | Exporta PNG (avatar, banner, icono Apple). Necesita Playwright |

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí (producción) | Dominio definitivo, p. ej. `https://www.cota.studio`. Canonical, sitemap, OG y JSON-LD |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Email público. Vacío = no se muestra ningún enlace de email |
| `CONTACT_PROVIDER` | Sí (producción) | `resend`, `webhook` o `console` (solo desarrollo) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Con `resend` | Envío por email con [Resend](https://resend.com) (dominio verificado) |
| `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET` | Con `webhook` | POST JSON a n8n, Make, Zapier, Slack… firmado con HMAC-SHA256 en `X-Signature` |
| `LEGAL_OWNER_NAME`, `LEGAL_TAX_ID`, `LEGAL_ADDRESS` | Sí (España) | Datos del titular para Aviso legal y Privacidad (LSSI / RGPD) |

## Despliegue (Vercel, recomendado)

1. Importa el repositorio en Vercel (framework detectado automáticamente).
2. Añade las variables de entorno anteriores en *Settings → Environment Variables*.
3. Conecta tu dominio y pon la misma URL en `NEXT_PUBLIC_SITE_URL`.
4. Despliega. Comprueba `/sitemap.xml`, `/robots.txt` y envía un mensaje de prueba desde `/contacto`.
5. Da de alta el sitemap en Google Search Console.

Cualquier plataforma con Node.js sirve (`npm run build && npm start`); también Docker con la salida `standalone` si se activa en `next.config.ts`.

## Ilustraciones y skills de diseño

Las ilustraciones isométricas (`public/art/`) se generan con la skill **Anatomy Asset** a partir de los scripts de `art/`:

```bash
bash scripts/install-skills.sh   # instala las skills en .claude/skills (una vez por máquina)
node art/hero.mjs                # hero: el banco COTA
node art/set.mjs                 # 6 servicios + 3 proyectos
```

Skills usadas en el rediseño: `anatomy-asset`, `frontend-design`, `impeccable`, `ui-ux-pro-max` y `web-design-guidelines`. La dirección de arte está en [`DESIGN.md`](DESIGN.md) y la verdad de producto en [`PRODUCT.md`](PRODUCT.md).

## Editar contenido

Todo el contenido vive en `src/content/` — no hace falta tocar componentes.

| Archivo | Contenido |
|---|---|
| `site.ts` | Nombre, descripción, email, **redes sociales**, **ubicación (SEO local)**, datos legales |
| `services.ts` | Las 6 líneas de servicio: problemas, entregables, beneficios, pasos, FAQ, SEO |
| `projects.ts` | Casos del portfolio |
| `process.ts`, `capabilities.ts`, `principles.ts`, `engagement.ts` | Proceso, capas técnicas, principios y modelos de colaboración |

### Añadir un proyecto real
1. Copia un objeto en `src/content/projects.ts`.
2. Usa `status: "client"` (con permiso del cliente) o `"product"`.
3. Sustituye `successCriteria` por `results` — **solo cifras verificables**.
4. Imágenes en `public/projects/<slug>/` y referencia en `cover` y `gallery`. Sin `cover`, la web usa `public/art/projects/<slug>.svg`: genera una ilustración en `art/set.mjs` o añade una portada real.
5. Si quieres una demo visual, añádela en `src/components/demos/` y regístrala en `index.tsx`.
6. `featured: true` para que aparezca en la home. Los proyectos reales se ordenan antes que los conceptos.

Los tres casos incluidos son **conceptos / demos técnicas** y se muestran etiquetados como tal. Retíralos o mantenlos a medida que publiques trabajos reales.

## Pendiente de tus datos

No se ha inventado ningún dato personal. Antes de publicar, completa:
- [ ] Dominio → `NEXT_PUBLIC_SITE_URL`
- [ ] Email de contacto y proveedor del formulario
- [ ] Redes (LinkedIn, GitHub…) → `site.social`
- [ ] Ciudad / región (si quieres SEO local) → `site.location`
- [ ] Titular, NIF y domicilio → variables `LEGAL_*` (si faltan, las páginas legales lo marcan como *pendiente*)
- [ ] Comprobar disponibilidad de la marca "Cota" (OEPM/EUIPO, clase 42) y de dominios
- [ ] Revisar el compromiso de respuesta (`site.contact.responseTime`, por defecto 48 h laborables)
