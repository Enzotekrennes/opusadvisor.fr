#!/usr/bin/env node
/**
 * Draws the town at dawn shown behind the home page hero.
 *
 * Writes one static SVG per depth plane into public/images/home/town/ (layer-5 is the farthest,
 * layer-1 the rooftop the visitor looks from) and components/home/desktop/townData.ts, which lists
 * what moves: the windows that switch on one by one and the chimneys that smoke. The page draws
 * those moving parts itself, so they can be paused and follow the reduced-motion setting.
 *
 * The town is deterministic: the same script always draws the same houses. Run it again after
 * changing a house, then commit the regenerated files.
 *
 * Usage: node scripts/home-town/generate.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const IMAGE_DIR = join(ROOT, 'public', 'images', 'home', 'town');
const DATA_FILE = join(ROOT, 'components', 'home', 'desktop', 'townData.ts');

/** The drawing area: 1440 x 900, plus a 40 px margin so a layer can shift with the pointer without showing its edge. */
const VIEWBOX = '-40 -40 1520 980';
/** Bottom of every wall: below the visible frame, so no building ever shows its base. */
const GROUND = 940;

/** Deterministic pseudo-random number in [0, 1) from any list of non-negative integers (FNV-1a style hash). */
function rnd(...keys) {
  let x = 2166136261;
  for (const v of keys) x = Math.imul(x ^ (Math.trunc(v * 997) + 7), 16777619) >>> 0;
  return (x % 100003) / 100003;
}

/** Rounds a coordinate to two decimals for compact output. */
const n = (v) => Math.round(v * 100) / 100;

/**
 * Window glass size, grid step (the step height is one storey) and the share of panes that are
 * lit, switching on during the animation, or lit by a TV, per depth plane.
 */
const WIN = {
  far: { size: [3, 4], step: [11, 13], p: [0.05, 0, 0] },
  l4: { size: [4, 6], step: [13, 16], p: [0.06, 0.04, 0] },
  mid: { size: [6, 9], step: [18, 22], p: [0.1, 0.08, 0.015] },
  near: { size: [13, 19], step: [32, 36], p: [0.12, 0.09, 0.02] },
};
/** Scale of a plane relative to the nearest houses, derived from the storey height (36 px nearest). */
const UNIT = Object.fromEntries(Object.entries(WIN).map(([k, v]) => [k, v.step[1] / 36]));
/** Chimney stack width and height above the roof, per plane. */
const CHIMNEY = { far: [4, 6], l4: [6, 9], mid: [8, 13], near: [13, 22] };

/** One depth plane: shapes, dark glass, lit panes (bloomed), window bars, plus what moves. */
class Layer {
  constructor({ fill, roof, cap, rim, rimOpacity, dim, kind }) {
    Object.assign(this, { fill, roof, cap, rimColor: rim, rimOpacity, dimColor: dim, kind });
    this.u = UNIT[kind];
    this.base = [];
    this.rim = [];
    this.dim = [];
    this.lit = [];
    this.mull = [];
    /** Panes that switch on during the animation, drawn by the page. */
    this.switching = [];
    /** Chimney pots that smoke, drawn by the page. */
    this.smoke = [];
  }

  /** The plane's static SVG markup. */
  render(extra = '') {
    return (
      this.base.join('') + this.rim.join('') + this.dim.join('') +
      `<g filter="url(#bloom)">${this.lit.join('')}</g>` + this.mull.join('') + extra
    );
  }

  rimPath(d, width = 1, opacity = this.rimOpacity) {
    if (this.rimOpacity) this.rim.push(`<path d="${d}" stroke="${this.rimColor}" stroke-opacity="${n(opacity)}" stroke-width="${width}" fill="none"/>`);
  }
}

/** Vertical window bar of a near pane, in the wall colour. */
const mullion = (L, x, y, ww, wh) =>
  `<path d="M${n(x + ww / 2)} ${n(y)} v${wh}" stroke="${L.fill}" stroke-width=".9" stroke-opacity=".8"/>`;

/**
 * One window slot: dark glass, a lit pane, a pane that switches on later, or a TV glow.
 * Far away only the lit panes show: dark glass would be lost in the haze.
 */
function pane(L, key, x, y) {
  const [ww, wh] = WIN[L.kind].size;
  const [pl, pa, pc] = WIN[L.kind].p;
  const near = L.kind === 'near';
  const v = rnd(...key);
  if (v >= pl && L.kind !== 'far') L.dim.push(`<rect x="${n(x)}" y="${n(y)}" width="${ww}" height="${wh}" fill="${L.dimColor}"/>`);
  if (v >= pl + pa + pc) {
    if (near) L.mull.push(mullion(L, x, y, ww, wh));
    return;
  }
  const tv = v >= pl + pa;
  const curtain = near && !tv && rnd(...key, 3) < 0.45;
  if (v >= pl && !tv) {
    L.switching.push({ x: n(x), y: n(y), w: ww, h: wh, delay: n(1.2 + rnd(...key, 9) * 18), ...(curtain ? { curtain: true } : {}) });
    return;
  }
  const fill = tv ? '#9DB8E8' : near ? 'url(#warm)' : '#F3C47B';
  const fo = L.kind === 'far' || L.kind === 'l4' ? 0.55 : tv ? 0.75 : 1;
  L.lit.push(`<rect x="${n(x)}" y="${n(y)}" width="${ww}" height="${wh}" fill="${fill}"${fo < 1 ? ` fill-opacity="${fo}"` : ''}/>`);
  if (curtain) L.mull.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(ww * 0.38)}" height="${wh}" fill="#B9773F" fill-opacity=".45"/>`);
  if (near) L.mull.push(mullion(L, x, y, ww, wh));
}

/** Window columns centred between x0 and x1. */
function columns(L, x0, x1) {
  const [ww] = WIN[L.kind].size;
  const [sx] = WIN[L.kind].step;
  if (x1 - x0 < ww) return [];
  const count = Math.floor((x1 - x0 - ww) / sx) + 1;
  const start = x0 + (x1 - x0 - (count - 1) * sx - ww) / 2;
  return Array.from({ length: count }, (_, i) => start + i * sx);
}

/** A regular grid of windows centred on the wall, one row per storey starting just under the roof; returns the columns. */
function facade(L, key, x, w, top, y1) {
  const [, wh] = WIN[L.kind].size;
  const [sx, sy] = WIN[L.kind].step;
  const cols = columns(L, x + sx * 0.35, x + w - sx * 0.35);
  if (!y1) return cols;
  for (let y = top + (sy - wh) / 2 + 2, r = 0; y + wh <= y1; y += sy, r += 1) {
    cols.forEach((cx, c) => pane(L, [key, r, c], cx, y));
  }
  return cols;
}

/** A chimney stack with two pots; records its mouth when it smokes. */
function stack(L, cx, top, bottom, smoke = false) {
  const [cw, ch] = CHIMNEY[L.kind];
  L.base.push(`<rect x="${n(cx - cw / 2)}" y="${n(top)}" width="${cw}" height="${n(bottom - top)}" fill="${L.fill}"/>`);
  if (L.kind !== 'far') {
    const pw = Math.max(1.5, cw * 0.26);
    const ph = Math.max(2, ch * 0.22);
    L.base.push(
      `<rect x="${n(cx - cw * 0.3 - pw / 2)}" y="${n(top - ph)}" width="${n(pw)}" height="${n(ph + 1)}" fill="${L.fill}"/>` +
        `<rect x="${n(cx + cw * 0.24 - pw / 2)}" y="${n(top - ph * 0.8)}" width="${n(pw)}" height="${n(ph * 0.8 + 1)}" fill="${L.fill}"/>`,
    );
    if (smoke) L.smoke.push([n(cx - cw * 0.3), n(top - ph - 3)]);
  }
  L.rimPath(`M${n(cx + cw / 2)} ${n(top)} v${n(ch * 0.7)}`);
}

/** Height of a gable roof line at x. */
function roofY(x0, w, eave, ridge, x) {
  const t = 1 - Math.abs(x - (x0 + w / 2)) / (w / 2);
  return eave - (eave - ridge) * Math.max(0, t);
}

/** A house with its gable on the street: triangular roof, a small attic window under the ridge. */
function gable(L, key, x, w, eave, ridge, { chimney = null, smoke = false } = {}, wy1 = null) {
  L.base.push(`<path d="M${n(x)} ${GROUND} V${n(eave)} L${n(x + w / 2)} ${n(ridge)} L${n(x + w)} ${n(eave)} V${GROUND} Z" fill="${L.fill}"/>`);
  L.rimPath(`M${n(x + w / 2)} ${n(ridge)} L${n(x + w)} ${n(eave)}`, 1.3);
  facade(L, key, x, w, eave, wy1);
  const [ww, wh] = WIN[L.kind].size;
  const slope = (eave - ridge) / (w / 2);
  const top = ridge + (ww / 2 + 2 * L.u) * slope + 2 * L.u;
  if (wy1 && top + wh <= eave - 2 * L.u) pane(L, [key, 99], x + w / 2 - ww / 2, top);
  if (chimney !== null) {
    const [cw, ch] = CHIMNEY[L.kind];
    const cx = x + w * chimney;
    const ry = roofY(x, w, eave, ridge, cx);
    stack(L, cx, ry - ch, ry + (cw * slope) / 2 + 2, smoke);
  }
}

/** Which window columns carry a dormer: symmetric, every other column. */
function dormerColumns(count) {
  if (count <= 2) return Array.from({ length: count }, (_, i) => i);
  const want = count % 2 ? 0 : 1;
  return Array.from({ length: count }, (_, i) => i).filter((i) => Math.min(i, count - 1 - i) % 2 === want);
}

/**
 * A house with its ridge along the street: a slate roof plane catching the sky, stone dormers
 * standing above the window columns, chimney stacks on the gable walls (or on a hipped ridge).
 */
function side(L, key, x, w, eave, ridge, { dormers = true, hip = false, chims = [], smoke = false } = {}, wy1 = null) {
  const inset = hip ? (eave - ridge) * 0.9 : 0;
  L.base.push(
    `<rect x="${n(x)}" y="${n(eave)}" width="${n(w)}" height="${n(GROUND - eave)}" fill="${L.fill}"/>` +
      `<path d="M${n(x - 1)} ${n(eave + 0.5)} L${n(x + inset)} ${n(ridge)} L${n(x + w - inset)} ${n(ridge)} L${n(x + w + 1)} ${n(eave + 0.5)} Z" fill="${L.roof}"/>` +
      `<path d="M${n(x - 1)} ${n(eave + 0.5)} H${n(x + w + 1)}" stroke="#050B1C" stroke-opacity=".3"/>`,
  );
  L.rimPath(`M${n(x + inset)} ${n(ridge)} H${n(x + w - inset)}`, 1.2);
  if (hip) L.rimPath(`M${n(x + w - inset)} ${n(ridge)} L${n(x + w + 1)} ${n(eave)}`, 1.1, L.rimOpacity * 0.8);
  const cols = facade(L, key, x, w, eave, wy1);
  if (dormers && cols.length && L.kind !== 'far') {
    const [ww, wh] = WIN[L.kind].size;
    const pad = Math.max(1.5, 3 * L.u);
    const dw = ww + 2 * pad;
    const dh = wh + 2 * pad;
    const ped = dw * 0.45;
    const yt = eave - dh;
    if (yt - ped >= ridge + 2 * L.u) {
      const edge = hip ? (inset * (eave - yt)) / (eave - ridge) : 0;
      for (const i of dormerColumns(cols.length)) {
        const cx = cols[i] + ww / 2;
        if (cx - dw / 2 - pad < x + edge || cx + dw / 2 + pad > x + w - edge) continue;
        const o = pad * 0.55;
        const k = ped / (dw / 2);
        L.base.push(
          `<path d="M${n(cx - dw / 2)} ${n(eave + 1)} V${n(yt)} L${n(cx)} ${n(yt - ped)} L${n(cx + dw / 2)} ${n(yt)} V${n(eave + 1)} Z" fill="${L.fill}"/>` +
            `<path d="M${n(cx - dw / 2 - o)} ${n(yt + o * k)} L${n(cx)} ${n(yt - ped - 0.6)} L${n(cx + dw / 2 + o)} ${n(yt + o * k)}" ` +
            `stroke="${L.cap}" stroke-width="${n(Math.max(1.2, 2.2 * L.u))}" fill="none" stroke-linejoin="round"/>`,
        );
        L.rimPath(`M${n(cx)} ${n(yt - ped - 0.6)} L${n(cx + dw / 2 + o)} ${n(yt + o * k)}`);
        pane(L, [key, 77, i], cx - ww / 2, yt + pad);
      }
    }
  }
  for (const f of chims) {
    const [cw, ch] = CHIMNEY[L.kind];
    if (hip || (f > 0 && f < 1)) stack(L, x + w * f, ridge - ch, ridge + 3, smoke);
    else stack(L, f === 0 ? x + cw / 2 : x + w - cw / 2, ridge - ch, eave + 1, smoke);
  }
}

/** A block of flats: flat roof, sometimes a lift housing and an aerial. */
function flat(L, key, x, w, top, { roofbox = false } = {}, wy1 = null) {
  L.base.push(`<rect x="${n(x)}" y="${n(top)}" width="${n(w)}" height="${n(GROUND - top)}" fill="${L.fill}"/>`);
  if (roofbox) {
    L.base.push(
      `<rect x="${Math.round(x + w * 0.2)}" y="${n(top - 14 * L.u)}" width="${Math.round(w * 0.22)}" height="${n(14 * L.u + 1)}" fill="${L.fill}"/>` +
        `<path d="M${Math.round(x + w * 0.75)} ${n(top)} V${n(top - 34 * L.u)}" stroke="${L.fill}" stroke-width="${n(Math.max(1, 2 * L.u))}"/>`,
    );
  }
  L.rimPath(`M${n(x)} ${n(top)} H${n(x + w)}`, 1.2);
  facade(L, key, x, w, top, wy1);
}

const BUILDERS = { g: gable, s: side, f: flat };

/** Draws a street of houses given as [kind, x, width, eave or top, ridge?, options]. */
function street(L, seed, items, wy1) {
  items.forEach(([kind, ...args], i) => {
    const options = typeof args[args.length - 1] === 'object' ? args.pop() : {};
    BUILDERS[kind](L, seed + i, ...args, options, wy1);
  });
}

// --- Plane 5: far and hazy; the cathedral spire on the left edge and one bell tower ----------------
const L5 = new Layer({ fill: '#7085AE', roof: 'url(#roof5)', cap: '#7E93BA', rim: '#C9D6EE', rimOpacity: 0, dim: '#7A8FB8', kind: 'far' });
L5.base.push(
  '<rect x="24" y="580" width="38" height="360" fill="#7085AE"/><path d="M22 582 L43 470 L64 582 Z" fill="#7085AE"/>' +
    '<path d="M20 584 L25 556 L30 584 Z M56 584 L61 556 L66 584 Z" fill="#7085AE"/>' +
    '<path d="M58 650 L58 640 L110 618 L168 640 L168 650 Z" fill="#7085AE"/><rect x="58" y="640" width="110" height="300" fill="#7085AE"/>' +
    '<rect x="692" y="612" width="22" height="330" fill="#7085AE"/><path d="M690 614 L703 566 L716 614 Z" fill="#7085AE"/>',
);
for (let x = 168, i = 0; x < 1480; i += 1) {
  const w = 50 + rnd(i, 1) * 70;
  const top = 642 + rnd(i, 2) * 38;
  const r = rnd(i, 3);
  if (r < 0.4) gable(L5, 500 + i, x, w, top, top - 16, {}, 720);
  else if (r < 0.65) side(L5, 500 + i, x, w, top, top - 9, {}, 720);
  else flat(L5, 500 + i, x, w, top, {}, 720);
  x += w;
}

// --- Plane 4 ----------------------------------------------------------------------------------------
const L4 = new Layer({ fill: '#4A6293', roof: 'url(#roof4)', cap: '#5F78A8', rim: '#C3D0EA', rimOpacity: 0.22, dim: '#5A72A2', kind: 'l4' });
for (let x = -30, i = 0; x < 1480; i += 1) {
  const w = 42 + rnd(i, 11) * 62;
  const top = 664 + rnd(i, 12) * 40;
  const r = rnd(i, 13);
  if (r < 0.35) {
    gable(L4, 700 + i, x, w, top, top - 14 - rnd(i, 14) * 12, { chimney: rnd(i, 15) < 0.4 ? 0.7 : null }, 760);
  } else if (r < 0.7) {
    side(L4, 700 + i, x, w, top, top - 16 - rnd(i, 14) * 8, { dormers: rnd(i, 16) < 0.6, chims: rnd(i, 15) < 0.5 ? [0] : [1] }, 760);
  } else {
    flat(L4, 700 + i, x, w, top, { roofbox: rnd(i, 16) < 0.3 }, 760);
  }
  x += w;
}

// --- Plane 3: town houses with dormers, gable houses, flats; the building site sits in the gap ------
const L3 = new Layer({ fill: '#2A406B', roof: 'url(#roof3)', cap: '#4A6393', rim: '#C6D4EF', rimOpacity: 0.5, dim: '#3A5283', kind: 'mid' });
street(L3, 900, [
  ['s', -30, 126, 726, 700, { chims: [1], smoke: true }],
  ['g', 96, 70, 734, 704, { chimney: 0.3 }],
  ['s', 166, 104, 722, 698, { chims: [1], smoke: true }],
  ['f', 270, 84, 708],
  ['g', 354, 92, 736, 700],
  ['s', 446, 120, 718, 694, { hip: true, chims: [0.5] }],
  ['f', 566, 130, 700, { roofbox: true }],
  ['g', 696, 88, 730, 696, { chimney: 0.7 }],
  ['f', 784, 150, 692, { roofbox: true }],
  ['s', 934, 100, 724, 700, { chims: [0] }],
  ['f', 1034, 116, 716],
  ['f', 1408, 80, 748],
], 800);

// The building site at the scale of its neighbours: one storey is 22 px, a scaffold deck per floor.
const SCAFFOLD = '#5B79AD';
const SLABS = [690, 712, 734, 756, 778];
const FRAME = [1168, 1208, 1248, 1288, 1328, 1362];
const SITE =
  '<rect x="1166" y="690" width="200" height="250" fill="#18294B"/>' +
  '<rect x="1212" y="738" width="34" height="18" fill="#F3C47B" opacity=".2" filter="url(#bloom)"/>' +
  SLABS.map((y0, i) => FRAME.map((cx) => `<rect x="${cx}" y="${y0 + 4}" width="4" height="${(SLABS[i + 1] ?? 800) - y0 - 4}" fill="#3A5285"/>`).join('')).join('') +
  SLABS.map((y) => `<rect x="1163" y="${y}" width="206" height="4" fill="#4B6391"/><path d="M1163 ${y} H1369" stroke="#AFC2E6" stroke-opacity=".5"/>`).join('') +
  FRAME.slice(0, 3).map((cx) => `<rect x="${cx}" y="672" width="4" height="18" fill="#3A5285"/><path d="M${cx + 1} 672 V664 M${cx + 3} 672 V665" stroke="#6E86B5" stroke-width=".7"/>`).join('') +
  FRAME.slice(3).map((cx) => `<path d="M${cx + 1} 690 V682 M${cx + 3} 690 V683" stroke="#6E86B5" stroke-width=".7"/>`).join('') +
  '<rect x="1290" y="676" width="86" height="124" fill="url(#net)" opacity=".7"/>' +
  [1290, 1318, 1346, 1374].map((x) => `<path d="M${x} 676 V800" stroke="${SCAFFOLD}" stroke-width="1.2"/>`).join('') +
  SLABS.map((y) => `<path d="M1288 ${y} H1378" stroke="${SCAFFOLD}" stroke-width="1.6"/><path d="M1288 ${y - 11} H1378" stroke="${SCAFFOLD}" stroke-width=".8"/>`).join('') +
  `<path d="M1290 712 L1318 690 M1346 756 L1374 734 M1318 778 L1346 756" stroke="${SCAFFOLD}" stroke-width=".8"/>` +
  // Floodlight on the neighbour's roof, lighting the site.
  '<path d="M1146 716 V684" stroke="#2A406B" stroke-width="2"/><rect x="1139" y="679" width="14" height="7" rx="1.5" fill="#2A406B"/>' +
  '<path d="M1146 686 L1366 700 L1366 790 L1196 790 Z" fill="url(#beam)" style="mix-blend-mode:screen"/>' +
  '<circle cx="1146" cy="687" r="2.2" fill="#F4F7FF" filter="url(#bloom)"/>';

/** Zigzag lattice between two horizontal chords. */
function zig(x0, x1, ya, yb, step) {
  let d = `M${x0} ${ya}`;
  for (let x = x0, up = false; x < x1; up = !up) {
    x = Math.min(x + step, x1);
    d += ` L${x} ${up ? ya : yb}`;
  }
  return d;
}

/** Zigzag lattice between two vertical chords. */
function mastZig(xa, xb, y0, y1, step) {
  let d = `M${xa} ${y0}`;
  for (let y = y0, left = true; y < y1; left = !left) {
    y = Math.min(y + step, y1);
    d += ` L${left ? xb : xa} ${y}`;
  }
  return d;
}

// The tower crane stands in the site yard right of the building; the house in front hides its foot.
// Its trolley, load and warning lights move, so the page draws them.
const CRANE_COLOR = '#24395F';
const CRANE =
  `<g stroke="${CRANE_COLOR}" fill="none">` +
  `<path d="M1388 530 V780 M1400 530 V780" stroke-width="2.2"/><path d="${mastZig(1388, 1400, 530, 780, 12)}" stroke-width="1"/>` +
  `<path d="M1170 506 H1480 M1176 516 H1480" stroke-width="2"/><path d="${zig(1176, 1480, 516, 506, 10)}" stroke-width="1"/>` +
  '<path d="M1386 506 L1394 466 L1402 506" stroke-width="2.2"/><path d="M1394 467 L1190 506 M1394 467 L1470 500" stroke-width="1"/></g>' +
  '<path d="M1170 506 H1480" stroke="#C6D4EF" stroke-opacity=".55" stroke-width="1"/>' +
  '<path d="M1394 466 L1402 506" stroke="#C6D4EF" stroke-opacity=".5" stroke-width="1"/>' +
  `<rect x="1380" y="516" width="28" height="16" rx="2" fill="${CRANE_COLOR}"/><rect x="1396" y="520" width="9" height="7" fill="#F3C47B" filter="url(#bloom)"/>` +
  `<rect x="1424" y="516" width="40" height="24" fill="${CRANE_COLOR}"/><path d="M1424 524 H1464 M1424 532 H1464" stroke="#30477A"/>`;

// --- Plane 2: the nearest houses ----------------------------------------------------------------------
const L2 = new Layer({ fill: '#162948', roof: 'url(#roof2)', cap: '#2E446E', rim: '#AFC1E3', rimOpacity: 0.35, dim: '#22375C', kind: 'near' });
street(L2, 1300, [
  ['s', -40, 190, 812, 772, { chims: [1] }],
  ['f', 150, 160, 790],
  ['g', 310, 140, 800, 764],
  ['f', 450, 150, 816],
  ['f', 600, 190, 826],
  ['f', 790, 110, 812],
  ['f', 900, 110, 822],
  ['g', 1010, 130, 796, 758, { chimney: 0.3 }],
  ['f', 1140, 120, 786],
  ['s', 1260, 220, 796, 756],
], 900);

// --- Plane 1: the rooftop the visitor looks from (its chimney smokes, drawn by the page) --------------
const ROOFTOP =
  '<path d="M-40 834 L340 905 V940 H-40 Z" fill="#08122A"/><path d="M-40 834 L340 905" stroke="#8EA3CC" stroke-opacity=".28"/>' +
  '<rect x="168" y="808" width="44" height="80" fill="#08122A"/><path d="M212 808 V872" stroke="#8EA3CC" stroke-opacity=".3"/>' +
  '<rect x="174" y="798" width="11" height="12" fill="#08122A"/><rect x="194" y="800" width="11" height="10" fill="#08122A"/>' +
  '<path d="M1480 820 L1130 905 V940 H1480 Z" fill="#08122A"/><path d="M1480 820 L1130 905" stroke="#8EA3CC" stroke-opacity=".28"/>' +
  '<path d="M1372 846 V752 M1352 770 H1392 M1358 786 H1386 M1364 800 H1380" stroke="#08122A" stroke-width="2"/>' +
  '<rect x="1278" y="826" width="34" height="50" fill="#08122A"/><rect x="1282" y="818" width="10" height="9" fill="#08122A"/>';

const DEFS =
  '<defs>' +
  '<filter id="bloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
  '<radialGradient id="warm" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#FFE6B0"/><stop offset="1" stop-color="#E9A257"/></radialGradient>' +
  '<linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9B9DA" stop-opacity="0"/><stop offset="1" stop-color="#A9B9DA" stop-opacity=".5"/></linearGradient>' +
  '<linearGradient id="roof5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8196BC"/><stop offset="1" stop-color="#768BB3"/></linearGradient>' +
  '<linearGradient id="roof4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#627BAA"/><stop offset="1" stop-color="#536C9C"/></linearGradient>' +
  '<linearGradient id="roof3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A6393"/><stop offset="1" stop-color="#344D7D"/></linearGradient>' +
  '<linearGradient id="roof2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F466F"/><stop offset="1" stop-color="#1F3458"/></linearGradient>' +
  '<linearGradient id="beam" x1="1146" y1="686" x2="1300" y2="790" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#EAF1FF" stop-opacity=".34"/><stop offset="1" stop-color="#EAF1FF" stop-opacity="0"/></linearGradient>' +
  '<pattern id="net" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 H4 M0 0 V4" stroke="#3E8C93" stroke-width=".7" stroke-opacity=".7"/><rect width="4" height="4" fill="#24575F" fill-opacity=".35"/></pattern>' +
  '</defs>';

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="1520" height="980">${DEFS}${body}</svg>\n`;

const files = {
  'layer-5.svg': L5.render('<rect x="-40" y="610" width="1520" height="150" fill="url(#fog)"/>'),
  'layer-4.svg': L4.render('<rect x="-40" y="664" width="1520" height="120" fill="url(#fog)" opacity=".6"/>'),
  'layer-3.svg': CRANE + L3.render(SITE),
  'layer-2.svg': L2.render(),
  'layer-1.svg': ROOFTOP,
};

mkdirSync(IMAGE_DIR, { recursive: true });
for (const [name, body] of Object.entries(files)) writeFileSync(join(IMAGE_DIR, name), svg(body));

/** One switching window per line, grouped by plane. */
const windowLists = Object.entries({ l4: L4.switching, mid: L3.switching, near: L2.switching })
  .map(([plane, list]) => [`  ${plane}: [`, ...list.map((w) => `    ${JSON.stringify(w)},`), '  ],'].join('\n'))
  .join('\n');

const data = `/**
 * What moves in the town behind the home page hero: the windows that switch on one by one, per depth
 * plane, and the chimney pots that smoke. Generated by scripts/home-town/generate.mjs, which also draws
 * the static planes in public/images/home/town/; edit the script and run it again rather than this file.
 * Coordinates are in the town's drawing space (viewBox ${VIEWBOX}); delays are in seconds.
 */

/** A pane that switches on during the animation. A curtain is drawn over its left part when set. */
export interface TownWindow {
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  curtain?: boolean;
}

export const switchingWindows: Record<'l4' | 'mid' | 'near', TownWindow[]> = {
${windowLists}
};

/** Mouths of the smoking chimney pots of plane 3, as [x, y]. */
export const chimneySmoke: [number, number][] = ${JSON.stringify(L3.smoke)};
`;
writeFileSync(DATA_FILE, data);

const counts = Object.entries(files).map(([name, body]) => `${name} ${Math.round(svg(body).length / 1024)} KB`);
console.log(`Town drawn: ${counts.join(', ')}; ${L4.switching.length + L3.switching.length + L2.switching.length} switching windows.`);
