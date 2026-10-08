import { cn } from "@/lib/cn";
import { formatKES } from "@/lib/money";

type Props = {
  price: number;
  /** Prefix "From" when the product has several sizes at different prices. */
  from?: boolean;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: "text-small", md: "text-body", lg: "text-h3" };

export function Price({ price, compareAt, from = false, size = "md", className }: Props) {
  const onSale = compareAt != null && compareAt > price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", sizes[size], className)}>
      {onSale ? (
        <>
          <span className="sr-only">Sale price</span>
          <span className="font-bold text-rose-ink">{formatKES(price)}</span>
          <span className="sr-only">Original price</span>
          <s className="text-[0.875em] text-mauve-soft">{formatKES(compareAt)}</s>
        </>
      ) : (
        <span className="font-bold text-rose-ink">
          {from && "From "}
          {formatKES(price)}
        </span>
      )}
    </p>
  );
}
