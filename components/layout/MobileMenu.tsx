"use client";

import { ChevronDown, Info, MessageCircle, Truck, UserRound, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import type { CategoryNode, Collection, ShopColour } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { whatsappHref } from "@/lib/site-config";

type Props = {
  id: string;
  open: boolean;
  onClose: () => void;
  categories: CategoryNode[];
  collections: Collection[];
  colours: ShopColour[];
};

/**
 * Full-screen category menu. A modal <dialog> gives us the focus trap
 * (everything else is inert), Escape to close and top-layer stacking for free.
 */
const helpLinks: { label: string; href: string; Icon: LucideIcon; external?: boolean }[] = [
  { label: "About", href: "/about", Icon: Info },
  { label: "Delivery & returns", href: "/delivery", Icon: Truck },
  { label: "My account", href: "/account", Icon: UserRound },
  { label: "WhatsApp us", href: whatsappHref(), Icon: MessageCircle, external: true },
];

export function MobileMenu({ id, open, onClose, categories, collections, colours }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    lockScroll();
    return unlockScroll;
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-label="Shop by category"
      onClose={onClose}
      className="grain m-0 h-dvh max-h-none w-full max-w-none bg-cream p-0 text-mauve backdrop:bg-mauve/40"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-sand px-4 py-2">
          <Wordmark href={null} />
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full hover:bg-sand"
          >
            <X aria-hidden="true" className="size-6" strokeWidth={1.75} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        {/* Contents mount only while open, so the closed menu costs nothing at hydration. */}
        {open && (
          <nav aria-label="Categories" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-10">
            <ul className="divide-y divide-sand">
              {categories.map((cat) => {
                const isOpen = expanded === cat.id;
                const panelId = `mobile-cat-${cat.slug}`;
                return (
                  <li key={cat.id}>
                    <h2>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setExpanded(isOpen ? null : cat.id)}
                        className="flex min-h-14 w-full items-center justify-between gap-4 text-left font-serif text-h3"
                      >
                        {cat.name}
                        <ChevronDown
                          aria-hidden="true"
                          className={cn("size-5 transition-transform duration-300 ease-soft", isOpen && "rotate-180")}
                        />
                      </button>
                    </h2>
                    <div id={panelId} hidden={!isOpen} className="pb-5">
                      <Link
                        href={cat.href}
                        onClick={onClose}
                        className="inline-flex min-h-11 items-center font-semibold text-rose-ink underline decoration-rose underline-offset-4"
                      >
                        Shop all {cat.name.toLowerCase()}
                      </Link>
                      <ul className="mt-1 space-y-3">
                        {cat.children.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={sub.href}
                              onClick={onClose}
                              className="inline-flex min-h-11 items-center font-semibold"
                            >
                              {sub.name}
                            </Link>
                            {sub.children.length > 0 && (
                              <ul className="flex flex-wrap gap-2">
                                {sub.children.map((leaf) => (
                                  <li key={leaf.id}>
                                    <Link
                                      href={leaf.href}
                                      onClick={onClose}
                                      className="inline-flex h-11 items-center rounded-full bg-white px-4 text-small transition-colors hover:bg-sand"
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
                  </li>
                );
              })}
            </ul>

            <h2 className="mt-8 font-serif text-h3 font-medium">Collections</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {collections.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collections/${c.slug}`}
                    onClick={onClose}
                    className="inline-flex h-11 items-center rounded-full bg-blush px-4 text-small font-semibold transition-colors hover:bg-blush-deep"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/collections/colour"
                  onClick={onClose}
                  className="inline-flex h-11 items-center rounded-full bg-sand px-4 text-small font-semibold transition-colors hover:bg-blush"
                >
                  Shop by colour
                </Link>
              </li>
            </ul>

            <h2 className="mt-8 font-serif text-h3 font-medium">Shop by colour</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {colours.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    onClick={onClose}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-white pr-4 pl-2 text-small transition-colors hover:bg-sand"
                  >
                    <span
                      aria-hidden="true"
                      className="size-7 rounded-full ring-1 ring-mauve/15 ring-inset"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-8 divide-y divide-sand border-y border-sand">
              {helpLinks.map(({ label, href, Icon, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    className="flex min-h-12 items-center gap-3 font-semibold hover:text-rose-ink"
                  >
                    <Icon aria-hidden="true" className="size-5 text-mauve-soft" strokeWidth={1.75} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </dialog>
  );
}
