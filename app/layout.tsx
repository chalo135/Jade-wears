import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito } from "next/font/google";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

// Static Fraunces italic (SOFT 100, WONK 0, opsz 72, weight 400), trimmed to basic Latin: 14KB.
// Used only for accent words such as "Wears" in the wordmark and the hero headline.
const frauncesItalic = localFont({
  src: "./fonts/FrauncesItalicSoft.woff2",
  style: "italic",
  weight: "400",
  variable: "--font-fraunces-italic",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#FFF9F6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" className={`${fraunces.variable} ${frauncesItalic.variable} ${nunito.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
