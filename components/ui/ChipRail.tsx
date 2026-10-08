import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type Chip = {
  label: string;
  href: string;
  image?: string | null;
  active?: boolean;
};

type Props = {
  chips: Chip[];
  label: string;
  className?: string;
};

export function ChipRail({ chips, label, className }: Props) {
  return (
    <nav aria-label={label} className={cn("-mx-4 sm:-mx-6", className)}>
      <ul className="rail edge-fade scroll-px-4 gap-2 px-4 py-1 sm:scroll-px-6 sm:px-6">
        {chips.map((chip) => (
          <li key={chip.href}>
            <Link
              href={chip.href}
              aria-current={chip.active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full pr-4 text-small font-semibold transition-colors duration-200 ease-soft",
                chip.image ? "pl-1" : "pl-4",
                chip.active ? "bg-mauve text-cream" : "bg-white text-mauve hover:bg-sand",
              )}
            >
              {chip.image && (
                <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-sand">
                  <Image src={chip.image} alt="" fill sizes="36px" className="object-cover" />
                </span>
              )}
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
