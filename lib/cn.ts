import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom theme names. Without this it treats
// text-h2 as a colour and drops it when text-mauve is also present.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "cream",
        "blush",
        "blush-deep",
        "rose",
        "deep-rose",
        "rose-ink",
        "sand",
        "mauve",
        "mauve-soft",
        "sage",
        "error",
        "white",
        "whatsapp",
        "whatsapp-deep",
        "mauve-line",
      ],
      text: ["display", "h1", "h2", "h3", "body", "small", "micro"],
      radius: ["card", "image", "field"],
      shadow: ["lift", "pop", "menu"],
      ease: ["soft"],
      font: ["sans", "serif", "accent"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
