"use client";

import { Heart, House, LayoutGrid, Search, ShoppingBag, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { CategoryNode, Collection, ShopColour } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { openSearch } from "@/lib/ui-events";
import { MobileMenu } from "./MobileMenu";

type Props = {
  categories: CategoryNode[];
  collections: Collection[];
  colours: ShopColour[];
  bagCount: number;
};

const MENU_ID = "mobile-shop-menu";

/** Reads the pathname, so the layout wraps it in Suspense (see BottomNavView for the fallback). */
export function BottomNav(props: Props) {
  const pathname = usePathname();
  return <BottomNavView {...props} pathname={pathname} />;
}

export function BottomNavView({
  categories,
  collections,
  colours,
  bagCount,
  pathname,
}: Props & { pathname: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const inShop = !!pathname && (pathname.startsWith("/shop") || pathname.startsWith("/collections"));

  const itemClass = (active: boolean) =>
    cn(
      "flex h-14 flex-col items-center justify-center gap-0.5 text-micro font-semibold transition-colors duration-200",
      active ? "text-rose-ink" : "text-mauve-soft hover:text-mauve",
    );

  const icon = (Icon: LucideIcon, active: boolean) => (
    <Icon aria-hidden="true" className="size-[22px]" strokeWidth={active ? 2.25 : 1.75} />
  );

  const linkItem = (href: string, label: string, Icon: LucideIcon, extra?: string) => {
    const active = pathname === href;
    return (
      <li>
        <Link href={href} aria-current={active ? "page" : undefined} className={itemClass(active)}>
          {icon(Icon, active)}
          <span>
            {label}
            {extra && <span className="sr-only">{extra}</span>}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <>
      <nav
        aria-label="Quick links"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid h-14 max-w-xl grid-cols-5">
          {linkItem("/", "Home", House)}
          <li>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              aria-current={inShop ? "page" : undefined}
              onClick={() => setMenuOpen(true)}
              className={cn(itemClass(inShop), "w-full")}
            >
              {icon(LayoutGrid, inShop)}
              <span>Shop</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-controls="search-dialog"
              aria-current={pathname === "/search" ? "page" : undefined}
              onClick={openSearch}
              className={cn(itemClass(pathname === "/search"), "w-full")}
            >
              {icon(Search, pathname === "/search")}
              <span>Search</span>
            </button>
          </li>
          {linkItem("/wishlist", "Wishlist", Heart)}
          {linkItem("/bag", "Bag", ShoppingBag, `, ${bagCount} ${bagCount === 1 ? "item" : "items"}`)}
        </ul>
      </nav>
      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categories}
        collections={collections}
        colours={colours}
      />
    </>
  );
}
