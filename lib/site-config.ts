// Site-wide copy and contact details.
// TODO(Stage 5): announcements and slogan move to an admin-editable table.

const PLACEHOLDER = "[PLACEHOLDER]";

export type DeliveryZone = {
  id: string;
  name: string;
  /** Whole shillings. null until the client confirms the fee. */
  fee: number | null;
};

export type PaymentMethod = { id: "mpesa" | "visa" | "mastercard" | "paypal"; name: string };

export const siteConfig = {
  name: "Jade Wears",
  /** Absolute site URL for Open Graph images, canonical links and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Soft perfumes, fluffy slippers, cute tech and pretty notebooks. Pay with M-Pesa, card or PayPal. Delivery countrywide, pickup in Nairobi.",
  slogan: "Soft things, sweet days",
  tagline: "Cute, soft things for everyday you — from Nairobi with love.",
  announcements: [
    "Delivery countrywide · Pickup in Nairobi",
    "Pay with M-Pesa, card or PayPal",
    "New in: Peony Hour perfume",
    "Questions? Chat with us on WhatsApp",
  ],
  contact: {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || PLACEHOLDER,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || PLACEHOLDER,
    pickupPoint: process.env.NEXT_PUBLIC_PICKUP_POINT || PLACEHOLDER,
    /** Shown when there is no public pickup address. */
    pickupArea: "Nairobi, Kenya",
    pickupHours: process.env.NEXT_PUBLIC_PICKUP_HOURS || PLACEHOLDER,
    /** Google Maps link for the pickup point. Empty until the client shares one. */
    pickupMapUrl: process.env.NEXT_PUBLIC_PICKUP_MAP_URL || "",
  },
  whatsappMessage: "Hi Jade Wears, I have a question",
  socials: {
    instagram: "#",
    tiktok: "#",
    facebook: "#",
  },
  paymentMethods: [
    { id: "mpesa", name: "M-Pesa" },
    { id: "visa", name: "Visa" },
    { id: "mastercard", name: "Mastercard" },
    { id: "paypal", name: "PayPal" },
  ] satisfies PaymentMethod[],
  deliveryZones: [
    { id: "nairobi-cbd", name: "Nairobi CBD", fee: null },
    { id: "nairobi-environs", name: "Nairobi environs", fee: null },
    { id: "upcountry", name: "Upcountry", fee: null },
    { id: "pickup", name: "Pickup", fee: null },
  ] satisfies DeliveryZone[],
  help: [
    { name: "Delivery & returns", href: "/delivery" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact us", href: "/contact" },
    { name: "Track my order", href: "/track-order" },
  ],
  company: [
    { name: "About us", href: "/about" },
    { name: "My account", href: "/account" },
  ],
  legal: [
    { name: "Privacy policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

export function isPlaceholder(value: string) {
  return value === PLACEHOLDER;
}

/** True once the client has given a pickup address we can publish. */
export function hasPublicPickupAddress() {
  return !isPlaceholder(siteConfig.contact.pickupPoint);
}

/** Social profile URLs that are real links (not "#" placeholders). */
export function liveSocialUrls(): string[] {
  return Object.values(siteConfig.socials).filter((url) => url && url !== "#");
}

/** wa.me link with a prefilled message. Without a real number it opens WhatsApp's contact picker. */
export function whatsappHref(): string {
  const digits = siteConfig.contact.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(siteConfig.whatsappMessage);
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}
