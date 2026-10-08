import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/PageFrame";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { getCategoryByPath, getProductsInCategory } from "@/lib/catalog";

/** Everything on the category page that depends on the URL. Rendered inside the page's Suspense boundary. */
export async function CategoryContent({ params }: Pick<PageProps<"/shop/[...slug]">, "params">) {
  const { slug } = await params;
  const found = await getCategoryByPath(slug);
  if (!found) notFound();
  const { category, trail } = found;
  const products = await getProductsInCategory(category.id);

  return (
    <>
      <PageHeading title={category.name} trail={trail} />

      {category.children.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {category.children.map((child) => (
            <li key={child.id}>
              <Link href={child.href} className="group block">
                {child.image && (
                  <ArchFrame
                    src={child.image}
                    alt=""
                    ratio="3/4"
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 46vw"
                  />
                )}
                <span className="mt-3 block font-serif text-h3 font-medium group-hover:text-rose-ink">
                  {child.name}
                </span>
              </Link>
              {child.children.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {child.children.map((leaf) => (
                    <li key={leaf.id}>
                      <Link
                        href={leaf.href}
                        className="inline-flex h-11 items-center rounded-full bg-white px-4 text-small transition-colors hover:bg-sand"
                      >
                        {leaf.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {products.length > 0 && (
        <section aria-labelledby="category-products" className="mt-14">
          <h2 id="category-products" className="text-h2">
            {products.length === 1 ? "1 product" : `${products.length} products`}
          </h2>
          <ProductGrid products={products} className="mt-6" />
        </section>
      )}
    </>
  );
}
