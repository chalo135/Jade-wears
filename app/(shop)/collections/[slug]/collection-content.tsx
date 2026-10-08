import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/PageFrame";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCollection, getProductsByCollection } from "@/lib/catalog";

/** Collection title, breadcrumb and products. Rendered inside the page's Suspense boundary. */
export async function CollectionContent({ params }: Pick<PageProps<"/collections/[slug]">, "params">) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();
  const products = await getProductsByCollection(slug);

  return (
    <>
      <PageHeading
        title={collection.name}
        trail={[{ name: collection.name, href: `/collections/${collection.slug}` }]}
      />
      <ProductGrid products={products} className="mt-10" />
    </>
  );
}
