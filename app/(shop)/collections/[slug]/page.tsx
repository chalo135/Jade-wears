import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeadingSkeleton, ProductGridSkeleton } from "@/components/layout/Skeletons";
import { getCollection, getCollections } from "@/lib/catalog";
import { CollectionContent } from "./collection-content";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  return { title: collection?.name ?? "Collection" };
}

export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <PageFrame footnote="Preview page. The full collection page with filters and sorting comes in Stage 3.">
      <Suspense
        fallback={
          <>
            <PageHeadingSkeleton />
            <ProductGridSkeleton className="mt-10" />
          </>
        }
      >
        <CollectionContent params={params} />
      </Suspense>
    </PageFrame>
  );
}
