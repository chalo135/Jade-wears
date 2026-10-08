import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Track my order" };

export default function Page() {
  return <PlaceholderPage title="Track my order" trail={[{ name: "Track my order", href: "/track-order" }]} note="Order tracking comes in a later stage. For now, chat with us on WhatsApp with your order number." />;
}
