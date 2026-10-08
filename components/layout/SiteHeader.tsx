import { Heart, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import type { CategoryNode, Collection, ProductListItem, ShopColour } from "@/lib/catalog/types";
import { HeaderShell } from "./HeaderShell";
import { MegaMenu, MegaMenuView } from "./MegaMenu";
import { SearchTrigger } from "./SearchTrigger";

type Props = {
  categories: CategoryNode[];
  collections: Collection[];
  colours: ShopColour[];
  featured: ProductListItem | null;
  bagCount: number;
};

const iconLink =
  "relative grid size-11 place-items-center rounded-full text-mauve transition-colors duration-200 hover:bg-sand";

export function SiteHeader({ categories, collections, colours, featured, bagCount }: Props) {
  const menu = { categories, collections, colours, featured };
  return (
    <HeaderShell>
      <div className="page-x flex h-15 items-center gap-4 lg:h-[4.5rem] lg:gap-8">
        <Wordmark />
        <Suspense fallback={<MegaMenuView {...menu} pathname={null} />}>
          <MegaMenu {...menu} />
        </Suspense>
        <div className="ml-auto flex items-center gap-1">
          <SearchTrigger variant="field" className="mr-2 hidden lg:flex" />
          <SearchTrigger className="lg:hidden" />
          <Link href="/wishlist" className={`${iconLink} hidden lg:grid`}>
            <Heart aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
            <span className="sr-only">Wishlist</span>
          </Link>
          <Link href="/account" className={`${iconLink} hidden lg:grid`}>
            <UserRound aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
            <span className="sr-only">My account</span>
          </Link>
          <Link href="/bag" className={iconLink}>
            <ShoppingBag aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-deep-rose px-1 text-[11px] leading-none font-bold text-white"
            >
              {bagCount}
            </span>
            <span className="sr-only">{`Bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}</span>
          </Link>
        </div>
      </div>
    </HeaderShell>
  );
}
