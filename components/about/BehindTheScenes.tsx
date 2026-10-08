import Image from "next/image";
import type { CSSProperties } from "react";
import type { AboutContent } from "@/lib/content/about";

// Small, varied tilts so the prints look scattered by hand rather than rotated by a formula.
const TILTS = [-2.5, 1.5, -1, 3, -2, 1];

export function BehindTheScenes({ content }: { content: AboutContent["behindTheScenes"] }) {
  const photos = content.photos.slice(0, 6);
  if (photos.length === 0) return null;

  return (
    <section aria-labelledby="bts-title" className="page-x pb-14 sm:pb-20">
      <h2 id="bts-title" className="text-h2">
        {content.heading}
      </h2>
      <p className="mt-2 max-w-xl text-mauve-soft">{content.intro}</p>
      <ul className="collage mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {photos.map((photo, i) => (
          <li
            key={photo.src}
            className="collage-item even:mt-6 lg:even:mt-10"
            style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
          >
            <figure className="collage-print bg-white p-2 pb-3 ring-1 ring-sand">
              <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
              {photo.caption && (
                <figcaption className="mt-2 text-center font-accent text-[1.0625rem] text-mauve-soft italic">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
