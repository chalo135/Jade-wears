import type { ProductListItem } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { ProductCard } from "./ProductCard";

const SIZES = "(min-width: 1280px) 296px, (min-width: 1024px) 23vw, (min-width: 640px) 42vw, 70vw";

/** Snap-scrolling rail on mobile (cards about 70% wide), 4-column grid on desktop. */
export function ProductRail({ products, label, className }: { products: ProductListItem[]; label: string; className?: string }) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "rail -mx-4 scroll-px-4 gap-3 px-4 py-2 sm:-mx-6 sm:scroll-px-6 sm:px-6",
        "lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0",
        className,
      )}
    >
      {products.map((p) => (
        <li key={p.id} className="w-[70%] sm:w-[42%] lg:w-auto">
          <ProductCard product={p} sizes={SIZES} />
        </li>
      ))}
    </ul>
  );
}
