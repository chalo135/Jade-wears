import { cacheLife } from "next/cache";
import { categories, collections, colours, products, shopColourKeys } from "./mock";
import type {
  CategoryNode,
  CategoryTrailItem,
  Collection,
  Product,
  ProductListItem,
  SearchIndex,
  ShopColour,
} from "./types";

export type * from "./types";

// Pages call only these functions. Stage 2 swaps the mock arrays for Supabase
// queries; the signatures and return shapes stay the same.

function buildTree(): CategoryNode[] {
  const byParent = new Map<string | null, typeof categories>();
  for (const c of categories) {
    const list = byParent.get(c.parent_id) ?? [];
    list.push(c);
    byParent.set(c.parent_id, list);
  }
  const walk = (parentId: string | null, base: string): CategoryNode[] =>
    (byParent.get(parentId) ?? [])
      .toSorted((a, b) => a.sort_order - b.sort_order)
      .map((c) => {
        const href = `${base}/${c.slug}`;
        return { ...c, href, children: walk(c.id, href) };
      });
  return walk(null, "/shop");
}

function flatten(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((n) => [n, ...flatten(n.children)]);
}

function toListItem(product: Product, nodes: CategoryNode[]): ProductListItem {
  const cat = nodes.find((n) => n.id === product.category_ids[0]);
  return { ...product, category: cat ? { name: cat.name, href: cat.href } : null };
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  "use cache";
  cacheLife("hours");
  return buildTree();
}

export async function getCategoryByPath(
  segments: string[],
): Promise<{ category: CategoryNode; trail: CategoryTrailItem[] } | null> {
  "use cache";
  cacheLife("hours");
  let level = buildTree();
  const trail: CategoryTrailItem[] = [];
  let found: CategoryNode | undefined;
  for (const slug of segments) {
    found = level.find((c) => c.slug === slug);
    if (!found) return null;
    trail.push({ name: found.name, href: found.href });
    level = found.children;
  }
  return found ? { category: found, trail } : null;
}

export async function getAllCategoryPaths(): Promise<string[][]> {
  "use cache";
  cacheLife("hours");
  return flatten(buildTree()).map((n) => n.href.replace(/^\/shop\//, "").split("/"));
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("hours");
  return collections.toSorted((a, b) => a.sort_order - b.sort_order);
}

export async function getCollection(slug: string): Promise<Collection | null> {
  "use cache";
  cacheLife("hours");
  return collections.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCollection(slug: string, limit?: number): Promise<ProductListItem[]> {
  "use cache";
  cacheLife("hours");
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return [];
  const nodes = flatten(buildTree());
  const list = products
    .filter((p) => p.collection_ids.includes(collection.id))
    .toSorted((a, b) => b.created_at.localeCompare(a.created_at))
    .map((p) => toListItem(p, nodes));
  return limit ? list.slice(0, limit) : list;
}

export async function getProductBySlug(slug: string): Promise<ProductListItem | null> {
  "use cache";
  cacheLife("hours");
  const product = products.find((p) => p.slug === slug);
  return product ? toListItem(product, flatten(buildTree())) : null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  return products.map((p) => p.slug);
}

export async function getShopColours(): Promise<ShopColour[]> {
  "use cache";
  cacheLife("hours");
  return shopColourKeys.map((key) => ({
    ...colours[key],
    slug: key,
    href: `/collections/colour/${key}`,
  }));
}

export async function searchProducts(query: string): Promise<ProductListItem[]> {
  "use cache";
  cacheLife("hours");
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const nodes = flatten(buildTree());
  return products
    .map((p) => toListItem(p, nodes))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.colours.some((c) => c.name.toLowerCase() === q),
    );
}

export async function getProductsByColour(colourSlug: string): Promise<ProductListItem[]> {
  "use cache";
  cacheLife("hours");
  const colour = (colours as Record<string, { name: string }>)[colourSlug];
  if (!colour) return [];
  const nodes = flatten(buildTree());
  return products
    .filter((p) => p.colours.some((c) => c.name === colour.name))
    .map((p) => toListItem(p, nodes));
}

export async function getProductsInCategory(categoryId: string, limit?: number): Promise<ProductListItem[]> {
  "use cache";
  cacheLife("hours");
  const nodes = flatten(buildTree());
  const root = nodes.find((n) => n.id === categoryId);
  if (!root) return [];
  const ids = new Set(flatten([root]).map((n) => n.id));
  const list = products
    .filter((p) => p.category_ids.some((id) => ids.has(id)))
    .map((p) => toListItem(p, nodes));
  return limit ? list.slice(0, limit) : list;
}

export async function getCategoryTrail(categoryId: string): Promise<CategoryTrailItem[]> {
  "use cache";
  cacheLife("hours");
  const nodes = flatten(buildTree());
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const trail: CategoryTrailItem[] = [];
  for (let node = byId.get(categoryId); node; node = node.parent_id ? byId.get(node.parent_id) : undefined) {
    trail.unshift({ name: node.name, href: node.href });
  }
  return trail;
}

export async function getShopColour(slug: string): Promise<ShopColour | null> {
  "use cache";
  cacheLife("hours");
  const key = shopColourKeys.find((k) => k === slug);
  return key ? { ...colours[key], slug: key, href: `/collections/colour/${key}` } : null;
}

/** Products whose price (lowest size for products with variants) is within [min, max]. */
export async function getProductsByPrice(min: number | null, max: number | null): Promise<ProductListItem[]> {
  "use cache";
  cacheLife("hours");
  const nodes = flatten(buildTree());
  return products
    .filter((p) => (min === null || p.price >= min) && (max === null || p.price <= max))
    .toSorted((a, b) => a.price - b.price)
    .map((p) => toListItem(p, nodes));
}

/** Small index the search overlay matches against on the client. */
export async function getSearchIndex(): Promise<SearchIndex> {
  "use cache";
  cacheLife("hours");
  const nodes = flatten(buildTree());
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return {
    products: products.map((p) => {
      const item = toListItem(p, nodes);
      return {
        name: p.name,
        href: `/product/${p.slug}`,
        price: p.price,
        compareAt: p.compare_at_price,
        image: p.images[0].src,
        category: item.category?.name ?? "",
      };
    }),
    categories: nodes.map((n) => ({
      name: n.name,
      href: n.href,
      parent: n.parent_id ? (byId.get(n.parent_id)?.name ?? null) : null,
    })),
    colours: shopColourKeys.map((key) => ({
      name: colours[key].name,
      hex: colours[key].hex,
      href: `/collections/colour/${key}`,
    })),
  };
}
