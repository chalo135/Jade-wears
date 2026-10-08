import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame, PageHeading } from "@/components/layout/PageFrame";
import { ProductGridSkeleton, SectionTitleSkeleton } from "@/components/layout/Skeletons";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

async function SearchResults({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  if (!query) {
    return <p className="text-mauve-soft">Type a word into search to see matching products.</p>;
  }
  const products = await searchProducts(query);
  return (
    <section aria-labelledby="search-results">
      <h2 id="search-results" className="text-h2">
        {products.length === 0
          ? `No products match “${query}”`
          : `${products.length} ${products.length === 1 ? "result" : "results"} for “${query}”`}
      </h2>
      {products.length > 0 && <ProductGrid products={products} className="mt-6" />}
    </section>
  );
}

// The breadcrumb and title don't depend on the query, so they stay in the frame.
export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <PageFrame footnote="Preview page. Full search with filters comes in Stage 3.">
      <PageHeading title="Search" trail={[{ name: "Search", href: "/search" }]} />
      <div className="mt-10">
        <Suspense
          fallback={
            <>
              <SectionTitleSkeleton />
              <ProductGridSkeleton count={4} className="mt-6" />
            </>
          }
        >
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </PageFrame>
  );
}
