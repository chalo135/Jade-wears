import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { badgeFor } from "@/lib/catalog/badge";
import type { ProductListItem } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { WishlistButton } from "./WishlistButton";

const MAX_SWATCHES = 4;
const LOW_STOCK_AT = 5;

type Props = {
  product: ProductListItem;
  sizes: string;
  className?: string;
};

export function ProductCard({ product, sizes, className }: Props) {
  const badge = badgeFor(product);
  const [first, second] = product.images;
  const shown = product.colours.slice(0, MAX_SWATCHES);
  const extra = product.colours.length - shown.length;
  const hasSizes = new Set(product.variants.map((v) => v.price)).size > 1;
  const lowStock =
    product.stock_status === "low_stock" &&
    product.stock_quantity != null &&
    product.stock_quantity > 0 &&
    product.stock_quantity <= LOW_STOCK_AT;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-image",
        "transition-[translate] duration-300 ease-soft hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-image bg-sand transition-shadow duration-300 ease-soft group-hover:shadow-lift">
        {first && <Image src={first.src} alt="" fill sizes={sizes} className="object-cover" />}
        {second && (
          // Hover-only devices load the second photo; touch devices never fetch it.
          <Image
            src={second.src}
            alt=""
            fill
            sizes={sizes}
            className="hidden object-cover opacity-0 transition-opacity duration-500 ease-soft group-hover:opacity-100 [@media(hover:hover)]:block"
          />
        )}
        {badge && <Badge tone={badge.tone} percent={badge.percent} className="absolute top-2.5 left-2.5 z-[2]" />}
      </div>

      <WishlistButton productName={product.name} className="absolute top-1 right-1 z-[2]" />

      <div className="flex flex-1 flex-col gap-0.5 px-0.5 pt-3">
        {product.category && <p className="text-micro text-rose-ink">{product.category.name}</p>}
        <h3 className="font-sans text-body leading-snug font-bold">
          <Link
            href={`/product/${product.slug}`}
            className={cn(
              "stretched-link outline-none after:rounded-card",
              "focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[var(--focus-ring)]",
            )}
          >
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} compareAt={product.compare_at_price} from={hasSizes} size="sm" />

        {(product.colours.length > 1 || lowStock) && (
          <div className="mt-auto flex min-h-5 flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-1">
            {product.colours.length > 1 && (
              <ul aria-label="Colours" className="flex items-center gap-1.5">
                {shown.map((c) => (
                  <li key={c.name}>
                    <span
                      className="block size-3.5 rounded-full ring-1 ring-mauve/20 ring-inset"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="sr-only">{c.name}</span>
                  </li>
                ))}
                {extra > 0 && (
                  <li className="text-micro text-mauve-soft">
                    +{extra}
                    <span className="sr-only"> more</span>
                  </li>
                )}
              </ul>
            )}
            {lowStock && <p className="text-micro font-semibold text-rose-ink">Only {product.stock_quantity} left</p>}
          </div>
        )}
      </div>
    </article>
  );
}
