// COTA · hero: "el banco COTA".
// A machined test bench on rubber feet carrying the modules of a real system: an AI compute
// module with a spinning fan and a heat sink, a data rack whose trays are drawers, an IoT board
// with a microcontroller, traces, a sensor and an antenna, and an interface module with a
// screen. The subject is the orange module lifted above its empty socket: the part COTA builds.
//
// Built with the Anatomy Asset kit (.claude/skills/anatomy-asset).
//   node art/hero.mjs          → public/art/hero.svg, art/out/hero.html, src/content/hero-hotspots.json

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../.claude/skills/anatomy-asset/kit/iso-kit.mjs";
import * as a from "../.claude/skills/anatomy-asset/kit/asset.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PAPER = "#0c0d0c";
const BRAND = "#ff5a36";

const W = 1000;
const H = 760;
const REGION = { x: 24, y: 24, w: W - 48, h: H - 48 };

// ---------- world ----------
const BASE = { x: -180, y: -124, w: 360, d: 248, r: 10 };
const FOOT_H = 7;
const TOP = 14; // top of the base plate
const LIFT = 22;
const MOD = { x: 128, y: 60, w: 40, d: 40, r: 4 };
const MOD_H = 30;
const MOD_Z = TOP + 3 + LIFT;

const P = a.fitInto(
  [...k.boxCorners(BASE, -FOOT_H, TOP + 64), [MOD.x + MOD.w, MOD.y + MOD.d, MOD_Z + MOD_H + 6], [-28, 102, TOP + 50]],
  REGION,
  { pad: 12, azimuth: 52 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const depth = ([x, y, z = 0]) => k.depthOf([x, y, z], P);
const byDepth = (items, key = (i) => i) => [...items].sort((p, q) => depth(key(p)) - depth(key(q)));
const brand = (svg) => `<g class="ac-brand">${svg}</g>`;
const led = (svg) => `<g class="ac-led">${svg}</g>`;
const ebony = (svg) => `<g class="ac-ebony">${svg}</g>`;
const SCREW = 0.55;

// Hotspots exported for the page (screen coordinates as % of the canvas).
const hotspots = {};
const mark = (id, p) => {
  const [sx, sy] = at(p);
  hotspots[id] = { x: +((sx / W) * 100).toFixed(2), y: +((sy / H) * 100).toFixed(2) };
};

// A screw: a ring on the face and a dot in it.
const screws = (pts, z, r = 1.8) =>
  L(pts.map(([x, y]) => k.ring(x, y, r, z, P, 16)).join(""), { tone: "lo" }) + D(pts.map(([x, y]) => at([x, y, z])), { size: SCREW });

// ---------- base ----------
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(BASE, -10), -FOOT_H, 4, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BASE, 24))) {
    out.push(ebony(S(k.cylinder(x, y, 9, -FOOT_H, 2, P, 32), { tone: "lo" })));
    out.push(S(k.cylinder(x, y, 7, -FOOT_H + 2, FOOT_H - 2, P, 32), { tone: "mid" }));
  }
  const seam = k.sideSeam(BASE, 5, P, 8);
  out.push(S(k.slabOf(BASE, 0, TOP, P, 8, 1.4), { tone: "mid", inner: L(seam, { tone: "faint" }) }));
  // a machined groove running round the top, and the corner screws inside it
  out.push(L(k.planOutline(k.insetPlan(BASE, 6), TOP, P, 8), { tone: "faint" }));
  out.push(screws(k.corners(BASE, 12), TOP, 2.2));
  // a ruler strip along the front edge: the cota of the bench
  const strip = { x: -150, y: 108, w: 300, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, TOP, 0.6, P, 2), { tone: "lo", crease: "none" }));
  const t = k.topTicks(-146, 146, 6, 5, strip.y + 0.2, TOP + 0.6, [1.6, 3.2], P, "x");
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  return out.join("");
}

// ---------- back: the backplane ----------
const BACKPLANE = { x: -172, y: -118, w: 344, d: 16, r: 3 };
const BP_H = 48;
function backplane() {
  const z1 = TOP + BP_H;
  const out = [S(k.slabOf(BACKPLANE, TOP, BP_H, P, 3, 0.8), { tone: "mid", inner: L(k.sideSeam(BACKPLANE, TOP + 10, P, 3), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(BACKPLANE, 2.6), z1, P, 3), { tone: "faint" }));
  // status LEDs along the top, two of them lit
  const leds = Array.from({ length: 14 }, (_, i) => [-150 + i * 9, BACKPLANE.y + 8]);
  out.push(L(leds.map(([x, y]) => k.ring(x, y, 1.6, z1, P, 12)).join(""), { tone: "lo" }));
  leds.forEach(([x, y], i) => {
    const dot = D([at([x, y, z1])], { size: 0.9, tone: i === 9 ? "hi" : "lo" });
    out.push(i === 9 ? a.amBlink(dot, { period: 2600, delay: 340 }) : dot);
  });
  // a vent of perforations and a label plate on the right
  out.push(D(k.dotGrid(-10, BACKPLANE.y + 5, 18, 2, 5, z1, P), { size: 0.5, tone: "lo" }));
  const plate = { x: 112, y: BACKPLANE.y + 3.5, w: 48, d: 9, r: 1 };
  out.push(S(k.slabOf(plate, z1, 0.6, P, 2), { tone: "lo", crease: "none" }));
  out.push(L([[5, 26], [5, 18]].map(([dx, len], i) => k.lineOnTop([plate.x + dx, plate.y + 3 + i * 3], [plate.x + dx + len, plate.y + 3 + i * 3], z1 + 0.6, P)).join(""), { tone: "lo", free: true }));
  out.push(D([at([plate.x + plate.w - 4, plate.y + 4.5, z1 + 0.6])], { size: SCREW }));
  return out.join("");
}

// ---------- back left: AI compute module ----------
const COMPUTE = { x: -164, y: -96, w: 150, d: 100, r: 6 };
const C_H = 40;
function compute() {
  const z1 = TOP + C_H;
  const out = [S(k.slabOf(COMPUTE, TOP, C_H, P, 6, 1.2), { tone: "mid", inner: L(k.sideSeam(COMPUTE, TOP + 8, P, 6), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(COMPUTE, 3.5), z1, P, 6), { tone: "faint" }));
  out.push(screws(k.corners(COMPUTE, 8), z1, 1.6));
  // the fan: a shroud ring standing on the lid, a rotor turning inside it, and its hub
  const FX = -124;
  const FY = -46;
  const FR = 30;
  out.push(S(k.cylinder(FX, FY, FR + 4, z1, 2, P, 64, 0.5), { tone: "lo" }));
  out.push(L(k.ring(FX, FY, FR, z1 + 2, P, 64), { tone: "mid" }));
  out.push(
    a.amRotor([FX, FY, z1 + 1.2], [1, 0, 0], [0, 1, 0], P, { count: 7, r0: 6, r1: FR - 2, chord: 9, tip: 4, sweep: 0.5, period: 900, thickness: 0.8, clip: FR - 0.5 }),
  );
  out.push(S(k.cylinder(FX, FY, 7, z1 + 1.2, 3, P, 32, 0.4), { tone: "hi", lit: true, inner: L(k.sideArc(FX, FY, 7, z1 + 2.4, P, 24), { tone: "lo" }) }));
  out.push(D([at([FX, FY, z1 + 4.2])], { size: 0.7, tone: "hi" }));
  mark("ia", [FX, FY, z1 + 4]);
  // the heat sink: a plinth and a row of fins, painted back to front
  const SINK = { x: -80, y: -88, w: 56, d: 84, r: 2 };
  out.push(S(k.slabOf(SINK, z1, 2, P, 2), { tone: "lo" }));
  const fins = Array.from({ length: 10 }, (_, i) => ({ x: SINK.x + 3 + i * 5.2, y: SINK.y + 3, w: 2.2, d: SINK.d - 6, r: 0.4 }));
  for (const f of byDepth(fins, (f) => [f.x, f.y + f.d / 2])) out.push(S(k.slabOf(f, z1 + 2, 16, P, 2), { tone: "hi", crease: "none" }));
  return out.join("");
}

// ---------- back right: the data rack, trays as drawers ----------
const RACK = { x: 4, y: -98, w: 152, d: 96, r: 3 };
const R_H = 60;
const TRAY_H = 15;
function rack() {
  const z1 = TOP + R_H;
  const out = [];
  const cheekL = { x: RACK.x, y: RACK.y, w: 8, d: RACK.d, r: 2 };
  const cheekR = { x: RACK.x + RACK.w - 8, y: RACK.y, w: 8, d: RACK.d, r: 2 };
  const back = { x: RACK.x + 8, y: RACK.y, w: RACK.w - 16, d: 6, r: 1 };
  out.push(S(k.slabOf(back, TOP, R_H, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf(cheekL, TOP, R_H, P, 2, 0.6), { tone: "mid", inner: L(k.sideSeam(cheekL, TOP + 6, P, 2), { tone: "faint" }) }));
  const trays = [0, 1, 2].map((i) => ({ i, z: TOP + 4 + i * (TRAY_H + 3) }));
  for (const t of trays) {
    const plan = { x: RACK.x + 9, y: RACK.y + 6, w: RACK.w - 18, d: RACK.d - 6, r: 2 };
    const front = plan.y + plan.d;
    const svg = [
      S(k.slabOf(plan, t.z, TRAY_H, P, 2, 0.6), { tone: t.i === 1 ? "hi" : "mid", inner: L(k.sideSeam(plan, t.z + 4, P, 2), { tone: "faint" }) }),
      // the pull: a bar standing proud of the tray front on two posts
      S(k.slabOf({ x: plan.x + 52, y: front, w: 4, d: 4, r: 0.6 }, t.z + 5, 5, P, 2), { tone: "mid" }),
      S(k.slabOf({ x: plan.x + 76, y: front, w: 4, d: 4, r: 0.6 }, t.z + 5, 5, P, 2), { tone: "mid" }),
      S(k.slabOf({ x: plan.x + 50, y: front + 3, w: 32, d: 4, r: 1.2 }, t.z + 5, 5, P, 3, 0.4), { tone: "hi" }),
      // activity LED on the front face
      a.amBlink(D([at([plan.x + plan.w - 10, front, t.z + 7.5])], { size: 1, tone: "hi" }), { period: 1900 + t.i * 700, delay: t.i * 500 }),
      D([at([plan.x + 8, front, t.z + 7.5])], { size: SCREW }),
    ].join("");
    out.push(t.i === 1 ? a.amSlide(svg, [0, 14, 0], P, { period: 7600, delay: 2200 }) : svg);
  }
  const cap = { ...RACK, x: RACK.x, w: RACK.w };
  out.push(S(k.slabOf(cap, z1 - 4, 4, P, 3, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(cap, 3), z1, P, 3), { tone: "faint" }));
  out.push(screws(k.corners(cap, 7), z1, 1.4));
  out.push(D(k.dotGrid(RACK.x + 24, RACK.y + 18, 20, 9, 5.4, z1, P), { size: 0.5, tone: "lo" }));
  out.push(S(k.slabOf(cheekR, TOP, R_H - 4, P, 2, 0.6), { tone: "mid", inner: L(k.sideSeam(cheekR, TOP + 6, P, 2), { tone: "faint" }) }));
  mark("datos", [RACK.x + RACK.w / 2, RACK.y + RACK.d, TOP + 30]);
  return out.join("");
}

// ---------- front left: the IoT board ----------
const PCB = { x: -164, y: 14, w: 150, d: 92, r: 3 };
const PCB_Z = TOP + 6;
const PCB_T = 2.4;
function iot() {
  const z = PCB_Z + PCB_T;
  const out = [];
  for (const [x, y] of byDepth(k.corners(PCB, 6))) out.push(S(k.cylinder(x, y, 3, TOP, 6, P, 16), { tone: "lo" }));
  out.push(ebony(S(k.slabOf(PCB, PCB_Z, PCB_T, P, 2, 0.4), { tone: "mid" })));
  out.push(screws(k.corners(PCB, 6), z, 1.6));
  // traces first, so the parts sit on them; every trace ends on a via or a pad
  const MCU = { x: -124, y: 38, w: 30, d: 30, r: 1.2 };
  const traces = [
    [[MCU.x + MCU.w + 4, MCU.y + 8], [-74, MCU.y + 8], [-70, 34]],
    [[MCU.x + MCU.w + 4, MCU.y + 22], [-80, MCU.y + 22], [-74, 66]],
    [[MCU.x + 12, MCU.y + MCU.d + 4], [MCU.x + 12, 92], [-48, 92]],
    [[MCU.x - 4, MCU.y + 15], [-148, MCU.y + 15], [-148, 82]],
    [[MCU.x + 20, MCU.y - 4], [MCU.x + 20, 24], [-40, 24]],
  ];
  out.push(L(traces.map((t) => k.onTop(t, z, P)).join(""), { tone: "lo" }));
  out.push(D(traces.flatMap((t) => [t[0], t[t.length - 1]]).map(([x, y]) => at([x, y, z])), { size: 0.75, tone: "mid" }));
  // the microcontroller: pins on the board round it, then the package
  const pins = [];
  for (let i = 0; i < 7; i++) {
    const o = 4 + i * 3.7;
    pins.push(k.lineOnTop([MCU.x + o, MCU.y], [MCU.x + o, MCU.y - 3], z, P), k.lineOnTop([MCU.x + o, MCU.y + MCU.d], [MCU.x + o, MCU.y + MCU.d + 3], z, P));
    pins.push(k.lineOnTop([MCU.x, MCU.y + o], [MCU.x - 3, MCU.y + o], z, P), k.lineOnTop([MCU.x + MCU.w, MCU.y + o], [MCU.x + MCU.w + 3, MCU.y + o], z, P));
  }
  out.push(L(pins.join(""), { tone: "mid" }));
  out.push(ebony(S(k.slabOf(MCU, z, 3, P, 2, 0.5), { tone: "hi" })));
  out.push(L(k.ring(MCU.x + 6, MCU.y + 6, 1.6, z + 3, P, 12), { tone: "lo" }));
  mark("iot", [MCU.x + MCU.w / 2, MCU.y + MCU.d / 2, z + 3]);
  // two support chips
  for (const c of byDepth([{ x: -74, y: 26, w: 20, d: 12 }, { x: -74, y: 58, w: 20, d: 12 }], (c) => [c.x, c.y])) {
    out.push(ebony(S(k.slabOf({ ...c, r: 1 }, z, 2.2, P, 2, 0.3), { tone: "hi" })));
  }
  // the header along the back edge: a block with its pin grid on top
  const HEADER = { x: -152, y: 18, w: 64, d: 7, r: 1 };
  out.push(S(k.slabOf(HEADER, z, 5, P, 2, 0.3), { tone: "lo" }));
  out.push(D(k.dotGrid(HEADER.x + 3, HEADER.y + 2, 12, 2, 5.2, z + 5, P), { size: 0.55, tone: "hi" }));
  // the sensor: a can with a vented cap
  out.push(S(k.cylinder(-142, 88, 9, z, 5, P, 40, 0.4), { tone: "mid", inner: L(k.sideArc(-142, 88, 9, z + 2, P, 32), { tone: "faint" }) }));
  out.push(S(k.cylinder(-142, 88, 6, z + 5, 3, P, 32, 0.4), { tone: "hi" }));
  out.push(D(k.dotGrid(-145, 85, 3, 3, 3, z + 8, P), { size: 0.45, tone: "lo" }));
  // the status LED
  out.push(S(k.cylinder(-104, 92, 2.4, z, 1.4, P, 16), { tone: "lo" }));
  out.push(a.amBlink(led(D([at([-104, 92, z + 1.4])], { size: 1.3, tone: "lit" })), { period: 3200, delay: 400 }));
  // the radio module and its antenna
  const RADIO = { x: -46, y: 82, w: 26, d: 18, r: 1.2 };
  out.push(S(k.slabOf(RADIO, z, 3, P, 2, 0.4), { tone: "hi" }));
  out.push(L(k.planOutline(k.insetPlan(RADIO, 2), z + 3, P, 2), { tone: "faint" }));
  // the antenna stands on the radio module's lid, on its own threaded boss
  const AX = RADIO.x + RADIO.w - 6;
  const AY = RADIO.y + RADIO.d / 2;
  out.push(S(k.cylinder(AX, AY, 2.8, z + 3, 2.4, P, 20, 0.3), { tone: "lo" }));
  out.push(S(k.cylinder(AX, AY, 1.2, z + 5.4, 30, P, 16), { tone: "mid", crease: "none", inner: L(k.sideArc(AX, AY, 1.2, z + 21, P, 10), { tone: "faint" }) }));
  out.push(S(k.cylinder(AX, AY, 2.4, z + 35.4, 3, P, 20, 0.3), { tone: "hi", lit: true }));
  return out.join("");
}

// ---------- front centre: the interface module ----------
const UI = { x: 6, y: 18, w: 104, d: 90, r: 6 };
const UI_H = 18;
function iface() {
  const z1 = TOP + UI_H;
  const out = [S(k.slabOf(UI, TOP, UI_H, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(UI, TOP + 6, P, 6), { tone: "faint" }) })];
  const SCREEN = { x: UI.x + 8, y: UI.y + 8, w: UI.w - 16, d: 54, r: 3 };
  out.push(ebony(S(k.slabOf(SCREEN, z1, 0.6, P, 3), { tone: "lo", crease: "none", flat: true })));
  const sz = z1 + 0.6;
  out.push(L(k.planOutline(SCREEN, sz, P, 3), { tone: "lo" }));
  // what the screen shows: a header rule, a telemetry line with its axis, and three bars
  out.push(L(k.lineOnTop([SCREEN.x + 6, SCREEN.y + 7], [SCREEN.x + 40, SCREEN.y + 7], sz, P), { tone: "mid", free: true }));
  const axis = k.onTop([[SCREEN.x + 6, SCREEN.y + 14], [SCREEN.x + 6, SCREEN.y + 42], [SCREEN.x + 60, SCREEN.y + 42]], sz, P);
  out.push(L(axis, { tone: "lo", free: true }));
  const pts = [0, 6, 3, 11, 8, 15, 12, 20, 17].map((v, i) => [SCREEN.x + 6 + i * 6.6, SCREEN.y + 40 - v * 1.2]);
  out.push(L(k.onTop(pts, sz, P), { tone: "hi", free: true }));
  out.push(led(D([at([...pts[pts.length - 1], sz])], { size: 1.1, tone: "lit" })));
  for (const [i, h] of [16, 26, 10].entries()) {
    const bx = SCREEN.x + 66 + i * 5;
    out.push(L(k.lineOnTop([bx, SCREEN.y + 42], [bx, SCREEN.y + 42 - h], sz, P), { tone: "hi", free: true }));
  }
  // the controls strip: four keys and a knurled encoder
  const KZ = z1;
  for (const b of byDepth([0, 1, 2, 3].map((i) => ({ x: UI.x + 10 + i * 13, y: UI.y + 70 })), (b) => [b.x, b.y])) {
    const plan = { x: b.x, y: b.y, w: 10, d: 10, r: 1.4 };
    out.push(S(k.slabOf(k.insetPlan(plan, -1), KZ, 0.6, P, 2), { tone: "lo", crease: "none" }));
    out.push(S(k.slabOf(plan, KZ + 0.6, 2.6, P, 2, 0.4), { tone: "hi" }));
  }
  const EX = UI.x + 84;
  const EY = UI.y + 76;
  out.push(S(k.cylinder(EX, EY, 9, KZ, 1.4, P, 40, 0.3), { tone: "lo" }));
  out.push(S(k.cylinder(EX, EY, 7, KZ + 1.4, 6, P, 40, 0.5), { tone: "hi", inner: L(k.knurl(EX, EY, 7, KZ + 1.6, KZ + 6.2, 28, P), { tone: "lo" }) }));
  out.push(L(k.lineOnTop([EX, EY], [EX + 4, EY - 4.4], KZ + 7.4, P), { tone: "hi" }));
  out.push(D([at([EX, EY, KZ + 7.4])], { size: 0.5, tone: "hi" }));
  mark("producto", [SCREEN.x + SCREEN.w / 2, SCREEN.y + SCREEN.d / 2, sz]);
  return out.join("");
}

// ---------- the subject: the socket and the lifted orange module ----------
function socket() {
  const BAY = k.insetPlan(MOD, -3);
  const out = [S(k.slabOf(BAY, TOP, 3, P, 3, 0.4), { tone: "lo" })];
  out.push(L(k.planOutline(k.insetPlan(BAY, 2.5), TOP + 3, P, 3), { tone: "faint" }));
  out.push(D(k.dotGrid(MOD.x + 6, MOD.y + 6, 6, 6, 6, TOP + 3, P), { size: 0.6, tone: "hi" }));
  return out.join("");
}

function module() {
  const z0 = MOD_Z;
  const z1 = z0 + MOD_H;
  const body = [
    S(k.slabOf(MOD, z0, MOD_H, P, 4, 1.2), { tone: "hi", lit: true, inner: L(k.sideSeam(MOD, z0 + 7, P, 4), { tone: "lo" }) }),
    L(k.planOutline(k.insetPlan(MOD, 4), z1, P, 4), { tone: "lo" }),
    // COTA's isotipo machined into its lid: the open "c" and the oblique tick that closes it
    (() => {
      const cx = MOD.x + MOD.w / 2;
      const cy = MOD.y + MOD.d / 2;
      const r = 9;
      const arc = [];
      for (let t = 0.75; t <= 2 * Math.PI - 0.75 + 1e-6; t += (2 * Math.PI - 1.5) / 40) arc.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
      const tick = k.lineOnTop([cx + 3, cy + 6], [cx + 14, cy - 5], z1, P);
      return L(k.onTop(arc, z1, P), { tone: "lo", free: true }) + L(tick, { tone: "lo", free: true });
    })(),
    D(k.corners(MOD, 7).map(([x, y]) => at([x, y, z1])), { size: SCREW, tone: "lo" }),
  ].join("");
  const halo = `<path class="iso-halo" d="${k.haloOf(MOD, TOP + 3, 0.1, P)}" style="filter:blur(7px)"/>`;
  mark("modulo", [MOD.x + MOD.w / 2, MOD.y + MOD.d / 2, z1]);
  return a.amFloat(brand(body), P, { rise: 6, period: 6200, halo });
}

// ---------- assemble, back to front ----------
const back = byDepth(
  [
    { at: [-89, -46], svg: compute },
    { at: [80, -50], svg: rack },
  ],
  (i) => i.at,
);
const front = byDepth(
  [
    { at: [-89, 60], svg: iot },
    { at: [58, 63], svg: iface },
    { at: [148, 80], svg: () => socket() + module() },
  ],
  (i) => i.at,
);
const body = [base(), backplane(), ...back.map((i) => i.svg()), ...front.map((i) => i.svg())].join("");

const svg = a.assetSvg({
  width: W,
  height: H,
  label:
    "Ilustración isométrica: un banco de pruebas mecanizado con los módulos de un sistema real. Un módulo de cómputo de IA con ventilador y disipador, un rack de datos con bandejas, una placa IoT con microcontrolador, sensor y antena, un módulo de interfaz con pantalla y, en naranja, un módulo flotando sobre su zócalo vacío.",
  body,
  paper: PAPER,
  accents: { brand: BRAND, led: { hex: BRAND, mode: "ink" }, ebony: "#070807" },
  weight: 0.9,
  id: "cota-hero",
});

mkdirSync(join(ROOT, "public/art"), { recursive: true });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(ROOT, "public/art/hero.svg"), svg);
writeFileSync(join(HERE, "out/hero.html"), a.previewHtml({ title: "cota-hero", svg, paper: PAPER, width: W }));
writeFileSync(join(ROOT, "src/content/hero-hotspots.json"), JSON.stringify(hotspots, null, 2) + "\n");
console.log(`wrote public/art/hero.svg (${(svg.length / 1024).toFixed(0)} KB), scale ${P.scale.toFixed(2)}`);
