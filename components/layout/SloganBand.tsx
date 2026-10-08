import { Heart } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// Each group is wider than any common screen; two identical groups scrolled by -50% loop seamlessly.
const REPEATS = 6;

function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: REPEATS }, (_, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 font-serif text-[23px] whitespace-nowrap text-mauve lg:px-8 lg:text-[34px]">
            {siteConfig.slogan}
          </span>
          <Heart aria-hidden="true" className="size-3.5 fill-mauve text-mauve lg:size-4" strokeWidth={0} />
        </span>
      ))}
    </div>
  );
}

/** Rose band above the footer with the slogan scrolling left. Pauses on hover; static under reduced motion. */
export function SloganBand() {
  return (
    <section
      aria-label="Our slogan"
      className="slogan-band flex h-[60px] items-center overflow-hidden rounded-t-[24px] bg-rose lg:h-[84px] lg:rounded-t-[32px]"
    >
      <p className="sr-only">{siteConfig.slogan}</p>
      <div aria-hidden="true" className="slogan-track flex w-max">
        <Group />
        <Group />
      </div>
    </section>
  );
}
