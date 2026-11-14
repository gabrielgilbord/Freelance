// Genera todos los archivos SVG de la identidad de COTA a partir de una única geometría.
// Versión 2 ("calibrada"). La versión 1 está en brand/archive/v1/.
// Uso: node scripts/build-brand.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const C = {
  ink: "#0C0D0C",
  paper: "#ECEAE4",
  paperLight: "#F4F2EC",
  accentDark: "#FF5A36", // sobre fondo oscuro
  accentLight: "#D9411E", // sobre fondo claro
  accentInk: "#1A0904", // tinta sobre naranja
};

// ---------- Geometría (una sola unidad para símbolo y letras) ----------
// Wordmark geométrico monolínea "cota": x-height 44, trazo 8, línea base y=60.
const word = ({ ink }) => `
  <g fill="none" stroke="${ink}" stroke-width="8">
    <path d="M35.79 49.57A18 18 0 1 1 35.79 26.43"/>
    <circle cx="70" cy="38" r="18"/>
    <path d="M110 2V60M98 20H124"/>
    <circle cx="153" cy="38" r="18"/>
    <path d="M171 16V60"/>
  </g>`;
const WORD_W = 175;

// Isotipo: la misma "c" del wordmark (radio 18, trazo 8, abertura ±40°) cerrada por el trazo
// de cota a 45° exactos que cruza su abertura. Caja útil: x −1…54, y 15…61.
const isoPaths = ({ ink, accent }, w = 8) => `
  <path d="M35.79 49.57A18 18 0 1 1 35.79 26.43" stroke="${ink}" stroke-width="${w}" fill="none"/>
  <path d="M30 47L50 27" stroke="${accent}" stroke-width="${w}" fill="none"/>`;
const GAP = 22; // separación símbolo–wordmark: media x-height
const WX = 54 + GAP; // origen del wordmark en los lockups

// Línea de cota bajo el wordmark (logotipo principal)
const underline = ({ ink, accent }, w) => `
  <path d="M2 70V90M${w - 2} 70V90" stroke="${ink}" stroke-width="2.5" fill="none"/>
  <path d="M2 84H${w - 2}" stroke="${ink}" stroke-width="2" fill="none"/>
  <path d="M-3 89L7 79M${w - 7} 89L${w + 3} 79" stroke="${accent}" stroke-width="4" fill="none"/>`;

const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${body}\n</svg>\n`;
const bg = (vb, color, r = 0) => {
  const [x, y, w, h] = vb.split(" ").map(Number);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}"/>`;
};
const mono = (t, x, y, lines, size = 10.5) =>
  lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.55}" fill="${t.ink}" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="${size}" letter-spacing="1.4">${l}</text>`).join("");

const themes = {
  dark: { ink: C.paper, accent: C.accentDark },
  light: { ink: C.ink, accent: C.accentLight },
  "mono-black": { ink: C.ink, accent: C.ink },
  "mono-white": { ink: "#FFFFFF", accent: "#FFFFFF" },
  // negativo sobre naranja COTA, para piezas impresas o digitales en el color de marca
  "on-accent": { ink: C.accentInk, accent: C.accentInk },
};

const files = {};

for (const [name, t] of Object.entries(themes)) {
  // Principal: wordmark + cota
  files[`logo-primary-${name}.svg`] = svg("-8 -4 191 100", word(t) + underline(t, WORD_W), "Cota");
  // Horizontal: isotipo + wordmark + descriptor
  files[`logo-horizontal-${name}.svg`] = svg(
    `-4 -2 ${WX + 312} 66`,
    `${isoPaths(t)}<g transform="translate(${WX} 0)">${word(t)}</g>
     <path d="M${WX + 197} 14V60" stroke="${t.ink}" stroke-opacity=".35" stroke-width="1.5"/>
     ${mono(t, WX + 211, 33, ["SOFTWARE", "ENGINEERING"])}`,
    "Cota, Software Engineering",
  );
  // Compacta: isotipo + wordmark
  files[`logo-compact-${name}.svg`] = svg(`-4 -2 ${WX + 183} 66`, `${isoPaths(t)}<g transform="translate(${WX} 0)">${word(t)}</g>`, "Cota");
  // Vertical: isotipo sobre wordmark
  files[`logo-vertical-${name}.svg`] = svg(
    "-6 0 187 142",
    `<g transform="translate(53.6 -16) scale(1.3)">${isoPaths(t)}</g><g transform="translate(0 74)">${word(t)}</g>`,
    "Cota",
  );
  // Isotipo
  files[`isotipo-${name}.svg`] = svg("-4 12 62 52", isoPaths(t), "Cota");
}

// Favicon: corte para tamaños pequeños. Misma geometría con trazo 10 (compensación óptica).
files["favicon.svg"] = svg("0 0 64 64", bg("0 0 64 64", C.ink, 14) + `<g transform="translate(6.5 -6)">${isoPaths(themes.dark, 10)}</g>`, "Cota");

// Avatar redes sociales (1:1, zona segura circular)
files["avatar.svg"] = svg("0 0 400 400", bg("0 0 400 400", C.ink) + `<g transform="translate(78 25) scale(4.6)">${isoPaths(themes.dark, 8.5)}</g>`, "Cota");

// Cabecera redes / OG estático
files["social-banner.svg"] = svg(
  "0 0 1500 500",
  bg("0 0 1500 500", C.ink) +
    `<g transform="translate(120 160) scale(1.4)">${word(themes.dark)}${underline(themes.dark, WORD_W)}</g>
     <text x="1380" y="380" text-anchor="end" fill="${C.paper}" fill-opacity=".7" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="22" letter-spacing="2">SOFTWARE, IA E IOT. DE PRINCIPIO A FIN.</text>`,
  "Cota",
);

mkdirSync("brand", { recursive: true });
mkdirSync("public/brand", { recursive: true });
for (const [f, content] of Object.entries(files)) {
  writeFileSync(`brand/${f}`, content);
  writeFileSync(`public/brand/${f}`, content);
}
writeFileSync("src/app/icon.svg", files["favicon.svg"]);
console.log(`${Object.keys(files).length} archivos generados en /brand y /public/brand`);
