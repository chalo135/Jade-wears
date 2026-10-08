import { Mail, MapPin } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { siFacebook, siInstagram, siMastercard, siPaypal, siTiktok, siVisa, siWhatsapp } from "simple-icons";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Wordmark } from "@/components/brand/Wordmark";
import type { CategoryNode } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { siteConfig, whatsappHref } from "@/lib/site-config";

type Props = { categories: CategoryNode[] };

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

// TODO(newsletter): UI only. Connect to the mailing-list provider once the client picks one.
async function subscribe() {
  "use server";
}

const linkClass =
  "inline-flex min-h-11 items-center text-cream/90 underline-offset-4 hover:text-cream hover:underline";

function Column({ id, title, links }: { id: string; title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h2 id={id} className="font-sans text-micro font-bold tracking-[0.14em] text-blush uppercase">
        {title}
      </h2>
      <ul aria-labelledby={id} className="mt-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={linkClass}>
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex min-h-9 items-center gap-3 text-small text-cream/90">
      <span className="grid size-5 place-items-center text-blush">{icon}</span>
      {children}
    </li>
  );
}

// Simple Icons share a square 24×24 box, so each mark gets its own size to read at badge height.
const paymentIcons = {
  visa: { icon: siVisa, size: "size-11" },
  mastercard: { icon: siMastercard, size: "size-8" },
  paypal: { icon: siPaypal, size: "size-5" },
} as const;

function PaymentMarks() {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {siteConfig.paymentMethods.map((m) => (
        <li key={m.id} className="grid h-8 w-16 place-items-center overflow-hidden rounded-[8px] bg-white">
          {m.id === "mpesa" ? (
            // No M-Pesa mark in Simple Icons and no logo file yet: plain text badge.
            <span className="text-[0.6875rem] font-extrabold tracking-[0.06em] text-mauve">M-PESA</span>
          ) : (
            <>
              <BrandIcon icon={paymentIcons[m.id].icon} color="brand" className={paymentIcons[m.id].size} />
              <span className="sr-only">{m.name}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function SocialLinks() {
  const socials = [
    { icon: siInstagram, label: "Jade Wears on Instagram", href: siteConfig.socials.instagram },
    { icon: siTiktok, label: "Jade Wears on TikTok", href: siteConfig.socials.tiktok },
    { icon: siFacebook, label: "Jade Wears on Facebook", href: siteConfig.socials.facebook },
    { icon: siWhatsapp, label: "Chat with Jade Wears on WhatsApp", href: whatsappHref() },
  ];
  return (
    <ul className="flex items-center gap-2.5">
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            aria-label={s.label}
            target="_blank"
            rel="noopener"
            // 1.5px line as an inset ring: Chrome floors border widths to whole pixels, so border-[1.5px] would draw at 1px.
            className="grid size-11 place-items-center rounded-full text-blush ring-[1.5px] ring-mauve-line transition-colors ring-inset hover:bg-blush hover:text-mauve hover:ring-blush focus-visible:bg-blush focus-visible:text-mauve focus-visible:ring-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush"
          >
            <BrandIcon icon={s.icon} className="size-[22px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter({ categories }: Props) {
  const { contact } = siteConfig;
  const shopLinks = categories.flatMap((c) => c.children.map((sub) => ({ name: sub.name, href: sub.href })));

  return (
    <footer className="bg-mauve text-cream [--focus-ring:var(--color-cream)]">
      <div className="page-x grid gap-10 py-12 lg:grid-cols-[1.4fr_2.6fr_1.3fr] lg:gap-12 lg:py-16">
        <div>
          <Wordmark inverse />
          <p className="mt-3 max-w-xs text-small text-cream/90">{siteConfig.tagline}</p>
          <ul className="mt-5 space-y-1">
            <ContactRow icon={<BrandIcon icon={siWhatsapp} className="size-4" />}>
              <span className="sr-only">WhatsApp: </span>
              {contact.whatsappNumber}
            </ContactRow>
            <ContactRow icon={<Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />}>
              <span className="sr-only">Email: </span>
              {contact.email}
            </ContactRow>
            <ContactRow icon={<MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />}>
              <span className="sr-only">Pickup point: </span>
              {contact.pickupPoint}
            </ContactRow>
          </ul>
        </div>

        {/* Mobile: newsletter comes right after the brand, then the link columns. */}
        <div className="lg:order-last">
          <h2 className="font-serif text-h3 font-medium">Stay in touch</h2>
          <p className="mt-1 text-small text-cream/90">Be first to see new drops and restocks.</p>
          <form action={subscribe} className="mt-4 space-y-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              className="h-12 w-full rounded-field bg-cream px-4 text-mauve placeholder:text-mauve-soft focus-visible:outline-2 focus-visible:outline-offset-2"
            />
            <button
              type="submit"
              className="h-12 w-full rounded-full bg-deep-rose font-semibold text-white transition-[background-color,scale] hover:bg-rose-ink active:scale-97"
            >
              Sign me up
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
          <Column id="footer-shop" title="Shop" links={shopLinks} />
          <div className="space-y-8 lg:contents">
            <Column id="footer-help" title="Help" links={siteConfig.help} />
            <Column id="footer-company" title="Jade Wears" links={siteConfig.company} />
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15">
        {/* Reserved space where the WhatsApp button docks at the end of the page. On mobile
            --wa-btn-offset already includes the bottom nav and safe area, so nothing is hidden. */}
        <div className="page-x grid gap-6 pt-6 pb-[calc(var(--wa-btn-h)+var(--wa-btn-offset)+16px)] lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div>
            <p className="mb-2 text-micro font-bold tracking-[0.14em] text-blush uppercase lg:sr-only">We accept</p>
            <PaymentMarks />
          </div>
          <div className="lg:order-last lg:justify-self-end">
            <p className="mb-2 text-micro font-bold tracking-[0.14em] text-blush uppercase lg:sr-only">Follow us</p>
            <SocialLinks />
          </div>
          <div className={cn("flex flex-wrap items-center gap-x-5 text-micro text-cream/90 lg:justify-center")}>
            <p>
              © <CurrentYear /> Jade Wears · Nairobi, Kenya
            </p>
            {siteConfig.legal.map((l) => (
              <Link key={l.href} href={l.href} className={cn(linkClass, "text-micro underline")}>
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
