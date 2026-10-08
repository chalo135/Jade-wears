import { percentOff } from "@/lib/money";
import type { Product } from "./types";

export type BadgeTone = "new" | "bestseller" | "sale" | "soldout" | "gift";
export type ProductBadge = { tone: BadgeTone; percent?: number };

/** One badge per card: sold out, then sale %, then new, bestseller, gift. */
export function badgeFor(product: Product): ProductBadge | null {
  if (product.stock_status === "sold_out") return { tone: "soldout" };
  const off = percentOff(product.price, product.compare_at_price);
  if (off > 0) return { tone: "sale", percent: off };
  if (product.collection_ids.includes("k-new-in")) return { tone: "new" };
  if (product.collection_ids.includes("k-bestsellers")) return { tone: "bestseller" };
  if (product.collection_ids.includes("k-gifts-for-her")) return { tone: "gift" };
  return null;
}
