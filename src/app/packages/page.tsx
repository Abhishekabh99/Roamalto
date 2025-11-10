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
    <main
      id="main-content"
      className="container mx-auto max-w-screen-xl flex-1 px-4 sm:px-6 lg:px-8"
    >
      <section className="py-10 md:py-14 lg:py-20">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Packages"
            title="All Roamalto routes at a glance"
            description="Use the sample itineraries for inspiration — every trip is tailored after our WhatsApp discovery call."
            align="center"
          />
          <PackagesGrid packages={featuredPackages} />
        </div>
      </section>
    </main>
  );
}
