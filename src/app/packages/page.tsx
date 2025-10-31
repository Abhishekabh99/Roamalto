import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PackagesGrid } from "@/components/PackagesGrid";
import { featuredPackages } from "@/data/packages";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";

const pageUrl = `${SITE_URL}/packages`;

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Discover Roamalto’s handpicked Italy, Poland, and Switzerland travel packages with sample day-wise itineraries.",
  alternates: {
    canonical: "/packages",
  },
  openGraph: {
    title: "Roamalto Europe Travel Packages",
    description:
      "Explore founder-curated itineraries for Italy, Poland, and Switzerland with visa-ready support.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto featured Europe travel routes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamalto Travel Packages",
    description:
      "Browse Roamalto’s featured Europe routes to customise for your next trip.",
    images: [OG_IMAGE_URL],
  },
};

export default function PackagesPage() {
  return (
    <main id="main-content" className="flex-1 bg-sand pb-16 pt-10 md:pb-20 md:pt-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4">
        <SectionHeading
          eyebrow="Packages"
          title="All Roamalto routes at a glance"
          description="Use the sample itineraries for inspiration — every trip is tailored after our WhatsApp discovery call."
        />
        <PackagesGrid packages={featuredPackages} />
      </div>
    </main>
  );
}
