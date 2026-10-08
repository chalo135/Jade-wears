import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Contact us" };

export default function Page() {
  return (
    <PlaceholderPage
      title="Contact us"
      trail={[{ name: "Contact us", href: "/contact" }]}
      note="The quickest way to reach us is the WhatsApp button at the bottom of the screen."
    />
  );
}
