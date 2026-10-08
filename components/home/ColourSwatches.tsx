import Link from "next/link";
import type { ShopColour } from "@/lib/catalog/types";

export function ColourSwatches({ colours }: { colours: ShopColour[] }) {
  return (
    <ul className="mt-6 flex justify-center gap-4 sm:gap-8">
      {colours.map((c) => (
        <li key={c.slug}>
          <Link href={c.href} className="group flex flex-col items-center gap-2 rounded-image py-1">
            <span
              aria-hidden="true"
              className="block size-16 rounded-full ring-1 ring-mauve/20 ring-inset transition-[scale] duration-300 ease-soft group-hover:scale-105 sm:size-24"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-small font-semibold group-hover:text-rose-ink group-hover:underline group-hover:underline-offset-4">
              {c.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
