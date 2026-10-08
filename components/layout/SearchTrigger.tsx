"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { openSearch } from "@/lib/ui-events";

/** Opens the search overlay. "field" looks like a search input (desktop); "icon" is a round button. */
export function SearchTrigger({ variant = "icon", className }: { variant?: "icon" | "field"; className?: string }) {
  if (variant === "field") {
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-haspopup="dialog"
        aria-controls="search-dialog"
        className={cn(
          "flex h-11 w-64 items-center gap-2 rounded-full border border-sand bg-white px-4 text-left text-small text-mauve-soft transition-colors hover:border-mauve-soft xl:w-72",
          className,
        )}
      >
        <Search aria-hidden="true" className="size-[18px] shrink-0 text-mauve" strokeWidth={1.75} />
        <span className="truncate">Search perfumes, slippers, cases</span>
        <span className="sr-only">, open search</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-haspopup="dialog"
      aria-controls="search-dialog"
      className={cn(
        "grid size-11 place-items-center rounded-full text-mauve transition-colors duration-200 hover:bg-sand",
        className,
      )}
    >
      <Search aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
      <span className="sr-only">Search</span>
    </button>
  );
}
