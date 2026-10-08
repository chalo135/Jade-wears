"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { Price } from "@/components/ui/Price";
import type { SearchIndex } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { OPEN_SEARCH_EVENT } from "@/lib/ui-events";

const DEBOUNCE_MS = 150;
const MAX_PRODUCTS = 5;
const MAX_CATEGORIES = 5;

const optionId = (i: number) => `search-opt-${i}`;

type OptionProps = {
  index: number;
  href: string;
  active: boolean;
  onSelect: (href: string) => void;
  onActivate: (index: number) => void;
  children: ReactNode;
};

function SearchOption({ index, href, active, onSelect, onActivate, children }: OptionProps) {
  return (
    <div
      id={optionId(index)}
      role="option"
      aria-selected={active}
      onClick={() => onSelect(href)}
      onPointerMove={() => !active && onActivate(index)}
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 rounded-field px-3 py-2",
        active ? "bg-blush" : "hover:bg-sand/60",
      )}
    >
      {children}
    </div>
  );
}

function match(index: SearchIndex, raw: string) {
  const q = raw.trim().toLowerCase();
  if (!q) return { products: [], categories: [], colours: [] };
  const has = (s: string | null | undefined) => !!s && s.toLowerCase().includes(q);
  return {
    products: index.products.filter((p) => has(p.name) || has(p.category)).slice(0, MAX_PRODUCTS),
    categories: index.categories.filter((c) => has(c.name)).slice(0, MAX_CATEGORIES),
    colours: index.colours.filter((c) => has(c.name)),
  };
}

export function SearchOverlay({ index }: { index: SearchIndex }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  // Active option is tied to the query it was chosen for, so it resets when results change.
  const [active, setActive] = useState({ q: "", i: -1 });

  useEffect(() => {
    const onOpen = () => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      openerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      lockScroll();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => match(index, debounced), [index, debounced]);
  const q = debounced.trim();

  const allHref = `/search?q=${encodeURIComponent(q)}`;
  const options: string[] = q
    ? [
        ...results.products.map((p) => p.href),
        ...results.categories.map((c) => c.href),
        ...results.colours.map((c) => c.href),
        allHref,
      ]
    : [];

  const activeIndex = active.q === debounced ? active.i : -1;

  function close() {
    dialogRef.current?.close();
  }

  function onClose() {
    unlockScroll();
    const opener = openerRef.current;
    if (opener?.isConnected) opener.focus();
  }

  function go(href: string) {
    close();
    router.push(href);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!options.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      const next = (activeIndex + step + options.length + 1) % (options.length + 1);
      // Index options.length means "back in the input" (no active option).
      setActive({ q: debounced, i: next === options.length ? -1 : next });
      document.getElementById(optionId(next))?.scrollIntoView({ block: "nearest" });
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && options[activeIndex]) {
      go(options[activeIndex]);
      return;
    }
    const term = query.trim();
    if (term) go(`/search?q=${encodeURIComponent(term)}`);
  }

  const offsets = {
    category: results.products.length,
    colour: results.products.length + results.categories.length,
    all: options.length - 1,
  };

  const activate = (i: number) => setActive({ q: debounced, i });

  return (
    <dialog
      ref={dialogRef}
      id="search-dialog"
      aria-label="Search"
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && close()}
      className={cn(
        "m-0 h-dvh max-h-none w-full max-w-none bg-cream p-0 text-mauve backdrop:bg-mauve/40",
        "lg:mx-auto lg:mt-16 lg:h-auto lg:max-h-[min(42rem,calc(100dvh-8rem))] lg:max-w-2xl lg:rounded-card lg:shadow-menu",
      )}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <form role="search" onSubmit={onSubmit} className="flex items-center gap-2 border-b border-sand px-4 py-3">
          <Search aria-hidden="true" className="size-5 shrink-0 text-mauve-soft" strokeWidth={1.75} />
          <label htmlFor="search-input" className="sr-only">
            Search the shop
          </label>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            role="combobox"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Search perfume, slippers, mirrors"
            aria-expanded={options.length > 0}
            aria-controls="search-listbox"
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="h-12 min-w-0 flex-1 rounded-field bg-transparent px-1 text-body text-mauve outline-none placeholder:text-mauve-soft [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={close}
            className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-sand"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            <span className="sr-only">Close search</span>
          </button>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
          {!q && <p className="px-3 py-2 text-small text-mauve-soft">Type to see products, categories and colours.</p>}
          {q && options.length === 1 && (
            <p className="px-3 py-2 text-small text-mauve-soft">No quick matches for “{q}”.</p>
          )}

          <div id="search-listbox" role="listbox" aria-label="Suggestions" hidden={!q}>
            {results.products.length > 0 && (
              <div role="group" aria-labelledby="search-group-products" className="mb-3">
                <p id="search-group-products" className="px-3 pb-1 text-micro font-semibold text-mauve-soft">
                  Products
                </p>
                {results.products.map((p, i) => (
                  <SearchOption key={p.href} index={i} href={p.href} active={activeIndex === i} onSelect={go} onActivate={activate}>
                    <span className="relative aspect-[4/5] w-11 shrink-0 overflow-hidden rounded-[10px] bg-sand">
                      <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif">{p.name}</span>
                      <span className="block text-micro text-mauve-soft">{p.category}</span>
                    </span>
                    <Price price={p.price} compareAt={p.compareAt} size="sm" className="shrink-0 flex-col items-end gap-0" />
                  </SearchOption>
                ))}
              </div>
            )}

            {results.categories.length > 0 && (
              <div role="group" aria-labelledby="search-group-categories" className="mb-3">
                <p id="search-group-categories" className="px-3 pb-1 text-micro font-semibold text-mauve-soft">
                  Categories
                </p>
                {results.categories.map((c, i) => (
                  <SearchOption key={c.href} index={offsets.category + i} href={c.href} active={activeIndex === offsets.category + i} onSelect={go} onActivate={activate}>
                    <span className="flex-1">
                      {c.name}
                      {c.parent && <span className="text-mauve-soft"> in {c.parent}</span>}
                    </span>
                  </SearchOption>
                ))}
              </div>
            )}

            {results.colours.length > 0 && (
              <div role="group" aria-labelledby="search-group-colours" className="mb-3">
                <p id="search-group-colours" className="px-3 pb-1 text-micro font-semibold text-mauve-soft">
                  Colours
                </p>
                {results.colours.map((c, i) => (
                  <SearchOption key={c.href} index={offsets.colour + i} href={c.href} active={activeIndex === offsets.colour + i} onSelect={go} onActivate={activate}>
                    <span
                      aria-hidden="true"
                      className="size-6 rounded-full ring-1 ring-mauve/15 ring-inset"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>Everything in {c.name.toLowerCase()}</span>
                  </SearchOption>
                ))}
              </div>
            )}

            {q && (
              <SearchOption index={offsets.all} href={allHref} active={activeIndex === offsets.all} onSelect={go} onActivate={activate}>
                <span className="font-semibold text-rose-ink underline decoration-rose underline-offset-4">
                  See all results for “{q}”
                </span>
              </SearchOption>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
