import type { Metadata } from "next";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/data/site";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/seo";

const pageUrl = `${SITE_URL}/privacy`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Roamalto privacy commitments covering WhatsApp conversations, email submissions, and itinerary data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Roamalto Privacy Policy",
    description:
      "Learn how Roamalto protects your personal information across WhatsApp, email, and itinerary planning systems.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Roamalto privacy commitments summary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamalto Privacy Policy",
    description:
      "Understand how Roamalto handles your data during bespoke Europe travel planning.",
    images: [OG_IMAGE_URL],
  },
};

const lastUpdated = "December 2024";

export default function PrivacyPage() {
  return (
    <main id="main-content" className="flex-1 bg-white pb-16 pt-10 md:pb-20 md:pt-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-sm leading-7 text-foreground-muted md:text-base">
        <h1 className="text-3xl font-semibold text-slate">Privacy Policy</h1>
        <p>Last updated: {lastUpdated}</p>
        <p>
          Roamalto operates as a WhatsApp-first travel planning service. This
          policy explains how we handle the personal information you share with us
          across WhatsApp, email, and any other channels we use to prepare your
          itinerary.
        </p>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate">
            Information we collect
          </h2>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">
              Contact details and traveller information shared via WhatsApp or email.
            </li>
            <li className="list-disc">
              Passport and visa documents provided for application support.
            </li>
            <li className="list-disc">
              Preference notes including stay types, dietary needs, and celebration
              plans.
            </li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate">
            How we use your information
          </h2>
          <ul className="space-y-2 pl-5">
            <li className="list-disc">
              To create and refine itineraries, bookings, and visa applications.
            </li>
            <li className="list-disc">
              To coordinate on-ground services with trusted local partners.
            </li>
            <li className="list-disc">
              To share mandatory updates, confirmations, and emergency support details.
            </li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate">Data retention</h2>
          <p>
            We retain planning information for the duration of your trip and for up to
            12 months afterwards for post-trip support and regulatory compliance. Visa
            documents are purged within 45 days of your return journey.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate">Third-party sharing</h2>
          <p>
            Information is shared only with airlines, hotels, tour partners, and visa
            facilitation centres necessary to deliver your trip. We do not sell or rent
            personal data.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate">Your rights</h2>
          <p>
            You may request access, updates, or deletion of your data anytime by
            emailing{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-full px-1 py-0.5 text-deepgreen underline-offset-4 hover:text-deepgreen/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {CONTACT_EMAIL}
            </a>
            . We will respond within seven working days.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate">Contact</h2>
          <p>
            For privacy questions, reach us on WhatsApp at +{CONTACT_PHONE} or email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-full px-1 py-0.5 text-deepgreen underline-offset-4 hover:text-deepgreen/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
