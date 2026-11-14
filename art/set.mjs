// COTA · illustration set: one spot per service and one tile per project.
// Every piece stands on the same machined lab plinth, with one camera, one world scale, one
// part vocabulary and one accent family, so the set reads as a family with the hero.
//
// Built with the Anatomy Asset kit (.claude/skills/anatomy-asset).
//   node art/set.mjs     → public/art/services/*.svg, public/art/projects/*.svg, art/out/*.html

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.claude/skills/anatomy-asset/kit/iso-kit.mjs";
import * as a from "../.claude/skills/anatomy-asset/kit/asset.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PAPER = "#0c0d0c";
const BRAND = "#ff5a36";
const AZ = 52;
const SCREW = 0.6;

// ---------- a drawing context bound to one projection ----------
function ctx(P) {
  const at = (p) => k.iso(p, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (pts, style) => k.dotsSvg(pts, style);
  const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
  const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
  const screws = (pts, z, r = 1.6) =>
    L(pts.map(([x, y]) => k.ring(x, y, r, z, P, 14)).join(""), { tone: "lo" }) + D(pts.map(([x, y]) => at([x, y, z])), { size: SCREW });
  const brand = (svg) => `<g class="ac-brand">${svg}</g>`;
  const led = (svg) => `<g class="ac-led">${svg}</g>`;
  const ebony = (svg) => `<g class="ac-ebony">${svg}</g>`;
  const box = (plan, z, h, { tone = "mid", bevel = 0.6, steps = 3, seam = null, lit = false } = {}) =>
    S(k.slabOf(plan, z, h, P, steps, bevel), { tone, lit, inner: seam === null ? undefined : L(k.sideSeam(plan, seam, P, steps), { tone: "faint" }) });
  const groove = (plan, z, inset = 3, steps = 3) => L(k.planOutline(k.insetPlan(plan, inset), z, P, steps), { tone: "faint" });
  const rules = (x, y, z, lens, gap = 3.2, tone = "lo") =>
    L(lens.map((len, i) => k.lineOnTop([x, y + i * gap], [x + len, y + i * gap], z, P)).join(""), { tone, free: true });
  const blink = (p, opts) => a.amBlink(led(D([at(p)], { size: 1.2, tone: "lit" })), opts);
  // The lab plinth every piece stands on: a machined plate on four feet, a groove, screws and a ruler.
  const plinth = (plan, { feet = true } = {}) => {
    const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, -8), -5, 3, P)}"/>`];
    if (feet) for (const [x, y] of byDepth(k.corners(plan, 16))) out.push(ebony(S(k.cylinder(x, y, 6, -5, 5, P, 28, 0.3), { tone: "lo" })));
    out.push(S(k.slabOf(plan, 0, 8, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(plan, 3, P, 6), { tone: "faint" }) }));
    out.push(groove(plan, 8, 5, 6));
    out.push(screws(k.corners(plan, 10), 8, 1.8));
    const strip = { x: plan.x + 22, y: plan.y + plan.d - 9, w: plan.w - 44, d: 4, r: 0.8 };
    out.push(S(k.slabOf(strip, 8, 0.5, P, 2), { tone: "lo", crease: "none" }));
    const t = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 5, 5, strip.y + 0.2, 8.5, [1.2, 2.4], P, "x");
    out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
    return out.join("");
  };
  return { P, at, S, L, D, depth, byDepth, screws, brand, led, ebony, box, groove, rules, blink, plinth };
}

function write(dir, name, { width, height, label, body }) {
  const svg = a.assetSvg({
    width,
    height,
    label,
    body,
    paper: PAPER,
    accents: { brand: BRAND, led: { hex: BRAND, mode: "ink" }, ebony: "#070807" },
    weight: width > 600 ? 0.75 : 0.6,
    id: `cota-${name}`,
  });
  mkdirSync(join(ROOT, "public/art", dir), { recursive: true });
  mkdirSync(join(HERE, "out"), { recursive: true });
  writeFileSync(join(ROOT, "public/art", dir, `${name}.svg`), svg);
  writeFileSync(join(HERE, "out", `${name}.html`), a.previewHtml({ title: name, svg, paper: PAPER, width }));
  console.log(`${dir}/${name}.svg ${(svg.length / 1024).toFixed(0)} KB`);
}

// ================================================================================================
// SERVICE SPOTS · 480 × 400, one shared projection
// ================================================================================================
const SW = 480;
const SH = 400;
const PLINTH = { x: -110, y: -90, w: 220, d: 180, r: 8 };
const SP = a.fitInto([...k.boxCorners(PLINTH, -5, 110)], { x: 20, y: 20, w: SW - 40, h: SH - 40 }, { pad: 8, azimuth: AZ });

// 01 · Software: a phone with its app on screen and a holder of component cards, one lifted.
function software(c) {
  const { P, at, S, L, D, byDepth, box, brand, ebony, rules, blink } = c;
  const out = [c.plinth(PLINTH)];
  // the card holder at the back: a slotted block and five cards standing in it
  const HOLD = { x: -84, y: -74, w: 116, d: 26, r: 3 };
  out.push(box(HOLD, 8, 12, { seam: 13 }));
  const cards = Array.from({ length: 5 }, (_, i) => ({ i, x: HOLD.x + 10 + i * 21 }));
  for (const cd of byDepth(cards, (cd) => [cd.x, HOLD.y + 13])) {
    const plan = { x: cd.x, y: HOLD.y + 4, w: 4, d: 18, r: 0.6 };
    const h = [44, 52, 38, 58, 46][cd.i];
    if (cd.i === 3) {
      const lifted = brand(S(k.slabOf(plan, 20 + 14, h, P, 2, 0.4), { tone: "hi", lit: true }));
      const halo = `<path class="iso-halo" d="${k.haloOf(plan, 20, 0.1, P)}" style="filter:blur(4px)"/>`;
      out.push(L(k.planOutline(plan, 20, P, 2), { tone: "lo" }));
      out.push(a.amFloat(lifted, P, { rise: 5, period: 5400, halo }));
    } else out.push(S(k.slabOf(plan, 20, h, P, 2, 0.4), { tone: cd.i === 1 ? "hi" : "mid" }));
  }
  // the phone lying on a charging pad
  const PAD = { x: -40, y: -26, w: 74, d: 100, r: 10 };
  out.push(box(PAD, 8, 3, { tone: "lo", bevel: 0.4, steps: 6 }));
  const PH = { x: -30, y: -18, w: 54, d: 86, r: 8 };
  out.push(box(PH, 11, 6, { tone: "mid", steps: 6, seam: 14 }));
  const SCR = k.insetPlan(PH, 3);
  out.push(ebony(S(k.slabOf(SCR, 17, 0.4, P, 6), { tone: "lo", crease: "none", flat: true })));
  const z = 17.4;
  out.push(L(k.planOutline(SCR, z, P, 6), { tone: "lo" }));
  // the app: a header, three list rows with an avatar each, and a call to action
  out.push(rules(SCR.x + 6, SCR.y + 8, z, [22, 12], 3.4, "mid"));
  for (let i = 0; i < 3; i++) {
    const y = SCR.y + 22 + i * 14;
    out.push(L(k.ring(SCR.x + 9, y + 2, 3, z, P, 16), { tone: "mid" }));
    out.push(rules(SCR.x + 16, y, z, [24, 14], 3.4));
  }
  const CTA = { x: SCR.x + 6, y: SCR.y + SCR.d - 16, w: SCR.w - 12, d: 9, r: 4 };
  out.push(c.led(L(k.planOutline(CTA, z, P, 6), { tone: "lit" })));
  out.push(D([at([PH.x + PH.w / 2, PH.y + 2, 17])], { size: 0.7, tone: "lo" }));
  // a status LED on the pad
  out.push(blink([PAD.x + PAD.w - 6, PAD.y + PAD.d - 5, 11], { period: 3000 }));
  // a small module with a dial at the right: the backend the app talks to
  const MODB = { x: 50, y: -10, w: 46, d: 50, r: 4 };
  out.push(box(MODB, 8, 22, { seam: 14 }));
  out.push(c.groove(MODB, 30, 3, 3));
  out.push(D(k.dotGrid(MODB.x + 8, MODB.y + 8, 7, 3, 4.6, 30, P), { size: 0.5, tone: "lo" }));
  out.push(S(k.cylinder(MODB.x + 23, MODB.y + 34, 7, 30, 4, P, 32, 0.4), { tone: "hi", inner: L(k.knurl(MODB.x + 23, MODB.y + 34, 7, 30.2, 33.6, 24, P), { tone: "lo" }) }));
  out.push(L(k.lineOnTop([MODB.x + 23, MODB.y + 34], [MODB.x + 27, MODB.y + 30], 34, P), { tone: "hi", free: "end" }));
  out.push(D([at([MODB.x + 23, MODB.y + 34, 34])], { size: 0.5, tone: "hi" }));
  return out.join("");
}

// 02 · AI: a document station. An in-tray of sheets, a processor with a feed slot and a status
// ring, a sheet floating into the slot, and the structured result in the out-tray.
function ai(c) {
  const { P, at, S, L, D, byDepth, box, brand, rules } = c;
  const out = [c.plinth(PLINTH)];
  const tray = (plan, sheets, top) => {
    const o = [box(plan, 8, 2, { tone: "lo", bevel: 0.3 })];
    const walls = [
      { x: plan.x, y: plan.y, w: plan.w, d: 3, r: 0.6 },
      { x: plan.x, y: plan.y, w: 3, d: plan.d, r: 0.6 },
      { x: plan.x + plan.w - 3, y: plan.y, w: 3, d: plan.d, r: 0.6 },
    ];
    for (const w of walls) o.push(S(k.slabOf(w, 10, 8, P, 2), { tone: "mid" }));
    for (let i = 0; i < sheets; i++) {
      const s = { x: plan.x + 6 + i * 1.2, y: plan.y + 6 - i * 1.4, w: plan.w - 12, d: plan.d - 10, r: 0.6 };
      o.push(S(k.slabOf(s, 10 + i * 1.6, 1.2, P, 2), { tone: "hi", crease: "none" }));
      if (i === sheets - 1) o.push(top(s, 10 + i * 1.6 + 1.2));
    }
    o.push(S(k.slabOf({ x: plan.x, y: plan.y + plan.d - 3, w: plan.w, d: 3, r: 0.6 }, 10, 8, P, 2), { tone: "mid" }));
    return o.join("");
  };
  // in-tray, back left
  out.push(tray({ x: -96, y: -76, w: 62, d: 74, r: 2 }, 4, (s, z) => rules(s.x + 6, s.y + 8, z, [34, 40, 28, 38, 22, 36, 30], 5)));
  // processor, back right
  const PROC = { x: -6, y: -80, w: 96, d: 84, r: 6 };
  out.push(box(PROC, 8, 46, { seam: 16, bevel: 1 }));
  const zt = 54;
  out.push(c.groove(PROC, zt, 3.5, 6));
  out.push(c.screws(k.corners(PROC, 8), zt));
  const SLOT = { x: PROC.x + 14, y: PROC.y + 18, w: 52, d: 6, r: 1.5 };
  out.push(S(k.slabOf(SLOT, zt - 0.4, 0.4, P, 3), { tone: "lo", crease: "none", flat: true }));
  out.push(L(k.planOutline(SLOT, zt, P, 3), { tone: "lo" }));
  out.push(D(k.dotGrid(PROC.x + 14, PROC.y + 40, 9, 5, 5.4, zt, P), { size: 0.5, tone: "lo" }));
  // the status ring: a bezel and an orange arc that breathes
  const RX = PROC.x + 76;
  const RY = PROC.y + 56;
  out.push(S(k.cylinder(RX, RY, 9, zt, 2, P, 40, 0.4), { tone: "lo" }));
  out.push(L(k.ring(RX, RY, 6, zt + 2, P, 40), { tone: "mid" }));
  const arc = [];
  for (let t = -Math.PI / 2; t <= Math.PI * 0.9; t += 0.1) arc.push([RX + Math.cos(t) * 6, RY + Math.sin(t) * 6]);
  out.push(a.amPulse(c.led(L(k.onTop(arc, zt + 2, P), { tone: "lit", free: true })), { period: 2800, min: 0.35 }));
  // the sheet entering the slot, floating above it
  const SHEET = { x: SLOT.x + 2, y: SLOT.y + 1.5, w: SLOT.w - 4, d: 2, r: 0.4 };
  out.push(a.amFloat(S(k.slabOf(SHEET, zt + 6, 40, P, 2), { tone: "hi", lit: true }), P, { rise: 5, period: 4800 }));
  // out-tray, front: the structured result with its fields, one highlighted
  out.push(
    tray({ x: -60, y: 18, w: 96, d: 58, r: 2 }, 2, (s, z) => {
      const o = [];
      for (let i = 0; i < 5; i++) {
        const y = s.y + 8 + i * 8;
        o.push(L(k.lineOnTop([s.x + 6, y], [s.x + 26, y], z, P), { tone: "mid", free: true }));
        const f = { x: s.x + 32, y: y - 2.6, w: s.w - 40, d: 5.4, r: 1 };
        o.push(i === 2 ? c.led(L(k.planOutline(f, z, P, 2), { tone: "lit" })) : L(k.planOutline(f, z, P, 2), { tone: "lo" }));
      }
      return o.join("");
    }),
  );
  out.push(brand(S(k.slabOf({ x: 50, y: 50, w: 18, d: 18, r: 3 }, 8, 6, P, 3, 0.5), { tone: "hi" })));
  out.push(D([at([59, 59, 14])], { size: 0.7, tone: "hi" }));
  return out.join("");
}

// 03 · IoT: a weatherproof sensor node. Enclosure with lid seam and screws, a cable gland, a
// probe on a post, a readout window, an antenna with an orange tip and a status LED.
function iot(c) {
  const { P, at, S, L, D, box, brand, blink } = c;
  const out = [c.plinth(PLINTH)];
  // mounting bracket
  const BR = { x: -70, y: -56, w: 120, d: 96, r: 4 };
  out.push(box(BR, 8, 4, { tone: "lo", bevel: 0.4 }));
  out.push(c.screws(k.corners(BR, 7), 12, 1.6));
  // the enclosure and its lid
  const BOX = { x: -56, y: -44, w: 92, d: 72, r: 7 };
  out.push(box(BOX, 12, 34, { seam: 36, steps: 6, bevel: 0.6 }));
  const LID = k.insetPlan(BOX, -1.4);
  out.push(box(LID, 46, 6, { tone: "hi", steps: 6, bevel: 1 }));
  out.push(c.screws(k.corners(LID, 7), 52, 1.6));
  // the readout window with its segments
  const WIN = { x: BOX.x + 14, y: BOX.y + 14, w: 40, d: 22, r: 2 };
  out.push(c.ebony(S(k.slabOf(WIN, 52, 0.4, P, 3), { tone: "lo", crease: "none", flat: true })));
  out.push(L(k.planOutline(WIN, 52.4, P, 3), { tone: "lo" }));
  for (let i = 0; i < 4; i++) {
    const x = WIN.x + 6 + i * 8;
    out.push(c.led(L(k.onTop([[x, WIN.y + 6], [x + 5, WIN.y + 6], [x + 5, WIN.y + 16], [x, WIN.y + 16]], 52.4, P), { tone: "lit", free: true })));
  }
  out.push(blink([LID.x + LID.w - 10, LID.y + LID.d - 10, 52], { period: 2400 }));
  // the cable gland on the lid
  out.push(S(k.cylinder(LID.x + 72, LID.y + 18, 6, 52, 4, P, 24, 0.4), { tone: "mid" }));
  out.push(S(k.cylinder(LID.x + 72, LID.y + 18, 4, 56, 5, P, 24, 0.4), { tone: "hi", inner: L(k.knurl(LID.x + 72, LID.y + 18, 4, 57, 60, 16, P) + k.sideArc(LID.x + 72, LID.y + 18, 4, 57, P, 20) + k.sideArc(LID.x + 72, LID.y + 18, 4, 60, P, 20), { tone: "lo" }) }));
  // the antenna
  const AX = LID.x + 74;
  const AY = LID.y + 52;
  out.push(S(k.cylinder(AX, AY, 3.4, 52, 3, P, 20, 0.3), { tone: "lo" }));
  out.push(S(k.cylinder(AX, AY, 1.4, 55, 44, P, 16), { tone: "mid", crease: "none", inner: L(k.sideArc(AX, AY, 1.4, 70, P, 10), { tone: "faint" }) }));
  out.push(brand(S(k.cylinder(AX, AY, 2.8, 99, 4, P, 20, 0.3), { tone: "hi", lit: true })));
  // the probe on its post, standing on the plinth at the front right
  const PX = 70;
  const PY = 50;
  out.push(S(k.cylinder(PX, PY, 10, 8, 3, P, 40, 0.4), { tone: "lo" }));
  out.push(S(k.cylinder(PX, PY, 2.6, 11, 30, P, 20), { tone: "mid", crease: "none", inner: L(k.sideArc(PX, PY, 2.6, 26, P, 12), { tone: "faint" }) }));
  out.push(S(k.cylinder(PX, PY, 6, 41, 10, P, 32, 0.5), { tone: "hi", inner: L(k.knurl(PX, PY, 6, 43, 49, 22, P) + k.sideArc(PX, PY, 6, 43, P, 28) + k.sideArc(PX, PY, 6, 49, P, 28), { tone: "lo" }) }));
  out.push(D(k.dotGrid(PX - 3, PY - 3, 3, 3, 3, 51, P), { size: 0.45, tone: "lo" }));
  out.push(c.screws([[PX - 6, PY + 6], [PX + 6, PY - 6]], 11, 1.2));
  return out.join("");
}

// 04 · Architecture: a service rack with four blades (one pulled out in orange) and a database
// of platters on a spindle, joined by a bus bar.
function architecture(c) {
  const { P, at, S, L, D, byDepth, box, brand } = c;
  const out = [c.plinth(PLINTH)];
  const RACK = { x: -92, y: -70, w: 104, d: 92, r: 3 };
  const postL = { x: RACK.x, y: RACK.y, w: 8, d: RACK.d, r: 2 };
  const postR = { x: RACK.x + RACK.w - 8, y: RACK.y, w: 8, d: RACK.d, r: 2 };
  out.push(S(k.slabOf({ x: RACK.x + 8, y: RACK.y, w: RACK.w - 16, d: 5, r: 1 }, 8, 84, P, 2), { tone: "lo" }));
  out.push(box(postL, 8, 84, { seam: 14, steps: 2 }));
  for (let i = 0; i < 4; i++) {
    const z = 12 + i * 19;
    const plan = { x: RACK.x + 9, y: RACK.y + 5, w: RACK.w - 18, d: RACK.d - 5, r: 2 };
    const front = plan.y + plan.d;
    const blade = [
      S(k.slabOf(plan, z, 15, P, 2, 0.5), { tone: i === 2 ? "hi" : "mid", lit: i === 2 }),
      ...[0, 1, 2, 3, 4, 5].map((j) => (i === 2 ? "" : D([at([plan.x + 10 + j * 5, front, z + 7.5])], { size: 0.8, tone: j < 3 - (i % 2) ? "hi" : "lo" }))),
      S(k.slabOf({ x: plan.x + plan.w - 22, y: front, w: 14, d: 3, r: 0.8 }, z + 5, 5, P, 2), { tone: "hi" }),
    ].join("");
    out.push(i === 2 ? a.amSlide(brand(blade), [0, 16, 0], P, { period: 7000, delay: 1500 }) : blade);
  }
  out.push(box({ ...RACK }, 92, 4, { tone: "mid" }));
  out.push(D(k.dotGrid(RACK.x + 14, RACK.y + 12, 13, 12, 6, 96, P), { size: 0.45, tone: "lo" }));
  out.push(box(postR, 8, 84, { seam: 14, steps: 2 }));
  // the bus bar to the database
  const BUS = { x: 12, y: -6, w: 52, d: 10, r: 2 };
  out.push(box(BUS, 8, 5, { tone: "lo", bevel: 0.3 }));
  out.push(D([0, 1, 2, 3, 4, 5, 6].map((i) => at([BUS.x + 6 + i * 6.6, BUS.y + 5, 13])), { size: 0.7, tone: "hi" }));
  // the database: platters on a spindle, top one in orange
  const DX = 66;
  const DY = 2;
  out.push(S(k.cylinder(DX, DY, 30, 8, 4, P, 64, 0.5), { tone: "lo" }));
  for (let i = 0; i < 4; i++) {
    const z = 12 + i * 14;
    const svg = S(k.cylinder(DX, DY, 26, z, 11, P, 64, 0.6), { tone: i === 3 ? "hi" : "mid", inner: L(k.sideArc(DX, DY, 26, z + 5.5, P, 48), { tone: "faint" }) });
    out.push(svg);
  }
  out.push(L(k.ring(DX, DY, 18, 67, P, 48), { tone: "faint" }));
  out.push(brand(S(k.cylinder(DX, DY, 6, 67, 4, P, 32, 0.4), { tone: "hi" })));
  out.push(D([at([DX, DY, 71])], { size: 0.7, tone: "hi" }));
  return out.join("");
}

// 05 · Automation: a conveyor carrying parcels out of a feed cabinet, under a scanner gate and
// into an output cabinet. The row of parcels runs endlessly.
function conveyor(c, { x0 = -100, x1 = 100, pitch = 30, period = 3000, gateAt = 6, envelopes = false } = {}) {
  const { P, at, S, L, D, byDepth, box, brand, blink } = c;
  const out = [];
  const BZ = 26;
  const belt = { x: x0, y: -22, w: x1 - x0, d: 44, r: 4 };
  // legs, then the frame and the belt surface on it
  for (const [lx, ly] of byDepth([[x0 + 26, belt.y + 5], [x0 + 26, belt.y + belt.d - 5], [x1 - 26, belt.y + 5], [x1 - 26, belt.y + belt.d - 5]]))
    out.push(S(k.slabOf({ x: lx - 3, y: ly - 3, w: 6, d: 6, r: 1 }, 8, BZ - 8, P, 2, 0.3), { tone: "lo" }));
  out.push(box(belt, BZ - 8, 6, { tone: "mid", seam: BZ - 5, bevel: 0.5 }));
  const SURF = { x: x0 + 2, y: belt.y + 4, w: belt.w - 4, d: belt.d - 8, r: 2 };
  out.push(c.ebony(S(k.slabOf(SURF, BZ - 2, 2, P, 3, 0.3), { tone: "mid" })));
  // side guide rails standing on the frame
  const RAIL_N = { x: x0, y: belt.y, w: belt.w, d: 3, r: 1 };
  out.push(S(k.slabOf(RAIL_N, BZ - 2, 6, P, 2, 0.3), { tone: "hi" }));
  // the feed hopper at the far end: a low cabinet with a mouth facing the belt
  const FEED = { x: x0 - 6, y: belt.y - 4, w: 30, d: belt.d + 8, r: 3 };
  out.push(box(FEED, 8, 40, { seam: 18 }));
  out.push(c.groove(FEED, 48, 3, 3));
  out.push(c.screws(k.corners(FEED, 6), 48, 1.2));
  const start = FEED.x + FEED.w;
  // belt lacing marks, running at belt speed
  const marks = [];
  for (let x = start + 4; x < x1 - 34; x += 10) marks.push(k.lineOnTop([x, SURF.y + 2], [x, SURF.y + SURF.d - 2], BZ, P));
  out.push(a.amLoop(L(marks.join(""), { tone: "lo", free: true }), [10, 0, 0], P, { period: period / 3 }));
  // the parcels, one pitch apart, sliding one pitch and jumping back: an endless line
  const slots = [];
  for (let x = start + 2; x < x1 - 34; x += pitch) slots.push(x);
  const parcels = [];
  for (const [i, x] of slots.entries()) {
    const plan = envelopes ? { x: x + 2, y: belt.y + 9, w: 24, d: 26, r: 1 } : { x: x + 2, y: belt.y + 10, w: 20, d: 24, r: 1.4 };
    const h = envelopes ? 3 : 16;
    const hot = i === Math.floor(slots.length / 2);
    let svg = S(k.slabOf(plan, BZ, h, P, 2, 0.5), { tone: "hi", lit: hot });
    if (envelopes) svg += L(k.onTop([[plan.x + 1.5, plan.y + 1.5], [plan.x + plan.w / 2, plan.y + plan.d / 2], [plan.x + plan.w - 1.5, plan.y + 1.5]], BZ + h, P), { tone: "lo", free: true });
    else svg += L(k.lineOnTop([plan.x, plan.y + plan.d / 2], [plan.x + plan.w, plan.y + plan.d / 2], BZ + h, P), { tone: "lo" });
    parcels.push(hot ? brand(svg) : svg);
  }
  out.push(a.amLoop(parcels.join(""), [pitch, 0, 0], P, { period }));
  // the near guide rail, in front of the parcels
  const RAIL_S = { x: x0, y: belt.y + belt.d - 3, w: belt.w, d: 3, r: 1 };
  out.push(S(k.slabOf(RAIL_S, BZ - 2, 6, P, 2, 0.3), { tone: "hi" }));
  // the scanner gate: two posts and a beam with an orange scan LED
  const gx = gateAt;
  out.push(box({ x: gx - 3, y: belt.y - 7, w: 6, d: 5, r: 1 }, BZ - 2, 36, { tone: "mid", steps: 2, bevel: 0.3 }));
  out.push(box({ x: gx - 3, y: belt.y + belt.d + 2, w: 6, d: 5, r: 1 }, BZ - 2, 36, { tone: "mid", steps: 2, bevel: 0.3 }));
  out.push(box({ x: gx - 6, y: belt.y - 8, w: 12, d: belt.d + 16, r: 2 }, BZ + 34, 7, { tone: "hi", bevel: 0.4 }));
  out.push(blink([gx, belt.y + belt.d / 2, BZ + 41], { period: period / 2 }));
  // the output station at the near end: a cabinet with a lit readout
  const OUT = { x: x1 - 34, y: belt.y - 8, w: 40, d: belt.d + 16, r: 3 };
  out.push(box(OUT, 8, 46, { seam: 20 }));
  out.push(c.groove(OUT, 54, 3, 3));
  out.push(c.screws(k.corners(OUT, 6), 54, 1.2));
  out.push(S(k.slabOf({ x: OUT.x + 9, y: OUT.y + 12, w: 22, d: 14, r: 1 }, 54, 0.4, P, 2), { tone: "lo", crease: "none", flat: true }));
  out.push(c.led(L(k.lineOnTop([OUT.x + 12, OUT.y + 19], [OUT.x + 27, OUT.y + 19], 54.4, P), { tone: "lit", free: true })));
  return out.join("");
}
function automation(c) {
  return c.plinth(PLINTH) + conveyor(c);
}

// 06 · Product: a prototype on a cutting mat. An open enclosure with its board inside, the lid
// lifted in orange, a battery and loose screws.
function product(c) {
  const { P, at, S, L, D, byDepth, box, brand } = c;
  const out = [c.plinth(PLINTH)];
  const MAT = { x: -92, y: -72, w: 184, d: 132, r: 4 };
  out.push(c.ebony(S(k.slabOf(MAT, 8, 1.4, P, 3, 0.3), { tone: "mid" })));
  const g = [];
  for (let x = MAT.x + 12; x < MAT.x + MAT.w; x += 12) g.push(k.lineOnTop([x, MAT.y + 4], [x, MAT.y + MAT.d - 4], 9.4, P));
  for (let y = MAT.y + 12; y < MAT.y + MAT.d; y += 12) g.push(k.lineOnTop([MAT.x + 4, y], [MAT.x + MAT.w - 4, y], 9.4, P));
  out.push(L(g.join(""), { tone: "faint", free: true }));
  const Z = 9.4;
  // the open enclosure: a floor and four walls, the board inside
  const ENC = { x: -66, y: -50, w: 88, d: 72, r: 6 };
  out.push(box(ENC, Z, 3, { tone: "mid", steps: 6 }));
  const T = 3;
  const walls = [
    { x: ENC.x, y: ENC.y, w: ENC.w, d: T, r: 1 },
    { x: ENC.x, y: ENC.y, w: T, d: ENC.d, r: 1 },
  ];
  for (const w of walls) out.push(S(k.slabOf(w, Z + 3, 20, P, 2), { tone: "mid" }));
  const PCB = { x: ENC.x + 8, y: ENC.y + 8, w: ENC.w - 16, d: ENC.d - 16, r: 2 };
  out.push(c.ebony(S(k.slabOf(PCB, Z + 6, 1.6, P, 2, 0.3), { tone: "mid" })));
  const pz = Z + 7.6;
  out.push(L(k.onTop([[PCB.x + 10, PCB.y + 30], [PCB.x + 30, PCB.y + 30], [PCB.x + 36, PCB.y + 24], [PCB.x + 54, PCB.y + 24]], pz, P), { tone: "lo" }));
  out.push(D([at([PCB.x + 10, PCB.y + 30, pz]), at([PCB.x + 54, PCB.y + 24, pz])], { size: 0.7, tone: "mid" }));
  out.push(c.ebony(S(k.slabOf({ x: PCB.x + 20, y: PCB.y + 8, w: 20, d: 14, r: 1 }, pz, 2.6, P, 2, 0.3), { tone: "hi" })));
  out.push(S(k.cylinder(PCB.x + 50, PCB.y + 40, 5, pz, 4, P, 24, 0.3), { tone: "hi" }));
  out.push(c.blink([PCB.x + 8, PCB.y + 44, pz], { period: 2600 }));
  for (const w of [{ x: ENC.x + ENC.w - T, y: ENC.y, w: T, d: ENC.d, r: 1 }, { x: ENC.x, y: ENC.y + ENC.d - T, w: ENC.w, d: T, r: 1 }])
    out.push(S(k.slabOf(w, Z + 3, 20, P, 2), { tone: "mid" }));
  out.push(c.screws(k.corners(k.insetPlan(ENC, 0), 5), Z + 23, 1.2));
  // the lid, lifted in orange, with its button holes
  const LID = ENC;
  const lz = Z + 23 + 34;
  const lid = brand(
    [
      S(k.slabOf(LID, lz, 4, P, 6, 0.8), { tone: "hi", lit: true }),
      L(k.ring(LID.x + 64, LID.y + 22, 5, lz + 4, P, 24), { tone: "lo" }),
      L(k.ring(LID.x + 64, LID.y + 40, 3.5, lz + 4, P, 20), { tone: "lo" }),
      D(k.corners(LID, 5).map(([x, y]) => at([x, y, lz + 4])), { size: SCREW, tone: "lo" }),
    ].join(""),
  );
  const halo = `<path class="iso-halo" d="${k.haloOf(LID, Z + 23, 0.1, P)}" style="filter:blur(6px)"/>`;
  out.push(a.amFloat(lid, P, { rise: 6, period: 6000, halo }));
  // a battery pack and two loose screws
  const BAT = { x: 40, y: 10, w: 40, d: 22, r: 3 };
  out.push(box(BAT, Z, 12, { tone: "hi", seam: Z + 4 }));
  out.push(c.ebony(S(k.slabOf({ x: BAT.x + BAT.w - 2, y: BAT.y + 7, w: 4, d: 8, r: 1 }, Z + 3, 6, P, 2), { tone: "mid" })));
  for (const [sx, sy] of byDepth([[50, -30], [64, -38]])) {
    out.push(S(k.cylinder(sx, sy, 3, Z, 1.6, P, 16, 0.2), { tone: "hi" }));
    out.push(L(k.lineOnTop([sx - 1.8, sy], [sx + 1.8, sy], Z + 1.6, P), { tone: "lo" }));
  }
  return out.join("");
}

const services = [
  ["desarrollo-software", software, "Un teléfono con una app en pantalla sobre su base de carga, un soporte con tarjetas de componentes, una de ellas en naranja flotando, y un pequeño módulo de servidor con un dial."],
  ["inteligencia-artificial", ai, "Una estación de documentos: una bandeja de entrada con hojas, un procesador con ranura y un anillo de estado naranja, una hoja entrando por la ranura y el resultado estructurado en la bandeja de salida."],
  ["iot-sistemas-conectados", iot, "Un nodo sensor estanco: caja con tapa atornillada, ventana con lectura digital, prensaestopas, antena con punta naranja y una sonda sobre su poste."],
  ["arquitectura-software", architecture, "Un rack de servicios con cuatro bandejas, una de ellas en naranja deslizándose hacia fuera, unido por una barra de bus a una base de datos de discos apilados."],
  ["automatizacion", automation, "Una cinta transportadora que saca paquetes de un armario de entrada, los pasa bajo un arco lector y los lleva a un armario de salida; uno de los paquetes es naranja."],
  ["producto-digital", product, "Un prototipo sobre una alfombrilla de corte: una caja abierta con su placa dentro, la tapa naranja flotando encima, una batería y dos tornillos sueltos."],
];
for (const [name, fn, label] of services) {
  write("services", name, { width: SW, height: SH, label: `Ilustración isométrica: ${label}`, body: fn(ctx(SP)) });
}

// ================================================================================================
// PROJECT TILES · 800 × 520, one shared projection
// ================================================================================================
const TW = 800;
const TH = 520;
const TPLINTH = { x: -170, y: -110, w: 340, d: 220, r: 10 };
const TP = a.fitInto([...k.boxCorners(TPLINTH, -5, 150)], { x: 24, y: 24, w: TW - 48, h: TH - 48 }, { pad: 8, azimuth: AZ });

// Cold-room telemetry: an insulated cold room with its door, panel seams, a condensing unit with
// a fan on the roof, an alarm beacon, a wall sensor with its LED, a readout by the door and a
// gateway with an antenna on the plinth.
function coldroom(c) {
  const { P, at, S, L, D, box, brand, blink } = c;
  const out = [c.plinth(TPLINTH)];
  const ROOM = { x: -140, y: -90, w: 200, d: 150, r: 4 };
  const RH = 100;
  const seams = [30, 60, 90].map((z) => L(k.sideSeam(ROOM, 8 + z, P, 3), { tone: "faint" })).join("");
  out.push(S(k.slabOf(ROOM, 8, RH, P, 3, 1), { tone: "mid", inner: seams }));
  const RT = 8 + RH;
  out.push(c.groove(ROOM, RT, 4, 3));
  // vertical panel joints on the front (+y) face, drawn as rises
  out.push(L([40, 80, 120, 160].map((dx) => k.rise([ROOM.x + dx, ROOM.y + ROOM.d, 0], 8, RT, P)).join(""), { tone: "faint" }));
  // the door on the front face: a leaf standing proud, hinges, a handle, a gasket line
  const DOOR = { x: ROOM.x + 96, y: ROOM.y + ROOM.d, w: 52, d: 3, r: 1 };
  out.push(S(k.slabOf(DOOR, 10, 84, P, 2, 0.4), { tone: "hi" }));
  out.push(S(k.slabOf({ x: DOOR.x + 40, y: DOOR.y + 3, w: 6, d: 4, r: 1 }, 46, 18, P, 2, 0.3), { tone: "mid" }));
  for (const z of [22, 76]) out.push(S(k.slabOf({ x: DOOR.x - 3, y: DOOR.y, w: 4, d: 4, r: 1 }, z, 8, P, 2), { tone: "lo" }));
  // the readout panel beside the door
  const PANEL = { x: ROOM.x + 154, y: ROOM.y + ROOM.d, w: 32, d: 3, r: 1 };
  out.push(S(k.slabOf(PANEL, 58, 24, P, 2, 0.3), { tone: "lo" }));
  out.push(
    `<g class="ac-led">${k.faceTextSvg(k.sideMatrix([PANEL.x + 16, PANEL.y + 3, 70], 70, P, "left"), "-18.4°", { size: 7, tone: "lit", anchor: "middle" })}</g>`,
  );
  // the wall sensor on the side (+x) face
  const SEN = { x: ROOM.x + ROOM.w, y: ROOM.y + 40, w: 4, d: 18, r: 1 };
  out.push(S(k.slabOf(SEN, 64, 22, P, 2, 0.3), { tone: "hi" }));
  out.push(blink([SEN.x + 4, SEN.y + 9, 80], { period: 2200 }));
  // roof: the condensing unit with its fan, and the alarm beacon
  const CU = { x: ROOM.x + 20, y: ROOM.y + 20, w: 96, d: 80, r: 4 };
  out.push(box(CU, RT, 24, { seam: RT + 8, bevel: 0.8 }));
  const ct = RT + 24;
  out.push(c.groove(CU, ct, 3, 3));
  const FX = CU.x + 48;
  const FY = CU.y + 40;
  out.push(S(k.cylinder(FX, FY, 31, ct, 2, P, 64, 0.4), { tone: "lo" }));
  out.push(a.amRotor([FX, FY, ct + 1.2], [1, 0, 0], [0, 1, 0], P, { count: 5, r0: 6, r1: 26, chord: 10, tip: 4, sweep: 0.4, period: 1100, thickness: 0.8, clip: 28 }));
  out.push(S(k.cylinder(FX, FY, 6, ct + 1.2, 3, P, 24, 0.3), { tone: "hi" }));
  out.push(c.screws(k.corners(CU, 6), ct, 1.4));
  const BX = ROOM.x + 170;
  const BY = ROOM.y + 120;
  out.push(S(k.cylinder(BX, BY, 7, RT, 3, P, 28, 0.3), { tone: "lo" }));
  out.push(a.amPulse(brand(S(k.cylinder(BX, BY, 5, RT + 3, 10, P, 28, 0.6), { tone: "hi", lit: true })), { period: 1800, min: 0.55 }));
  // the gateway on the plinth, with its antenna
  const GW = { x: 92, y: 30, w: 48, d: 40, r: 4 };
  out.push(box(GW, 8, 22, { seam: 16 }));
  out.push(c.groove(GW, 30, 3, 3));
  out.push(D(k.dotGrid(GW.x + 8, GW.y + 8, 7, 3, 4.6, 30, P), { size: 0.5, tone: "lo" }));
  out.push(blink([GW.x + 40, GW.y + 32, 30], { period: 2600, delay: 900 }));
  out.push(S(k.cylinder(GW.x + 38, GW.y + 10, 2.6, 30, 2, P, 16), { tone: "lo" }));
  out.push(S(k.cylinder(GW.x + 38, GW.y + 10, 1.2, 32, 34, P, 14), { tone: "mid", crease: "none" }));
  out.push(brand(S(k.cylinder(GW.x + 38, GW.y + 10, 2.4, 66, 3, P, 16, 0.3), { tone: "hi" })));
  return out.join("");
}

// Documentation assistant: a filing cabinet with its top drawer open on folders, one folder
// lifted in orange, a stack of manuals, and a lectern terminal showing an answer with citations.
function docs(c) {
  const { P, at, S, L, D, byDepth, box, brand, rules } = c;
  const out = [c.plinth(TPLINTH)];
  const CAB = { x: -150, y: -96, w: 90, d: 96, r: 3 };
  const CH = 120;
  out.push(box(CAB, 8, CH, { tone: "mid", bevel: 0.8 }));
  out.push(c.groove(CAB, 8 + CH, 3, 3));
  const front = CAB.y + CAB.d;
  // three closed drawers below, each a front proud of the case with a pull and a label holder
  for (let i = 0; i < 3; i++) {
    const z = 12 + i * 28;
    const F = { x: CAB.x + 4, y: front, w: CAB.w - 8, d: 2.4, r: 0.8 };
    out.push(S(k.slabOf(F, z, 24, P, 2, 0.3), { tone: "hi" }));
    out.push(S(k.slabOf({ x: F.x + 30, y: front + 2.4, w: 22, d: 3, r: 1 }, z + 8, 4, P, 2), { tone: "mid" }));
    out.push(S(k.slabOf({ x: F.x + 32, y: front + 2.4, w: 18, d: 1, r: 0.3 }, z + 15, 6, P, 2), { tone: "lo" }));
  }
  // the top drawer, open: a tray standing out of the case, folders inside
  const DZ = 96;
  const DR = { x: CAB.x + 6, y: front - 40, w: CAB.w - 12, d: 64, r: 1 };
  out.push(S(k.slabOf(DR, DZ, 2, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf({ x: DR.x, y: DR.y, w: 3, d: DR.d, r: 0.6 }, DZ + 2, 20, P, 2), { tone: "mid" }));
  const folders = Array.from({ length: 7 }, (_, i) => ({ i, y: DR.y + 46 - i * 6 }));
  for (const f of byDepth(folders, (f) => [DR.x + DR.w / 2, f.y])) {
    const plan = { x: DR.x + 6, y: f.y, w: DR.w - 12, d: 1.6, r: 0.3 };
    if (f.i === 3) {
      out.push(L(k.lineOnTop([plan.x, plan.y + 0.8], [plan.x + plan.w, plan.y + 0.8], DZ + 2, P), { tone: "lo" }));
      out.push(a.amFloat(brand(S(k.slabOf(plan, DZ + 26, 26, P, 2, 0.3), { tone: "hi", lit: true })), P, { rise: 6, period: 5600 }));
    } else out.push(S(k.slabOf(plan, DZ + 2, 22 + (f.i % 3) * 2, P, 2, 0.3), { tone: f.i % 2 ? "hi" : "mid" }));
  }
  out.push(S(k.slabOf({ x: DR.x + DR.w - 3, y: DR.y, w: 3, d: DR.d, r: 0.6 }, DZ + 2, 20, P, 2), { tone: "mid" }));
  const DF = { x: CAB.x + 4, y: DR.y + DR.d, w: CAB.w - 8, d: 2.4, r: 0.8 };
  out.push(S(k.slabOf(DF, DZ - 2, 26, P, 2, 0.3), { tone: "hi" }));
  out.push(S(k.slabOf({ x: DF.x + 30, y: DF.y + 2.4, w: 22, d: 3, r: 1 }, DZ + 8, 4, P, 2), { tone: "mid" }));
  // a stack of manuals
  for (let i = 0; i < 4; i++) {
    const m = { x: -40 + (i % 2) * 2, y: -80 - (i % 2) * 2, w: 56, d: 40, r: 1 };
    out.push(S(k.slabOf(m, 8 + i * 7, 6, P, 2, 0.3), { tone: i % 2 ? "mid" : "hi", inner: L(k.sideSeam(m, 8 + i * 7 + 1.2, P, 2), { tone: "faint" }) }));
  }
  // the terminal: a base, a column and a deck with the answer on screen
  const TB = { x: 30, y: -20, w: 110, d: 96, r: 6 };
  out.push(box(TB, 8, 6, { tone: "lo", bevel: 0.4, steps: 6 }));
  out.push(box({ x: 72, y: 14, w: 26, d: 26, r: 3 }, 14, 30, { tone: "mid" }));
  const DECK = { x: 36, y: -12, w: 98, d: 80, r: 6 };
  out.push(box(DECK, 44, 8, { tone: "mid", steps: 6, bevel: 1 }));
  const SCR = k.insetPlan(DECK, 6);
  out.push(c.ebony(S(k.slabOf(SCR, 52, 0.4, P, 6), { tone: "lo", crease: "none", flat: true })));
  const z = 52.4;
  out.push(L(k.planOutline(SCR, z, P, 6), { tone: "lo" }));
  // the question, the answer, and two citation markers in orange
  out.push(rules(SCR.x + 6, SCR.y + 8, z, [44], 3, "hi"));
  out.push(rules(SCR.x + 6, SCR.y + 18, z, [70, 62, 74, 40], 4.4, "mid"));
  for (const [x, y] of [[SCR.x + 50, SCR.y + 31.2], [SCR.x + 66, SCR.y + 18]]) {
    out.push(c.led(L(k.planOutline({ x, y: y - 2.2, w: 8, d: 4.4, r: 1.4 }, z, P, 2), { tone: "lit" })));
  }
  const REF = { x: SCR.x + 6, y: SCR.y + 44, w: SCR.w - 12, d: 14, r: 2 };
  out.push(L(k.planOutline(REF, z, P, 2), { tone: "lo" }));
  out.push(rules(REF.x + 5, REF.y + 5, z, [30, 46], 4, "lo"));
  return out.join("");
}

// Orders from email to ERP: an inbox tray of envelopes feeding a longer line, a scanner gate,
// and the ERP cabinet at the end.
function orders(c) {
  const { P, at, S, L, D, box } = c;
  const out = [c.plinth(TPLINTH)];
  // the ERP cabinet at the back right: a tall rack with blades
  const ERP = { x: 90, y: -96, w: 66, d: 60, r: 3 };
  out.push(box(ERP, 8, 116, { tone: "mid", bevel: 0.8 }));
  for (let i = 0; i < 5; i++) {
    const F = { x: ERP.x + 4, y: ERP.y + ERP.d, w: ERP.w - 8, d: 2, r: 0.6 };
    out.push(S(k.slabOf(F, 14 + i * 21, 17, P, 2, 0.3), { tone: i === 4 ? "hi" : "lo" }));
    out.push(D([0, 1, 2, 3].map((j) => at([F.x + 8 + j * 5, F.y + 2, 14 + i * 21 + 8.5])), { size: 0.8, tone: j0(i) }));
  }
  out.push(c.groove(ERP, 124, 3, 3));
  out.push(D(k.dotGrid(ERP.x + 10, ERP.y + 10, 9, 8, 5.4, 124, P), { size: 0.45, tone: "lo" }));
  // the line itself
  out.push(conveyor(c, { x0: -120, x1: 74, pitch: 34, period: 3400, gateAt: -10, envelopes: true }));
  // the inbox tray beside the feed, with envelopes
  const INB = { x: -150, y: 40, w: 70, d: 50, r: 2 };
  out.push(box(INB, 8, 3, { tone: "lo", bevel: 0.3 }));
  for (let i = 0; i < 4; i++) {
    const e = { x: INB.x + 6 + i * 1.5, y: INB.y + 5 - i, w: INB.w - 14, d: INB.d - 12, r: 0.8 };
    out.push(S(k.slabOf(e, 11 + i * 2, 1.6, P, 2), { tone: "hi", crease: "none" }));
    if (i === 3) out.push(L(k.onTop([[e.x + 1, e.y + 1], [e.x + e.w / 2, e.y + e.d / 2], [e.x + e.w - 1, e.y + 1]], 11 + i * 2 + 1.6, P), { tone: "lo", free: true }));
  }
  return out.join("");
}
function j0(i) {
  return i % 2 ? "hi" : "lo";
}

const projects = [
  ["telemetria-camaras-frigorificas", coldroom, "una cámara frigorífica con su puerta, un panel con la lectura -18,4°, un sensor en la pared, una unidad condensadora con ventilador en el techo, una baliza de alarma naranja y una pasarela con antena."],
  ["asistente-documentacion-interna", docs, "un archivador con el cajón superior abierto y una carpeta naranja flotando, una pila de manuales y un terminal que muestra una respuesta con dos referencias marcadas."],
  ["automatizacion-pedidos-email", orders, "una bandeja de entrada con sobres, una cinta que lleva los pedidos bajo un arco lector y un armario ERP al fondo; un sobre es naranja."],
];
for (const [name, fn, label] of projects) {
  write("projects", name, { width: TW, height: TH, label: `Ilustración isométrica (concepto): ${label}`, body: fn(ctx(TP)) });
}
