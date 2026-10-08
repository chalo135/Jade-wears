import { CreditCard, MapPin, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatKES } from "@/lib/money";
import { siteConfig } from "@/lib/site-config";

export function DeliveryPayment() {
  return (
    <section aria-labelledby="delivery-title" className="page-x py-12 sm:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="delivery-title" className="text-h2">
            Delivery and payment
          </h2>
          <p className="mt-3 max-w-md text-mauve-soft">
            We deliver across Kenya. The fee depends on where you are, and you see it at checkout before you pay.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-blush">
                <Smartphone aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              Pay with M-Pesa
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-blush">
                <CreditCard aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              Or pay by card or PayPal
            </li>
          </ul>
          <Button href="/delivery" variant="link" className="mt-4">
            Delivery and returns
          </Button>
        </div>

        <div className="rounded-card bg-white p-2">
          <h3 className="px-4 pt-4 pb-2 text-h3">Delivery zones</h3>
          <ul className="divide-y divide-sand">
            {siteConfig.deliveryZones.map((zone) => (
              <li key={zone.id} className="flex flex-col gap-0.5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="flex items-center gap-3 font-semibold">
                  <MapPin aria-hidden="true" className="size-5 shrink-0 text-mauve-soft" strokeWidth={1.75} />
                  {zone.name}
                </span>
                <span className="pl-8 text-small text-mauve-soft sm:pl-0 sm:text-right">
                  {zone.fee === null ? "Fee shown at checkout" : formatKES(zone.fee)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
