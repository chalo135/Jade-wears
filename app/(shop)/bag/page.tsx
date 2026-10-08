import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Bag" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Bag"
      trail={[{ name: "Bag", href: "/bag" }]}
      note="Your bag is empty."
    />
  );
}
