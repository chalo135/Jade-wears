// Labelled pastel placeholders for the About page, so the client can see which photos to send.
// Run with: node scripts/make-about-placeholders.mjs
// Skips any file that already exists, so real photos are never overwritten.
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "about");

const tones = [
  ["#F8E1E7", "#FCEFF2"],
  ["#F1E7DF", "#F8F1EB"],
  ["#F1EBF8", "#F8F4FC"],
  ["#EBF0E7", "#F4F7F1"],
];

const images = [
  // [file, label, width, height]
  ["opening-portrait", "Founder or shop portrait", 900, 1200],
  ["founder-at-work", "Founder at work", 900, 1200],
  ["milestone-first-order", "Milestone photo: the first order", 900, 1200],
  ["milestone-pickup", "Milestone photo: the pickup point", 900, 1200],
  ["team-1", "Team photo: founder", 900, 1200],
  ["team-1-candid", "Team photo: founder, candid", 900, 1200],
  ["team-2", "Team photo: team member 2", 900, 1200],
  ["team-3", "Team photo: team member 3", 900, 1200],
  ["bts-packing", "Packing orders", 900, 1125],
  ["bts-shelf", "The shelf", 900, 1125],
  ["bts-wrapping", "Wrapping a gift set", 900, 1125],
  ["bts-stock", "New stock arriving", 900, 1125],
  ["bts-pickup", "Pickup day", 900, 1125],
];

function escape(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function wrap(label, max = 18) {
  const lines = [];
  let line = "";
  for (const word of label.split(" ")) {
    if ((line + " " + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function svg(label, w, h, [bg, soft]) {
  const lines = wrap(label);
  const cy = h * 0.52 - ((lines.length - 1) * 64) / 2;
  const text = lines
    .map(
      (l, i) =>
        `<text x="${w / 2}" y="${cy + i * 64}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="54" fill="#6E5060">${escape(l)}</text>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <path d="M ${w * 0.18} ${h * 0.86} V ${h * 0.42} A ${w * 0.32} ${w * 0.32} 0 0 1 ${w * 0.82} ${h * 0.42} V ${h * 0.86} Z" fill="${soft}"/>
    <circle cx="${w / 2}" cy="${h * 0.3}" r="${w * 0.07}" fill="#EFC3D0" opacity=".7"/>
    ${text}
    <text x="${w / 2}" y="${h * 0.8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" letter-spacing="3" fill="#8E3A57">PHOTO NEEDED</text>
  </svg>`;
}

await mkdir(OUT, { recursive: true });
let written = 0;
for (const [i, [file, label, w, h]] of images.entries()) {
  const out = path.join(OUT, `${file}.webp`);
  if (existsSync(out)) continue;
  await sharp(Buffer.from(svg(label, w, h, tones[i % tones.length])))
    .webp({ quality: 78 })
    .toFile(out);
  written++;
}
console.log(`Wrote ${written} placeholder(s) to ${OUT}`);
