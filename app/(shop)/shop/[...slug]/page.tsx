import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeadingSkeleton, ProductGridSkeleton } from "@/components/layout/Skeletons";
import { getAllCategoryPaths, getCategoryByPath } from "@/lib/catalog";
import { CategoryContent } from "./category-content";

export async function generateStaticParams() {
  const paths = await getAllCategoryPaths();
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getCategoryByPath(slug);
  return { title: found?.category.name ?? "Shop" };
}

// params is passed down unawaited: the frame stays in the shared App Shell and
// only the URL-specific content streams in after navigation.
export default function CategoryPage({ params }: PageProps<"/shop/[...slug]">) {
  return (
    <PageFrame footnote="Preview page. The full listing with filters and sorting comes in Stage 3.">
      <Suspense
        fallback={
          <>
            <PageHeadingSkeleton />
            <ProductGridSkeleton className="mt-10" />
          </>
        }
      >
        <CategoryContent params={params} />
      </Suspense>
    </PageFrame>
  );
}
