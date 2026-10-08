import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { formatKES } from "@/lib/money";

// Matches the price filter on /shop (minPrice / maxPrice, whole shillings, inclusive).
const bands = [
  { label: `Under ${formatKES(1500)}`, href: "/shop?maxPrice=1500" },
  { label: `${formatKES(1500)} – ${(3000).toLocaleString("en-KE")}`, href: "/shop?minPrice=1500&maxPrice=3000" },
  { label: `${formatKES(3000)}+`, href: "/shop?minPrice=3000" },
];

type Props = {
  /** Main arch photo and the small overlapping photo (the perfume and journal tiles). */
  images: { main: string | null; inset: string | null };
};

export function ShopByBudget({ images }: Props) {
  return (
    <section aria-labelledby="budget-title" className="page-x py-12 sm:py-16 lg:py-20">
      <div className="overflow-hidden rounded-card bg-sand lg:grid lg:grid-cols-2 lg:rounded-[28px]">
        <div className="relative hidden items-center justify-center bg-blush p-10 lg:flex">
          <div className="relative w-full max-w-[260px]">
            {images.main && (
              <ArchFrame src={images.main} alt="A blush perfume bottle beside a peony" ratio="3/4" sizes="260px" />
            )}
            {images.inset && (
              <span
                className="absolute -right-12 -bottom-6 block w-32 overflow-hidden rounded-image border-4 border-blush"
                style={{ aspectRatio: "3 / 4" } as CSSProperties}
              >
                <Image src={images.inset} alt="A pink journal" fill sizes="128px" className="object-cover" />
              </span>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12">
          <p className="text-micro font-bold tracking-[0.16em] text-rose-ink uppercase">Shop by budget</p>
          <h2 id="budget-title" className="mt-3 text-h2">
            Something sweet at every price
          </h2>
          <p className="mt-3 max-w-md text-mauve-soft">From little treats to bigger splurges.</p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {bands.map((b) => (
              <li key={b.href}>
                <Link
                  href={b.href}
                  className="inline-flex h-11 items-center rounded-full bg-white px-5 text-small font-bold text-mauve transition-colors hover:bg-blush"
                >
                  {b.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/shop"
            className="mt-5 inline-flex min-h-11 items-center font-semibold text-rose-ink underline decoration-rose underline-offset-[5px] hover:decoration-rose-ink"
          >
            Shop all products
          </Link>
        </div>
      </div>
    </section>
  );
}
