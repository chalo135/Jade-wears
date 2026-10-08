"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  productName: string;
  initialSaved?: boolean;
  className?: string;
};

// Local state only for now; wired to the wishlist store in Stage 5.
export function WishlistButton({ productName, initialSaved = false, className }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  // Bumped on each save so the pop animation replays.
  const [pops, setPops] = useState(0);

  function toggle() {
    const next = !saved;
    setSaved(next);
    if (next) setPops((n) => n + 1);
  }

  const popping = saved && pops > 0;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${productName} to wishlist`}
      onClick={toggle}
      className={cn("group/heart relative grid size-11 place-items-center rounded-full", className)}
    >
      <span className="grid size-9 place-items-center rounded-full bg-white/90 transition-colors duration-200 ease-soft group-hover/heart:bg-white">
        <span key={pops} className={cn("relative grid place-items-center", popping && "animate-heart-pop")}>
          <Heart
            aria-hidden="true"
            strokeWidth={1.75}
            className={cn(
              "size-[18px] transition-colors duration-200",
              saved ? "fill-deep-rose text-deep-rose" : "text-mauve",
            )}
          />
          {popping && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2.5 animate-ring-burst rounded-full border-2 border-rose"
            />
          )}
        </span>
      </span>
    </button>
  );
}
