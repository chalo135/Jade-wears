import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/PageFrame";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProductsByColour, getShopColour } from "@/lib/catalog";

/** Colour title, breadcrumb and products. Rendered inside the page's Suspense boundary. */
export async function ColourContent({ params }: Pick<PageProps<"/collections/colour/[family]">, "params">) {
  const { family } = await params;
  const colour = await getShopColour(family);
  if (!colour) notFound();
  const products = await getProductsByColour(colour.slug);

  return (
    <>
      <PageHeading
        title={colour.name}
        trail={[
          { name: "Shop by colour", href: "/collections/colour" },
          { name: colour.name, href: colour.href },
        ]}
        note={`${products.length} ${products.length === 1 ? "product" : "products"} in ${colour.name.toLowerCase()}, across every category.`}
      />
      <ProductGrid products={products} className="mt-10" />
    </>
  );
}
