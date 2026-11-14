# COTA · Sistema de identidad v2

> Brief de identidad visual (método *brand-identity*) y normas de aplicación del logotipo (método *svg-logo-designer*). Noviembre 2026. La v1 se conserva en `brand/archive/v1/`.

## 01 · Intención
COTA es un estudio de ingeniería de una sola persona que construye sistemas completos (software, IA e IoT) con el rigor de un fabricante de instrumentos de precisión. La identidad debe sentirse **medida, no decorada**: cada forma se deriva de una sola geometría, el color se usa como una marca de taller (un único punto naranja por vista) y las imágenes son objetos fabricados, nunca metáforas genéricas. Si una pieza no puede justificarse con una medida, sobra.

## 02 · Logotipo
- **Tipo:** combinación de isotipo + wordmark geométrico monolínea en minúsculas.
- **Carácter:** instrumento de precisión. Construido, no dibujado a mano; trazos de grosor constante, terminaciones rectas.
- **Construcción v2 (calibrada):** el isotipo **es la "c" del propio wordmark** (radio 18, trazo 8, abertura ±40°) cerrada por el **trazo de cota a 45°** que cruza su abertura. Símbolo y letras comparten unidad y grosor óptico. Separación símbolo–wordmark = media x-height (22 u).
- **Evitar:** degradados, sombras, contornos, versiones "3D", inclinarlo, cambiar el ángulo del trazo, cambiar la tipografía de las letras.
- **Referencias de cualidad (no de forma):** *Braun* (geometría funcional y proporciones exactas), *Teenage Engineering* (un acento de color como componente, no como decoración), *Rimowa* (wordmark sobrio que gana autoridad por repetición y consistencia).

### Piezas
| Pieza | Archivo | Uso |
|---|---|---|
| Principal | `logo-primary-*.svg` | Wordmark + línea de cota. Portadas, firma, piezas editoriales |
| Horizontal | `logo-horizontal-*.svg` | Isotipo + wordmark + descriptor. Documentos, propuestas, facturas |
| Compacta | `logo-compact-*.svg` | Isotipo + wordmark. Web, apps, cabeceras |
| Vertical | `logo-vertical-*.svg` | Perfiles, piezas cuadradas, merchandising |
| Isotipo | `isotipo-*.svg` | Espacios pequeños, sellos, marcas de agua |
| Favicon | `favicon.svg` | Corte para tamaños pequeños: misma geometría, trazo 10 (compensación óptica) |
| Avatar | `avatar.svg` / `.png` | Redes sociales |
| Imagen para compartir | `src/app/opengraph-image.png` (`scripts/export-og.mjs`) | Vista previa en WhatsApp, LinkedIn, X… |

Variantes de color de cada pieza: `dark` (sobre grafito), `light` (sobre papel), `mono-black`, `mono-white`, `on-accent` (tinta sobre naranja).

### Normas
- **Zona de respeto:** la altura de la "o" (x-height) alrededor de todo el logotipo.
- **Tamaño mínimo:** compacta 72 px de ancho en pantalla / 20 mm en impresión. Por debajo, solo isotipo; por debajo de 24 px, el favicon.
- **Color:** el trazo de cota va en naranja salvo en versiones monocromas. Nunca naranja sobre naranja: usar `on-accent`.
- **Fondos:** grafito, papel o naranja liso. Nunca sobre fotografía o ilustración sin una placa lisa.

## 02b · Recurso de firma: el calibre
`public/art/caliper.svg` (fuente `art/caliper.mjs`). Un calibre digital midiendo la pieza naranja; la pantalla marca **60.00 mm**. Es la palabra "cota" convertida en objeto y el único elemento que solo puede pertenecer a COTA.

- **Cuándo:** piezas donde la marca firma o explica quién es: sección del estudio, portadas de propuestas y documentos, cierre de presentaciones, publicaciones de marca.
- **Tamaño mínimo:** 300 px de ancho en pantalla (60 mm impreso). Por debajo la lectura "60.00" deja de leerse; ahí se usa el isotipo, cuyo trazo a 45° es la misma marca de cota reducida a lo esencial.
- **Reglas:** siempre sobre grafito liso; nunca recortado por el calibre ni por la pieza; la lectura es una constante de marca (no se cambia por datos reales ni se traduce); un solo calibre por pieza; nunca como icono, avatar ni patrón.
- **Familia:** misma cámara (azimut 52°), misma peana y mismo vocabulario de piezas que el resto de ilustraciones.

## 03 · Color
| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Base | Grafito | `#0C0D0C` | Fondo de marca. 70 % de cualquier pieza |
| Texto / superficie clara | Papel | `#ECEAE4` | Texto sobre grafito; fondo de documentos |
| Superficie técnica | Hoja | `#E8E5DD` | Capítulos claros, fichas técnicas |
| Acento | Naranja COTA | `#FF5A36` | El sujeto: CTA, foco, la pieza que construimos |
| Acento sobre claro | Naranja profundo | `#D9411E` | Mismo papel sobre fondos claros |

- **Personalidad:** taller de precisión de noche; monocromo cálido con una señal.
- **Tipo de paleta:** monocroma neutra + un acento.
- **Regla de oro:** un solo punto naranja protagonista por vista. El naranja nunca rellena superficies grandes salvo en el capítulo de cierre (pleno de color, como un panel de producto).

## 04 · Tipografía
- **Principal:** Schibsted Grotesk (variable). Titulares a 450–500, interletraje −0.035 a −0.045 em, interlineado 0.92–1.05.
- **Secundaria:** IBM Plex Mono 400. Solo para datos, medidas, coordenadas, estados de demo y el descriptor del logotipo. Nunca como antetítulo.
- **Jerarquía:** Display (2.75–6 rem) · Sección (2.5–4.75 rem) · Subtítulo (1.25–1.5 rem) · Cuerpo 16–20 px, medida ≤ 65 caracteres · Dato 12 px mono, cifras tabulares.
- **Evitar:** mayúsculas con espaciado ancho como etiqueta, cursivas decorativas, una tercera familia.

## 05 · Imagen
- **Estética:** producto industrial premium; objetos fabricados, iluminación de estudio, materiales sobrios.
- **Sujeto:** máquinas e instrumentos isométricos que *son* el servicio (banco de pruebas, rack, nodo sensor, calibre). Capturas reales de producto cuando existan.
- **Tratamiento:** monocromo grafito, cuatro tonos de sombreado, el naranja solo en la pieza protagonista.
- **Evitar:** fotografía de stock, personas posando delante de pantallas, render 3D genérico, cerebros, robots, bombillas, circuitos decorativos.

## 06 · Iconografía e ilustración
- **Ilustración (núcleo de marca):** isometría Anatomy Asset: azimut 52°, elevación 30°, misma escala por familia, peana mecanizada común, movimiento solo CSS y discreto.
- **Iconos:** trazo 1.5 px, terminaciones rectas, rejilla 24 px, utilitarios. Nunca protagonistas.

## 07 · Principios
- **Medido antes que decorado.** Cada línea, espacio y color responde a una medida o a una función; si no, se elimina.
- **Una señal.** El naranja marca lo importante una vez por vista. Repetirlo lo convierte en ruido.
- **Objeto, no metáfora.** Se enseñan cosas construidas con detalle real, no símbolos genéricos de "tecnología".
- **Silencio como material.** El espacio negativo es parte de la composición: menos elementos, más grandes, mejor alineados.

## 08 · Expresiones
- **Web:** capítulos grafito / hoja / naranja; ilustración isométrica como protagonista; en móvil, composición condensada (mismo sistema, menos recorrido).
- **Redes:** avatar isotipo sobre grafito; publicaciones con una ilustración isométrica y un titular, sin más elementos.
- **Documentos y propuestas:** fondo papel, logotipo horizontal arriba a la izquierda, datos en Plex Mono, una ilustración por capítulo.
- **Presentaciones:** portadas en grafito con el logotipo principal y su cota; una idea por diapositiva.
- **Papelería:** tarjeta grafito con el isotipo grabado y el trazo de cota en naranja; reverso papel con datos en mono.
