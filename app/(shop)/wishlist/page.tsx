import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Wishlist" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Wishlist"
      trail={[{ name: "Wishlist", href: "/wishlist" }]}
      note="Saved items will appear here once the wishlist is connected."
    />
  );
}
