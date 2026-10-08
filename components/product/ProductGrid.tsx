import type { ProductListItem } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { ProductCard } from "./ProductCard";

const SIZES = "(min-width: 1280px) 296px, (min-width: 1024px) 23vw, 47vw";

/** 2 columns on mobile, 4 on desktop, with the CSS scroll reveal. */
export function ProductGrid({ products, className }: { products: ProductListItem[]; className?: string }) {
  return (
    <ul className={cn("reveal grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4", className)}>
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} sizes={SIZES} />
        </li>
      ))}
    </ul>
  );
}
