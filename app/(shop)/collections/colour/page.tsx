import type { Metadata } from "next";
import { ColourSwatches } from "@/components/home/ColourSwatches";
import { PageFrame, PageHeading } from "@/components/layout/PageFrame";
import { getShopColours } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop by colour" };

export default async function ColourIndexPage() {
  const colours = await getShopColours();
  return (
    <PageFrame>
      <PageHeading
        title="Shop by colour"
        trail={[{ name: "Shop by colour", href: "/collections/colour" }]}
        note="Pick a colour to see it across every category."
      />
      <div className="mt-8 flex">
        <ColourSwatches colours={colours} />
      </div>
    </PageFrame>
  );
}
