import { ArchFrame } from "@/components/ui/ArchFrame";
import type { AboutContent } from "@/lib/content/about";

/** Snap rail on mobile (next card peeks in), grid with the scroll reveal from 1024px. Works for 1–6 people. */
export function Team({ content }: { content: AboutContent["team"] }) {
  const { members } = content;
  if (members.length === 0) return null;

  return (
    <section aria-labelledby="team-title" className="page-x pb-14 sm:pb-20">
      <h2 id="team-title" className="text-h2">
        {content.heading}
      </h2>
      <p className="mt-2 max-w-xl text-mauve-soft">{content.intro}</p>
      <ul className="rail reveal-lg -mx-4 mt-8 scroll-px-4 gap-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">
        {members.map((m) => (
          <li key={`${m.name}-${m.photo.src}`} className="w-[72%] sm:w-[44%] lg:w-auto">
            <ArchFrame
              src={m.photo.src}
              alt={m.photo.alt}
              hoverSrc={m.hoverPhoto?.src}
              ratio="3/4"
              sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 72vw"
            />
            <h3 className="mt-4 text-h3">{m.name}</h3>
            <p className="text-small font-bold text-rose-ink">{m.role}</p>
            <p className="mt-1 text-small text-mauve-soft">{m.line}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
