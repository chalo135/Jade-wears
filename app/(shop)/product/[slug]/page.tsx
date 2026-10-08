import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeadingSkeleton, ProductDetailSkeleton } from "@/components/layout/Skeletons";
import { getAllProductSlugs, getProductBySlug } from "@/lib/catalog";
import { ProductContent } from "./product-content";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return (
    <PageFrame>
      <Suspense
        fallback={
          <>
            <PageHeadingSkeleton />
            <ProductDetailSkeleton className="mt-10" />
          </>
        }
      >
        <ProductContent params={params} />
      </Suspense>
    </PageFrame>
  );
}
