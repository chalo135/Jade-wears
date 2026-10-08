// Generates soft pastel placeholder art (webp) until the client's real photos arrive.
// Run with: node scripts/make-placeholders.mjs
// Uses the sharp copy that Next.js already installs, so there is no extra dependency.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "placeholders");
const CX = 400;
const CY = 540;

const C = {
  pink: "#F3C1CF",
  pinkDeep: "#E7A6BA",
  white: "#F5ECE6",
  beige: "#E7D5BF",
  lilac: "#D8CAEC",
  amber: "#EBC79A",
  sage: "#CFDCCB",
  blue: "#C9DBEA",
};
const BG = {
  pink: "#FBE9EE",
  cream: "#FBF3EC",
  lilac: "#F1EBF8",
  sand: "#F1E7DF",
  sage: "#EBF0E7",
  blue: "#EAF1F7",
  blush: "#F8E1E7",
};

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  const x = hex(a);
  const y = hex(b);
  return (
    "#" +
    x
      .map((v, i) => Math.round(v + (y[i] - v) * t))
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}
const shade = (c, t = 0.25) => mix(c, "#4A3040", t);
const tint = (c, t = 0.5) => mix(c, "#FFFFFF", t);

function rng(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fluff(cx, cy, rx, ry, color, rnd, n = 46) {
  let out = "";
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    out += `<circle cx="${(cx + Math.cos(a) * rx).toFixed(1)}" cy="${(cy + Math.sin(a) * ry).toFixed(1)}" r="${(20 + rnd() * 10).toFixed(1)}" fill="${color}"/>`;
  }
  out += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}"/>`;
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 0.85;
    const c = i % 3 === 0 ? tint(color, 0.35) : shade(color, 0.05);
    out += `<circle cx="${(cx + Math.cos(a) * rx * d).toFixed(1)}" cy="${(cy + Math.sin(a) * ry * d).toFixed(1)}" r="${(10 + rnd() * 12).toFixed(1)}" fill="${c}" opacity=".7"/>`;
  }
  return out;
}

const GLASS = "#F1EEF5";
const shine = (id) =>
  `<g clip-path="url(#${id})" opacity=".55"><polygon points="250,300 330,300 560,760 480,760" fill="#fff"/><polygon points="360,300 390,300 620,760 590,760" fill="#fff"/></g>`;

const kinds = {
  mist(c) {
    const d = shade(c, 0.3);
    return `
      <rect x="335" y="230" width="130" height="72" rx="18" fill="${shade(c, 0.15)}"/>
      <rect x="372" y="300" width="56" height="52" fill="${d}"/>
      <path d="M310 400 Q310 350 360 350 H440 Q490 350 490 400 V760 Q490 800 450 800 H350 Q310 800 310 760Z" fill="${c}"/>
      <rect x="340" y="520" width="120" height="124" rx="10" fill="${tint(c, 0.6)}"/>
      <rect x="370" y="572" width="60" height="6" rx="3" fill="${d}" opacity=".5"/>
      <rect x="380" y="590" width="40" height="5" rx="2.5" fill="${d}" opacity=".35"/>
      <rect x="326" y="380" width="16" height="360" rx="8" fill="#fff" opacity=".5"/>`;
  },
  edp(c) {
    return `
      <circle cx="400" cy="398" r="64" fill="${shade(c, 0.22)}"/>
      <circle cx="378" cy="376" r="18" fill="#fff" opacity=".4"/>
      <rect x="372" y="450" width="56" height="50" fill="${shade(c, 0.32)}"/>
      <rect x="266" y="490" width="268" height="300" rx="64" fill="${c}"/>
      <rect x="282" y="610" width="236" height="165" rx="50" fill="${shade(c, 0.12)}"/>
      <rect x="345" y="560" width="110" height="64" rx="8" fill="${tint(c, 0.7)}"/>
      <rect x="292" y="515" width="20" height="240" rx="10" fill="#fff" opacity=".5"/>`;
  },
  giftset(c) {
    const ribbon = mix(c, "#A84D6B", 0.45);
    return `
      <rect x="210" y="540" width="380" height="260" rx="20" fill="${c}"/>
      <rect x="190" y="490" width="420" height="72" rx="16" fill="${shade(c, 0.07)}"/>
      <rect x="380" y="490" width="40" height="310" fill="${ribbon}"/>
      <ellipse cx="352" cy="460" rx="58" ry="30" transform="rotate(-20 352 460)" fill="${ribbon}"/>
      <ellipse cx="448" cy="460" rx="58" ry="30" transform="rotate(20 448 460)" fill="${ribbon}"/>
      <circle cx="400" cy="478" r="24" fill="${shade(ribbon, 0.15)}"/>
      <rect x="240" y="600" width="120" height="14" rx="7" fill="#fff" opacity=".35"/>`;
  },
  slipper(c, rnd, opts = {}) {
    let out = "";
    for (const side of [-1, 1]) {
      const cx = CX + side * 108;
      const ears = opts.ears
        ? `<ellipse cx="${cx - 34}" cy="292" rx="24" ry="64" transform="rotate(-14 ${cx - 34} 292)" fill="${c}"/><ellipse cx="${cx - 34}" cy="296" rx="11" ry="44" transform="rotate(-14 ${cx - 34} 296)" fill="${C.pink}"/><ellipse cx="${cx + 34}" cy="292" rx="24" ry="64" transform="rotate(14 ${cx + 34} 292)" fill="${c}"/><ellipse cx="${cx + 34}" cy="296" rx="11" ry="44" transform="rotate(14 ${cx + 34} 296)" fill="${C.pink}"/>`
        : "";
      const teddy = opts.teddy
        ? `<circle cx="${cx - 52}" cy="360" r="30" fill="${shade(c, 0.1)}"/><circle cx="${cx + 52}" cy="360" r="30" fill="${shade(c, 0.1)}"/>`
        : "";
      const band = opts.band === "slide" ? fluff(cx, 520, 98, 58, c, rnd, 30) : fluff(cx, 470, 100, 128, c, rnd);
      out += `<g transform="rotate(${side * 6} ${cx} 560)">
        <ellipse cx="${cx}" cy="570" rx="96" ry="232" fill="${shade(c, 0.14)}"/>
        <ellipse cx="${cx}" cy="610" rx="76" ry="186" fill="${tint(c, 0.5)}"/>
        ${ears}${teddy}${band}
      </g>`;
    }
    return out;
  },
  headphones(c, rnd, opts = {}) {
    const ear = (x1, x2, x3) =>
      `<polygon points="${x1},458 ${x2},378 ${x3},440" fill="${c}" stroke="${c}" stroke-width="10" stroke-linejoin="round"/><polygon points="${x1 + 14},450 ${x2},400 ${x3 - 14},440" fill="${C.pinkDeep}"/>`;
    const bow = mix(c, "#A84D6B", 0.4);
    const bowSvg = opts.bow
      ? `<path d="M400 430 L330 392 L336 470Z" fill="${bow}" stroke="${bow}" stroke-width="14" stroke-linejoin="round"/><path d="M400 430 L470 392 L464 470Z" fill="${bow}" stroke="${bow}" stroke-width="14" stroke-linejoin="round"/><circle cx="400" cy="430" r="20" fill="${shade(bow, 0.15)}"/>`
      : "";
    return `
      ${opts.cat ? ear(268, 300, 348) + ear(452, 500, 532) : ""}
      <path d="M235 600 A165 175 0 0 1 565 600" stroke="${c}" stroke-width="54" fill="none" stroke-linecap="round"/>
      <path d="M235 600 A165 175 0 0 1 565 600" stroke="${tint(c, 0.45)}" stroke-width="18" fill="none" stroke-linecap="round"/>
      ${bowSvg}
      <rect x="172" y="545" width="124" height="205" rx="58" fill="${shade(c, 0.08)}"/>
      <rect x="504" y="545" width="124" height="205" rx="58" fill="${shade(c, 0.08)}"/>
      <rect x="262" y="566" width="44" height="164" rx="22" fill="${tint(c, 0.5)}"/>
      <rect x="494" y="566" width="44" height="164" rx="22" fill="${tint(c, 0.5)}"/>
      <circle cx="224" cy="610" r="14" fill="#fff" opacity=".45"/>`;
  },
  podcase(c, rnd, opts = {}) {
    let ring = "";
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2;
      ring += `<circle cx="${(400 + Math.cos(a) * 112).toFixed(1)}" cy="${(560 + Math.sin(a) * 182).toFixed(1)}" r="${(24 + rnd() * 9).toFixed(1)}" fill="${i % 2 ? c : tint(c, 0.25)}"/>`;
    }
    const strap = opts.strap
      ? `<path d="M400 360 C 560 300, 640 520, 560 760" stroke="${shade(c, 0.3)}" stroke-width="16" fill="none" stroke-linecap="round"/>`
      : "";
    return `
      ${strap}
      <circle cx="400" cy="352" r="30" stroke="${shade(c, 0.35)}" stroke-width="10" fill="none"/>
      ${ring}
      <rect x="296" y="378" width="208" height="364" rx="100" fill="${c}"/>
      ${fluff(400, 560, 80, 150, c, rnd, 40)}
      <rect x="300" y="500" width="200" height="8" rx="4" fill="${shade(c, 0.18)}" opacity=".5"/>`;
  },
  journal(c, rnd, opts = {}) {
    let rings = "";
    if (opts.spiral) {
      for (let y = 320; y <= 760; y += 40)
        rings += `<path d="M240 ${y} q 30 -14 40 6" stroke="${shade(c, 0.45)}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    }
    const spine = opts.spiral
      ? ""
      : `<rect x="255" y="290" width="46" height="500" rx="20" fill="${shade(c, 0.12)}"/>`;
    return `
      <rect x="268" y="300" width="300" height="490" rx="14" fill="#FFFDF9"/>
      <rect x="255" y="290" width="300" height="500" rx="20" fill="${c}"/>
      ${spine}
      <rect x="498" y="290" width="12" height="500" fill="${shade(c, 0.35)}"/>
      <rect x="330" y="380" width="140" height="74" rx="10" fill="${tint(c, 0.65)}"/>
      <rect x="352" y="410" width="96" height="6" rx="3" fill="${shade(c, 0.35)}" opacity=".5"/>
      ${rings}`;
  },
  sticky() {
    const sq = (col, rot, dx, dy) =>
      `<g transform="rotate(${rot} 400 540) translate(${dx} ${dy})"><rect x="270" y="410" width="260" height="260" rx="10" fill="${col}"/><path d="M530 610 L470 670 L470 610Z" fill="${shade(col, 0.12)}"/></g>`;
    return sq(C.beige, -10, -30, 60) + sq(C.lilac, 4, 10, 10) + sq(C.pink, -2, -10, -50);
  },
  mirrorWall(c) {
    let sc = "";
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      sc += `<circle cx="${(400 + Math.cos(a) * 214).toFixed(1)}" cy="${(530 + Math.sin(a) * 214).toFixed(1)}" r="46" fill="${c}"/>`;
    }
    return `<defs><clipPath id="mw"><circle cx="400" cy="530" r="176"/></clipPath></defs>
      ${sc}<circle cx="400" cy="530" r="220" fill="${c}"/>
      <circle cx="400" cy="530" r="186" fill="${shade(c, 0.1)}"/>
      <circle cx="400" cy="530" r="176" fill="${GLASS}"/>${shine("mw")}`;
  },
  mirrorVanity(c) {
    return `<defs><clipPath id="mv"><path d="M308 670 V440 A92 92 0 0 1 492 440 V670Z"/></clipPath></defs>
      <rect x="386" y="680" width="28" height="90" fill="${shade(c, 0.2)}"/>
      <ellipse cx="400" cy="780" rx="120" ry="24" fill="${shade(c, 0.14)}"/>
      <path d="M290 690 V440 A110 110 0 0 1 510 440 V690Z" fill="${c}"/>
      <path d="M308 670 V440 A92 92 0 0 1 492 440 V670Z" fill="${GLASS}"/>${shine("mv")}`;
  },
  mirrorStanding(c) {
    return `<defs><clipPath id="ms"><path d="M306 884 V330 A94 94 0 0 1 494 330 V884Z"/></clipPath></defs>
      <path d="M288 900 V330 A112 112 0 0 1 512 330 V900Z" fill="${c}"/>
      <path d="M306 884 V330 A94 94 0 0 1 494 330 V884Z" fill="${GLASS}"/>${shine("ms")}
      <rect x="300" y="900" width="26" height="22" rx="6" fill="${shade(c, 0.25)}"/>
      <rect x="474" y="900" width="26" height="22" rx="6" fill="${shade(c, 0.25)}"/>`;
  },
  mirrorLed(c) {
    let bulbs = "";
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      bulbs += `<circle cx="${(400 + Math.cos(a) * 168).toFixed(1)}" cy="${(470 + Math.sin(a) * 168).toFixed(1)}" r="12" fill="#FFF7DC"/>`;
    }
    return `<defs><clipPath id="ml"><circle cx="400" cy="470" r="150"/></clipPath></defs>
      <rect x="386" y="660" width="28" height="110" fill="${shade(c, 0.2)}"/>
      <ellipse cx="400" cy="780" rx="130" ry="26" fill="${shade(c, 0.14)}"/>
      <circle cx="400" cy="470" r="196" fill="${c}"/>
      <circle cx="400" cy="470" r="150" fill="${GLASS}"/>${shine("ml")}${bulbs}`;
  },
};

function item({ kind, color, opts, dx = 0, dy = 0, s = 1, rot = 0 }, rnd) {
  const body = kinds[kind](color, rnd, opts);
  return `<g transform="translate(${CX + dx} ${CY + dy}) rotate(${rot}) scale(${s}) translate(${-CX} ${-CY})">${body}</g>`;
}

function scene(items, bg, seed, variant = 1) {
  const rnd = rng(seed);
  const halo = variant === 1 ? [400, 470, 330] : [560, 340, 300];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
    <defs><filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter></defs>
    <rect width="800" height="1000" fill="${bg}"/>
    <circle cx="${halo[0]}" cy="${halo[1]}" r="${halo[2]}" fill="${tint(bg, 0.4)}"/>
    <ellipse cx="400" cy="${variant === 1 ? 830 : 900}" rx="250" ry="28" fill="#4A3040" opacity=".09" filter="url(#blur)"/>
    ${items.map((it) => item(it, rnd)).join("")}
  </svg>`;
}

const products = [
  ["peony-cloud-body-mist", { kind: "mist", color: C.pink }, BG.pink],
  ["vanilla-musk-body-mist", { kind: "mist", color: C.beige }, BG.cream],
  ["rose-oud-eau-de-parfum", { kind: "edp", color: C.pinkDeep }, BG.blush],
  ["soft-amber-eau-de-parfum", { kind: "edp", color: C.amber }, BG.sand],
  ["mini-mist-trio-gift-set", { kind: "giftset", color: C.lilac }, BG.lilac],
  ["bedtime-gift-set", { kind: "giftset", color: C.pink }, BG.cream],
  ["cloud-fluffy-slippers", { kind: "slipper", color: C.pink }, BG.cream],
  ["bunny-ear-slippers", { kind: "slipper", color: C.white, opts: { ears: true } }, BG.pink],
  ["faux-fur-slides", { kind: "slipper", color: C.beige, opts: { band: "slide" } }, BG.sage],
  ["teddy-house-shoes", { kind: "slipper", color: C.beige, opts: { teddy: true } }, BG.sand],
  ["cat-ear-wireless-headphones", { kind: "headphones", color: C.pink, opts: { cat: true } }, BG.lilac],
  ["bow-wireless-headphones", { kind: "headphones", color: C.white, opts: { bow: true } }, BG.blush],
  ["fluffy-airpods-case", { kind: "podcase", color: C.lilac }, BG.pink],
  ["fluffy-earbud-case-with-strap", { kind: "podcase", color: C.pink, opts: { strap: true } }, BG.blue],
  ["linen-dot-grid-journal", { kind: "journal", color: C.beige }, BG.sage],
  ["gratitude-journal", { kind: "journal", color: C.lilac }, BG.cream],
  ["undated-weekly-planner", { kind: "journal", color: C.pink, opts: { spiral: true } }, BG.sand],
  ["pastel-sticky-notes-set", { kind: "sticky", color: C.pink }, BG.blue],
  ["scalloped-wall-mirror", { kind: "mirrorWall", color: C.white }, BG.blush],
  ["arch-vanity-mirror", { kind: "mirrorVanity", color: C.beige }, BG.lilac],
  ["full-length-standing-mirror", { kind: "mirrorStanding", color: C.white }, BG.sage],
  ["led-makeup-mirror", { kind: "mirrorLed", color: C.pink }, BG.cream],
];

const groups = {
  "cat-beauty": [[{ kind: "mist", color: C.pink, dx: -120, s: 0.78 }, { kind: "edp", color: C.amber, dx: 120, dy: 50, s: 0.8 }], BG.pink],
  "cat-footwear": [[{ kind: "slipper", color: C.pink, s: 0.9 }], BG.cream],
  "cat-tech": [[{ kind: "headphones", color: C.lilac, opts: { cat: true }, dy: -60, s: 0.9 }, { kind: "podcase", color: C.pink, dx: 190, dy: 230, s: 0.5 }], BG.blush],
  "cat-stationery": [[{ kind: "journal", color: C.beige, dx: -60, rot: -6, s: 0.85 }, { kind: "sticky", dx: 170, dy: 230, s: 0.5 }], BG.lilac],
  "cat-home": [[{ kind: "mirrorVanity", color: C.white, s: 1.05 }], BG.sand],
  "cat-perfumes": [[{ kind: "edp", color: C.pinkDeep, dx: -110, dy: 40, s: 0.8 }, { kind: "mist", color: C.lilac, dx: 130, s: 0.78 }], BG.cream],
  "cat-fluffy-shoes": [[{ kind: "slipper", color: C.lilac, s: 0.9 }], BG.pink],
  "cat-cute-headphones": [[{ kind: "headphones", color: C.pink, opts: { cat: true }, s: 0.95 }], BG.cream],
  "cat-fluffy-pods": [[{ kind: "podcase", color: C.pink, dx: -110, s: 0.8 }, { kind: "podcase", color: C.white, dx: 120, dy: 40, s: 0.8 }], BG.lilac],
  "cat-notebooks": [[{ kind: "journal", color: C.pink, dx: -70, rot: -5, s: 0.85 }, { kind: "journal", color: C.sage, opts: { spiral: true }, dx: 90, dy: 40, rot: 6, s: 0.8 }], BG.cream],
  "cat-mirrors": [[{ kind: "mirrorWall", color: C.pink, s: 0.95 }], BG.sage],
  "col-new-in": [[{ kind: "slipper", color: C.lilac, dx: -80, s: 0.75 }, { kind: "mist", color: C.pink, dx: 170, dy: 60, s: 0.6 }], BG.cream],
  "col-bestsellers": [[{ kind: "headphones", color: C.pink, opts: { bow: true }, s: 0.95 }], BG.lilac],
  "col-gifts-for-her": [[{ kind: "giftset", color: C.pink, s: 0.95 }], BG.blush],
  "col-under-1500": [[{ kind: "sticky", dx: -90, dy: 40, s: 0.7 }, { kind: "podcase", color: C.lilac, dx: 160, dy: 20, s: 0.62 }], BG.sage],
};

async function write(name, svg, width = 800, height = 1000) {
  await sharp(Buffer.from(svg), { density: 72 * (width / 800) })
    .resize(width, height)
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(OUT, `${name}.webp`));
}

await mkdir(OUT, { recursive: true });

for (const [slug, spec, bg] of products) {
  await write(`${slug}-1`, scene([spec], bg, slug, 1));
  await write(`${slug}-2`, scene([{ ...spec, s: 1.32, rot: -7, dx: 20, dy: 40 }], mix(bg, "#EADFD7", 0.35), `${slug}b`, 2));
}
for (const [name, [items, bg]] of Object.entries(groups)) {
  await write(name, scene(items, bg, name));
}
await write(
  "hero",
  scene(
    [
      { kind: "mirrorStanding", color: C.white, dx: -110, dy: -40, s: 0.95 },
      { kind: "edp", color: C.pinkDeep, dx: 170, dy: 60, s: 0.5 },
      { kind: "slipper", color: C.pink, dx: 90, dy: 300, rot: -70, s: 0.55 },
    ],
    BG.blush,
    "hero",
  ),
  960,
  1200,
);
console.log(`Wrote ${products.length * 2 + Object.keys(groups).length + 1} images to ${OUT}`);
