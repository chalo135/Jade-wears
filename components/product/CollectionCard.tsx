import Link from "next/link";
import type { Collection } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

// Tone follows position, so reordering collections (sort_order) keeps the colour rhythm.
const tones = [
  "bg-blush text-mauve hover:bg-blush-deep",
  "bg-sand text-mauve hover:bg-blush",
  "bg-deep-rose text-white hover:bg-rose-ink",
  "bg-blush text-mauve hover:bg-blush-deep",
];
const linkTones = ["text-rose-ink", "text-rose-ink", "text-white", "text-rose-ink"];

type Props = {
  collection: Collection;
  index: number;
  compact?: boolean;
  onNavigate?: () => void;
};

export function CollectionCard({ collection, index, compact = false, onNavigate }: Props) {
  const tone = index % tones.length;
  return (
    <Link
      href={`/collections/${collection.slug}`}
      onClick={onNavigate}
      className={cn(
        "flex flex-col justify-between rounded-card p-5 transition-colors duration-200 ease-soft",
        compact ? "min-h-36" : "min-h-36 sm:min-h-40 lg:min-h-44 lg:p-6",
        tones[tone],
      )}
    >
      <span className={cn("font-serif leading-tight", compact ? "text-h3" : "text-h3 lg:text-[1.75rem]")}>
        {collection.name}
      </span>
      <span className={cn("mt-6 text-small font-bold", linkTones[tone])}>Shop now →</span>
    </Link>
  );
}
