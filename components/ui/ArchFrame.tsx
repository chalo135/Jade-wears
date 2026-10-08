import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type ArchRatio = "3/4" | "4/5" | "2/3";

// Vertical radius = half the width as a percentage of the height.
const ratios: Record<ArchRatio, { aspect: string; ry: string }> = {
  "3/4": { aspect: "aspect-[3/4]", ry: "37.5%" },
  "4/5": { aspect: "aspect-[4/5]", ry: "40%" },
  "2/3": { aspect: "aspect-[2/3]", ry: "33.333%" },
};

type Props = {
  src: string;
  alt: string;
  sizes: string;
  /** Optional second photo that crossfades in on hover (mouse devices only; touch devices never fetch it). */
  hoverSrc?: string;
  ratio?: ArchRatio;
  bevel?: boolean;
  intro?: boolean;
  preload?: boolean;
  className?: string;
  imageClassName?: string;
};

export function ArchFrame({
  src,
  alt,
  sizes,
  hoverSrc,
  ratio = "3/4",
  bevel = false,
  intro = false,
  preload = false,
  className,
  imageClassName,
}: Props) {
  const r = ratios[ratio];
  return (
    <div
      className={cn("group/arch arch relative isolate overflow-hidden bg-sand", r.aspect, className)}
      style={{ "--arch-ry": r.ry } as CSSProperties}
    >
      <div className={cn("absolute inset-0", intro && "arch-intro")}>
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={cn("object-cover", imageClassName)} />
        {hoverSrc && (
          <Image
            src={hoverSrc}
            alt=""
            fill
            sizes={sizes}
            className="hidden object-cover opacity-0 transition-opacity duration-500 ease-soft group-hover/arch:opacity-100 [@media(hover:hover)]:block"
          />
        )}
      </div>
      {bevel && (
        <span
          aria-hidden="true"
          className="arch pointer-events-none absolute inset-[5px] border border-white/70 shadow-[inset_0_0_0_1px_rgb(74_48_64/0.06)]"
          style={{ "--arch-ry": r.ry } as CSSProperties}
        />
      )}
    </div>
  );
}
