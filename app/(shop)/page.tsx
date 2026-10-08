import { CategoryTiles } from "@/components/home/CategoryTiles";
import { ColourSwatches } from "@/components/home/ColourSwatches";
import { Hero } from "@/components/home/Hero";
import { ShopByBudget } from "@/components/home/ShopByBudget";
import { CollectionCard } from "@/components/product/CollectionCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategoryTree, getCollections, getProductsByCollection, getShopColours } from "@/lib/catalog";

export default async function HomePage() {
  const [categories, collections, colours, newIn] = await Promise.all([
    getCategoryTree(),
    getCollections(),
    getShopColours(),
    getProductsByCollection("new-in", 4),
  ]);

  const subcategory = (slug: string) => categories.flatMap((c) => c.children).find((c) => c.slug === slug);
  const budgetImages = {
    main: subcategory("perfumes")?.image ?? null,
    inset: subcategory("notebooks")?.image ?? null,
  };

  return (
    <>
      <Hero featured={newIn[0] ?? null} />

      <section aria-labelledby="categories-title" className="page-x py-10 sm:py-14">
        <SectionHeading id="categories-title" title="Shop by category" action={{ label: "Shop all", href: "/shop" }} />
        <CategoryTiles categories={categories} />
      </section>

      <section aria-labelledby="curated-title" className="page-x py-10 sm:py-14">
        <SectionHeading id="curated-title" title="Curated for you" />
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {collections.map((c, i) => (
            <li key={c.id}>
              <CollectionCard collection={c} index={i} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="new-in-title" className="page-x py-10 sm:py-14">
        <SectionHeading
          id="new-in-title"
          title="New in"
          action={{ label: "View all new in", href: "/collections/new-in" }}
        />
        <ProductGrid products={newIn} className="mt-6" />
      </section>

      <ShopByBudget images={budgetImages} />

      <section aria-labelledby="colour-title" className="page-x pt-4 pb-14 sm:pb-20">
        <h2 id="colour-title" className="text-center text-h2">
          Shop by colour
        </h2>
        <ColourSwatches colours={colours} />
      </section>
    </>
  );
}
