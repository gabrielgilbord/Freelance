// Variantes de refinamiento del logotipo COTA para comparar antes de decidir.
//   node scripts/logo-variants.mjs → brand/variants/*.svg + brand/variants/compare.html
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

const PAPER = "#ECEAE4", INK = "#0C0D0C", ACC = "#FF5A36", ACC_L = "#D9411E";

// Wordmark (sin cambios en la forma de las letras: unidades de x-height 44, trazo 8)
const word = (c) => `<g fill="none" stroke="${c}" stroke-width="8"><path d="M35.79 49.57A18 18 0 1 1 35.79 26.43"/><circle cx="70" cy="38" r="18"/><path d="M110 2V60M98 20H124"/><circle cx="153" cy="38" r="18"/><path d="M171 16V60"/></g>`;

// A · actual: isotipo propio (r13, trazo 5.5 en caja 48) escalado ×1.1667
const isoA = (ink, acc) => `<g transform="translate(-4 4) scale(1.1667)"><path d="M33.2 33.2A13 13 0 1 1 33.2 14.8" stroke="${ink}" stroke-width="5.5" fill="none"/><path d="M31 29L43 17" stroke="${acc}" stroke-width="5.5" fill="none"/></g>`;
const lockA = (ink, acc) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206 64">${isoA(ink, acc)}<g transform="translate(64 8) scale(0.8)">${word(ink)}</g></svg>`;

// B · calibrado: el isotipo es la "c" del propio wordmark (mismo radio, mismo trazo, misma
// abertura) y el trazo de cota cruza la abertura a 45° exactos. Separación = media x-height.
const isoB = (ink, acc) => `<path d="M35.79 49.57A18 18 0 1 1 35.79 26.43" stroke="${ink}" stroke-width="8" fill="none"/><path d="M30 47L50 27" stroke="${acc}" stroke-width="8" fill="none"/>`;
const GAP = 22;
const lockB = (ink, acc) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 0 ${54 + GAP + 177} 62">${isoB(ink, acc)}<g transform="translate(${54 + GAP} 0)">${word(ink)}</g></svg>`;
const iconB = (ink, acc, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${bg ? `<rect width="64" height="64" rx="14" fill="${bg}"/>` : ""}<g transform="translate(7 2)">${isoB(ink, acc)}</g></svg>`;

const V = {
  "A-actual": { lock: lockA },
  "B-calibrado": { lock: lockB },
  "C-calibrado-mono": { lock: (ink) => lockB(ink, ink) },
};

mkdirSync("brand/variants", { recursive: true });
let rows = "";
for (const [name, v] of Object.entries(V)) {
  const dark = v.lock(PAPER, ACC), light = v.lock(INK, ACC_L);
  writeFileSync(`brand/variants/${name}-dark.svg`, dark);
  writeFileSync(`brand/variants/${name}-light.svg`, light);
  const sizes = [16, 22, 36, 72].map((h) => `<div style="height:${h}px">${dark.replace("<svg ", `<svg style="height:${h}px;width:auto" `)}</div>`).join("");
  const sizesL = [16, 22, 36, 72].map((h) => `<div style="height:${h}px">${light.replace("<svg ", `<svg style="height:${h}px;width:auto" `)}</div>`).join("");
  rows += `<section><h2>${name}</h2><div class="pair"><div class="d">${sizes}</div><div class="l">${sizesL}</div></div></section>`;
}
writeFileSync("brand/variants/B-icon-dark.svg", iconB(PAPER, ACC, INK));
writeFileSync("brand/variants/B-icon-light.svg", iconB(INK, ACC_L, PAPER));
const fav = [16, 32, 64].map((s) => iconB(PAPER, ACC, INK).replace("<svg ", `<svg width="${s}" height="${s}" `)).join("");
const favA = [16, 32, 64].map((s) => readFileSync("brand/archive/v1/favicon.svg", "utf8").replace(/<title>.*?<\/title>/, "").replace("<svg ", `<svg width="${s}" height="${s}" `)).join("");
writeFileSync(
  "brand/variants/compare.html",
  `<!doctype html><meta charset="utf-8"><style>body{margin:0;font:13px system-ui;background:#888}section{padding:16px 24px}h2{margin:0 0 8px;font-size:13px;color:#111}.pair{display:grid;grid-template-columns:1fr 1fr}.d,.l{display:flex;flex-direction:column;gap:14px;padding:20px}.d{background:${INK}}.l{background:#F4F2EC}.fav{display:flex;gap:16px;align-items:end;padding:20px;background:#ddd}</style>${rows}<section><h2>Favicon A (actual) vs B</h2><div class="fav">${favA}<span style="width:40px"></span>${fav}</div></section>`,
);
console.log("variants written");
