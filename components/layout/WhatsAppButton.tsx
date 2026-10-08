import { siWhatsapp } from "simple-icons";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { cn } from "@/lib/cn";
import { whatsappHref } from "@/lib/site-config";

/**
 * The green "Chat on WhatsApp" link. #1A8D47, not WhatsApp's #25D366 (white on that is under 2:1).
 * White on #1A8D47 is 4.25:1, which passes for this large 19px bold label only.
 */
export function WhatsAppLink({ className }: { className?: string }) {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener"
      className={cn(
        "flex items-center gap-2.5 rounded-full bg-whatsapp px-5 text-[19px] font-bold text-white shadow-pop transition-[background-color,translate] duration-200 ease-soft hover:-translate-y-0.5 hover:bg-whatsapp-deep motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <BrandIcon icon={siWhatsapp} className="size-[26px] lg:size-7" />
      Chat on WhatsApp
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * Floating WhatsApp button that docks at the end of the page. Pure CSS, works without JavaScript.
 *
 * The zero-height wrapper must be the last child of the page wrapper (after the footer), with
 * no overflow:hidden/auto ancestor. Being sticky to `bottom: --wa-btn-offset`, it floats while
 * browsing; at the end of the page it lands in the space the footer reserves
 * (--wa-btn-h + --wa-btn-offset + 16px), below the social row.
 */
export function WhatsAppDock() {
  return (
    <div className="pointer-events-none sticky bottom-[var(--wa-btn-offset)] z-30 flex h-0 justify-end pr-[var(--wa-btn-right)]">
      <WhatsAppLink className="pointer-events-auto -mt-[var(--wa-btn-h)] h-[var(--wa-btn-h)] lg:px-6" />
    </div>
  );
}
