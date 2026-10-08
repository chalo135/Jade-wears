import Image from "next/image";
import Link from "next/link";
import type { CategoryNode } from "@/lib/catalog/types";

/** One tile per subcategory (Perfumes, Fluffy shoes, …), labelled with its main category. Built from the tree. */
export function CategoryTiles({ categories }: { categories: CategoryNode[] }) {
  const tiles = categories.flatMap((parent) => parent.children.map((child) => ({ parent, child })));
  return (
    <ul className="rail -mx-4 mt-6 scroll-px-4 gap-3 px-4 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
      {tiles.map(({ parent, child }) => (
        <li key={child.id} className="w-[40%] sm:w-[28%] lg:w-auto">
          <Link href={child.href} className="group block rounded-image">
            <span className="relative block aspect-square overflow-hidden rounded-image bg-blush">
              {child.image && (
                <Image
                  src={child.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 200px, (min-width: 1024px) 15vw, (min-width: 640px) 28vw, 40vw"
                  className="object-cover transition-[scale] duration-500 ease-soft group-hover:scale-[1.03]"
                />
              )}
            </span>
            <span className="mt-2.5 block text-micro text-rose-ink">{parent.name}</span>
            <span className="block font-bold group-hover:text-rose-ink group-hover:underline group-hover:underline-offset-4">
              {child.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
