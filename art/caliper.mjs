// COTA · pieza de firma: el calibre.
// Un calibre digital tumbado sobre la peana de laboratorio, midiendo una pieza mecanizada en
// naranja (el único acento). La pantalla da la medida: la "cota" convertida en objeto.
// Misma cámara (azimut 52°), misma peana y mismo vocabulario de piezas que el resto del set.
//
// Built with the Anatomy Asset kit (.claude/skills/anatomy-asset).
//   node art/caliper.mjs  → public/art/caliper.svg, art/out/caliper.html

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.claude/skills/anatomy-asset/kit/iso-kit.mjs";
import * as a from "../.claude/skills/anatomy-asset/kit/asset.mjs";
import * as G from "../.claude/skills/anatomy-asset/kit/lathe.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PAPER = "#0c0d0c";
const W = 720;
const H = 520;

const PLINTH = { x: -104, y: -62, w: 318, d: 140, r: 9 };
const P = a.fitInto([...k.boxCorners(PLINTH, -5, 100)], { x: 24, y: 24, w: W - 48, h: H - 48 }, { pad: 8, azimuth: 52 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const brand = (svg) => `<g class="ac-brand">${svg}</g>`;
const ebony = (svg) => `<g class="ac-ebony">${svg}</g>`;
const steel = (svg) => `<g class="ac-steel">${svg}</g>`;
const screws = (pts, z, r = 1.6) =>
  L(pts.map(([x, y]) => k.ring(x, y, r, z, P, 14)).join(""), { tone: "lo" }) + D(pts.map(([x, y]) => at([x, y, z])), { size: 0.6 });

const Z0 = 8; // top of the plinth

// ---------- the plinth (same recipe as the set) ----------
function plinth() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(PLINTH, -8), -5, 3, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLINTH, 16))) out.push(ebony(S(k.cylinder(x, y, 6.5, -5, 5, P, 28, 0.3), { tone: "lo" })));
  out.push(S(k.slabOf(PLINTH, 0, Z0, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(PLINTH, 3, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLINTH, 5), Z0, P, 6), { tone: "faint" }));
  out.push(screws(k.corners(PLINTH, 7), Z0, 1.6));
  // a felt pad under the instrument
  const PAD = { x: -92, y: -50, w: 294, d: 116, r: 4 };
  out.push(ebony(S(k.slabOf(PAD, Z0, 1, P, 3, 0.2), { tone: "mid", crease: "none" })));
  return out.join("");
}

// ---------- geometry of the instrument (upright, in the plane y = −2…2) ----------
const ZP = Z0 + 1; // on the pad
const T = 4; // thickness of the blade, along y
const BLOCK = { x: -56, y: -24, w: 64, d: 48, r: 2.5 }; // the part being measured
const BLOCK_H = 42;
const BEAM_Z = ZP + BLOCK_H + 10;
const BEAM_H = 16;
const plate = (x, w, z0, h, y = -T / 2, d = T) => k.slabOf({ x, y, w, d, r: 1 }, z0, h, P, 2, 0.4);

function fixedJaw() {
  const out = [S(plate(-74, 18, ZP + 6, BEAM_Z - ZP - 6), { tone: "hi", lit: true })];
  // the measuring tip: a narrower blade reaching the pad
  out.push(S(plate(-62, 6, ZP, 7), { tone: "hi" }));
  return out.join("");
}

function block() {
  const z1 = ZP + BLOCK_H;
  const svg = [
    S(k.slabOf(BLOCK, ZP, BLOCK_H, P, 3, 1.2), { tone: "hi", lit: true, inner: L(k.sideSeam(BLOCK, ZP + 8, P, 3), { tone: "lo" }) }),
    // a counterbored hole, two tapped holes and a machined slot on the top face
    L(k.ring(BLOCK.x + 22, BLOCK.y + 24, 10, z1, P, 40) + k.ring(BLOCK.x + 22, BLOCK.y + 24, 6, z1, P, 32), { tone: "lo" }),
    D([at([BLOCK.x + 22, BLOCK.y + 24, z1])], { size: 0.5, tone: "lo" }),
    L(k.ring(BLOCK.x + 48, BLOCK.y + 10, 2.6, z1, P, 16) + k.ring(BLOCK.x + 48, BLOCK.y + 38, 2.6, z1, P, 16), { tone: "lo" }),
    L(k.planOutline({ x: BLOCK.x + 42, y: BLOCK.y + 19, w: 12, d: 10, r: 4 }, z1, P, 4), { tone: "lo" }),
  ].join("");
  return `<path class="iso-halo" d="${k.haloOf(BLOCK, ZP, 1, P)}"/>` + brand(svg);
}

function beam() {
  const out = [S(plate(-74, 250, BEAM_Z, BEAM_H), { tone: "hi", lit: true })];
  // the engraved scale on the front face, ticks hanging from the top edge
  const t = k.sideTicks(66, 168, 2.5, 4, T / 2, BEAM_Z + BEAM_H, [3, 5.5], P, "x");
  out.push(L(t.minor, { tone: "lo", free: "end" }), L(t.major, { tone: "mid", free: "end" }));
  // the inside-measuring jaw of the fixed end, pointing up
  out.push(S(plate(-70, 9, BEAM_Z + BEAM_H, 12), { tone: "hi" }));
  // the depth rod leaving the beam's end
  out.push(S(plate(176, 18, BEAM_Z + 5, 4, -1, 2), { tone: "mid" }));
  return out.join("");
}

function slideJaw() {
  const out = [S(plate(8, 18, ZP + 6, BEAM_Z - ZP - 6), { tone: "hi", lit: true })];
  out.push(S(plate(8, 6, ZP, 7), { tone: "hi" }));
  return out.join("");
}

function slider() {
  const SX = 4;
  const SW = 62;
  const z0 = BEAM_Z - 5;
  const z1 = BEAM_Z + BEAM_H + 5;
  const out = [];
  out.push(S(plate(SX + 4, 9, z1, 12), { tone: "hi" })); // its inside jaw, pointing up
  out.push(ebony(S(k.slabOf({ x: SX, y: -5, w: SW, d: 10, r: 2.5 }, z0, z1 - z0, P, 3, 0.8), { tone: "mid" })));
  // the display on the front face, with the reading
  const LX = SX + 8;
  const LW = 36;
  out.push(S(k.slabOf({ x: LX, y: 5, w: LW, d: 1, r: 0.6 }, z0 + 6, 14, P, 2), { tone: "lo", crease: "none" }));
  const reading = (txt) => k.faceTextSvg(k.sideMatrix([LX + LW - 3, 6], z0 + 9.6, P, "left"), txt, { size: 7.2, tone: "hi", anchor: "end" });
  out.push(a.amFlip([reading("60.00"), reading("60.01"), reading("60.00"), reading("59.99")], { period: 5200 }));
  out.push(k.faceTextSvg(k.sideMatrix([LX + 3, 6], z0 + 17, P, "left"), "mm", { size: 3, tone: "mid" }));
  // two buttons and the thumb roller, on the front face
  for (const [bx, bz] of [[SX + 50, z0 + 16], [SX + 50, z0 + 8]]) {
    const F = G.frameAlong([bx, 5, bz], [0, 1, 0]);
    out.push(S(G.disc(0, 1.6, 2.4, F, P), { tone: "hi" }));
  }
  const RF = G.frameAlong([SX + 30, 5, z0 - 3], [0, 1, 0]);
  out.push(S(G.disc(-1, 3, 5.5, RF, P), { tone: "hi", inner: L(G.ribsOf(RF, -1, 3, 5.5, 26, P), { tone: "lo" }) }));
  // the lock screw on top
  out.push(S(k.cylinder(SX + 46, 0, 2.6, z1, 3.4, P, 20, 0.3), { tone: "hi" }));
  return out.join("");
}

// a steel rule and a pencil-thin scriber beside it, so the instrument sits in a workplace
function rule() {
  const R = { x: -40, y: 44, w: 200, d: 12, r: 0.8 };
  const out = [S(k.slabOf(R, ZP, 1.2, P, 2, 0.3), { tone: "mid" })];
  const t = k.topTicks(R.x + 4, R.x + R.w - 4, 2, 5, R.y + 0.2, ZP + 1.2, [1.8, 3.6], P, "x");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  return out.join("");
}

const body = [plinth(), rule(), fixedJaw(), block(), beam(), slideJaw(), slider()].join("");

const svg = a.assetSvg({
  width: W,
  height: H,
  label: "Ilustración isométrica: un calibre digital sobre una peana de laboratorio midiendo una pieza mecanizada naranja; la pantalla marca 60.00 milímetros.",
  body,
  paper: PAPER,
  accents: { brand: "#ff5a36", ebony: "#070807" },
  weight: 0.7,
  id: "cota-caliper",
});
mkdirSync(join(ROOT, "public/art"), { recursive: true });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(ROOT, "public/art/caliper.svg"), svg);
writeFileSync(join(HERE, "out/caliper.html"), a.previewHtml({ title: "cota-caliper", svg, paper: PAPER, width: W }));
console.log(`wrote public/art/caliper.svg (${(svg.length / 1024).toFixed(0)} KB)`);
