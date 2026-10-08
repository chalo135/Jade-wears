import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeadingSkeleton, ProductGridSkeleton } from "@/components/layout/Skeletons";
import { getShopColour, getShopColours } from "@/lib/catalog";
import { ColourContent } from "./colour-content";

export async function generateStaticParams() {
  const colours = await getShopColours();
  return colours.map((c) => ({ family: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/colour/[family]">): Promise<Metadata> {
  const { family } = await params;
  const colour = await getShopColour(family);
  return { title: colour ? `${colour.name} things` : "Shop by colour" };
}

export default function ColourPage({ params }: PageProps<"/collections/colour/[family]">) {
  return (
    <PageFrame footnote="Preview page. The full colour filter comes in Stage 3.">
      <Suspense
        fallback={
          <>
            <PageHeadingSkeleton withNote />
            <ProductGridSkeleton className="mt-10" />
          </>
        }
      >
        <ColourContent params={params} />
      </Suspense>
    </PageFrame>
  );
}
