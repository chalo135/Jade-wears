import { Feather, HandHeart, Leaf, PackageCheck, Sparkles, type LucideIcon } from "lucide-react";
import type { AboutContent, PickIcon } from "@/lib/content/about";

const icons: Record<PickIcon, LucideIcon> = {
  "hand-heart": HandHeart,
  feather: Feather,
  "package-check": PackageCheck,
  sparkles: Sparkles,
  leaf: Leaf,
};

export function HowWePick({ content }: { content: AboutContent["howWePick"] }) {
  if (content.points.length === 0) return null;
  return (
    <section aria-labelledby="how-we-pick-title" className="page-x pb-14 sm:pb-20">
      <h2 id="how-we-pick-title" className="text-h2">
        {content.heading}
      </h2>
      <p className="mt-2 max-w-xl text-mauve-soft">{content.intro}</p>
      <ul className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
        {content.points.map((point) => {
          const Icon = icons[point.icon];
          return (
            <li key={point.title} className="border-t border-sand pt-5">
              {/* Decorative: the title carries the meaning, so rose is fine here. */}
              <Icon aria-hidden="true" className="size-6 text-rose" strokeWidth={1.75} />
              <h3 className="mt-3 text-h3">{point.title}</h3>
              <p className="mt-1.5 text-mauve-soft">{point.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
