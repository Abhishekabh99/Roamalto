import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/data/site";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";

const pageUrl = `${SITE_URL}/contact`;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Roamalto on WhatsApp or email for personalised Europe travel planning and visa support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Roamalto",
    description:
      "WhatsApp or email Roamalto to start planning immersive Italy, Poland, and Switzerland trips with visa guidance.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto travel planning contact information",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Roamalto",
    description:
      "Message Roamalto to design a personalised Europe itinerary with visa and concierge support.",
    images: [OG_IMAGE_URL],
  },
};

export default function ContactPage() {
  return (
    <main
      id="main-content"
      className="container mx-auto max-w-screen-xl flex-1 px-4"
    >
      <section className="py-10 md:py-14 lg:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s start your Europe itinerary"
            description="WhatsApp is the fastest way to reach us. We reply within business hours: Monday to Saturday, 10:00–19:00 IST."
            align="center"
          />
          <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-border md:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-green">
                  WhatsApp
                </p>
                <p className="mt-2 text-lg font-semibold text-brand-slate">
                  +{CONTACT_PHONE}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted md:text-base">
                  Share your travel dates, cities, traveller count, and special requests. We usually respond within a couple of hours.
                </p>
                <div className="mt-4">
                  <WhatsAppCTA
                    phone={CONTACT_PHONE}
                    text="Hi Roamalto, I'd like to plan a Europe trip."
                    utm={{ utm_content: "contact-page" }}
                    label="Message on WhatsApp"
                    size="lg"
                  />
                </div>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-green">
                  Email
                </p>
                <Link
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 inline-flex h-11 items-center rounded-full px-4 text-lg font-semibold text-brand-slate transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {CONTACT_EMAIL}
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-foreground-muted md:text-base">
                  Prefer email summaries? Drop us your draft itinerary or wish-list and we’ll respond with next steps within one business day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
