import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Terms" };

export default function Page() {
  return <PlaceholderPage title="Terms" trail={[{ name: "Terms", href: "/terms" }]} note="The terms of sale are being written with the client." />;
}
