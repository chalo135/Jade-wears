import { ArchFrame } from "@/components/ui/ArchFrame";
import type { AboutContent } from "@/lib/content/about";

export function AboutOpening({ content }: { content: AboutContent["opening"] }) {
  return (
    <section
      aria-labelledby="about-title"
      className="page-x grid items-center gap-8 pt-8 pb-14 sm:pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-12 lg:pt-16 lg:pb-20"
    >
      <div>
        <h1 id="about-title" className="text-display">
          {content.headline}
        </h1>
        <p className="mt-5 max-w-lg text-mauve-soft sm:text-[1.0625rem]">{content.intro}</p>
      </div>
      {/* No intro animation here: the arch reveal is homepage-only. */}
      <ArchFrame
        src={content.image.src}
        alt={content.image.alt}
        ratio="3/4"
        bevel
        preload
        sizes="(min-width: 1280px) 420px, (min-width: 768px) 38vw, calc(100vw - 32px)"
        className="w-full max-w-sm md:ml-auto md:max-w-[420px]"
      />
    </section>
  );
}
