import type { Category, Collection, Colour, Product, ProductVariant, StockStatus } from "./types";

// MOCK PHOTOS AND PRICES: the photos in public/images/mock are AI mock-ups and the
// prices are placeholders. Replace both with real Jade Wears products before launch.

const img = (name: string) => `/placeholders/${name}.webp`;
/**
 * AI mock photo, 3:4 PNG in public/images/mock (1536×2048; the gift set and journal
 * are 660×880 crops of hero-flatlay.png until the client supplies their own photos).
 */
const photo = (name: string) => `/images/mock/${name}.png`;

export const categories: Category[] = [
  { id: "c-beauty", parent_id: null, name: "Beauty", slug: "beauty", image: photo("perfume-peony-hour"), sort_order: 1 },
  { id: "c-footwear", parent_id: null, name: "Footwear", slug: "footwear", image: photo("slides-cloud-puff"), sort_order: 2 },
  { id: "c-tech", parent_id: null, name: "Tech", slug: "tech", image: photo("headphones-kitty-ear"), sort_order: 3 },
  { id: "c-stationery", parent_id: null, name: "Stationery", slug: "stationery", image: photo("journal-little-bow"), sort_order: 4 },
  { id: "c-home", parent_id: null, name: "Home", slug: "home", image: photo("mirror-oval-vanity"), sort_order: 5 },

  { id: "c-perfumes", parent_id: "c-beauty", name: "Perfumes", slug: "perfumes", image: photo("perfume-peony-hour"), sort_order: 1 },
  { id: "c-body-mists", parent_id: "c-perfumes", name: "Body mists", slug: "body-mists", image: photo("body-mist-rose-milk"), sort_order: 1 },
  { id: "c-eau-de-parfum", parent_id: "c-perfumes", name: "Eau de parfum", slug: "eau-de-parfum", image: img("rose-oud-eau-de-parfum-1"), sort_order: 2 },
  { id: "c-gift-sets", parent_id: "c-perfumes", name: "Gift sets", slug: "gift-sets", image: photo("gift-set-bloom-trio"), sort_order: 3 },

  { id: "c-fluffy-shoes", parent_id: "c-footwear", name: "Fluffy shoes", slug: "fluffy-shoes", image: photo("slides-cloud-puff"), sort_order: 1 },
  { id: "c-slippers", parent_id: "c-fluffy-shoes", name: "Slippers", slug: "slippers", image: img("cloud-fluffy-slippers-1"), sort_order: 1 },
  { id: "c-slides", parent_id: "c-fluffy-shoes", name: "Slides", slug: "slides", image: photo("slides-cloud-puff"), sort_order: 2 },
  { id: "c-house-shoes", parent_id: "c-fluffy-shoes", name: "House shoes", slug: "house-shoes", image: img("teddy-house-shoes-1"), sort_order: 3 },

  { id: "c-cute-headphones", parent_id: "c-tech", name: "Cute headphones", slug: "cute-headphones", image: photo("headphones-kitty-ear"), sort_order: 1 },
  // Name still to be confirmed with the client.
  { id: "c-fluffy-pods", parent_id: "c-tech", name: "Fluffy pods", slug: "fluffy-pods", image: photo("pods-bunny-puff"), sort_order: 2 },

  { id: "c-notebooks", parent_id: "c-stationery", name: "Notebooks", slug: "notebooks", image: photo("journal-little-bow"), sort_order: 1 },
  { id: "c-journals", parent_id: "c-notebooks", name: "Journals", slug: "journals", image: photo("journal-little-bow"), sort_order: 1 },
  { id: "c-planners", parent_id: "c-notebooks", name: "Planners", slug: "planners", image: img("undated-weekly-planner-1"), sort_order: 2 },
  { id: "c-sticky-notes", parent_id: "c-notebooks", name: "Sticky notes", slug: "sticky-notes", image: img("pastel-sticky-notes-set-1"), sort_order: 3 },

  { id: "c-mirrors", parent_id: "c-home", name: "Mirrors", slug: "mirrors", image: photo("mirror-oval-vanity"), sort_order: 1 },
  { id: "c-wall", parent_id: "c-mirrors", name: "Wall mirrors", slug: "wall", image: img("scalloped-wall-mirror-1"), sort_order: 1 },
  { id: "c-vanity", parent_id: "c-mirrors", name: "Vanity mirrors", slug: "vanity", image: photo("mirror-oval-vanity"), sort_order: 2 },
  { id: "c-standing", parent_id: "c-mirrors", name: "Standing mirrors", slug: "standing", image: img("full-length-standing-mirror-1"), sort_order: 3 },
  { id: "c-led", parent_id: "c-mirrors", name: "LED mirrors", slug: "led", image: img("led-makeup-mirror-1"), sort_order: 4 },
];

export const collections: Collection[] = [
  // sort_order drives every collection list: homepage, header panel, mobile menu and footer.
  { id: "k-new-in", name: "New In", slug: "new-in", image: photo("perfume-peony-hour"), sort_order: 1 },
  { id: "k-under-1500", name: "Under KES 1,500", slug: "under-1500", image: photo("pods-bunny-puff"), sort_order: 2 },
  { id: "k-bestsellers", name: "Bestsellers", slug: "bestsellers", image: photo("headphones-kitty-ear"), sort_order: 3 },
  { id: "k-gifts-for-her", name: "Gifts for Her", slug: "gifts-for-her", image: photo("gift-set-bloom-trio"), sort_order: 4 },
];

/** Price ceiling for the "Under KES 1,500" collection (inclusive). */
export const UNDER_PRICE = 1500;

export const colours = {
  pink: { name: "Pink", hex: "#F2C6D2" },
  white: { name: "White", hex: "#FFFFFF" },
  lilac: { name: "Lilac", hex: "#D9CCEB" },
  beige: { name: "Beige", hex: "#E8D6C3" },
  cream: { name: "Cream", hex: "#F6EEE3" },
  grey: { name: "Grey", hex: "#CFC9C6" },
  black: { name: "Black", hex: "#3A3236" },
  babyBlue: { name: "Baby blue", hex: "#C9DBEA" },
  sage: { name: "Sage", hex: "#CFDCCB" },
} satisfies Record<string, Colour>;

/** Colour families offered as a cross-category filter (/collections/colour/pink). */
export const shopColourKeys = ["pink", "white", "lilac", "beige"] as const;

type Seed = {
  slug: string;
  name: string;
  /** Lowest price; with variants this is the smallest size. */
  price: number;
  variants?: Omit<ProductVariant, "id">[];
  /** Mock photo file name in public/images/mock, plus its alt text. */
  photo?: { file: string; alt: string };
  compare?: number;
  colours: Colour[];
  category: string;
  collections?: string[];
  stock?: StockStatus;
  qty?: number;
  created: string;
};

const seeds: Seed[] = [
  // Products with AI mock photos (newest first, so they lead "New In").
  {
    slug: "peony-hour-eau-de-parfum",
    name: "Peony Hour Eau de Parfum",
    price: 1900,
    variants: [
      { name: "30 ml", price: 1900 },
      { name: "50 ml", price: 3200 },
      { name: "100 ml", price: 4800 },
    ],
    colours: [colours.pink],
    category: "c-eau-de-parfum",
    collections: ["k-new-in", "k-bestsellers"],
    created: "2026-10-06",
    photo: { file: "perfume-peony-hour", alt: "Peony Hour perfume in a blush glass bottle with a pale gold cap, beside pink peonies" },
  },
  {
    slug: "cloud-puff-slides",
    name: "Cloud Puff Slides",
    price: 1450,
    colours: [colours.pink, colours.beige],
    category: "c-slides",
    collections: ["k-new-in"],
    created: "2026-10-05",
    photo: { file: "slides-cloud-puff", alt: "A pair of pink fluffy Cloud Puff slides on a warm beige background" },
  },
  {
    slug: "kitty-ear-headphones",
    name: "Kitty Ear Headphones",
    price: 2800,
    colours: [colours.pink],
    category: "c-cute-headphones",
    collections: ["k-new-in", "k-bestsellers"],
    created: "2026-10-04",
    photo: { file: "headphones-kitty-ear", alt: "Pale pink over-ear headphones with cat ears on the headband" },
  },
  {
    slug: "bunny-puff-pods-case",
    name: "Bunny Puff Pods Case",
    price: 1100,
    colours: [colours.white],
    category: "c-fluffy-pods",
    collections: ["k-new-in", "k-bestsellers"],
    created: "2026-10-03",
    photo: { file: "pods-bunny-puff", alt: "A fluffy white bunny earbud case with pink ears and cheeks" },
  },
  {
    slug: "rose-milk-body-mist",
    name: "Rose Milk Body Mist",
    price: 1200,
    colours: [colours.pink],
    category: "c-body-mists",
    collections: ["k-new-in"],
    created: "2026-10-02",
    photo: { file: "body-mist-rose-milk", alt: "Rose Milk body mist in a frosted pink spray bottle on cream linen" },
  },
  {
    slug: "bloom-trio-gift-set",
    name: "Bloom Trio Gift Set",
    price: 2500,
    colours: [colours.pink],
    category: "c-gift-sets",
    collections: ["k-gifts-for-her"],
    created: "2026-10-01",
    photo: { file: "gift-set-bloom-trio", alt: "A blush perfume bottle beside a pink box tied with a satin ribbon" },
  },
  {
    slug: "little-bow-journal-a5",
    name: "Little Bow Journal A5",
    price: 950,
    colours: [colours.pink],
    category: "c-journals",
    collections: ["k-gifts-for-her"],
    created: "2026-09-30",
    photo: { file: "journal-little-bow", alt: "A pink journal tied with a satin ribbon bow" },
  },
  {
    slug: "oval-vanity-mirror",
    name: "Oval Vanity Mirror",
    price: 2200,
    colours: [colours.white],
    category: "c-vanity",
    collections: ["k-bestsellers"],
    created: "2026-09-29",
    photo: { file: "mirror-oval-vanity", alt: "An oval vanity mirror on a slim gold stand on a cream dressing table" },
  },

  // Older mock products with generated placeholder art.
  { slug: "peony-cloud-body-mist", name: "Peony cloud body mist", price: 1200, colours: [colours.pink], category: "c-body-mists", created: "2026-09-28" },
  { slug: "vanilla-musk-body-mist", name: "Vanilla musk body mist", price: 1200, compare: 1500, colours: [colours.beige], category: "c-body-mists", collections: ["k-bestsellers"], created: "2026-05-02" },
  { slug: "rose-oud-eau-de-parfum", name: "Rose oud eau de parfum, 50ml", price: 4800, colours: [colours.pink], category: "c-eau-de-parfum", collections: ["k-bestsellers", "k-gifts-for-her"], created: "2026-03-14" },
  { slug: "soft-amber-eau-de-parfum", name: "Soft amber eau de parfum, 30ml", price: 3500, colours: [colours.beige], category: "c-eau-de-parfum", collections: ["k-gifts-for-her"], stock: "low_stock", qty: 4, created: "2026-06-20" },
  { slug: "mini-mist-trio-gift-set", name: "Mini mist trio gift set", price: 2900, colours: [colours.lilac], category: "c-gift-sets", collections: ["k-gifts-for-her"], created: "2026-09-30" },
  { slug: "bedtime-gift-set", name: "Bedtime gift set with mist and slippers", price: 5500, colours: [colours.pink], category: "c-gift-sets", collections: ["k-gifts-for-her"], created: "2026-07-11" },
  { slug: "cloud-fluffy-slippers", name: "Cloud fluffy slippers", price: 1800, colours: [colours.pink, colours.white, colours.lilac, colours.beige, colours.grey], category: "c-slippers", collections: ["k-bestsellers", "k-gifts-for-her"], created: "2026-02-08" },
  { slug: "bunny-ear-slippers", name: "Bunny ear slippers", price: 2200, colours: [colours.white, colours.pink], category: "c-slippers", created: "2026-10-01" },
  { slug: "faux-fur-slides", name: "Faux fur slides", price: 1500, compare: 1900, colours: [colours.pink, colours.beige, colours.white, colours.black], category: "c-slides", created: "2026-09-18" },
  { slug: "teddy-house-shoes", name: "Teddy house shoes", price: 2500, colours: [colours.beige, colours.cream], category: "c-house-shoes", collections: ["k-bestsellers"], stock: "low_stock", qty: 3, created: "2026-04-22" },
  { slug: "cat-ear-wireless-headphones", name: "Cat ear wireless headphones", price: 3900, colours: [colours.pink, colours.white, colours.lilac], category: "c-cute-headphones", created: "2026-09-25" },
  { slug: "bow-wireless-headphones", name: "Bow wireless headphones", price: 4500, colours: [colours.white, colours.pink], category: "c-cute-headphones", collections: ["k-bestsellers"], stock: "sold_out", qty: 0, created: "2026-01-30" },
  { slug: "fluffy-airpods-case", name: "Fluffy AirPods case", price: 1200, colours: [colours.lilac, colours.pink, colours.white, colours.beige, colours.babyBlue, colours.black], category: "c-fluffy-pods", created: "2026-09-22" },
  { slug: "fluffy-earbud-case-with-strap", name: "Fluffy earbud case with strap", price: 1000, colours: [colours.pink, colours.lilac], category: "c-fluffy-pods", collections: ["k-bestsellers"], created: "2026-03-03" },
  { slug: "linen-dot-grid-journal", name: "Linen dot-grid journal, A5", price: 950, colours: [colours.beige, colours.pink, colours.sage], category: "c-journals", collections: ["k-bestsellers"], created: "2026-02-19" },
  { slug: "gratitude-journal", name: "Five-minute gratitude journal", price: 1100, colours: [colours.lilac], category: "c-journals", collections: ["k-gifts-for-her"], created: "2026-09-12" },
  { slug: "undated-weekly-planner", name: "Undated weekly planner", price: 1400, colours: [colours.pink, colours.beige], category: "c-planners", created: "2026-06-05" },
  { slug: "pastel-sticky-notes-set", name: "Pastel sticky notes, set of 6", price: 450, colours: [colours.pink], category: "c-sticky-notes", created: "2026-05-27" },
  { slug: "scalloped-wall-mirror", name: "Scalloped wall mirror, 60cm", price: 6500, colours: [colours.white, colours.pink], category: "c-wall", collections: ["k-bestsellers"], created: "2026-03-29" },
  { slug: "arch-vanity-mirror", name: "Arch vanity mirror", price: 3200, colours: [colours.beige, colours.white], category: "c-vanity", created: "2026-09-08" },
  { slug: "full-length-standing-mirror", name: "Full-length arch standing mirror", price: 12500, colours: [colours.white, colours.beige], category: "c-standing", stock: "low_stock", qty: 2, created: "2026-08-16" },
  { slug: "led-makeup-mirror", name: "LED makeup mirror", price: 4200, compare: 5000, colours: [colours.white, colours.pink], category: "c-led", collections: ["k-gifts-for-her"], created: "2026-09-02" },
];

export const products: Product[] = seeds.map((s, i) => ({
  id: `p-${String(i + 1).padStart(2, "0")}`,
  slug: s.slug,
  name: s.name,
  price: s.price,
  compare_at_price: s.compare ?? null,
  variants: (s.variants ?? []).map((v, j) => ({ ...v, id: `p-${String(i + 1).padStart(2, "0")}-v${j + 1}` })),
  images: s.photo
    ? [{ src: photo(s.photo.file), alt: s.photo.alt }]
    : [
        { src: img(`${s.slug}-1`), alt: s.name },
        { src: img(`${s.slug}-2`), alt: `${s.name}, close-up` },
      ],
  colours: s.colours,
  stock_status: s.stock ?? "in_stock",
  stock_quantity: s.qty ?? null,
  category_ids: [s.category],
  collection_ids: [...(s.collections ?? []), ...(s.price <= UNDER_PRICE ? ["k-under-1500"] : [])],
  created_at: `${s.created}T09:00:00+03:00`,
}));
