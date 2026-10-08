export const palette = {
  cream: { hex: "#FFF9F6", use: "Page background" },
  blush: { hex: "#F6D6DE", use: "Section backgrounds" },
  "blush-deep": { hex: "#EFC3D0", use: "Soft button hover" },
  rose: { hex: "#D98BA3", use: "Decoration only, never text or meaningful icons" },
  "deep-rose": { hex: "#A84D6B", use: "Buttons on cream or white" },
  "rose-ink": { hex: "#8E3A57", use: "Links and text on blush or sand, primary hover, sale prices" },
  sand: { hex: "#EADFD7", use: "Cards, dividers, image wells" },
  mauve: { hex: "#4A3040", use: "Headings and body text" },
  "mauve-soft": { hex: "#6E5060", use: "Secondary text" },
  sage: { hex: "#4F6B4F", use: "In stock" },
  error: { hex: "#A3303A", use: "Errors" },
  white: { hex: "#FFFFFF", use: "Cards on blush, badges" },
  "mauve-line": { hex: "#D9C5CE", use: "Footer social button borders" },
} as const;

export type ColorName = keyof typeof palette;

export type ColorPair = { fg: ColorName; bg: ColorName; use: string };

/** Text pairings we use. All must reach 4.5:1 (normal-size text). */
export const approvedPairs: ColorPair[] = [
  { fg: "mauve", bg: "cream", use: "Headings and body" },
  { fg: "mauve", bg: "blush", use: "Text on blush bands, footer social icons on hover" },
  { fg: "mauve", bg: "sand", use: "Text on sand" },
  { fg: "mauve", bg: "white", use: "Card text" },
  { fg: "mauve", bg: "blush-deep", use: "Soft button hover" },
  { fg: "mauve-soft", bg: "cream", use: "Secondary text" },
  { fg: "mauve-soft", bg: "blush", use: "Secondary text on blush" },
  { fg: "mauve-soft", bg: "sand", use: "Secondary text on sand" },
  { fg: "mauve-soft", bg: "white", use: "Secondary text in cards" },
  { fg: "white", bg: "deep-rose", use: "Primary button, Bestseller badge, New In card" },
  { fg: "white", bg: "rose-ink", use: "Primary hover, Sale badge" },
  { fg: "deep-rose", bg: "cream", use: "Accent text on cream" },
  { fg: "deep-rose", bg: "white", use: "Accent text on white" },
  { fg: "rose-ink", bg: "cream", use: "Links on cream" },
  { fg: "rose-ink", bg: "blush", use: "Links on blush" },
  { fg: "rose-ink", bg: "sand", use: "Links on sand" },
  { fg: "rose-ink", bg: "white", use: "Sale price" },
  { fg: "mauve", bg: "rose", use: "Slogan band (large text)" },
  { fg: "cream", bg: "mauve", use: "Footer, Sold out badge" },
  { fg: "blush", bg: "mauve", use: "Footer social icons and headings" },
  { fg: "sage", bg: "cream", use: "In stock" },
  { fg: "sage", bg: "white", use: "Gift ready badge" },
  { fg: "error", bg: "cream", use: "Errors" },
  { fg: "error", bg: "white", use: "Errors in cards" },
];

/** Pairings that fail WCAG AA. Never use them for text. */
export const rejectedPairs: ColorPair[] = [
  { fg: "deep-rose", bg: "blush", use: "Use rose-ink instead" },
  { fg: "deep-rose", bg: "sand", use: "Use rose-ink instead" },
  { fg: "rose", bg: "cream", use: "Rose is decoration only" },
  { fg: "white", bg: "rose", use: "Rose is decoration only" },
];
