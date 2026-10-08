import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageFrame, PageHeading } from "@/components/layout/PageFrame";
import { ProductGridSkeleton, SectionTitleSkeleton, TextLineSkeleton } from "@/components/layout/Skeletons";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductsByColour, getProductsByPrice, getShopColours } from "@/lib/catalog";
import { formatKES } from "@/lib/money";

export const metadata: Metadata = { title: "Shop" };

type SearchParams = PageProps<"/shop">["searchParams"];

function toShillings(value: string | string[] | undefined): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

function priceLabel(min: number | null, max: number | null) {
  if (min !== null && max !== null) return `${formatKES(min)} – ${max.toLocaleString("en-KE")}`;
  if (max !== null) return `Under ${formatKES(max)}`;
  if (min !== null) return `${formatKES(min)}+`;
  return "All products";
}

/** Reads ?minPrice= and ?maxPrice= (whole shillings, inclusive) and the older ?colour= filter. */
async function ShopResults({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const colours = await getShopColours();
  const colourSlug = typeof params.colour === "string" ? params.colour.toLowerCase() : "";
  const colour = colours.find((c) => c.slug === colourSlug);
  const min = toShillings(params.minPrice);
  const max = toShillings(params.maxPrice);

  const products = colour ? await getProductsByColour(colour.slug) : await getProductsByPrice(min, max);
  const title = colour ? colour.name : priceLabel(min, max);

  return (
    <section aria-labelledby="shop-results">
      <h2 id="shop-results" className="text-h2">
        {title}
      </h2>
      <p className="mt-2 text-mauve-soft">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>
      <ProductGrid products={products} className="mt-6" />
    </section>
  );
}

const filters = [
  { label: "All products", href: "/shop" },
  { label: `Under ${formatKES(1500)}`, href: "/shop?maxPrice=1500" },
  { label: `${formatKES(1500)} – 3,000`, href: "/shop?minPrice=1500&maxPrice=3000" },
  { label: `${formatKES(3000)}+`, href: "/shop?minPrice=3000" },
];

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <PageFrame footnote="Preview page. Full filters for category, colour and price come in Stage 3.">
      <PageHeading title="Shop" trail={[{ name: "Shop", href: "/shop" }]} />
      <nav aria-label="Price" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {filters.map((b) => (
            <li key={b.href}>
              <Link
                href={b.href}
                className="inline-flex h-11 items-center rounded-full bg-white px-4 text-small font-semibold transition-colors hover:bg-sand"
              >
                {b.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-10">
        <Suspense
          fallback={
            <>
              <SectionTitleSkeleton />
              <TextLineSkeleton className="mt-2" />
              <ProductGridSkeleton className="mt-6" />
            </>
          }
        >
          <ShopResults searchParams={searchParams} />
        </Suspense>
      </div>
    </PageFrame>
  );
}
