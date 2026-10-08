import { Clock, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import type { AboutContent } from "@/lib/content/about";
import { hasPublicPickupAddress, isPlaceholder, siteConfig } from "@/lib/site-config";

// Static cards on purpose: a live Google Map would load a heavy iframe with the page.
export function FindUs({ content }: { content: AboutContent["findUs"] }) {
  const { contact } = siteConfig;
  const hasAddress = hasPublicPickupAddress();
  const hasHours = !isPlaceholder(contact.pickupHours);

  return (
    <section aria-labelledby="find-us-title" className="page-x pb-14 sm:pb-20">
      <h2 id="find-us-title" className="text-h2">
        {content.heading}
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-card bg-white p-6 sm:p-8">
          <h3 className="flex items-center gap-2.5 text-h3">
            <MapPin aria-hidden="true" className="size-5 text-rose-ink" strokeWidth={1.75} />
            {content.pickupTitle}
          </h3>
          {hasAddress ? (
            <>
              <p className="mt-3">{contact.pickupPoint}</p>
              {hasHours && (
                <p className="mt-2 flex items-center gap-2 text-mauve-soft">
                  <Clock aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {contact.pickupHours}
                </p>
              )}
              {contact.pickupMapUrl && (
                <a
                  href={contact.pickupMapUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-rose-ink underline decoration-rose underline-offset-[5px] hover:decoration-rose-ink"
                >
                  Open in Google Maps
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </>
          ) : (
            <>
              <p className="mt-3">{contact.pickupArea}</p>
              <p className="mt-2 text-mauve-soft">{content.noAddressNote}</p>
            </>
          )}
        </div>

        <div className="rounded-card bg-white p-6 sm:p-8">
          <h3 className="flex items-center gap-2.5 text-h3">
            <Truck aria-hidden="true" className="size-5 text-rose-ink" strokeWidth={1.75} />
            {content.deliveryTitle}
          </h3>
          <p className="mt-3 text-mauve-soft">{content.deliveryText}</p>
          <Link
            href="/delivery"
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-rose-ink underline decoration-rose underline-offset-[5px] hover:decoration-rose-ink"
          >
            Delivery &amp; returns
          </Link>
        </div>
      </div>
    </section>
  );
}
