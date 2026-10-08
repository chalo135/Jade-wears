import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Page() {
  return <PlaceholderPage title="Privacy policy" trail={[{ name: "Privacy policy", href: "/privacy" }]} note="The privacy policy is being written with the client." />;
}
