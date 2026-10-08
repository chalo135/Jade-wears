import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "My account" };

export default function Page() {
  return <PlaceholderPage title="My account" trail={[{ name: "My account", href: "/account" }]} note="Sign-in and order history come in a later stage." />;
}
