import { WhatsAppLink } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import type { AboutContent } from "@/lib/content/about";

export function AboutClosing({ content }: { content: AboutContent["closing"] }) {
  return (
    <section aria-labelledby="closing-title" className="page-x pb-16 sm:pb-24">
      <div className="grain rounded-card bg-blush p-6 sm:p-10">
        <h2 id="closing-title" className="max-w-2xl text-h2">
          {content.line}
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <WhatsAppLink className="inline-flex h-14" />
          <Button href="/collections/new-in" size="lg">
            Shop new in
          </Button>
        </div>
      </div>
    </section>
  );
}
