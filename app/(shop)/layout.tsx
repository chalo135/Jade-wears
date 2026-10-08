import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { BottomNav, BottomNavView } from "@/components/layout/BottomNav";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SloganBand } from "@/components/layout/SloganBand";
import { WhatsAppDock } from "@/components/layout/WhatsAppButton";
import { getCategoryTree, getCollections, getProductsByCollection, getSearchIndex, getShopColours } from "@/lib/catalog";
import { siteConfig } from "@/lib/site-config";

// The bag is wired up in a later stage.
const BAG_COUNT = 0;

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const [categories, collections, colours, searchIndex, [featured]] = await Promise.all([
    getCategoryTree(),
    getCollections(),
    getShopColours(),
    getSearchIndex(),
    getProductsByCollection("new-in", 1),
  ]);
  const nav = { categories, collections, colours, bagCount: BAG_COUNT };

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-24 rounded-full bg-mauve px-5 py-3 font-semibold text-cream transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <AnnouncementBar messages={siteConfig.announcements} />
      <SiteHeader {...nav} featured={featured ?? null} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SloganBand />
      <SiteFooter categories={categories} />
      <Suspense fallback={<BottomNavView {...nav} pathname={null} />}>
        <BottomNav {...nav} />
      </Suspense>
      <SearchOverlay index={searchIndex} />
      {/* Must stay the last child of this wrapper: see WhatsAppDock. */}
      <WhatsAppDock />
    </div>
  );
}
