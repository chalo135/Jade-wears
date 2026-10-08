import type { Metadata } from "next";
import { DeliveryPayment } from "@/components/home/DeliveryPayment";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Delivery & returns" };

export default function Page() {
  return (
    <>
      <PlaceholderPage
        title="Delivery & returns"
        trail={[{ name: "Delivery & returns", href: "/delivery" }]}
        note="Delivery fees and returns details are being confirmed. Until then, the fee for your area is shown at checkout before you pay."
      />
      <DeliveryPayment />
    </>
  );
}
