import { MapPin, Smartphone, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Button } from "@/components/ui/Button";
import type { ProductListItem } from "@/lib/catalog/types";
import { formatKES } from "@/lib/money";

const trust = [
  { Icon: Smartphone, label: "Pay with M-Pesa" },
  { Icon: Truck, label: "Delivery across Kenya" },
  { Icon: MapPin, label: "Pickup in Nairobi" },
];

export function Hero({ featured }: { featured: ProductListItem | null }) {
  const hasSizes = featured ? new Set(featured.variants.map((v) => v.price)).size > 1 : false;

  return (
    <section
      aria-labelledby="hero-title"
      className="page-x grid items-center gap-8 pt-8 pb-12 sm:pt-10 lg:grid-cols-2 lg:gap-12 lg:pt-12 lg:pb-16"
    >
      <div>
        <p className="text-micro font-bold tracking-[0.16em] text-rose-ink uppercase">The new season edit</p>
        <h1 id="hero-title" className="mt-4 text-display">
          Little things that feel like <span className="font-accent text-deep-rose italic">you</span>.
        </h1>
        <p className="mt-5 max-w-md text-mauve-soft sm:text-[1.0625rem]">
          Soft perfumes, fluffy slippers, cute tech and pretty notebooks — little treats for slow, soft days.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/collections/new-in" size="lg">
            Shop new in
          </Button>
          <Button href="/collections/bestsellers" variant="outline" size="lg" className="border-deep-rose text-rose-ink">
            Shop bestsellers
          </Button>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small text-mauve-soft">
          {trust.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon aria-hidden="true" className="size-4 text-rose-ink" strokeWidth={1.75} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative rounded-[28px] bg-blush px-[12%] pt-[10%] pb-[14%] lg:rounded-[32px]">
        <ArchFrame
          src="/images/mock/hero-flatlay.png"
          alt="Flat lay of fluffy cream slippers, a blush perfume bottle and a ribboned gift box on a soft pink surface"
          ratio="3/4"
          intro
          preload
          sizes="(min-width: 1280px) 460px, (min-width: 1024px) 36vw, 76vw"
          className="mx-auto w-full max-w-[460px]"
        />
        {featured && (
          <Link
            href={`/product/${featured.slug}`}
            className="absolute bottom-4 left-4 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 transition-shadow hover:shadow-pop sm:bottom-6 sm:left-6"
          >
            {featured.images[0] && (
              <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-sand">
                <Image src={featured.images[0].src} alt="" fill sizes="40px" className="object-cover" />
              </span>
            )}
            <span className="min-w-0 leading-tight">
              <span className="block text-micro text-mauve-soft">New in</span>
              <span className="block truncate text-small font-bold">
                {featured.name.replace(/ Eau de Parfum$/, "")} · {hasSizes ? "from " : ""}
                {formatKES(featured.price)}
              </span>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
