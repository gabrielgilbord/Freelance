// Genera todos los archivos SVG de la identidad de Cota a partir de una única geometría.
// Uso: node scripts/build-brand.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const C = {
  ink: "#0C0D0C",
  paper: "#ECEAE4",
  paperLight: "#F4F2EC",
  accentDark: "#FF5A36", // sobre fondo oscuro
  accentLight: "#D9411E", // sobre fondo claro
};

// ---------- Geometría ----------
// Isotipo: la "c" del wordmark cerrada por el trazo oblicuo con el que se marca
// el extremo de una cota en un plano técnico. Rejilla de 48 × 48.
const iso = ({ ink, accent }) => `
  <path d="M33.2 33.2A13 13 0 1 1 33.2 14.8" stroke="${ink}" stroke-width="5.5" fill="none"/>
  <path d="M31 29L43 17" stroke="${accent}" stroke-width="5.5" fill="none"/>`;

// Wordmark geométrico monolínea "cota". x-height 44, trazo 8, línea base y=60.
const word = ({ ink }) => `
  <g fill="none" stroke="${ink}" stroke-width="8">
    <path d="M35.79 49.57A18 18 0 1 1 35.79 26.43"/>
    <circle cx="70" cy="38" r="18"/>
    <path d="M110 2V60M98 20H124"/>
    <circle cx="153" cy="38" r="18"/>
    <path d="M171 16V60"/>
  </g>`;
const WORD_W = 175;

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

const themes = {
  dark: { ink: C.paper, accent: C.accentDark },
  light: { ink: C.ink, accent: C.accentLight },
  "mono-black": { ink: C.ink, accent: C.ink },
  "mono-white": { ink: "#FFFFFF", accent: "#FFFFFF" },
};

const files = {};

for (const [name, t] of Object.entries(themes)) {
  // Principal: wordmark + cota
  files[`logo-primary-${name}.svg`] = svg("-8 -4 191 100", word(t) + underline(t, WORD_W), "Cota");
  // Horizontal: isotipo + wordmark + descriptor
  files[`logo-horizontal-${name}.svg`] = svg(
    "0 0 386 64",
    `<g transform="translate(-4 4) scale(1.1667)">${iso(t)}</g>
     <g transform="translate(64 8) scale(0.8)">${word(t)}</g>
     <path d="M220 14V54" stroke="${t.ink}" stroke-opacity=".35" stroke-width="1.5"/>
     <text x="236" y="30" fill="${t.ink}" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="12.5" letter-spacing="1.2">SOFTWARE</text>
     <text x="236" y="47" fill="${t.ink}" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="12.5" letter-spacing="1.2">ENGINEERING</text>`,
    "Cota — Software Engineering",
  );
  // Compacta: isotipo + wordmark sin descriptor
  files[`logo-compact-${name}.svg`] = svg(
    "0 0 206 64",
    `<g transform="translate(-4 4) scale(1.1667)">${iso(t)}</g><g transform="translate(64 8) scale(0.8)">${word(t)}</g>`,
    "Cota",
  );
  // Isotipo
  files[`isotipo-${name}.svg`] = svg("0 0 48 48", iso(t), "Cota");
}

// Favicon: isotipo sobre teselado oscuro, legible a 16 px (trazos reforzados)
const favIso = `
  <path d="M32.5 32.5A12 12 0 1 1 32.5 15.5" stroke="${C.paper}" stroke-width="6.5" fill="none"/>
  <path d="M29 31L43 17" stroke="${C.accentDark}" stroke-width="6.5" fill="none"/>`;
files["favicon.svg"] = svg("0 0 48 48", bg("0 0 48 48", C.ink, 10) + favIso, "Cota");

// Avatar redes sociales (1:1, zona segura circular)
files["avatar.svg"] = svg(
  "0 0 400 400",
  bg("0 0 400 400", C.ink) +
    `<g transform="translate(75 80) scale(5)">${iso(themes.dark)}</g>`,
  "Cota",
);

// Cabecera redes / OG estático
files["social-banner.svg"] = svg(
  "0 0 1500 500",
  bg("0 0 1500 500", C.ink) +
    `<g transform="translate(120 160) scale(1.4)">${word(themes.dark)}${underline(themes.dark, WORD_W)}</g>
     <text x="1380" y="380" text-anchor="end" fill="${C.paper}" fill-opacity=".7" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="22" letter-spacing="2">SOFTWARE · IA · IOT — DE PRINCIPIO A FIN</text>`,
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
