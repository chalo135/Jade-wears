# Jade Wears

Boutique e-commerce site for a Kenyan shop: perfumes, fluffy slippers, cute headphones, fluffy earbud cases, notebooks and mirrors. Audience: young women in Kenya, mostly on mobile, buying for themselves or as gifts. Feel: soft, girly, natural, calm. Boutique, not bargain store.

Read AGENTS.md too. When unsure about a Next 16 API, check node_modules/next/dist/docs.

## Setup
- Next.js 16.4 App Router, React 19.3, TypeScript strict. Node 24. Developer is on Windows with Git Bash.
- `cacheComponents` and `partialPrefetching` are on in next.config.ts. Anything that reads the URL (searchParams, usePathname, useSearchParams) must sit inside a Suspense boundary.
- Tailwind CSS v4 through `@tailwindcss/turbopack` in next.config.ts. There is no PostCSS config; don't add one. CSS-first config: `@theme` in app/globals.css, no tailwind.config.js.
- No src/ folder. app/, components/, lib/ and scripts/ at the root, `@/*` alias points to the root.
- next/image uses `preload`; `priority` is deprecated.
- Allowed deps: clsx, tailwind-merge, lucide-react, simple-icons (CC0 brand icons; import named icons in Server Components only). No animation or UI component libraries.
- Placeholder images: `node scripts/make-placeholders.mjs` writes 800×1000 webp files to public/placeholders using the sharp copy that Next installs.

## Design decisions (locked)

### Colours
Tailwind's default palette is reset (`--color-*: initial`), so only these exist:

| Token | Hex | Use |
| --- | --- | --- |
| cream | #FFF9F6 | page background |
| blush | #F6D6DE | section backgrounds |
| blush-deep | #EFC3D0 | soft button hover |
| rose | #D98BA3 | decoration only, never text or meaningful icons |
| deep-rose | #A84D6B | buttons on cream/white |
| rose-ink | #8E3A57 | links and text on blush or sand, primary button hover, sale prices |
| sand | #EADFD7 | cards, dividers, image wells |
| mauve | #4A3040 | headings and body text |
| mauve-soft | #6E5060 | secondary text |
| sage | #4F6B4F | in stock |
| error | #A3303A | errors |
| white | #FFFFFF | |
| whatsapp | #1A8D47 | WhatsApp button only. White on it is 4.25:1, so its label must stay large (19px bold or bigger) |
| whatsapp-deep | #146E37 | WhatsApp button hover |

Rose is still never text, but it is the slogan band background with mauve Fraunces on top (4.57:1, large text). Never use WhatsApp's #25D366 with white text (1.98:1).

### Contrast (WCAG AA for every pairing)
- Never use: deep-rose text on blush (3.96:1) or on sand (4.07:1), rose on cream (2.46:1), white on rose (2.57:1).
- Badge text is small, so it needs 4.5:1.
- Badge tones (uppercase, 12px bold, tracked): new = mauve on white, bestseller = white on deep-rose, sale = white on rose-ink, sold out = cream on mauve, gift = sage on white.
- Approved and rejected pairs live in lib/tokens.ts; /styleguide computes them live with lib/contrast.ts.

### Type
- Fraunces for headings, Nunito for everything else, including product names on cards (bold, as in the approved prototype). Serif text gets `font-variation-settings: "SOFT" 100, "WONK" 0` so terminals are rounded.
- Italic accent (`font-accent italic`): app/fonts/FrauncesItalicSoft.woff2, a static Fraunces italic instance (SOFT 100, WONK 0, opsz 72, weight 400) trimmed to basic Latin, 14KB, loaded with next/font/local. Used for "Wears" in the wordmark and one accent word in the hero headline. Fonts total about 115KB.
- Loaded with next/font/google. Fraunces requests only the SOFT axis (plus weight): with WONK and opsz the latin file is 121KB on its own, with SOFT only it is 62KB. Total with Nunito is about 101KB, under the 120KB budget. If app/fonts/FrauncesSoft.woff2 and app/fonts/Nunito.woff2 appear (pre-trimmed, opsz kept), switch to next/font/local to get optical sizing back.
- Total font payload under 120KB.
- Fluid scale with clamp(), tested from 360px: display 40→72px, h1 32→52, h2 26→38, h3 20→24, body 16px / 1.6, small 14, micro 13.
- Headings weight 400 (h3 500). Sentence case for copy; collection names are title case as the client writes them (New In, Gifts for Her).

### Shape, depth, texture
- Radius by hierarchy: cards 20px, images 16px, form fields 12px, buttons and chips fully rounded.
- Shadows tinted mauve (`rgb(74 48 64 / x)`), only on hover or interaction. Exceptions: the floating WhatsApp button and open header panels.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Grain: subtle SVG feTurbulence noise as a background-image on body, plus a `grain` utility for blush sections. No fixed overlays or blend modes (they hurt scrolling on cheap phones).

### Motion
- Signature moment, homepage hero only, once on load: the arch-framed image rises open (clip-path inset from about 38% at the top down to 0, scale 1.08 → 1), then one soft light sheen sweeps across. Starting at 38% keeps the hero image visible at first paint (LCP).
- Product grids only: scroll reveal with CSS scroll-driven animations (`animation-timeline: view()`) inside `@supports` and `prefers-reduced-motion: no-preference`. No JavaScript, so nothing is hidden while the page hydrates. Slight stagger by column.
- Motion that answers the shopper: product card lifts 4px and the second photo crossfades in on hover (Tailwind v4 hover is mouse-only); wishlist heart pops with a ring burst when saved; buttons scale to 0.97 while pressed; chips change colour only.
- Announcement ticker: one message at a time, slides up every 4s (0.6s ease-in-out), loops via a copy of the first message. Pauses on hover, focus and a pause/play button (WCAG 2.2.2). Bar is 44px so the button meets the tap-target rule. Reduced motion: first message only, no button.
- Slogan band: two identical groups scrolled by translateX(-50%), 36s linear loop, pauses on hover. Static under reduced motion.
- Header panels fade and slide 8px over 240ms using @starting-style and transition-behavior: allow-discrete.
- Global `prefers-reduced-motion: reduce` kill switch.

### Must not look AI-generated
The client-approved prototype (October 2026) overrides some earlier rules. Allowed now, and only where the prototype uses them:
- Small uppercase tracked labels: hero eyebrow, "Shop by budget" eyebrow, main-category labels in the Products panel, footer column headings, badges.
- Arrows on "Shop now →" (collection cards) and "Shop all products →" (Products panel). No arrows elsewhere.
- One italic accent word in the hero headline ("you"), in deep rose, using the italic accent font.
- "Curated for you" as a section heading. The "Shop by colour" heading is centred; other headings stay left-aligned.

Still in force:
- No gradient washes, no emoji icons, no identical cards with the same grey shadow.
- Copy is plain and specific. Never use "elevate", "discover", "essentials". No fake reviews or ratings. No gift-led filler copy ("wrap up for someone sweet", "gift edits"); Gift sets stays as a product type.
- Code comments only where the reason isn't obvious.

### Components
- brand/Wordmark: "Jade Wears" in Fraunces with "Wears" in the italic accent (rose-ink, or blush on mauve), until the client's logo arrives.
- brand/BrandIcon: renders a Simple Icons mark unaltered as inline SVG, in brand colour or currentColor. M-Pesa has no Simple Icon: text badge until the client supplies a logo file (public/payments/mpesa.svg).
- ui/Button: variants primary, soft, outline, inverse (for mauve backgrounds), link. Heights 40/48/56px. Renders next/link when given href. Loading keeps full colour, shows a spinner, keeps its width, sets aria-busy.
- ui/Badge: tones new ("New"), bestseller, sale ("−20%"), soldout, gift ("Gift ready"); every tone at least 4.5:1.
- ui/Price: integer KES shown as "KES 1,500" with a non-breaking space, in rose-ink. "From KES 1,900" when a product has sizes at different prices. Sale shows the price plus the struck-through original, with sr-only "Sale price" and "Original price".
- ui/SectionHeading: title, optional description, optional action link.
- ui/ArchFrame: true semicircle top at 3/4, 4/5 and 2/3 (vertical radius = half the width as a percentage of the height), optional inner bevel line like a mirror edge, optional intro animation.
- ui/ChipRail: horizontally scrolling chips with round thumbnails, scroll snap, edge fade, aria-current on the active chip, 44px tall.
- product/ProductCard: 4:5 image on the page background (no white mat); badge priority sold out > sale % > new/bestseller/gift; category label in rose-ink; name in Nunito bold; price; up to 4 colour swatches then "+n"; "Only N left". Whole card clickable via a stretched ::after on the name link so screen readers hear only the name. Focus ring wraps the card. Wishlist button sits outside the link.
- product/CollectionCard: coloured card (tone by position: blush, sand, deep rose, blush) with the collection name and "Shop now →". Used on the homepage and in the Collections panel.
- layout/AnnouncementBar (client), layout/MegaMenu (client; Products and Collections panels plus About), layout/SloganBand, layout/SiteFooter: behaviour is described under Motion above.
- layout/WhatsAppButton exports WhatsAppDock: a zero-height `position: sticky; bottom: var(--wa-btn-offset)` wrapper that must stay the LAST child of the page wrapper in app/(shop)/layout.tsx, with no overflow:hidden/auto ancestor. It floats while browsing and, at the end of the page, rests in the footer bottom bar's reserved padding (--wa-btn-h + --wa-btn-offset + 16px). CSS only, works without JavaScript. Variables live in :root in globals.css: --wa-btn-h 58px / 64px (lg), --wa-btn-offset bottom-nav + 16px + safe area / 32px (lg), --wa-btn-right 16px / 32px (lg). z-index 30: above content, below the bottom nav (40) and the modal dialogs (top layer).
- Footer social buttons: 44px circles, 22px blush icons, 1.5px mauve-line (#D9C5CE) line drawn as an inset ring (Chrome floors border widths to whole pixels), 10px gap; hover and focus fill blush with a mauve icon; focus ring 2px blush, 2px offset.
- product/WishlistButton: client component, aria-pressed, 44px tap target, local state for now (wired up in Stage 5).
- lib/cn.ts: clsx + tailwind-merge extended with our text, radius, shadow and colour names (otherwise it drops text-h2 when text-mauve is present).
- lib/money.ts: formatKES and percentOff. Prices are whole shillings because M-Pesa only takes whole amounts.

### Data and routes
- Pages only call the async functions in lib/catalog/index.ts. lib/catalog/mock.ts holds mock rows shaped like the future Supabase tables, so the data source can be swapped without touching pages.
- The category tree is rendered from data, never hard-coded in components.
- Colour is a filter across every category: /collections/colour/[family] (pink, white, lilac, beige), with an index at /collections/colour. /shop?colour= still works.
- Price filter on /shop: ?minPrice= and ?maxPrice=, whole shillings, inclusive. "Shop by budget" uses Under 1,500 (max 1500), 1,500–3,000, and 3,000+.
- Collections are ordered by collections.sort_order everywhere (homepage, header panel, mobile menu): New In, Under KES 1,500, Bestsellers, Gifts for Her.
- Products may have variants (size and price). product.price is the lowest variant price.
- Site-wide copy lives in lib/site-config.ts: announcements, slogan, tagline, contact (NEXT_PUBLIC_WHATSAPP_NUMBER, NEXT_PUBLIC_CONTACT_EMAIL, NEXT_PUBLIC_PICKUP_POINT, "[PLACEHOLDER]" until set), socials, payment methods, delivery zones and footer links. Announcements and slogan move to an admin-editable table in Stage 5. Delivery fees stay null ("Fee shown at checkout") until the client confirms them.
- Mock photos: public/images/mock/*.png (1536×2048, AI mock-ups). Only the hero image uses `preload`. Replace with real photos before launch (see README).
- Server Components by default. "use client" only for the announcement ticker, mega menu, mobile menu, search overlay, bottom nav and wishlist button.
- Every subcategory listing must be reachable from the homepage in 2 clicks or fewer on mobile and desktop. Mobile path: a subcategory tile on the homepage, then the type chip on its page. Desktop path: Products panel.

### Performance notes
- Mega menu panels and the mobile menu render their contents only on first intent or while open, to keep hydration small.
- Routes that read `params` or `searchParams`: never await them in the page. Pass the promise to a child Server Component (colocated, e.g. category-content.tsx) wrapped in `<Suspense>` with a skeleton from components/layout/Skeletons.tsx. Keep PageFrame and anything URL-independent outside the boundary, so client navigation shows the frame instantly. Never use `export const instant = false`.
- Because the frame streams first, `notFound()` in those children returns status 200 with a noindex tag (documented Next behaviour). `dynamicParams` is not available with Cache Components; a real 404 for unknown slugs would need a Proxy check.
- Do not wrap page sections in `<Suspense>` with empty fallbacks to split hydration: React streams them out of order and the header pops in late (layout shift).
- Lighthouse on the dev machine is noisy (benchmark index about 1000). Judge performance on the deployed site with PageSpeed Insights.

## Open questions for the client
- Delivery fees and times per zone.
- WhatsApp number, email and pickup point (the NEXT_PUBLIC_ variables).
- Instagram, TikTok and Facebook links.
- An M-Pesa logo file for the footer.
- Final name for "Fluffy pods".
- Logo, real product photos and real prices.
