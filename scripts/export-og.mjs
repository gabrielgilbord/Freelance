// Genera la imagen para compartir (Open Graph / Twitter) con las tipografías reales de la web
// y la ilustración del hero. Requiere la web en marcha: `npm run build && npm start`.
//   node scripts/export-og.mjs [http://localhost:3000]
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] || "http://localhost:3000";
const css = await (await fetch(base + "/")).text().then((html) => {
  const href = html.match(/href="(\/_next\/static\/chunks\/[^"]+\.css)"/)[1];
  return fetch(base + href).then((r) => r.text());
});
// Las caras latinas precargadas de cada familia (archivos .p.)
// Se incrustan como data: URL (las fuentes de otro origen no cargan en una página local)
const face = async (family) => {
  const block = [...css.matchAll(/@font-face\{([^}]*)\}/g)].map((x) => x[1]).find((b) => b.includes(family) && b.includes(".p."));
  const file = block.match(/url\(\.\.\/media\/([^)]+)\)/)[1];
  const data = Buffer.from(await (await fetch(`${base}/_next/static/media/${file}`)).arrayBuffer()).toString("base64");
  const weight = (block.match(/font-weight:([^;]+)/) || [, "400"])[1];
  return `font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2')`;
};
const sans = await face("Schibsted Grotesk");
const mono = await face("IBM Plex Mono");
const hero = readFileSync("public/art/hero.svg", "utf8").replace("<svg ", '<svg style="position:absolute;right:-70px;bottom:-60px;width:860px;height:auto" ');
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{${sans}} @font-face{${mono}}
body{margin:0;width:1200px;height:630px;background:#0c0d0c;color:#eceae4;font-family:'Schibsted Grotesk';position:relative;overflow:hidden}
.logo{position:absolute;left:64px;top:56px;height:30px}
h1{position:absolute;left:64px;top:150px;margin:0;font-weight:450;font-size:62px;line-height:.98;letter-spacing:-.045em;width:560px}
p{position:absolute;left:64px;bottom:56px;margin:0;font-family:'IBM Plex Mono';font-size:17px;color:#a9a8a0;letter-spacing:.01em}
</style>
<svg class="logo" viewBox="-4 -2 263 66"><path d="M35.79 49.57A18 18 0 1 1 35.79 26.43" stroke="#eceae4" stroke-width="8" fill="none"/><path d="M30 47L50 27" stroke="#ff5a36" stroke-width="8" fill="none"/><g transform="translate(76 0)" fill="none" stroke="#eceae4" stroke-width="8"><path d="M35.79 49.57A18 18 0 1 1 35.79 26.43"/><circle cx="70" cy="38" r="18"/><path d="M110 2V60M98 20H124"/><circle cx="153" cy="38" r="18"/><path d="M171 16V60"/></g></svg>
<h1>Ingeniería digital a medida, de la señal al sistema.</h1>
<p>Software · IA · IoT · Infraestructura</p>
${hero}`;
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
for (const out of ["src/app/opengraph-image.png", "src/app/twitter-image.png"]) await page.screenshot({ path: out });
await b.close();
const alt = "COTA: ingeniería digital a medida, de la señal al sistema. Ilustración isométrica de un banco de pruebas con módulos de software, IA, datos e IoT.";
writeFileSync("src/app/opengraph-image.alt.txt", alt);
writeFileSync("src/app/twitter-image.alt.txt", alt);
console.log("OG image written");
