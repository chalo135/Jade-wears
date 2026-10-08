// Shaped like the future Supabase tables so the data source can be swapped
// without touching pages or components.

export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  image: string;
  sort_order: number;
};

export type Colour = {
  name: string;
  hex: string;
};

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductVariant = {
  id: string;
  /** e.g. "50 ml" */
  name: string;
  /** Whole Kenyan shillings. */
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Whole Kenyan shillings. With variants, this is the lowest variant price. */
  price: number;
  compare_at_price: number | null;
  /** Size or style options with their own price. Empty when the product has one price. */
  variants: ProductVariant[];
  images: ProductImage[];
  colours: Colour[];
  stock_status: StockStatus;
  stock_quantity: number | null;
  category_ids: string[];
  collection_ids: string[];
  created_at: string;
};

// View models built by lib/catalog/index.ts.

export type CategoryNode = Category & {
  href: string;
  children: CategoryNode[];
};

export type CategoryTrailItem = { name: string; href: string };

export type ProductListItem = Product & {
  category: { name: string; href: string } | null;
};

export type ShopColour = Colour & { slug: string; href: string };

export type SearchIndex = {
  products: {
    name: string;
    href: string;
    price: number;
    compareAt: number | null;
    image: string;
    category: string;
  }[];
  categories: { name: string; href: string; parent: string | null }[];
  colours: { name: string; href: string; hex: string }[];
};
