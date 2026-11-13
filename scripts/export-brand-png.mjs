// Exporta versiones PNG de los SVG de marca (avatar, banner, icono Apple).
// Requiere Playwright con Chromium:  npx playwright install chromium  (si no lo tienes)
// Uso: node scripts/export-brand-png.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const jobs = [
  { svg: "brand/avatar.svg", out: "brand/avatar.png", w: 800, h: 800 },
  { svg: "brand/social-banner.svg", out: "brand/social-banner.png", w: 1500, h: 500 },
  { svg: "brand/favicon.svg", out: "src/app/apple-icon.png", w: 180, h: 180 },
  { svg: "brand/logo-primary-light.svg", out: "brand/logo-primary-light.png", w: 1200, h: 628, bg: "#F4F2EC" },
  { svg: "brand/logo-primary-dark.svg", out: "brand/logo-primary-dark.png", w: 1200, h: 628, bg: "#0C0D0C" },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const j of jobs) {
  const svg = readFileSync(j.svg, "utf8");
  await page.setViewportSize({ width: j.w, height: j.h });
  const pad = j.bg ? "padding:15%;box-sizing:border-box;" : "";
  await page.setContent(
    `<html><body style="margin:0;background:${j.bg ?? "transparent"}"><div style="width:${j.w}px;height:${j.h}px;display:flex;align-items:center;justify-content:center;${pad}">${svg.replace("<svg ", '<svg style="width:100%;height:100%" ')}</div></body></html>`,
  );
  await page.screenshot({ path: j.out, omitBackground: !j.bg });
  console.log("✓", j.out);
}
await browser.close();
