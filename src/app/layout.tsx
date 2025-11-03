import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { MobileWhatsAppBar } from "@/components/MobileWhatsAppBar";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { ConsentBanner } from "@/components/providers/ConsentBanner";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s — Roamalto",
    default: "Roamalto — Your Personal Europe Travel Curator",
  },
  description:
    "Roamalto plans immersive Italy, Poland, and Switzerland trips for Indian travellers — from visas to must-see views.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Roamalto — Your Personal Europe Travel Curator",
    description:
      "Founder-led Europe travel planning for Italy, Poland, and Switzerland with WhatsApp-first support.",
    url: SITE_URL,
    siteName: "Roamalto",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto — Your Personal Europe Travel Curator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamalto — Your Personal Europe Travel Curator",
    description:
      "We craft custom Europe itineraries for Italy, Poland, and Switzerland with visa handholding.",
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-sand text-slate antialiased`}
      >
        <Script id="datalayer-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];`}
        </Script>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <FloatingWhatsAppButton />
        <MobileWhatsAppBar />
        <AnalyticsProvider />
        <ConsentBanner />
      </body>
    </html>
  );
}
