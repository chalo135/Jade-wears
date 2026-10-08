import Image from "next/image";
import type { AboutContent } from "@/lib/content/about";

/**
 * Vertical timeline. A faint track runs down the left; a rose segment per milestone draws
 * itself as that milestone passes the reading line, its dot fills and its card rises in.
 * All CSS (see "Journey" in globals.css); without scroll-timeline support or with reduced
 * motion, the line is fully drawn and every dot is filled.
 */
export function Journey({ content }: { content: AboutContent["journey"] }) {
  const { milestones } = content;
  if (milestones.length === 0) return null;

  return (
    <section aria-labelledby="journey-title" className="page-x pb-14 sm:pb-20">
      <div className="mx-auto max-w-[880px]">
        <h2 id="journey-title" className="text-h2">
          {content.heading}
        </h2>
        <p className="mt-2 max-w-xl text-mauve-soft">{content.intro}</p>

        <ol className="journey mt-10">
          {milestones.map((m, i) => (
            <li key={`${m.date}-${m.title}`} className="journey-item relative pb-10 pl-11 last:pb-0 sm:pl-14">
              <span aria-hidden="true" className="journey-dot" />
              {i < milestones.length - 1 && <span aria-hidden="true" className="journey-segment" />}
              <div className="journey-card rounded-card bg-white p-5 sm:flex sm:items-start sm:gap-6 sm:p-6">
                <div className="min-w-0 flex-1">
                  <p className="text-small font-bold text-rose-ink">{m.date}</p>
                  <h3 className="mt-1 text-h3">{m.title}</h3>
                  <p className="mt-2 text-mauve-soft">{m.text}</p>
                </div>
                {m.image && (
                  <div className="relative mt-4 aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-image bg-sand sm:mt-0 sm:w-40">
                    <Image src={m.image.src} alt={m.image.alt} fill sizes="160px" className="object-cover" />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
