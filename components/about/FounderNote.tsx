import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ArchFrame } from "@/components/ui/ArchFrame";
import type { AboutContent } from "@/lib/content/about";

/**
 * Reads the signature SVG from public/ at build time and inlines it, so its strokes can be
 * drawn in with CSS. Every path gets pathLength="1" so one dash animation fits any drawing.
 */
function readSignature(src: string): string | null {
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, "utf8");
  const start = raw.indexOf("<svg");
  if (start < 0) return null;
  return raw
    .slice(start)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<(path|line|polyline|circle|ellipse)\b/gi, '<$1 pathLength="1"')
    .replace(/<svg\b/i, '<svg aria-hidden="true" focusable="false"');
}

export function FounderNote({ content }: { content: AboutContent["founderNote"] }) {
  const signature = readSignature(content.signatureSrc);

  return (
    <section aria-labelledby="founder-note-title" className="page-x pb-14 sm:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_17rem] lg:gap-14">
        <article className="grain rounded-card bg-blush p-6 sm:p-10 lg:p-12">
          <h2 id="founder-note-title" className="text-h2">
            {content.heading}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4 text-mauve sm:text-[1.0625rem]">
            {content.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 text-mauve-soft">{content.signOff}</p>
          {signature ? (
            <>
              <div
                className="signature-draw mt-2 h-16 w-56 text-mauve [&_svg]:h-full [&_svg]:w-auto"
                dangerouslySetInnerHTML={{ __html: signature }}
              />
              <p className="sr-only">{content.name}</p>
            </>
          ) : (
            <p className="mt-1 font-accent text-h2 text-rose-ink italic">{content.name}</p>
          )}
        </article>
        <ArchFrame
          src={content.image.src}
          alt={content.image.alt}
          ratio="3/4"
          sizes="272px"
          className="hidden w-full lg:block"
        />
      </div>
    </section>
  );
}
