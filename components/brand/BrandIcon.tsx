import type { SimpleIcon } from "simple-icons";
import { cn } from "@/lib/cn";

type Props = {
  icon: SimpleIcon;
  /** "brand" uses the official brand colour; "current" inherits the text colour (monochrome). */
  color?: "brand" | "current";
  className?: string;
};

/** Renders a Simple Icons (CC0) brand mark as inline SVG, unaltered. Decorative: label the parent. */
export function BrandIcon({ icon, color = "current", className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      fill={color === "brand" ? `#${icon.hex}` : "currentColor"}
    >
      <path d={icon.path} />
    </svg>
  );
}
