import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ProductCard } from "@/components/product/ProductCard";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipRail } from "@/components/ui/ChipRail";
import { Price } from "@/components/ui/Price";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCategoryTree, getProductBySlug } from "@/lib/catalog";
import type { ProductListItem } from "@/lib/catalog/types";
import { cn } from "@/lib/cn";
import { contrastRatio, wcagLevel } from "@/lib/contrast";
import { approvedPairs, palette, rejectedPairs, type ColorName, type ColorPair } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const sampleSlugs = [
  "cloud-fluffy-slippers",
  "faux-fur-slides",
  "bow-wireless-headphones",
  "fluffy-airpods-case",
  "rose-oud-eau-de-parfum",
  "bedtime-gift-set",
  "full-length-standing-mirror",
  "undated-weekly-planner",
];

const typeSpecimens = [
  { cls: "text-display font-serif", label: "Display, 40 to 72px, Fraunces 400", sample: "Soft things for slow mornings" },
  { cls: "text-h1 font-serif", label: "H1, 32 to 52px, Fraunces 400", sample: "Fluffy slippers and pretty mirrors" },
  { cls: "text-h2 font-serif", label: "H2, 26 to 38px, Fraunces 400", sample: "Gifts for her" },
  { cls: "text-h3 font-serif font-medium", label: "H3, 20 to 24px, Fraunces 500", sample: "Cloud fluffy slippers" },
  { cls: "text-body", label: "Body, 16px / 1.6, Nunito 400", sample: "Pay with M-Pesa or card. We deliver across Kenya, and every order is wrapped in tissue so it is ready to give." },
  { cls: "text-small", label: "Small, 14px, Nunito", sample: "Fee shown at checkout" },
  { cls: "text-micro", label: "Micro, 13px, Nunito", sample: "Only 3 left" },
];

const motion = [
  ["Homepage hero arch", "Rises open from a 38% clip and settles from 1.08 scale, then one light sheen. Once, on load."],
  ["Product grids", "Rise in as they scroll into view, staggered by column. CSS scroll-driven animation, no JavaScript."],
  ["Product card hover", "Lifts 4px with a mauve-tinted shadow and crossfades to the second photo. Mouse only."],
  ["Wishlist heart", "Pops and sends out a thin rose ring when saved."],
  ["Buttons", "Scale to 0.97 while pressed."],
  ["Chips", "Change colour only."],
  ["Announcement ticker", "Slides to the next message every 4s; pauses on hover, focus or the pause button."],
  ["Slogan band", "Scrolls left in a seamless loop (36s); pauses on hover."],
  ["Header panels", "Fade in and slide 8px over 240ms."],
  ["Reduced motion", "Everything above is switched off. The hero arch shows fully open."],
];

function hex(name: ColorName) {
  return palette[name].hex;
}

function Section({ id, title, children, className }: { id: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn("page-x py-12 sm:py-16", className)}>
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ContrastTable({ pairs, caption }: { pairs: ColorPair[]; caption: string }) {
  return (
    <table className="w-full border-collapse text-left text-small">
      <caption className="mb-3 text-left font-semibold">{caption}</caption>
      <thead>
        <tr className="border-b border-sand text-micro text-mauve-soft">
          <th scope="col" className="py-2 pr-3 font-semibold">
            Sample
          </th>
          <th scope="col" className="py-2 pr-3 font-semibold">
            Text on background
          </th>
          <th scope="col" className="py-2 pr-3 font-semibold">
            Ratio
          </th>
          <th scope="col" className="py-2 font-semibold">
            Result
          </th>
        </tr>
      </thead>
      <tbody>
        {pairs.map((p) => {
          const ratio = contrastRatio(hex(p.fg), hex(p.bg));
          const level = wcagLevel(ratio);
          const passes = ratio >= 4.5;
          return (
            <tr key={`${p.fg}-${p.bg}`} className="border-b border-sand align-middle">
              <td className="py-2 pr-3">
                <span
                  className="grid h-10 w-12 place-items-center rounded-field font-serif text-h3 ring-1 ring-sand ring-inset"
                  style={{ color: hex(p.fg), backgroundColor: hex(p.bg) }}
                  aria-hidden="true"
                >
                  Aa
                </span>
              </td>
              <td className="py-2 pr-3">
                <span className="font-semibold">{p.fg}</span> on <span className="font-semibold">{p.bg}</span>
                <span className="block text-micro text-mauve-soft">{p.use}</span>
              </td>
              <td className="py-2 pr-3 tabular-nums">{ratio.toFixed(2)}:1</td>
              <td className={cn("py-2 font-bold", passes ? "text-sage" : "text-error")}>
                {passes ? level : `Fail (${level === "Fail" ? "under 3:1" : "large text only"})`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default async function StyleguidePage() {
  const [tree, ...maybeProducts] = await Promise.all([getCategoryTree(), ...sampleSlugs.map((s) => getProductBySlug(s))]);
  const products = maybeProducts.filter((p): p is ProductListItem => p !== null);
  const chips = [
    ...tree.map((c, i) => ({ label: c.name, href: c.href, image: c.image, active: i === 0 })),
    { label: "New in", href: "/collections/new-in" },
    { label: "Under KES 1,500", href: "/collections/under-1500" },
  ];

  return (
    <main id="main" className="pb-24">
      <header className="page-x flex flex-wrap items-center justify-between gap-4 border-b border-sand py-4">
        <Wordmark />
        <p className="text-small text-mauve-soft">Styleguide, not indexed</p>
      </header>

      <section aria-labelledby="sg-hero" className="page-x grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div>
          <h1 id="sg-hero" className="text-display">
            Fluffy slippers, soft perfume and pretty things for your room
          </h1>
          <p className="mt-5 max-w-md text-mauve-soft">
            Hero preview with the arch intro. Reload the page to see it again. With reduced motion on, the arch shows
            fully open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/collections/new-in" size="lg">
              Shop new in
            </Button>
            <Button href="/collections/bestsellers" variant="outline" size="lg">
              Shop bestsellers
            </Button>
          </div>
        </div>
        <ArchFrame
          src="/placeholders/hero.webp"
          alt="A standing arch mirror, a pink perfume bottle and fluffy slippers"
          ratio="4/5"
          intro
          bevel
          preload
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 384px, calc(100vw - 32px)"
          className="w-full max-w-sm lg:ml-auto lg:max-w-[440px]"
        />
      </section>

      <Section id="sg-colours" title="Colours">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(Object.keys(palette) as ColorName[]).map((name) => (
            <li key={name} className="rounded-card bg-white p-1">
              <span
                className="block h-20 rounded-image ring-1 ring-sand ring-inset"
                style={{ backgroundColor: hex(name) }}
              />
              <div className="px-2 pt-2 pb-2.5">
                <p className="font-semibold">{name}</p>
                <p className="text-micro text-mauve-soft tabular-nums">{hex(name)}</p>
                <p className="mt-1 text-micro text-mauve-soft">{palette[name].use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-contrast" title="Contrast">
        <p className="max-w-2xl text-mauve-soft">
          Calculated live with lib/contrast. Every pairing we use must reach 4.5:1, because most of our text and all
          badge text is small.
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <ContrastTable pairs={approvedPairs} caption="Approved pairs" />
          <div>
            <ContrastTable pairs={rejectedPairs} caption="Never use" />
          </div>
        </div>
      </Section>

      <Section id="sg-type" title="Type">
        <ul className="divide-y divide-sand">
          {typeSpecimens.map((t) => (
            <li key={t.label} className="py-5">
              <p className="mb-2 text-micro text-mauve-soft">{t.label}</p>
              <p className={t.cls}>{t.sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-buttons" title="Buttons">
        <div className="space-y-8">
          {(["primary", "soft", "outline"] as const).map((v) => (
            <div key={v}>
              <h3 className="mb-3 text-h3">{v[0].toUpperCase() + v.slice(1)}</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={v} size="lg">
                  Add to bag
                </Button>
                <Button variant={v}>Add to bag</Button>
                <Button variant={v} size="sm">
                  Add to bag
                </Button>
                <Button variant={v} loading>
                  Add to bag
                </Button>
                <Button variant={v} disabled>
                  Sold out
                </Button>
              </div>
            </div>
          ))}
          <div className="rounded-card bg-mauve p-6 text-cream [--focus-ring:var(--color-cream)]">
            <h3 className="mb-3 text-h3">Inverse, for mauve backgrounds</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="inverse" size="lg">
                Chat with us
              </Button>
              <Button variant="inverse">Chat with us</Button>
              <Button variant="inverse" loading>
                Chat with us
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-h3">Link</h3>
            <Button href="/collections/new-in" variant="link">
              Shop all new in
            </Button>
          </div>
          <p className="text-small text-mauve-soft">
            Hover, pressed (scale 0.97) and keyboard focus are live: hover with a mouse, press, or tab through this page.
          </p>
        </div>
      </Section>

      <Section id="sg-badges" title="Badges and prices">
        <div className="flex flex-wrap gap-3 rounded-card bg-sand p-5">
          <Badge tone="new" />
          <Badge tone="bestseller" />
          <Badge tone="sale" percent={20} />
          <Badge tone="soldout" />
          <Badge tone="gift" />
        </div>
        <div className="mt-6 flex flex-wrap gap-10">
          <div>
            <p className="mb-1 text-micro text-mauve-soft">Regular</p>
            <Price price={1500} />
          </div>
          <div>
            <p className="mb-1 text-micro text-mauve-soft">Sale</p>
            <Price price={1200} compareAt={1500} />
          </div>
          <div>
            <p className="mb-1 text-micro text-mauve-soft">Large</p>
            <Price price={12500} size="lg" />
          </div>
        </div>
      </Section>

      <section aria-labelledby="sg-chips" className="grain bg-blush py-12 sm:py-16">
        <div className="page-x">
          <SectionHeading
            id="sg-chips"
            title="Chips on blush"
            description="44px tall, scroll snap, faded edges. The active chip has aria-current."
          />
          <ChipRail chips={chips} label="Shop categories" className="mt-6" />
        </div>
      </section>

      <Section id="sg-shapes" title="Arches and radius">
        <div className="flex flex-wrap items-end gap-6">
          {(["2/3", "3/4", "4/5"] as const).map((r) => (
            <figure key={r} className="w-36">
              <ArchFrame src="/placeholders/cat-mirrors.webp" alt="" ratio={r} bevel sizes="144px" />
              <figcaption className="mt-2 text-micro text-mauve-soft">{r} with bevel</figcaption>
            </figure>
          ))}
          <figure className="w-36">
            <div className="h-24 rounded-card bg-white ring-1 ring-sand ring-inset" />
            <figcaption className="mt-2 text-micro text-mauve-soft">Card, 20px</figcaption>
          </figure>
          <figure className="w-36">
            <div className="h-24 rounded-image bg-sand" />
            <figcaption className="mt-2 text-micro text-mauve-soft">Image, 16px</figcaption>
          </figure>
          <figure className="w-36">
            <div className="h-12 rounded-field border border-mauve-soft bg-white" />
            <figcaption className="mt-2 text-micro text-mauve-soft">Field, 12px</figcaption>
          </figure>
        </div>
      </Section>

      <Section id="sg-cards" title="Product cards">
        <p className="mb-6 max-w-2xl text-mauve-soft">
          Sold out, sale, low stock, more than 4 colours and gift examples. Tab to a card to see the focus ring wrap the
          whole card.
        </p>
        <ul className="reveal grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard
                product={p}
                sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 47vw"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-motion" title="What moves">
        <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {motion.map(([what, how]) => (
            <div key={what}>
              <dt className="font-semibold">{what}</dt>
              <dd className="text-mauve-soft">{how}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </main>
  );
}
