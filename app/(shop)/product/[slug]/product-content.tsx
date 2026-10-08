import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/layout/PageFrame";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { getCategoryTrail, getProductBySlug } from "@/lib/catalog";
import { badgeFor } from "@/lib/catalog/badge";

/** Product breadcrumb, title, photo and actions. Rendered inside the page's Suspense boundary. */
export async function ProductContent({ params }: Pick<PageProps<"/product/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const trail = await getCategoryTrail(product.category_ids[0]);
  const badge = badgeFor(product);
  const soldOut = product.stock_status === "sold_out";

  return (
    <>
      <PageHeading title={product.name} trail={[...trail, { name: product.name, href: `/product/${product.slug}` }]} />
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-image bg-sand">
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 46vw, calc(100vw - 32px)"
            className="object-cover"
          />
          {badge && <Badge tone={badge.tone} percent={badge.percent} className="absolute top-3 left-3" />}
        </div>
        <div>
          <Price price={product.price} compareAt={product.compare_at_price} size="lg" />
          {product.colours.length > 0 && (
            <p className="mt-4 text-mauve-soft">Colours: {product.colours.map((c) => c.name).join(", ")}</p>
          )}
          <p className="mt-4 text-mauve-soft">
            The full product page with photos, options and add to bag comes in Stage 4.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button size="lg" disabled={soldOut}>
              {soldOut ? "Sold out" : "Add to bag"}
            </Button>
            <WishlistButton productName={product.name} />
          </div>
        </div>
      </div>
    </>
  );
}
