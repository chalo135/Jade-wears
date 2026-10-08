import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "FAQ" };

export default function Page() {
  return (
    <PlaceholderPage
      title="FAQ"
      trail={[{ name: "FAQ", href: "/faq" }]}
      note="Answers to common questions are coming soon. For anything urgent, chat with us on WhatsApp."
    />
  );
}
