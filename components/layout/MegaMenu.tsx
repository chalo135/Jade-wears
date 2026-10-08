"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { CollectionCard } from "@/components/product/CollectionCard";
import type { CategoryNode, Collection, ProductListItem, ShopColour } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";

type Props = {
  categories: CategoryNode[];
  collections: Collection[];
  colours: ShopColour[];
  featured: ProductListItem | null;
};

const OPEN_DELAY = 100;
const CLOSE_DELAY = 200;
type PanelId = "products" | "collections";

/** Reads the pathname to close on navigation, so the header wraps it in Suspense. */
export function MegaMenu(props: Props) {
  return <MegaMenuView {...props} pathname={usePathname()} />;
}

export function MegaMenuView({ categories, collections, colours, featured, pathname }: Props & { pathname: string | null }) {
  const [openId, setOpenId] = useState<PanelId | null>(null);
  // Panels build their contents on first intent rather than at hydration.
  const [primed, setPrimed] = useState<ReadonlySet<PanelId>>(() => new Set());
  const [lastPath, setLastPath] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const triggers = useRef(new Map<PanelId, HTMLButtonElement>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef<PanelId | null>(null);

  // Close on route change (covers back/forward as well as link clicks).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenId(null);
  }

  useEffect(() => {
    openRef.current = openId;
  }, [openId]);

  const prime = (id: PanelId) => {
    if (!primed.has(id)) setPrimed((prev) => new Set(prev).add(id));
  };

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const close = useCallback((returnFocus = false) => {
    const current = openRef.current;
    setOpenId(null);
    if (returnFocus && current) triggers.current.get(current)?.focus();
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openId, close]);

  useEffect(() => clearTimer, []);

  // Hover intent is mouse-only; touch and pen open on tap, like keyboard users.
  const onEnter = (id: PanelId) => (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    prime(id);
    clearTimer();
    if (openId && openId !== id) {
      setOpenId(id);
      return;
    }
    timer.current = setTimeout(() => setOpenId(id), OPEN_DELAY);
  };

  // The panel sits inside the same <li>, so moving diagonally into it never leaves the item.
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimer();
    timer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY);
  };

  const toggle = (id: PanelId) => {
    clearTimer();
    prime(id);
    setOpenId((current) => (current === id ? null : id));
  };

  const onBlur = (e: FocusEvent) => {
    if (!navRef.current?.contains(e.relatedTarget as Node | null)) close();
  };

  const panels: { id: PanelId; label: string }[] = [
    { id: "products", label: "Products" },
    { id: "collections", label: "Collections" },
  ];

  return (
    <nav ref={navRef} aria-label="Main" onBlur={onBlur} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {panels.map((panel) => {
          const open = openId === panel.id;
          const panelId = `mega-${panel.id}`;
          return (
            <li key={panel.id} onPointerEnter={onEnter(panel.id)} onPointerLeave={onLeave}>
              <button
                ref={(el) => {
                  if (el) triggers.current.set(panel.id, el);
                  else triggers.current.delete(panel.id);
                }}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(panel.id)}
                onFocus={() => prime(panel.id)}
                className={cn(
                  "relative flex h-11 items-center gap-1 rounded-full px-3.5 font-semibold text-mauve transition-colors duration-200 hover:text-rose-ink",
                  "after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-rose after:transition-opacity after:duration-200",
                  open ? "after:opacity-100" : "after:opacity-0",
                )}
              >
                {panel.label}
                <ChevronDown
                  aria-hidden="true"
                  strokeWidth={2}
                  className={cn("size-4 transition-transform duration-300 ease-soft", open && "rotate-180")}
                />
              </button>

              <div
                id={panelId}
                hidden={!open}
                className="mega-panel grain absolute inset-x-0 top-full border-y border-sand bg-cream shadow-menu"
              >
                <div className="page-x py-8">
                  {!primed.has(panel.id) && !open ? null : panel.id === "products" ? (
                    <ProductsPanel categories={categories} featured={featured} onNavigate={() => close()} />
                  ) : (
                    <CollectionsPanel collections={collections} colours={colours} onNavigate={() => close()} />
                  )}
                </div>
              </div>
            </li>
          );
        })}
        <li>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className="flex h-11 items-center rounded-full px-3.5 font-semibold text-mauve transition-colors hover:text-rose-ink"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function ProductsPanel({
  categories,
  featured,
  onNavigate,
}: {
  categories: CategoryNode[];
  featured: ProductListItem | null;
  onNavigate: () => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,13rem)] gap-6 xl:gap-8">
      {categories.map((cat) => (
        <div key={cat.id} className="min-w-0">
          {cat.image && (
            <Link href={cat.href} onClick={onNavigate} tabIndex={-1} aria-hidden="true" className="block">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-image bg-sand">
                <Image src={cat.image} alt="" fill sizes="180px" className="object-cover" />
              </span>
            </Link>
          )}
          <Link
            href={cat.href}
            onClick={onNavigate}
            className="mt-3 inline-flex min-h-11 items-center text-micro font-bold tracking-[0.12em] text-mauve-soft uppercase hover:text-rose-ink"
          >
            {cat.name}
          </Link>
          <ul className="mt-1 space-y-1">
            {cat.children.map((sub) => (
              <li key={sub.id}>
                <Link
                  href={sub.href}
                  onClick={onNavigate}
                  className="inline-flex min-h-11 items-center font-bold text-mauve hover:text-rose-ink"
                >
                  {sub.name}
                </Link>
                {sub.children.length > 0 && (
                  <ul>
                    {sub.children.map((leaf) => (
                      <li key={leaf.id}>
                        <Link
                          href={leaf.href}
                          onClick={onNavigate}
                          className="inline-flex min-h-11 items-center text-small text-mauve-soft hover:text-rose-ink hover:underline"
                        >
                          {leaf.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex flex-col gap-3">
        <Link
          href="/collections/new-in"
          onClick={onNavigate}
          className="flex flex-1 flex-col overflow-hidden rounded-card bg-deep-rose text-white transition-colors hover:bg-rose-ink"
        >
          {featured?.images[0] && (
            <span className="relative block aspect-[4/3] overflow-hidden">
              <Image src={featured.images[0].src} alt="" fill sizes="208px" className="object-cover" />
            </span>
          )}
          <span className="flex flex-1 flex-col p-4">
            <span className="font-serif text-h3">New In</span>
            {featured && <span className="mt-1 text-small">{featured.name} and more fresh arrivals</span>}
            <span className="mt-auto pt-3 text-small font-bold underline underline-offset-4">Shop new in</span>
          </span>
        </Link>
        <Link
          href="/shop"
          onClick={onNavigate}
          className="flex h-11 items-center justify-center rounded-full border border-mauve px-4 text-small font-bold text-mauve transition-colors hover:bg-mauve hover:text-cream"
        >
          Shop all products →
        </Link>
      </div>
    </div>
  );
}

function CollectionsPanel({
  collections,
  colours,
  onNavigate,
}: {
  collections: Collection[];
  colours: ShopColour[];
  onNavigate: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-10">
      <ul className="grid grid-cols-4 gap-4">
        {collections.map((c, i) => (
          <li key={c.id}>
            <CollectionCard collection={c} index={i} onNavigate={onNavigate} compact />
          </li>
        ))}
      </ul>
      <div>
        <h2 className="font-serif text-h3 font-medium">Shop by colour</h2>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
          {colours.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.href}
                onClick={onNavigate}
                className="flex min-h-11 items-center gap-3 text-mauve hover:text-rose-ink"
              >
                <span
                  aria-hidden="true"
                  className="size-7 rounded-full ring-1 ring-mauve/20 ring-inset"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
