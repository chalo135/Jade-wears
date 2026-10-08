import { cn } from "@/lib/cn";
import type { BadgeTone } from "@/lib/catalog/badge";

// Every tone is at least 4.5:1 (see lib/tokens.ts).
const tones: Record<BadgeTone, string> = {
  new: "bg-white text-mauve",
  bestseller: "bg-deep-rose text-white",
  sale: "bg-rose-ink text-white",
  soldout: "bg-mauve text-cream",
  gift: "bg-white text-sage",
};

const labels: Record<Exclude<BadgeTone, "sale">, string> = {
  new: "New",
  bestseller: "Bestseller",
  soldout: "Sold out",
  gift: "Gift ready",
};

type Props = { tone: BadgeTone; percent?: number; className?: string };

export function Badge({ tone, percent, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-[0.75rem] font-bold tracking-[0.08em] whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      {tone === "sale" ? (
        <>
          <span aria-hidden="true">{`\u2212${percent ?? 0}%`}</span>
          <span className="sr-only">{`${percent ?? 0}% off`}</span>
        </>
      ) : (
        labels[tone]
      )}
    </span>
  );
}
