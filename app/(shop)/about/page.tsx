import type { Metadata } from "next";
import { AboutClosing } from "@/components/about/AboutClosing";
import { AboutOpening } from "@/components/about/AboutOpening";
import { BehindTheScenes } from "@/components/about/BehindTheScenes";
import { FindUs } from "@/components/about/FindUs";
import { FounderNote } from "@/components/about/FounderNote";
import { HowWePick } from "@/components/about/HowWePick";
import { Journey } from "@/components/about/Journey";
import { Team } from "@/components/about/Team";
import { about } from "@/lib/content/about";
import { hasPublicPickupAddress, liveSocialUrls, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${about.meta.title} · ${siteConfig.name}`,
    description: about.meta.description,
    url: "/about",
    type: "website",
    images: [{ url: about.opening.image.src, width: 900, height: 1200, alt: about.opening.image.alt }],
  },
};

function structuredData() {
  const sameAs = liveSocialUrls();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    // No logo yet: add "logo" once the client's logo file exists.
    address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
    ...(sameAs.length > 0 && { sameAs }),
  };
  // LocalBusiness only once there is a public pickup address to publish.
  const localBusiness = hasPublicPickupAddress()
    ? {
        "@context": "https://schema.org",
        "@type": "Store",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.pickupPoint,
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
      }
    : null;
  return localBusiness ? [organization, localBusiness] : organization;
}

export default function AboutPage() {
  // "<" is escaped so the JSON can never close the script tag early.
  const jsonLd = JSON.stringify(structuredData()).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <AboutOpening content={about.opening} />
      <FounderNote content={about.founderNote} />
      <Journey content={about.journey} />
      <HowWePick content={about.howWePick} />
      <Team content={about.team} />
      <BehindTheScenes content={about.behindTheScenes} />
      <FindUs content={about.findUs} />
      <AboutClosing content={about.closing} />
    </>
  );
}
