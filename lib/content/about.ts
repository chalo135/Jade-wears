// About page content. The page renders only from this file.
//
// Everything in [square brackets] is a placeholder for the client to replace. Do not swap a
// placeholder for an invented name, date, number, award or quote. Photos in public/about/ are
// labelled pastel placeholders until the client sends real ones (same file names, or update paths).
//
// Empty lists (milestones, team, behind-the-scenes photos) hide their section.

export type AboutImage = {
  src: string;
  /** Describe the person or scene. Team photos must include the person's name. */
  alt: string;
};

export type Milestone = {
  /** Shown as written, e.g. "March 2021" or "[Year]". */
  date: string;
  title: string;
  /** One or two sentences. */
  text: string;
  image?: AboutImage;
};

export type PickIcon = "hand-heart" | "feather" | "package-check" | "sparkles" | "leaf";

export type PickPoint = { icon: PickIcon; title: string; text: string };

export type TeamMember = {
  name: string;
  role: string;
  /** One personal line, e.g. "Can't live without: [product]". */
  line: string;
  photo: AboutImage;
  /** Optional second photo that crossfades in on hover. */
  hoverPhoto?: AboutImage;
};

export type CandidPhoto = AboutImage & {
  /** Short handwritten-style caption under the print. */
  caption?: string;
};

export type AboutContent = {
  meta: { title: string; description: string };
  opening: { headline: string; intro: string; image: AboutImage };
  founderNote: {
    heading: string;
    paragraphs: string[];
    signOff: string;
    name: string;
    /** Drawn in on scroll if the file exists in public/; otherwise the name is shown in Fraunces. */
    signatureSrc: string;
    image: AboutImage;
  };
  journey: { heading: string; intro: string; milestones: Milestone[] };
  howWePick: { heading: string; intro: string; points: PickPoint[] };
  team: { heading: string; intro: string; members: TeamMember[] };
  behindTheScenes: { heading: string; intro: string; photos: CandidPhoto[] };
  findUs: {
    heading: string;
    pickupTitle: string;
    /** Shown while there is no public pickup address in site config. */
    noAddressNote: string;
    deliveryTitle: string;
    deliveryText: string;
  };
  closing: { line: string };
};

const FOUNDER = "[Founder's first name]";

export const about: AboutContent = {
  meta: {
    title: "About us",
    description:
      "Jade Wears is a small Nairobi shop for soft perfumes, fluffy slippers, cute tech and pretty notebooks. Meet the people behind it.",
  },

  opening: {
    headline: "Soft things, sweet days, from Nairobi",
    intro:
      "[Sentence 1, in the founder's voice: who Jade Wears is and what we sell.] [Sentence 2: who it's for and why it matters to us.]",
    image: {
      src: "/about/opening-portrait.webp",
      alt: `[Describe the photo, e.g. "${FOUNDER} at the Jade Wears table, holding a pink perfume bottle"]`,
    },
  },

  founderNote: {
    heading: "A note from the founder",
    paragraphs: [
      "[Paragraph 1, first person: how Jade Wears started. The first product, the year, where you were.]",
      "[Paragraph 2: one specific moment you remember, like the first order, the first customer who came back, or a packing night.]",
      "[Paragraph 3: what you want someone to feel when they open a Jade Wears parcel.]",
      "[Paragraph 4, optional: a thank-you to the people who shop with you.]",
    ],
    signOff: "[Sign-off, e.g. With love,]",
    name: FOUNDER,
    signatureSrc: "/about/signature.svg",
    image: {
      src: "/about/founder-at-work.webp",
      alt: `[Describe the photo, e.g. "${FOUNDER} wrapping an order in tissue paper"]`,
    },
  },

  journey: {
    heading: "Our journey",
    intro: "[One line introducing the timeline, e.g. how far Jade Wears has come since the first order.]",
    milestones: [
      {
        date: "[Year Jade Wears started]",
        title: "[How it started]",
        text: "[One or two sentences: the first product and where it was sold.]",
        image: {
          src: "/about/milestone-first-order.webp",
          alt: "[Describe the photo of the first order or first product]",
        },
      },
      {
        date: "[Year]",
        title: "[A first big moment, e.g. the first market or pop-up]",
        text: "[One or two sentences about what happened.]",
      },
      {
        date: "[Year]",
        title: "[Starting pickups in Nairobi]",
        text: "[One or two sentences about the pickup point and why you opened it.]",
        image: {
          src: "/about/milestone-pickup.webp",
          alt: "[Describe the photo of the pickup point]",
        },
      },
      {
        date: "[Year]",
        title: "[Opening the online shop]",
        text: "[One or two sentences about launching jadewears online and delivering countrywide.]",
      },
    ],
  },

  howWePick: {
    heading: "How we pick what we sell",
    intro: "[Draft for the client to confirm or rewrite.]",
    points: [
      {
        icon: "hand-heart",
        title: "[Point 1, e.g. We try it first]",
        text: "[One sentence on how you test products before selling them.]",
      },
      {
        icon: "feather",
        title: "[Point 2, e.g. Soft, cute and useful]",
        text: "[One sentence on what makes something feel like Jade Wears.]",
      },
      {
        icon: "package-check",
        title: "[Point 3, e.g. Packed with care]",
        text: "[One sentence on how orders are checked and wrapped.]",
      },
    ],
  },

  team: {
    heading: "Meet the team",
    intro: "[One line about the people who pack, post and answer your messages.]",
    members: [
      {
        name: FOUNDER,
        role: "Founder",
        line: "Can't live without: [product]",
        photo: { src: "/about/team-1.webp", alt: `${FOUNDER}, founder of Jade Wears. [Describe the portrait.]` },
        hoverPhoto: { src: "/about/team-1-candid.webp", alt: "" },
      },
      {
        name: "[Team member's name]",
        role: "[Role]",
        line: "Can't live without: [product]",
        photo: { src: "/about/team-2.webp", alt: "[Team member's name], [role] at Jade Wears. [Describe the portrait.]" },
      },
      {
        name: "[Team member's name]",
        role: "[Role]",
        line: "Can't live without: [product]",
        photo: { src: "/about/team-3.webp", alt: "[Team member's name], [role] at Jade Wears. [Describe the portrait.]" },
      },
    ],
  },

  behindTheScenes: {
    heading: "Behind the scenes",
    intro: "[One line, e.g. what a normal packing day looks like.]",
    photos: [
      { src: "/about/bts-packing.webp", alt: "[Describe: packing orders]", caption: "[Packing orders]" },
      { src: "/about/bts-shelf.webp", alt: "[Describe: the shelf]", caption: "[The shelf]" },
      { src: "/about/bts-wrapping.webp", alt: "[Describe: wrapping a gift set]", caption: "[Wrapping]" },
      { src: "/about/bts-stock.webp", alt: "[Describe: new stock arriving]", caption: "[New stock day]" },
      { src: "/about/bts-pickup.webp", alt: "[Describe: a pickup in Nairobi]", caption: "[Pickup day]" },
    ],
  },

  findUs: {
    heading: "Where to find us",
    pickupTitle: "Pickup in Nairobi",
    noAddressNote: "Exact pickup pin shared on WhatsApp after you order.",
    deliveryTitle: "Delivery across Kenya",
    deliveryText: "We deliver countrywide. You'll see the fee for your area at checkout.",
  },

  closing: {
    line: "[One warm closing line from the founder, e.g. an invitation to say hi on WhatsApp.]",
  },
};
